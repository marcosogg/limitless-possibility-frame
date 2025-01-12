-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Drop existing tables if they exist
drop table if exists revolut_transactions cascade;
drop table if exists monthly_approvals cascade;

-- Create monthly_approvals table first (since it will be referenced)
create table monthly_approvals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  month integer not null check (month between 1 and 12),
  year integer not null check (year >= 2000),
  approved_at timestamp with time zone default now(),
  unique(user_id, month, year)
);

-- Create revolut_transactions table with reference to monthly_approvals
create table revolut_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  monthly_approval_id uuid references monthly_approvals not null,
  date date not null,
  description text not null,
  amount decimal not null,
  category text not null,
  original_category text not null,
  created_at timestamp with time zone default now(),
  unique(user_id, date, description, amount)
);

-- Create function to validate transaction dates match approval
create or replace function validate_transaction_dates()
returns trigger as $$
begin
  -- Check if date matches the month/year of the monthly_approval
  if (
    extract(month from NEW.date) != (
      select month from monthly_approvals where id = NEW.monthly_approval_id
    ) or
    extract(year from NEW.date) != (
      select year from monthly_approvals where id = NEW.monthly_approval_id
    )
  ) then
    raise exception 'Transaction date must match the month and year of the monthly approval';
  end if;

  -- Check if user_id matches the monthly_approval's user_id
  if NEW.user_id != (
    select user_id from monthly_approvals where id = NEW.monthly_approval_id
  ) then
    raise exception 'Transaction user_id must match the monthly approval user_id';
  end if;

  return NEW;
end;
$$ language plpgsql;

-- Create trigger for date validation
create trigger validate_transaction_dates_trigger
  before insert or update on revolut_transactions
  for each row
  execute function validate_transaction_dates();

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

-- Add indexes for better query performance
create index revolut_transactions_user_id_date_idx 
  on revolut_transactions(user_id, date);

create index revolut_transactions_monthly_approval_id_idx
  on revolut_transactions(monthly_approval_id);

create index monthly_approvals_user_id_month_year_idx 
  on monthly_approvals(user_id, month, year);