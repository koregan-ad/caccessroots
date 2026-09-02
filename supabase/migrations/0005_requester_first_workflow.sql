-- =========================================================================
-- Request eligibility review and requester-first matching
-- =========================================================================

-- Any request that needs human review automatically enters the admin queue.
create or replace function create_request_review_approval() returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if new.status = 'pending_review'::request_status then
    insert into approvals (
      kind,
      target_table,
      target_id,
      requested_by,
      requires_two_keys,
      context
    )
    values (
      'request_review'::approval_kind,
      'requests',
      new.id,
      new.requestor_id,
      false,
      jsonb_build_object(
        'request_id', new.id,
        'title', new.title,
        'event_type', new.event_type,
        'review_reasons', new.notes_internal
      )
    );
  end if;

  return new;
end;
$$;

drop trigger if exists requests_review_approval on requests;
create trigger requests_review_approval
  after insert on requests
  for each row execute function create_request_review_approval();

-- Interpreters can only see requests after the requester approves the proposed
-- match. Declined/completed rows remain visible as the interpreter's history.
create or replace function interpreter_can_view_request(p_request_id uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1
    from assignments a
    where a.request_id = p_request_id
      and a.interpreter_id = auth.uid()
      and a.status in ('released', 'accepted', 'declined', 'completed')
  );
$$;

drop policy if exists "requests interpreter visible" on requests;
create policy "requests interpreter visible"
  on requests for select
  using (
    current_role_is('interpreter'::user_role)
    and interpreter_can_view_request(id)
  );

drop policy if exists "assignments interpreter own" on assignments;
create policy "assignments interpreter own"
  on assignments for select
  using (
    interpreter_id = auth.uid()
    and status in ('released', 'accepted', 'declined', 'completed')
  );

-- The requester's dashboard uses this narrow function to show only the current
-- proposed match and the minimum profile information needed for a decision.
create or replace function requestor_assignment_proposals()
returns table (
  assignment_id uuid,
  request_id uuid,
  interpreter_id uuid,
  interpreter_name text,
  interpreter_credentials text
)
language sql stable security definer
set search_path = public
as $$
  select
    a.id,
    a.request_id,
    a.interpreter_id,
    p.full_name,
    ip.credentials
  from assignments a
  join requests r on r.id = a.request_id
  join profiles p on p.id = a.interpreter_id
  left join interpreter_profiles ip on ip.profile_id = a.interpreter_id
  where r.requestor_id = auth.uid()
    and r.status = 'proposed'
    and a.status = 'proposed';
$$;

-- Accepting a proposal releases it to the interpreter. Declining it returns
-- the request to Open without ever exposing it to that interpreter.
create or replace function respond_to_assignment_proposal(
  p_assignment_id uuid,
  p_accept boolean
)
returns uuid
language plpgsql volatile security definer
set search_path = public
as $$
declare
  v_request_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;

  select a.request_id
  into v_request_id
  from assignments a
  join requests r on r.id = a.request_id
  where a.id = p_assignment_id
    and a.status = 'proposed'
    and r.status = 'proposed'
    and r.requestor_id = auth.uid()
  for update of a;

  if v_request_id is null then
    raise exception 'Proposal is no longer available';
  end if;

  if p_accept then
    update assignments
    set
      status = 'released',
      released_at = now(),
      declined_at = null,
      decline_reason = null
    where id = p_assignment_id;

    update requests
    set status = 'pending_acceptance'
    where id = v_request_id;
  else
    update assignments
    set
      status = 'cancelled',
      declined_at = now(),
      decline_reason = 'Declined by requester'
    where id = p_assignment_id;

    update requests
    set status = 'open'
    where id = v_request_id;
  end if;

  return v_request_id;
end;
$$;

revoke all on function interpreter_can_view_request(uuid) from public;
revoke all on function requestor_assignment_proposals() from public;
revoke all on function respond_to_assignment_proposal(uuid, boolean) from public;

grant execute on function interpreter_can_view_request(uuid) to authenticated;
grant execute on function requestor_assignment_proposals() to authenticated;
grant execute on function respond_to_assignment_proposal(uuid, boolean) to authenticated;

revoke all on function create_request_review_approval() from public;
