export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  start_date: string;
  next_billing_date: string | null;
  price_paid: number;
  billing_cycle: 'monthly' | 'annual';
  currency: string;
  payment_method_id?: string;
  device_info?: {
    type: string;
    brand: string;
    model: string;
  };
  address_info?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
}

export interface SubscriptionFormData {
  plan_id: string;
  plan_name: string;
  price_paid: number;
  billing_cycle: 'monthly' | 'annual';
  device_info: {
    type: string;
    brand: string;
    model: string;
  };
  address_info: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}