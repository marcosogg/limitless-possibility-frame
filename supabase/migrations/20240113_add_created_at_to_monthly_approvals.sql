-- Add created_at column to monthly_approvals table
ALTER TABLE public.monthly_approvals
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing rows to have a created_at value if they don't already
UPDATE public.monthly_approvals
SET created_at = NOW()
WHERE created_at IS NULL; 