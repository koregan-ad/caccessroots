begin;

alter table public.interpreter_profiles
  add column if not exists
    is_advanced_itp_student boolean
    not null default false,
  add column if not exists
    college_name text;

commit;
