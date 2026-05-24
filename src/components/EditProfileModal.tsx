import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Subscription } from '../types/subscription';
import { updateUserProfile, updateSubscriptionAddress } from '../lib/supabase';
import { CANADIAN_PROVINCES, US_STATES } from '../types/checkout';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser;
  activeSubscription?: Subscription;
  onUpdateSuccess: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  activeSubscription,
  onUpdateSuccess
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Canada'
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && user?.email) {
      setFormData({
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        phone: user.user_metadata?.phone || '',
        address: activeSubscription?.address_info || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Canada'
        }
      });
      setMessage(null);
      setErrors({});
    }
  }, [isOpen, user, activeSubscription]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));

      // Reset state when country changes
      if (addressField === 'country') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            country: value,
            state: ''
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (message) {
      setMessage(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Address validation (if provided)
    if (formData.address.street && formData.address.street.trim().length < 5) {
      newErrors['address.street'] = 'Street address must be at least 5 characters';
    }

    if (formData.address.city && formData.address.city.trim().length < 2) {
      newErrors['address.city'] = 'City must be at least 2 characters';
    }

    if (formData.address.zipCode) {
      const isCanada = formData.address.country === 'Canada';
      const postalPattern = isCanada 
        ? /^[A-Za-z]\d[A-Za-z][\s\-]?\d[A-Za-z]\d$/
        : /^\d{5}(-\d{4})?$/;
      
      if (!postalPattern.test(formData.address.zipCode.trim())) {
        newErrors['address.zipCode'] = isCanada 
          ? 'Please enter a valid Canadian postal code (e.g., M5V 3A8)'
          : 'Please enter a valid US ZIP code (e.g., 12345)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      // Update user profile metadata
      const profileUpdates = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        full_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phone: formData.phone.trim() || null
      };

      const { error: profileError } = await updateUserProfile(profileUpdates);
      
      if (profileError) {
        setMessage({ type: 'error', text: profileError.message });
        return;
      }

      // Update subscription address if there's an active subscription and address data
      if (activeSubscription && (
        formData.address.street || 
        formData.address.city || 
        formData.address.state || 
        formData.address.zipCode
      )) {
        const { error: addressError } = await updateSubscriptionAddress(
          activeSubscription.id,
          formData.address
        );
        
        if (addressError) {
          setMessage({ type: 'error', text: 'Profile updated but address update failed: ' + addressError.message });
          return;
        }
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      onUpdateSuccess();
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getAvailableStatesProvinces = () => {
    return formData.address.country === 'Canada' ? CANADIAN_PROVINCES : US_STATES;
  };

  const getStateProvinceLabel = () => {
    return formData.address.country === 'Canada' ? 'Province/Territory' : 'State';
  };

  const getPostalCodeLabel = () => {
    return formData.address.country === 'Canada' ? 'Postal Code' : 'ZIP Code';
  };

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
              <h2 className="text-xl font-semibold text-gray-900">Edit Profile Information</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Success/Error Messages */}
              {message && (
                <div className={`mb-4 p-3 rounded-lg flex items-start ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  <p className={`text-sm ${
                    message.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {message.text}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Email Address</span>
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed from this form</p>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    Service Address
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="address.street"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                          errors['address.street'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123 Main Street, Apt 4B"
                      />
                      {errors['address.street'] && <p className="text-red-500 text-sm mt-1">{errors['address.street']}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          id="address.city"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                            errors['address.city'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={formData.address.country === 'Canada' ? 'Toronto' : 'New York'}
                        />
                        {errors['address.city'] && <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>}
                      </div>

                      <div>
                        <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <select
                          id="address.country"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        >
                          <option value="Canada">Canada</option>
                          <option value="United States">United States</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-2">
                          {getStateProvinceLabel()}
                        </label>
                        <select
                          id="address.state"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        >
                          <option value="">Select {getStateProvinceLabel().toLowerCase()}</option>
                          {getAvailableStatesProvinces().map((location) => (
                            <option key={location.code} value={location.name}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                          {getPostalCodeLabel()}
                        </label>
                        <input
                          type="text"
                          id="address.zipCode"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                            errors['address.zipCode'] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder={formData.address.country === 'Canada' ? 'M5V 3A8' : '12345'}
                        />
                        {errors['address.zipCode'] && <p className="text-red-500 text-sm mt-1">{errors['address.zipCode']}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
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
                        Save Changes
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