-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Drop existing tables if they exist
drop table if exists revolut_transactions cascade;
drop table if exists monthly_approvals cascade;

-- Create revolut_transactions table
create table revolut_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users,
  date date not null,
  description text not null,
  amount decimal not null,
  category text not null,
  original_category text not null,
  created_at timestamp with time zone default now(),
  unique(user_id, date, description, amount)
);

-- Add RLS policies for revolut_transactions
alter table revolut_transactions enable row level security;

create policy "Users can insert their own transactions"
  on revolut_transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own transactions"
  on revolut_transactions for select
  using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on revolut_transactions for delete
  using (auth.uid() = user_id);

-- Create monthly_approvals table
create table monthly_approvals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users,
  month integer not null,
  year integer not null,
  approved_at timestamp with time zone default now(),
  unique(user_id, month, year)
);

-- Add RLS policies for monthly_approvals
alter table monthly_approvals enable row level security;

create policy "Users can insert their own approvals"
  on monthly_approvals for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own approvals"
  on monthly_approvals for select
  using (auth.uid() = user_id);

create policy "Users can delete their own approvals"
  on monthly_approvals for delete
  using (auth.uid() = user_id);

-- Add indexes for better query performance
create index revolut_transactions_user_id_date_idx 
  on revolut_transactions(user_id, date);

create index monthly_approvals_user_id_month_year_idx 
  on monthly_approvals(user_id, month, year); 