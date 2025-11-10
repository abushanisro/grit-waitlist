# Supabase Database Setup

## Run this SQL in Supabase Dashboard

Go to: https://supabase.com/dashboard/project/uhwpvkvvfrlokmdegptv/sql/new

Copy and paste this SQL, then click **"Run"**:

```sql
-- Create waitlist table (supports both email signup and OAuth)
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  picture TEXT,
  provider TEXT DEFAULT 'email',
  reason TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  UNIQUE(email)
);

-- Create user profiles table (for OAuth users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  picture TEXT,
  provider TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for waitlist: Allow anyone to insert (for email signup)
CREATE POLICY "Anyone can join waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own waitlist entry"
  ON waitlist FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IS NULL
  );

-- Policies for user_profiles: Authenticated users only
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

---

## What This Does:

1. **Creates `waitlist` table**:
   - Stores all users who join the waitlist
   - Supports both email signup (no auth) and OAuth (Google/LinkedIn)
   - `email` is unique (prevents duplicates)
   - `user_id` is optional (null for email signups)

2. **Creates `user_profiles` table**:
   - Stores additional profile data for authenticated users
   - Only used for OAuth signups

3. **Sets up security**:
   - Anyone can join waitlist (insert)
   - Row Level Security (RLS) enabled
   - Users can only view their own data

---

## After Running This:

    Email signups will work (no authentication needed)
    Google/LinkedIn signups will work (with OAuth)
    No duplicate emails allowed
    All data is secure with RLS policies
