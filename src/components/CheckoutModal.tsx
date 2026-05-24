import React from 'react';
import { X, CheckCircle, UserPlus, Shield, CreditCard } from 'lucide-react';
import { CheckoutForm } from './CheckoutForm';
import { SquarePaymentForm } from './SquarePaymentForm';
import { useCheckout } from '../hooks/useCheckout';
import { CartState } from '../types/cart';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartState;
  onClearCart: () => void;
  isAuthenticated?: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onClearCart,
  isAuthenticated = false
}) => {
  const { checkoutState, setStep, processOrder, resetCheckout, setCustomerInfo } = useCheckout();

  if (!isOpen) return null;

  // Get the selected plan (assuming single item in cart for now)
  const selectedPlan = cart.items.length > 0 ? cart.items[0] : null;

  const handleCustomerInfoSubmit = async (customerInfo: any) => {
    setCustomerInfo(customerInfo);
    // Move to payment step for all plans - account creation happens during checkout
  };

  const handlePaymentSuccess = async (paymentResult: any) => {
    // Process the order with customer info, payment result, and cart items
    const result = await processOrder(checkoutState.customerInfo!, paymentResult, cart.items);
    if (result.success) {
      onClearCart();
    }
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    // Handle payment error (show error message, etc.)
  };

  const handleClose = () => {
    resetCheckout();
    onClose();
  };

  const handleBackToCustomerInfo = () => {
    setStep('cart');
  };

  const renderContent = () => {
    switch (checkoutState.step) {
      case 'cart':
        return (
          <CheckoutForm
            onSubmit={handleCustomerInfoSubmit}
            onBack={handleClose}
            isProcessing={checkoutState.isProcessing}
            selectedPlan={selectedPlan ? {
              id: selectedPlan.id,
              name: selectedPlan.name,
              price: selectedPlan.price
            } : undefined}
            isAuthenticated={isAuthenticated}
          />
        );
      
      case 'payment':
        return (
          <div className="max-w-2xl mx-auto p-6">
            <div className="mb-8">
              <button
                onClick={handleBackToCustomerInfo}
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-4"
              >
                <X className="h-4 w-4 mr-2 rotate-45" />
                Back to Account Information
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h2>
              <p className="text-gray-600">Secure payment processing powered by Square</p>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(0)}{item.period}
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${cart.total.toFixed(0)}/month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information Summary */}
            {checkoutState.customerInfo && (
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="ml-2 text-gray-900">
                      {checkoutState.customerInfo.firstName} {checkoutState.customerInfo.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{checkoutState.customerInfo.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Device:</span>
                    <span className="ml-2 text-gray-900">
                      {checkoutState.customerInfo.deviceBrand === 'Other' 
                        ? `${checkoutState.customerInfo.customBrand} ${checkoutState.customerInfo.customModel}`
                        : `${checkoutState.customerInfo.deviceBrand} ${checkoutState.customerInfo.deviceModel}`
                      } ({checkoutState.customerInfo.deviceType})
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="ml-2 text-gray-900">
                      {checkoutState.customerInfo.address.city}, {checkoutState.customerInfo.address.state}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Square Payment Form */}
            <SquarePaymentForm
              applicationId={import.meta.env.VITE_SQUARE_APPLICATION_ID || 'sandbox-sq0idb-your-app-id'}
              locationId={import.meta.env.VITE_SQUARE_LOCATION_ID || 'your-location-id'}
              amount={cart.total}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              isProcessing={checkoutState.isProcessing}
            />
          </div>
        );
      
      case 'confirmation':
        return (
          <div className="text-center py-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isAuthenticated ? 'Payment Successful!' : 'Account Created & Payment Successful!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isAuthenticated 
                ? 'Your subscription is now active. Thank you for choosing GeekOnSite Solutions!'
                : 'Your account has been created and your subscription is now active. Welcome to GeekOnSite Solutions!'
              }
            </p>
            
            {!isAuthenticated && (
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <UserPlus className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">Your Account is Ready!</h3>
                <p className="text-blue-800 text-sm mb-4">
                  You can now log in to your account to manage your subscription, view service history, and schedule appointments.
                </p>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">Account Security</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    A verification email has been sent to your email address. Please verify your account to access all features.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                {!isAuthenticated && (
                  <li>• Check your email for account verification and welcome information</li>
                )}
                <li>• Our team will contact you within 24 hours to schedule your first service</li>
                <li>• We'll begin monitoring and maintaining your devices based on your plan</li>
                <li>• You can log in to your account to track service history and schedule appointments</li>
                <li>• Your first monthly service will be scheduled within the next week</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleClose}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Continue Browsing
              </button>
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    // In a real app, this would redirect to login page
                    alert('Login functionality would be implemented here');
                  }}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  Log In to Account
                </button>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (checkoutState.step) {
      case 'cart':
        return isAuthenticated ? 'Complete Your Order' : 'Create Account & Subscribe';
      case 'payment':
        return 'Complete Payment';
      case 'confirmation':
        return isAuthenticated ? 'Order Complete!' : 'Welcome to GeekOnSite!';
      default:
        return 'Checkout';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                {checkoutState.step === 'payment' && (
                  <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                )}
                <h2 className="text-xl font-semibold text-gray-900">
                  {getModalTitle()}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};