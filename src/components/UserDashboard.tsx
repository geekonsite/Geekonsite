import React, { useState, useEffect } from 'react';
import { 
  User, 
  CreditCard, 
  Calendar, 
  Monitor, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Settings,
  ArrowLeft,
  Phone,
  Mail,
  Edit3,
  LogOut
} from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/supabase';
import { Subscription } from '../types/subscription';
import { EditProfileModal } from './EditProfileModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { EmailPreferencesModal } from './EmailPreferencesModal';

interface UserDashboardProps {
  onBack: () => void;
  initialTab?: 'overview' | 'subscription' | 'profile';
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ 
  onBack, 
  initialTab = 'overview' 
}) => {
  const { user } = useAuth();
  const { subscriptions, activeSubscription, loading, error, refetchSubscriptions } = useSubscription();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'subscription' | 'profile'>(initialTab);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [emailPreferencesModalOpen, setEmailPreferencesModalOpen] = useState(false);

  // Update selected tab when initialTab changes
  useEffect(() => {
    setSelectedTab(initialTab);
  }, [initialTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading your dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-900">Error Loading Dashboard</h3>
              <p className="text-red-800 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'expired':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
      case 'expired':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {getUserDisplayName()}!
        </h2>
        <p className="text-gray-600">
          Manage your subscription, view service history, and update your account settings.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Plan</p>
              <p className="text-lg font-semibold text-gray-900">
                {activeSubscription ? activeSubscription.plan_name : 'No Active Plan'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Next Billing</p>
              <p className="text-lg font-semibold text-gray-900">
                {activeSubscription?.next_billing_date 
                  ? formatDate(activeSubscription.next_billing_date)
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <Monitor className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Device</p>
              <p className="text-lg font-semibold text-gray-900">
                {activeSubscription?.device_info 
                  ? `${activeSubscription.device_info.brand} ${activeSubscription.device_info.model}`
                  : 'Not Set'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {subscriptions.length > 0 ? (
          <div className="space-y-3">
            {subscriptions.slice(0, 3).map((subscription) => (
              <div key={subscription.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                    {getStatusIcon(subscription.status)}
                    <span className="ml-1 capitalize">{subscription.status}</span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{subscription.plan_name}</p>
                    <p className="text-sm text-gray-600">
                      Started {formatDate(subscription.start_date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${subscription.price_paid}/{subscription.billing_cycle === 'monthly' ? 'month' : 'year'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No subscription history found.</p>
        )}
      </div>
    </div>
  );

  const renderSubscription = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Current Subscription</h3>
          {activeSubscription && (
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activeSubscription.status)}`}>
              {getStatusIcon(activeSubscription.status)}
              <span className="ml-2 capitalize">{activeSubscription.status}</span>
            </div>
          )}
        </div>

        {activeSubscription ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Plan Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">{activeSubscription.plan_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">
                      ${activeSubscription.price_paid}/{activeSubscription.billing_cycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billing Cycle:</span>
                    <span className="font-medium capitalize">{activeSubscription.billing_cycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{formatDate(activeSubscription.start_date)}</span>
                  </div>
                  {activeSubscription.next_billing_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Billing:</span>
                      <span className="font-medium">{formatDate(activeSubscription.next_billing_date)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Device Information</h4>
                {activeSubscription.device_info ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{activeSubscription.device_info.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-medium">{activeSubscription.device_info.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium">{activeSubscription.device_info.model}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No device information available</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => alert('Update payment method functionality would be implemented here')}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update Payment Method
                </button>
                <button
                  onClick={() => alert('Change plan functionality would be implemented here')}
                  className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Change Plan
                </button>
                <button
                  onClick={() => alert('Cancel subscription functionality would be implemented here')}
                  className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors duration-200"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h4>
            <p className="text-gray-600 mb-6">You don't have an active subscription yet.</p>
            <button
              onClick={onBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Browse Plans
            </button>
          </div>
        )}
      </div>

      {/* Subscription History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription History</h3>
        {subscriptions.length > 0 ? (
          <div className="space-y-3">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                    {getStatusIcon(subscription.status)}
                    <span className="ml-1 capitalize">{subscription.status}</span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{subscription.plan_name}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(subscription.start_date)} - {subscription.next_billing_date ? formatDate(subscription.next_billing_date) : 'Ongoing'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${subscription.price_paid}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {subscription.billing_cycle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No subscription history found.</p>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
          <button
            onClick={() => setEditProfileModalOpen(true)}
            className="flex items-center px-3 py-1 text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <Edit3 className="h-4 w-4 mr-1" />
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{getUserDisplayName()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              {user?.user_metadata?.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{user.user_metadata.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Address</h4>
            {activeSubscription?.address_info ? (
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Service Address</p>
                  <div className="font-medium">
                    <p>{activeSubscription.address_info.street}</p>
                    <p>
                      {activeSubscription.address_info.city}, {activeSubscription.address_info.state} {activeSubscription.address_info.zipCode}
                    </p>
                    <p>{activeSubscription.address_info.country}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No address information available</p>
            )}
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
        <div className="space-y-4">
          <button
            onClick={() => setChangePasswordModalOpen(true)}
            className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-gray-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
            </div>
            <Edit3 className="h-4 w-4 text-gray-400" />
          </button>

          <button
            onClick={() => setEmailPreferencesModalOpen(true)}
            className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Email Preferences</p>
                <p className="text-sm text-gray-600">Manage notification settings</p>
              </div>
            </div>
            <Edit3 className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Account Dashboard</h1>
            </div>
            
            {/* Profile Icon and Sign Out */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {getUserInitials()}
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                selectedTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('subscription')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                selectedTab === 'subscription'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Subscription
            </button>
            <button
              onClick={() => setSelectedTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                selectedTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'subscription' && renderSubscription()}
        {selectedTab === 'profile' && renderProfile()}

        {/* Modals */}
        <EditProfileModal
          isOpen={editProfileModalOpen}
          onClose={() => setEditProfileModalOpen(false)}
          user={user!}
          activeSubscription={activeSubscription}
          onUpdateSuccess={handleProfileUpdateSuccess}
        />

        <ChangePasswordModal
          isOpen={changePasswordModalOpen}
          onClose={() => setChangePasswordModalOpen(false)}
          onUpdateSuccess={handlePasswordUpdateSuccess}
        />

        <EmailPreferencesModal
          isOpen={emailPreferencesModalOpen}
          onClose={() => setEmailPreferencesModalOpen(false)}
          user={user!}
          onUpdateSuccess={handleEmailPreferencesUpdateSuccess}
        />
      </div>
    </div>
  );
};

  const handleProfileUpdateSuccess = () => {
    // Refresh subscription data to get updated address info
    refetchSubscriptions();
  };

  const handlePasswordUpdateSuccess = () => {
    // Password update doesn't require data refresh
    console.log('Password updated successfully');
  };

  const handleEmailPreferencesUpdateSuccess = () => {
    // Email preferences update doesn't require data refresh
    console.log('Email preferences updated successfully');
  };
  const handleSignOut = async () => {
    try {
      await signOut();
      // The useAuth hook will automatically handle the state change
      // and redirect the user back to the homepage
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
