begin;

alter table public.interpreter_profiles
  add column if not exists accepting_requests boolean
    not null default true,
  add column if not exists available_days text[]
    not null default '{}'::text[],
  add column if not exists preferred_time_blocks text[]
    not null default '{}'::text[],
  add column if not exists unavailable_until date;

alter table public.interpreter_profiles
  drop constraint if exists
    interpreter_profiles_available_days_check;

alter table public.interpreter_profiles
  add constraint
    interpreter_profiles_available_days_check
  check (
    available_days <@ array[
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ]::text[]
  );

alter table public.interpreter_profiles
  drop constraint if exists
    interpreter_profiles_time_blocks_check;

alter table public.interpreter_profiles
  add constraint
    interpreter_profiles_time_blocks_check
  check (
    preferred_time_blocks <@ array[
      'morning',
      'afternoon',
      'evening'
    ]::text[]
  );

commit;
