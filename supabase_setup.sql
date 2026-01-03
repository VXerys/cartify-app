-- =====================================================
-- SUPABASE DATABASE SETUP FOR CARTIFY
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query
-- =====================================================

-- Enable Row Level Security on all tables
-- This ensures data is isolated per user

-- =====================================================
-- 1. PROFILES TABLE
-- Stores user profile information
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- =====================================================
-- 2. TRANSACTIONS TABLE
-- Stores shopping transactions per user
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  total_amount BIGINT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policies for transactions
CREATE POLICY "Users can view own transactions" 
  ON public.transactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" 
  ON public.transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" 
  ON public.transactions FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" 
  ON public.transactions FOR DELETE 
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_date_idx ON public.transactions(date DESC);

-- =====================================================
-- 3. TRANSACTION ITEMS TABLE
-- Stores individual items in each transaction
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transaction_items (
  id BIGSERIAL PRIMARY KEY,
  transaction_id BIGINT REFERENCES public.transactions(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  item_price BIGINT NOT NULL,
  quantity INTEGER NOT NULL,
  unit TEXT,
  category TEXT NOT NULL,
  total_price BIGINT NOT NULL
);

-- Enable RLS
ALTER TABLE public.transaction_items ENABLE ROW LEVEL SECURITY;

-- Policies for transaction_items (based on parent transaction ownership)
CREATE POLICY "Users can view own transaction items" 
  ON public.transaction_items FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.transactions 
      WHERE id = transaction_items.transaction_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own transaction items" 
  ON public.transaction_items FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.transactions 
      WHERE id = transaction_items.transaction_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own transaction items" 
  ON public.transaction_items FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.transactions 
      WHERE id = transaction_items.transaction_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own transaction items" 
  ON public.transaction_items FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.transactions 
      WHERE id = transaction_items.transaction_id 
      AND user_id = auth.uid()
    )
  );

-- Index for faster queries
CREATE INDEX IF NOT EXISTS transaction_items_transaction_id_idx ON public.transaction_items(transaction_id);

-- =====================================================
-- 4. FUNCTION: Handle new user signup
-- Automatically create profile when user signs up
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 5. FUNCTION: Update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- DONE! Your Supabase database is now ready.
-- 
-- Summary:
-- - profiles: User profile data (auto-created on signup)
-- - transactions: Shopping transactions (per user)
-- - transaction_items: Items in each transaction
-- 
-- All tables have Row Level Security enabled,
-- so users can only access their own data.
-- =====================================================
