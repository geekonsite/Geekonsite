/*
  # Create subscriptions table for customer subscription management

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `plan_id` (text, stores plan identifier like 'basic-care-annual')
      - `plan_name` (text, human-readable plan name)
      - `status` (text, subscription status: 'active', 'pending', 'cancelled', 'expired')
      - `start_date` (timestamptz, when subscription started)
      - `next_billing_date` (timestamptz, next payment due date)
      - `price_paid` (numeric, amount paid for current billing cycle)
      - `billing_cycle` (text, 'monthly' or 'annual')
      - `currency` (text, default 'USD')
      - `payment_method_id` (text, Square payment method reference)
      - `device_info` (jsonb, stores device details)
      - `address_info` (jsonb, stores customer address)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `subscriptions` table
    - Add policy for users to read their own subscriptions
    - Add policy for users to update their own subscription details

  3. Indexes
    - Index on user_id for fast lookups
    - Index on status for filtering active subscriptions
    - Index on next_billing_date for billing operations
*/

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id text NOT NULL,
  plan_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'cancelled', 'expired')),
  start_date timestamptz DEFAULT now(),
  next_billing_date timestamptz,
  price_paid numeric(10,2) NOT NULL,
  billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
  currency text DEFAULT 'USD',
  payment_method_id text,
  device_info jsonb,
  address_info jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON subscriptions(next_billing_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();