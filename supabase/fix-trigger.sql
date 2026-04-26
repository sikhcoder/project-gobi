-- Run this in the Supabase SQL editor to fix the "Database error saving new user" issue.
-- This replaces the trigger with a minimal version that can't fail on type casts.

-- Also clear any stuck auth users from failed attempts
DELETE FROM auth.users WHERE id NOT IN (SELECT id FROM public.users);

-- Replace the trigger function with a bulletproof version
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(COALESCE(NEW.email, ''), '@', 1)
    ),
    'couple'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
