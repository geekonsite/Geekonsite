import { useState, useCallback } from 'react';
import { CheckoutState, CustomerInfo } from '../types/checkout';
import { SubscriptionFormData } from '../types/subscription';
import { signUpWithEmail } from '../lib/supabase';
import { useSubscription } from './useSubscription';

export const useCheckout = () => {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 'cart',
    customerInfo: null,
    isProcessing: false
  });

  const { createSubscription } = useSubscription();

  const setStep = useCallback((step: CheckoutState['step']) => {
    setCheckoutState(prev => ({ ...prev, step }));
  }, []);

  const setCustomerInfo = useCallback((customerInfo: CustomerInfo) => {
    setCheckoutState(prev => ({ 
      ...prev, 
      customerInfo,
      step: 'payment'
    }));
  }, []);

  const setProcessing = useCallback((isProcessing: boolean) => {
    setCheckoutState(prev => ({ ...prev, isProcessing }));
  }, []);

  const resetCheckout = useCallback(() => {
    setCheckoutState({
      step: 'cart',
      customerInfo: null,
      isProcessing: false
    });
  }, []);

  const processOrder = useCallback(async (customerInfo: CustomerInfo, paymentResult?: any, cartItems?: any[]) => {
    setProcessing(true);
    
    try {
      let userId = null;

      // Create user account with Supabase Auth if password is provided (new user)
      if (customerInfo.password) {
        const { data, error } = await signUpWithEmail(
          customerInfo.email, 
          customerInfo.password, 
          {
            first_name: customerInfo.firstName,
            last_name: customerInfo.lastName,
            full_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            phone: customerInfo.phone || null,
            address: customerInfo.address,
            device_type: customerInfo.deviceType,
            device_brand: customerInfo.deviceBrand === 'Other' ? customerInfo.customBrand : customerInfo.deviceBrand,
            device_model: customerInfo.deviceBrand === 'Other' ? customerInfo.customModel : customerInfo.deviceModel
          }
        );

        if (error) {
          console.error('Account creation error:', error);
          setProcessing(false);
          return { success: false, error: `Account creation failed: ${error.message}` };
        }

        userId = data.user?.id;
        console.log('Account created successfully:', data);
      }

      // Create subscription record for each cart item
      if (cartItems && cartItems.length > 0) {
        for (const item of cartItems) {
          // Extract billing cycle from item ID or period
          const billingCycle = item.id.includes('annual') || item.period.includes('year') ? 'annual' : 'monthly';
          
          const subscriptionData: SubscriptionFormData = {
            plan_id: item.id,
            plan_name: item.name,
            price_paid: item.price * item.quantity,
            billing_cycle: billingCycle,
            device_info: {
              type: customerInfo.deviceType,
              brand: customerInfo.deviceBrand === 'Other' ? customerInfo.customBrand || '' : customerInfo.deviceBrand,
              model: customerInfo.deviceBrand === 'Other' ? customerInfo.customModel || '' : customerInfo.deviceModel
            },
            address_info: customerInfo.address
          };

          try {
            await createSubscription(subscriptionData);
            console.log('Subscription created for plan:', item.name);
          } catch (subscriptionError) {
            console.error('Error creating subscription:', subscriptionError);
            // Continue with other subscriptions even if one fails
          }
        }
      }

      // Simulate additional processing time for order setup
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, this would also:
      // 1. Process payment with Square (already handled by SquarePaymentForm)
      // 2. Send welcome email with account details
      // 3. Send confirmation email
      // 4. Create initial service records
      // 5. Set up automated billing (for recurring subscriptions)
      
      console.log('Order processed successfully for:', {
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        email: customerInfo.email,
        device: customerInfo.deviceBrand === 'Other' 
          ? `${customerInfo.customBrand} ${customerInfo.customModel} (${customerInfo.deviceType})`
          : `${customerInfo.deviceBrand} ${customerInfo.deviceModel} (${customerInfo.deviceType})`,
        address: customerInfo.address,
        paymentResult: paymentResult,
        accountCreated: !!customerInfo.password,
        subscriptionsCreated: cartItems?.length || 0
      });
      
      setCheckoutState(prev => ({
        ...prev,
        step: 'confirmation',
        isProcessing: false
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Order processing error:', error);
      setProcessing(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Order processing failed' 
      };
    }
  }, [setProcessing, createSubscription]);

  return {
    checkoutState,
    setStep,
    setCustomerInfo,
    setProcessing,
    resetCheckout,
    processOrder
  };
};