import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  })
  return { data, error }
}

export const getCurrentUser = () => {
  return supabase.auth.getUser()
}

export const getSession = () => {
  return supabase.auth.getSession()
}

// User profile update functions
export const updateUserProfile = async (updates: {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone?: string;
}) => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  })
  return { data, error }
}

export const updateUserPassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })
  return { data, error }
}

export const updateSubscriptionAddress = async (subscriptionId: string, addressInfo: {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ address_info: addressInfo })
    .eq('id', subscriptionId)
    .select()
    .single()
  
  return { data, error }
}

export const updateUserEmailPreferences = async (preferences: {
  marketing_emails?: boolean;
  service_notifications?: boolean;
  billing_reminders?: boolean;
  security_alerts?: boolean;
}) => {
  const { data, error } = await supabase.auth.updateUser({
    data: {
      email_preferences: preferences
    }
  })
  return { data, error }
}