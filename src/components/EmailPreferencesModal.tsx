import React, { useState, useEffect } from 'react';
import { X, Mail, Save, AlertCircle, CheckCircle, Bell, CreditCard, Shield, Megaphone } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { updateUserEmailPreferences } from '../lib/supabase';

interface EmailPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser;
  onUpdateSuccess: () => void;
}

interface EmailPreferences {
  marketing_emails: boolean;
  service_notifications: boolean;
  billing_reminders: boolean;
  security_alerts: boolean;
}

export const EmailPreferencesModal: React.FC<EmailPreferencesModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateSuccess
}) => {
  const [preferences, setPreferences] = useState<EmailPreferences>({
    marketing_emails: true,
    service_notifications: true,
    billing_reminders: true,
    security_alerts: true
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Initialize preferences when modal opens
  useEffect(() => {
    if (isOpen && user?.email) {
      const currentPreferences = user.user_metadata?.email_preferences || {};
      setPreferences({
        marketing_emails: currentPreferences.marketing_emails ?? true,
        service_notifications: currentPreferences.service_notifications ?? true,
        billing_reminders: currentPreferences.billing_reminders ?? true,
        security_alerts: currentPreferences.security_alerts ?? true
      });
      setMessage(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handlePreferenceChange = (key: keyof EmailPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));

    // Clear message when user makes changes
    if (message) {
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await updateUserEmailPreferences(preferences);
      
      if (error) {
        setMessage({ type: 'error', text: error.message });
        return;
      }

      setMessage({ type: 'success', text: 'Email preferences updated successfully!' });
      onUpdateSuccess();
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Email preferences update error:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessage(null);
    onClose();
  };

  const preferenceOptions = [
    {
      key: 'marketing_emails' as keyof EmailPreferences,
      icon: <Megaphone className="h-5 w-5 text-purple-600" />,
      title: 'Marketing Emails',
      description: 'Receive updates about new services, promotions, and company news',
      bgColor: 'bg-purple-100'
    },
    {
      key: 'service_notifications' as keyof EmailPreferences,
      icon: <Bell className="h-5 w-5 text-blue-600" />,
      title: 'Service Notifications',
      description: 'Get notified about scheduled maintenance, service appointments, and system updates',
      bgColor: 'bg-blue-100'
    },
    {
      key: 'billing_reminders' as keyof EmailPreferences,
      icon: <CreditCard className="h-5 w-5 text-green-600" />,
      title: 'Billing Reminders',
      description: 'Receive payment reminders, invoices, and billing-related notifications',
      bgColor: 'bg-green-100'
    },
    {
      key: 'security_alerts' as keyof EmailPreferences,
      icon: <Shield className="h-5 w-5 text-red-600" />,
      title: 'Security Alerts',
      description: 'Important security notifications and account activity alerts (recommended)',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Email Preferences</h2>
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
              {/* Success/Error Messages */}
              {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-start ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  )}
                  <p className={`text-sm ${
                    message.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {message.text}
                  </p>
                </div>
              )}

              {/* Email Address Display */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email Address</p>
                    <p className="text-gray-900">{user?.email || 'Loading...'}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Choose which emails you'd like to receive
                  </h3>
                  
                  <div className="space-y-4">
                    {preferenceOptions.map((option) => (
                      <div key={option.key} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${option.bgColor}`}>
                          {option.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{option.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer ml-4">
                              <input
                                type="checkbox"
                                checked={preferences[option.key]}
                                onChange={(e) => handlePreferenceChange(option.key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Important Notice</h4>
                      <p className="text-yellow-800 text-sm mt-1">
                        We strongly recommend keeping Security Alerts enabled to stay informed about important account activity and security updates.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Preferences
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};