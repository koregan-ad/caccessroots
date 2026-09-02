-- Retire the partner_admin account type.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.user_role;
begin
  requested_role :=
    case new.raw_user_meta_data ->> 'role'
      when 'interpreter'
        then 'interpreter'::public.user_role
      else
        'requestor'::public.user_role
    end;

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    status
  )
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
      split_part(coalesce(new.email, 'New user'), '@', 1)
    ),
    requested_role,
    case
      when requested_role = 'requestor'::public.user_role
        then 'active'::public.user_status
      else
        'pending'::public.user_status
    end
  );

  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_no_partner_admin'
  ) then
    alter table public.profiles
      add constraint profiles_no_partner_admin
      check (role <> 'partner_admin'::public.user_role);
  end if;
end
$$;
