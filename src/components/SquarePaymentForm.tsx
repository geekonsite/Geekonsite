import React, { useEffect, useRef, useState } from 'react';
import { CreditCard, Smartphone, Shield, AlertCircle, CheckCircle } from 'lucide-react';

declare global {
  interface Window {
    Square: any;
  }
}

interface SquarePaymentFormProps {
  applicationId: string;
  locationId: string;
  amount: number;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: any) => void;
  isProcessing: boolean;
}

export const SquarePaymentForm: React.FC<SquarePaymentFormProps> = ({
  applicationId,
  locationId,
  amount,
  onPaymentSuccess,
  onPaymentError,
  isProcessing
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'digital-wallet'>('card');
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [isCardValid, setIsCardValid] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const googlePayRef = useRef<HTMLDivElement>(null);
  const applePayRef = useRef<HTMLDivElement>(null);
  
  const paymentsRef = useRef<any>(null);
  const cardRef2 = useRef<any>(null);
  const googlePayRef2 = useRef<any>(null);
  const applePayRef2 = useRef<any>(null);

  // Validate Square credentials
  const isValidSquareConfig = () => {
    if (!applicationId || applicationId === 'your_square_application_id_here') {
      return { valid: false, error: 'Square Application ID is not configured. Please add your Application ID to the environment variables.' };
    }
    if (!locationId || locationId === 'your_square_location_id_here') {
      return { valid: false, error: 'Square Location ID is not configured. Please add your Location ID to the environment variables.' };
    }
    
    // Check if it's a valid sandbox or production ID
    const isSandbox = applicationId.startsWith('sandbox-sq0idb-');
    const isProduction = applicationId.startsWith('sq0idp-');
    
    if (!isSandbox && !isProduction) {
      return { valid: false, error: 'Invalid Square Application ID format. Must start with "sandbox-sq0idb-" for sandbox or "sq0idp-" for production.' };
    }
    
    return { valid: true, error: null };
  };

  useEffect(() => {
    const validation = isValidSquareConfig();
    if (!validation.valid) {
      setInitializationError(validation.error);
      return;
    }

    // Check if Square SDK is available and initialize
    const initializeSquare = async () => {
      try {
        // Wait for Square SDK to be available
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait time
        
        while (!window.Square && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.Square) {
          throw new Error('Square SDK not available after waiting');
        }

        paymentsRef.current = window.Square.payments(applicationId, locationId);
        
        // Initialize Card Payment
        if (cardRef.current) {
          cardRef2.current = await paymentsRef.current.card();
          await cardRef2.current.attach(cardRef.current);
          
          cardRef2.current.addEventListener('cardBrandChanged', (event: any) => {
            console.log('Card brand changed:', event.cardBrand);
            setIsCardValid(true);
          });
          
          cardRef2.current.addEventListener('errorClassAdded', (event: any) => {
            setCardErrors(prev => ({ ...prev, [event.field]: event.message }));
            setIsCardValid(false);
          });
          
          cardRef2.current.addEventListener('errorClassRemoved', (event: any) => {
            setCardErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[event.field];
              return newErrors;
            });
            // Check if there are any remaining errors
            const hasErrors = Object.keys(cardErrors).length > 1; // -1 because we're removing one
            if (!hasErrors) {
              setIsCardValid(true);
            }
          });
        }

        // Initialize Google Pay (optional)
        try {
          if (googlePayRef.current) {
            const googlePayOptions = {
              buttonColor: 'black',
              buttonSizeMode: 'fill',
              buttonType: 'pay'
            };
            
            googlePayRef2.current = await paymentsRef.current.googlePay(googlePayOptions);
            await googlePayRef2.current.attach(googlePayRef.current);
          }
        } catch (googlePayError) {
          console.log('Google Pay not available:', googlePayError);
        }

        // Initialize Apple Pay (optional)
        try {
          if (applePayRef.current) {
            const applePayOptions = {
              buttonColor: 'black',
              buttonSizeMode: 'fill',
              buttonType: 'pay'
            };
            
            applePayRef2.current = await paymentsRef.current.applePay(applePayOptions);
            await applePayRef2.current.attach(applePayRef.current);
          }
        } catch (applePayError) {
          console.log('Apple Pay not available:', applePayError);
        }

        setIsInitialized(true);

      } catch (error) {
        console.error('Error initializing Square:', error);
        setInitializationError('Failed to initialize payment system. Please check your Square configuration.');
      }
    };

    initializeSquare();

    return () => {
      // Cleanup
      if (cardRef2.current) {
        cardRef2.current.destroy();
      }
      if (googlePayRef2.current) {
        googlePayRef2.current.destroy();
      }
      if (applePayRef2.current) {
        applePayRef2.current.destroy();
      }
    };
  }, [applicationId, locationId]);

  const handleCardPayment = async () => {
    if (!cardRef2.current) return;

    try {
      const result = await cardRef2.current.tokenize();
      
      if (result.status === 'OK') {
        // Process payment with token
        await processPayment(result.token);
      } else {
        onPaymentError({ message: result.errors?.[0]?.message || 'Card tokenization failed' });
      }
    } catch (error) {
      console.error('Card payment error:', error);
      onPaymentError({ message: 'Payment processing failed' });
    }
  };

  const handleDigitalWalletPayment = async (walletType: 'google' | 'apple') => {
    const wallet = walletType === 'google' ? googlePayRef2.current : applePayRef2.current;
    
    if (!wallet) {
      onPaymentError({ message: `${walletType} Pay is not available` });
      return;
    }

    try {
      const result = await wallet.tokenize();
      
      if (result.status === 'OK') {
        await processPayment(result.token);
      } else {
        onPaymentError({ message: result.errors?.[0]?.message || `${walletType} Pay failed` });
      }
    } catch (error) {
      console.error(`${walletType} Pay error:`, error);
      onPaymentError({ message: `${walletType} Pay processing failed` });
    }
  };

  const processPayment = async (token: string) => {
    try {
      // Check if we have Supabase configured for backend processing
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_url_here') {
        // Use Supabase Edge Function for payment processing
        const response = await fetch(`${supabaseUrl}/functions/v1/process-square-payment`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceId: token,
            amountMoney: {
              amount: Math.round(amount * 100), // Convert to cents
              currency: 'USD'
            },
            idempotencyKey: crypto.randomUUID()
          }),
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
          onPaymentSuccess(result);
        } else {
          onPaymentError({ message: result.error || 'Payment processing failed' });
        }
      } else {
        // Fallback: Simulate successful payment for demo purposes
        console.log('Payment simulation (Square backend not configured):', {
          token,
          amount: amount,
          timestamp: new Date().toISOString()
        });
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate successful payment
        onPaymentSuccess({
          success: true,
          payment: {
            id: `demo_payment_${Date.now()}`,
            amount: amount * 100,
            currency: 'USD',
            status: 'COMPLETED'
          },
          message: 'Payment processed successfully (Demo Mode)'
        });
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      onPaymentError({ message: 'Payment processing failed' });
    }
  };

  // Show configuration error
  if (initializationError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-900">Payment System Configuration Error</h4>
            <p className="text-red-800 text-sm mt-1">{initializationError}</p>
            <div className="mt-3 text-xs text-red-700">
              <p>To fix this issue:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>For sandbox: Use Application ID starting with "sandbox-sq0idb-"</li>
                <li>For production: Use Application ID starting with "sq0idp-"</li>
                <li>Add your Square Location ID to the environment variables</li>
                <li>Restart the development server after updating the configuration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading payment system...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
            paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value as 'card')}
              className="sr-only"
            />
            <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Credit/Debit Card</div>
              <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
            </div>
          </label>

          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
            paymentMethod === 'digital-wallet' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="digital-wallet"
              checked={paymentMethod === 'digital-wallet'}
              onChange={(e) => setPaymentMethod(e.target.value as 'digital-wallet')}
              className="sr-only"
            />
            <Smartphone className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Digital Wallet</div>
              <div className="text-sm text-gray-600">Google Pay, Apple Pay</div>
            </div>
          </label>
        </div>
      </div>

      {/* Card Payment Form */}
      {paymentMethod === 'card' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900">Card Information</h4>
          </div>
          
          <div 
            ref={cardRef}
            className="min-h-[60px] p-4 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
          />
          
          {Object.keys(cardErrors).length > 0 && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  {Object.entries(cardErrors).map(([field, error]) => (
                    <p key={field} className="text-red-800 text-sm">{error}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleCardPayment}
            disabled={isProcessing || Object.keys(cardErrors).length > 0}
            className="w-full mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Pay ${amount.toFixed(2)} Securely
              </>
            )}
          </button>
        </div>
      )}

      {/* Digital Wallet Payment */}
      {paymentMethod === 'digital-wallet' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Smartphone className="h-5 w-5 text-blue-600 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900">Digital Wallet Payment</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Pay</label>
              <div 
                ref={googlePayRef}
                className="min-h-[48px] rounded-lg cursor-pointer"
                onClick={() => handleDigitalWalletPayment('google')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apple Pay</label>
              <div 
                ref={applePayRef}
                className="min-h-[48px] rounded-lg cursor-pointer"
                onClick={() => handleDigitalWalletPayment('apple')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-900">Secure Payment</h4>
            <p className="text-green-800 text-sm mt-1">
              Your payment information is encrypted and processed securely by Square. 
              We never store your card details on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};