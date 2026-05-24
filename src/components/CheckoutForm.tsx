import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Mail, MapPin, Monitor, Smartphone, Lock, Eye, EyeOff } from 'lucide-react';
import { CustomerInfo, PC_BRANDS, MAC_BRANDS, CANADIAN_PROVINCES, US_STATES } from '../types/checkout';

interface CheckoutFormProps {
  onSubmit: (customerInfo: CustomerInfo) => void;
  onBack: () => void;
  isProcessing: boolean;
  selectedPlan?: {
    id: string;
    name: string;
    price: number;
  };
  isAuthenticated?: boolean;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  onSubmit, 
  onBack, 
  isProcessing, 
  selectedPlan,
  isAuthenticated = false 
}) => {
  const [formData, setFormData] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Canada'
    },
    deviceType: 'PC',
    deviceBrand: '',
    deviceModel: '',
    customBrand: '',
    customModel: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      // Reset state/province when country changes
      if (addressField === 'country') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            country: value,
            state: '' // Reset state when country changes
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Reset device brand and model when device type changes
    if (name === 'deviceType') {
      setFormData(prev => ({
        ...prev,
        deviceBrand: '',
        deviceModel: '',
        customBrand: '',
        customModel: ''
      }));
    }

    // Reset device model when brand changes
    if (name === 'deviceBrand') {
      setFormData(prev => ({
        ...prev,
        deviceModel: '',
        customModel: ''
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Enhanced validation functions
  const isValidName = (name: string): boolean => {
    // Must be at least 2 characters, contain only letters, spaces, hyphens, and apostrophes
    const namePattern = /^[a-zA-Z\s\-']{2,50}$/;
    return namePattern.test(name.trim());
  };

  const isValidStreetAddress = (address: string): boolean => {
    // Must contain at least one number and one letter, be at least 5 characters
    const addressPattern = /^(?=.*\d)(?=.*[a-zA-Z]).{5,100}$/;
    return addressPattern.test(address.trim());
  };

  const isValidCity = (city: string): boolean => {
    // Must be at least 2 characters, contain only letters, spaces, hyphens, and apostrophes
    const cityPattern = /^[a-zA-Z\s\-']{2,50}$/;
    return cityPattern.test(city.trim());
  };

  const isValidPostalCode = (code: string, country: string): boolean => {
    if (country === 'Canada') {
      // Canadian postal code format: A1A 1A1 or A1A1A1
      const canadianPattern = /^[A-Za-z]\d[A-Za-z][\s\-]?\d[A-Za-z]\d$/;
      return canadianPattern.test(code.trim());
    } else {
      // US ZIP code format: 12345 or 12345-6789
      const usPattern = /^\d{5}(-\d{4})?$/;
      return usPattern.test(code.trim());
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Enhanced name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!isValidName(formData.firstName)) {
      newErrors.firstName = 'Please enter a valid first name (2-50 characters, letters only)';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!isValidName(formData.lastName)) {
      newErrors.lastName = 'Please enter a valid last name (2-50 characters, letters only)';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation - only required if not authenticated
    if (!isAuthenticated) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    // Enhanced address validation
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Street address is required';
    } else if (!isValidStreetAddress(formData.address.street)) {
      newErrors['address.street'] = 'Please enter a complete street address with house/building number';
    }

    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    } else if (!isValidCity(formData.address.city)) {
      newErrors['address.city'] = 'Please enter a valid city name (2-50 characters, letters only)';
    }

    if (!formData.address.state.trim()) {
      newErrors['address.state'] = 'State/Province is required';
    }

    if (!formData.address.zipCode.trim()) {
      newErrors['address.zipCode'] = getPostalCodeLabel() + ' is required';
    } else if (!isValidPostalCode(formData.address.zipCode, formData.address.country)) {
      if (formData.address.country === 'Canada') {
        newErrors['address.zipCode'] = 'Please enter a valid Canadian postal code (e.g., M5V 3A8)';
      } else {
        newErrors['address.zipCode'] = 'Please enter a valid US ZIP code (e.g., 12345 or 12345-6789)';
      }
    }

    // Device validation
    if (!formData.deviceBrand) {
      newErrors.deviceBrand = 'Device brand is required';
    }
    if (!formData.deviceModel) {
      newErrors.deviceModel = 'Device model is required';
    }
    
    // Custom brand/model validation when "Other" is selected
    if (formData.deviceBrand === 'Other') {
      if (!formData.customBrand?.trim()) {
        newErrors.customBrand = 'Please specify the brand';
      } else if (formData.customBrand.trim().length < 2) {
        newErrors.customBrand = 'Brand name must be at least 2 characters';
      }
      
      if (!formData.customModel?.trim()) {
        newErrors.customModel = 'Please specify the model';
      } else if (formData.customModel.trim().length < 2) {
        newErrors.customModel = 'Model name must be at least 2 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getAvailableBrands = () => {
    return formData.deviceType === 'PC' ? PC_BRANDS : MAC_BRANDS;
  };

  const getAvailableModels = () => {
    const brands = getAvailableBrands();
    const selectedBrand = brands.find(brand => brand.name === formData.deviceBrand);
    return selectedBrand ? selectedBrand.models : [];
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

  const getPostalCodePlaceholder = () => {
    return formData.address.country === 'Canada' ? 'M5V 3A8' : '12345';
  };

  const isOtherBrandSelected = formData.deviceBrand === 'Other';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isAuthenticated ? 'Complete Your Order' : 'Create Your Account'}
        </h2>
        <p className="text-gray-600">
          {isAuthenticated 
            ? 'Provide your device details and address for personalized service'
            : 'Set up your account and provide device details for personalized service'
          }
        </p>
        
        {/* Information Notice */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <User className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900">Important: Real Information Required</h4>
              <p className="text-blue-800 text-sm mt-1">
                Please provide accurate personal information and address details. This information is required for:
              </p>
              <ul className="text-blue-700 text-sm mt-2 list-disc list-inside space-y-1">
                <li>Service delivery and on-site support</li>
                <li>Account verification and security</li>
                <li>Billing and payment processing</li>
                <li>Emergency contact if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Information - Only show if not authenticated */}
        {!isAuthenticated && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
            </div>
            
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
                  placeholder="Enter your legal first name"
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
                  placeholder="Enter your legal last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
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
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="h-4 w-4 inline mr-1" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                <p className="text-xs text-gray-500 mt-1">Must be 8+ characters with uppercase, lowercase, and number</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Contact Information - Always show */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              {isAuthenticated ? 'Contact Information' : 'Personal Information'}
            </h3>
          </div>
          
          {isAuthenticated && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  placeholder="Enter your legal first name"
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
                  placeholder="Enter your legal last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>
          )}

          {isAuthenticated && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
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
            </div>
          )}
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Service Address</h3>
          </div>
          
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Important:</strong> Please provide your actual service address where our technicians will provide support. 
              This must be a real, complete address for service delivery.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
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
              <p className="text-xs text-gray-500 mt-1">Include house/building number and street name</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
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
                  Country *
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
                  {getStateProvinceLabel()} *
                </label>
                <select
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors['address.state'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select {getStateProvinceLabel().toLowerCase()}</option>
                  {getAvailableStatesProvinces().map((location) => (
                    <option key={location.code} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
                {errors['address.state'] && <p className="text-red-500 text-sm mt-1">{errors['address.state']}</p>}
              </div>

              <div>
                <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                  {getPostalCodeLabel()} *
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
                  placeholder={getPostalCodePlaceholder()}
                />
                {errors['address.zipCode'] && <p className="text-red-500 text-sm mt-1">{errors['address.zipCode']}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.address.country === 'Canada' 
                    ? 'Format: A1A 1A1 or A1A1A1' 
                    : 'Format: 12345 or 12345-6789'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Device Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Monitor className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Device Information</h3>
          </div>

          {/* Device Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Device Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                formData.deviceType === 'PC' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="deviceType"
                  value="PC"
                  checked={formData.deviceType === 'PC'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <Monitor className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">PC (Windows/Linux)</div>
                  <div className="text-sm text-gray-600">Desktop or laptop computers</div>
                </div>
              </label>

              <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                formData.deviceType === 'MAC' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="deviceType"
                  value="MAC"
                  checked={formData.deviceType === 'MAC'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <Smartphone className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-gray-900">MAC (Apple)</div>
                  <div className="text-sm text-gray-600">MacBook, iMac, Mac Mini</div>
                </div>
              </label>
            </div>
          </div>

          {/* Brand and Model Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="deviceBrand" className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <select
                id="deviceBrand"
                name="deviceBrand"
                value={formData.deviceBrand}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                  errors.deviceBrand ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a brand</option>
                {getAvailableBrands().map((brand) => (
                  <option key={brand.name} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.deviceBrand && <p className="text-red-500 text-sm mt-1">{errors.deviceBrand}</p>}
            </div>

            <div>
              <label htmlFor="deviceModel" className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <select
                id="deviceModel"
                name="deviceModel"
                value={formData.deviceModel}
                onChange={handleInputChange}
                disabled={!formData.deviceBrand}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.deviceModel ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a model</option>
                {getAvailableModels().map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              {errors.deviceModel && <p className="text-red-500 text-sm mt-1">{errors.deviceModel}</p>}
              {!formData.deviceBrand && (
                <p className="text-xs text-gray-500 mt-1">Please select a brand first</p>
              )}
            </div>
          </div>

          {/* Custom Brand/Model Fields - Show when "Other" is selected */}
          {isOtherBrandSelected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <label htmlFor="customBrand" className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify the brand *
                </label>
                <input
                  type="text"
                  id="customBrand"
                  name="customBrand"
                  value={formData.customBrand || ''}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.customBrand ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Samsung, Toshiba, Gateway"
                />
                {errors.customBrand && <p className="text-red-500 text-sm mt-1">{errors.customBrand}</p>}
              </div>

              <div>
                <label htmlFor="customModel" className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify the model *
                </label>
                <input
                  type="text"
                  id="customModel"
                  name="customModel"
                  value={formData.customModel || ''}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                    errors.customModel ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Galaxy Book Pro, Satellite L50"
                />
                {errors.customModel && <p className="text-red-500 text-sm mt-1">{errors.customModel}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isProcessing}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isAuthenticated ? 'Processing...' : 'Creating Account...'}
              </>
            ) : (
              <>
                {isAuthenticated ? 'Continue to Payment' : 'Create Account & Continue'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};