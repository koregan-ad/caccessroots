begin;

alter table public.interpreter_profiles
  add column if not exists profile_photo_path text;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'interpreter-profile-photos',
  'interpreter-profile-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists
  "interpreter photo owner upload"
  on storage.objects;

create policy "interpreter photo owner upload"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'interpreter-profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
    and public.current_role_is(
      'interpreter'::public.user_role
    )
  );

drop policy if exists
  "interpreter photo owner update"
  on storage.objects;

create policy "interpreter photo owner update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'interpreter-profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
    and public.current_role_is(
      'interpreter'::public.user_role
    )
  )
  with check (
    bucket_id = 'interpreter-profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
    and public.current_role_is(
      'interpreter'::public.user_role
    )
  );

drop policy if exists
  "interpreter photo owner delete"
  on storage.objects;

create policy "interpreter photo owner delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'interpreter-profile-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
    and public.current_role_is(
      'interpreter'::public.user_role
    )
  );

drop policy if exists
  "interpreter photo authorized read"
  on storage.objects;

create policy "interpreter photo authorized read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'interpreter-profile-photos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_coordinator_or_admin()
      or exists (
        select 1
        from public.assignments a
        join public.requests r
          on r.id = a.request_id
        where r.requestor_id = auth.uid()
          and a.interpreter_id::text =
            (storage.foldername(name))[1]
          and a.status in (
            'proposed'::public.assignment_status,
            'released'::public.assignment_status,
            'accepted'::public.assignment_status,
            'completed'::public.assignment_status
          )
          and r.status in (
            'proposed'::public.request_status,
            'pending_acceptance'::public.request_status,
            'assigned'::public.request_status,
            'completed'::public.request_status
          )
      )
    )
  );

drop function if exists
  public.requestor_assignment_proposals();

create function public.requestor_assignment_proposals()
returns table (
  assignment_id uuid,
  request_id uuid,
  interpreter_id uuid,
  interpreter_name text,
  interpreter_credentials text,
  interpreter_is_certified boolean,
  interpreter_certifications text[],
  interpreter_licenses text[],
  interpreter_specialties text[],
  interpreter_experience_band text,
  interpreter_profile_photo_path text,
  interpreter_intro_video_url text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    a.id,
    a.request_id,
    a.interpreter_id,
    p.full_name,
    ip.credentials,
    ip.is_certified,
    ip.certifications,
    ip.licenses,
    ip.specialties,
    ip.experience_band,
    ip.profile_photo_path,
    ip.intro_video_url
  from public.assignments a
  join public.requests r
    on r.id = a.request_id
  join public.profiles p
    on p.id = a.interpreter_id
  left join public.interpreter_profiles ip
    on ip.profile_id = a.interpreter_id
  where r.requestor_id = auth.uid()
    and r.status =
      'proposed'::public.request_status
    and a.status =
      'proposed'::public.assignment_status;
$$;

revoke all
  on function public.requestor_assignment_proposals()
  from public;

grant execute
  on function public.requestor_assignment_proposals()
  to authenticated;

commit;
