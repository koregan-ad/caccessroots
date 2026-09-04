-- Allow requesters to manage their private blocklist without granting them
-- broad read access to every interpreter profile.

create or replace function public.add_requestor_block_by_email(
  p_interpreter_email text,
  p_reason text default null
)
returns uuid
language plpgsql
volatile
security definer
set search_path = public
as $function$
declare
  v_requestor_id uuid := auth.uid();
  v_interpreter_id uuid;
  v_block_id uuid;
begin
  if v_requestor_id is null
    or not public.current_role_is('requestor'::public.user_role)
  then
    raise exception using
      errcode = '42501',
      message = 'permission denied';
  end if;

  select p.id
  into v_interpreter_id
  from public.profiles p
  where lower(p.email) = lower(trim(p_interpreter_email))
    and p.role = 'interpreter'::public.user_role;

  if v_interpreter_id is null then
    raise exception using
      errcode = 'P0002',
      message = 'interpreter not found';
  end if;

  insert into public.coi_blocks (
    requestor_id,
    interpreter_id,
    reason
  )
  values (
    v_requestor_id,
    v_interpreter_id,
    nullif(trim(p_reason), '')
  )
  on conflict (requestor_id, interpreter_id) do nothing
  returning id into v_block_id;

  if v_block_id is null then
    select b.id
    into v_block_id
    from public.coi_blocks b
    where b.requestor_id = v_requestor_id
      and b.interpreter_id = v_interpreter_id;
  end if;

  return v_block_id;
end;
$function$;

create or replace function public.requestor_blocklist()
returns table (
  block_id uuid,
  interpreter_id uuid,
  interpreter_name text,
  interpreter_email text,
  reason text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $function$
  select
    b.id,
    b.interpreter_id,
    p.full_name,
    p.email,
    b.reason,
    b.created_at
  from public.coi_blocks b
  join public.profiles p
    on p.id = b.interpreter_id
  where auth.uid() is not null
    and public.current_role_is('requestor'::public.user_role)
    and b.requestor_id = auth.uid()
  order by b.created_at desc;
$function$;

revoke all on function public.add_requestor_block_by_email(text, text)
  from public;
revoke all on function public.requestor_blocklist()
  from public;

grant execute on function public.add_requestor_block_by_email(text, text)
  to authenticated;
grant execute on function public.requestor_blocklist()
  to authenticated;
