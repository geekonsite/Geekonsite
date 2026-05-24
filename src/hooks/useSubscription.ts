import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Subscription, SubscriptionFormData } from '../types/subscription';
import { useAuth } from './useAuth';

export const useSubscription = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSubscriptions = async () => {
    if (!user) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubscriptions(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (subscriptionData: SubscriptionFormData) => {
    if (!user) {
      throw new Error('User must be authenticated to create subscription');
    }

    try {
      // Calculate next billing date
      const startDate = new Date();
      const nextBillingDate = new Date(startDate);
      
      if (subscriptionData.billing_cycle === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_id: subscriptionData.plan_id,
          plan_name: subscriptionData.plan_name,
          status: 'active',
          start_date: startDate.toISOString(),
          next_billing_date: nextBillingDate.toISOString(),
          price_paid: subscriptionData.price_paid,
          billing_cycle: subscriptionData.billing_cycle,
          device_info: subscriptionData.device_info,
          address_info: subscriptionData.address_info
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh subscriptions list
      await fetchSubscriptions();
      
      return { success: true, subscription: data };
    } catch (err) {
      console.error('Error creating subscription:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to create subscription');
    }
  };

  const updateSubscriptionStatus = async (subscriptionId: string, status: Subscription['status']) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status })
        .eq('id', subscriptionId)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Refresh subscriptions list
      await fetchSubscriptions();
      
      return { success: true };
    } catch (err) {
      console.error('Error updating subscription status:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to update subscription');
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  const activeSubscription = subscriptions.find(sub => sub.status === 'active');

  return {
    subscriptions,
    activeSubscription,
    loading,
    error,
    createSubscription,
    updateSubscriptionStatus,
    refetchSubscriptions: fetchSubscriptions
  };
};