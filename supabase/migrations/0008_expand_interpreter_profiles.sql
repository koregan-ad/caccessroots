alter table public.interpreter_profiles
  add column if not exists is_certified boolean,
  add column if not exists certifications text[] not null default '{}'::text[],
  add column if not exists licenses text[] not null default '{}'::text[],
  add column if not exists specialties text[] not null default '{}'::text[],
  add column if not exists experience_band text,
  add column if not exists profile_photo_url text,
  add column if not exists intro_video_url text,
  add column if not exists willing_to_mentor boolean not null default false,
  add column if not exists willing_to_work_with_students boolean not null default false;

alter table public.interpreter_profiles
  drop constraint if exists interpreter_profiles_experience_band_check;

alter table public.interpreter_profiles
  add constraint interpreter_profiles_experience_band_check
  check (
    experience_band is null
    or experience_band in (
      'less_than_2',
      '2_to_5',
      '6_to_10',
      '11_plus'
    )
  );
