-- Drop the existing function first
drop function if exists undo_monthly_approval(uuid, uuid);

-- Create a function to handle the undo operation in a transaction
create or replace function undo_monthly_approval(p_approval_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Verify the approval exists and belongs to the user
  if not exists (
    select 1 
    from monthly_approvals 
    where id = p_approval_id 
    and user_id = p_user_id
  ) then
    raise exception 'Monthly approval not found or does not belong to user';
  end if;

  -- Start transaction
  begin
    -- Delete transactions first
    delete from revolut_transactions
    where monthly_approval_id = p_approval_id
    and user_id = p_user_id;

    -- Then delete the approval
    delete from monthly_approvals
    where id = p_approval_id
    and user_id = p_user_id;

    -- If we get here, both operations succeeded
  exception
    when others then
      -- Roll back the transaction on any error
      raise exception 'Failed to undo monthly approval: %', sqlerrm;
  end;
end;
$$; 