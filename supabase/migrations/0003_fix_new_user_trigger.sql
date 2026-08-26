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
      when 'partner_admin'
        then 'partner_admin'::public.user_role
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

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
