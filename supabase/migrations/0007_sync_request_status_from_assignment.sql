-- Keep the request status synchronized with interpreter responses.

create or replace function public.sync_request_status_from_assignment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Interpreter accepts the assignment.
  if
    old.status = 'released'::assignment_status
    and new.status = 'accepted'::assignment_status
  then
    update public.requests
    set
      status = 'assigned'::request_status,
      updated_at = now()
    where id = new.request_id
      and status = 'pending_acceptance'::request_status;

  -- Interpreter declines or withdraws.
  elsif
    old.status in (
      'released'::assignment_status,
      'accepted'::assignment_status
    )
    and new.status = 'declined'::assignment_status
  then
    update public.requests
    set
      status = 'open'::request_status,
      updated_at = now()
    where id = new.request_id
      and status in (
        'pending_acceptance'::request_status,
        'assigned'::request_status
      );
  end if;

  return new;
end;
$$;

drop trigger if exists assignments_sync_request_status
  on public.assignments;

create trigger assignments_sync_request_status
after update of status on public.assignments
for each row
when (old.status is distinct from new.status)
execute function public.sync_request_status_from_assignment();

revoke all
on function public.sync_request_status_from_assignment()
from public;

-- Repair accepted assignments stuck at Awaiting interpreter response.
update public.requests r
set
  status = 'assigned'::request_status,
  updated_at = now()
where r.status = 'pending_acceptance'::request_status
  and exists (
    select 1
    from public.assignments a
    where a.request_id = r.id
      and a.status = 'accepted'::assignment_status
  );

-- Repair declined or withdrawn requests stuck in the wrong status.
update public.requests r
set
  status = 'open'::request_status,
  updated_at = now()
where r.status in (
    'pending_acceptance'::request_status,
    'assigned'::request_status
  )
  and exists (
    select 1
    from public.assignments a
    where a.request_id = r.id
      and a.status = 'declined'::assignment_status
  )
  and not exists (
    select 1
    from public.assignments active_assignment
    where active_assignment.request_id = r.id
      and active_assignment.status in (
        'proposed'::assignment_status,
        'pending_admin_release'::assignment_status,
        'released'::assignment_status,
        'accepted'::assignment_status
      )
  );
