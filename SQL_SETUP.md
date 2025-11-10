# Supabase Database Setup

## Run this SQL in Supabase Dashboard

Go to: https://supabase.com/dashboard/project/uhwpvkvvfrlokmdegptv/sql/new

Copy and paste this SQL, then click **"Run"**:

```sql
-- Add phone column to waitlist table (if it doesn't exist)
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS phone TEXT;

-- If you need to create the table from scratch, use this instead:
-- CREATE TABLE IF NOT EXISTS waitlist (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
--   email TEXT NOT NULL,
--   name TEXT NOT NULL,
--   phone TEXT,
--   picture TEXT,
--   provider TEXT DEFAULT 'email',
--   reason TEXT,
--   joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   status TEXT DEFAULT 'pending',
--   UNIQUE(email)
-- );
```

---

## What This Does:

1. **Adds `phone` column**:
   - Stores phone numbers from waitlist signups
   - Optional field (nullable)
   - Supports international formats

---

## After Running This:

✅ Phone number field will be saved with waitlist signups
✅ Existing records won't be affected
✅ Phone field is optional (can be null)
