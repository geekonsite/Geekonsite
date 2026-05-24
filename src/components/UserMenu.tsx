import React, { useState } from 'react'
import { User, Settings, CreditCard, HelpCircle, LogOut, ChevronDown } from 'lucide-react'
import { signOut } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface UserMenuProps {
  onManageSubscription?: () => void;
  onAccountSettings?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ 
  onManageSubscription,
  onAccountSettings 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  const handleManageSubscription = () => {
    setIsOpen(false)
    if (onManageSubscription) {
      onManageSubscription()
    }
  }

  const handleAccountSettings = () => {
    setIsOpen(false)
    if (onAccountSettings) {
      onAccountSettings()
    }
  }

  const getUserDisplayName = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
    }
    return user.email?.split('@')[0] || 'User'
  }

  const getUserInitials = () => {
    const name = getUserDisplayName()
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {getUserInitials()}
        </div>
        <span className="hidden md:block text-gray-700 font-medium">{getUserDisplayName()}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                  {getUserInitials()}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{getUserDisplayName()}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button
                onClick={handleAccountSettings}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <User className="h-4 w-4 mr-3" />
                Account Settings
              </button>
              
              <button
                onClick={handleManageSubscription}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <CreditCard className="h-4 w-4 mr-3" />
                Manage Subscription
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false)
                  // Navigate to support
                  alert('Support page would be implemented here')
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <HelpCircle className="h-4 w-4 mr-3" />
                Help & Support
              </button>
            </div>

            <div className="border-t border-gray-200 py-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}