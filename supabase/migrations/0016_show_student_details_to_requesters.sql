begin;

drop function if exists public.requestor_assignment_proposals();

create function public.requestor_assignment_proposals()
returns table(
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
  interpreter_intro_video_url text,
  interpreter_intro_video_path text,
  interpreter_is_advanced_itp_student boolean,
  interpreter_college_name text
)
language sql
stable
security definer
set search_path to 'public'
as $function$
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
    ip.intro_video_url,
    ip.intro_video_path,
    coalesce(ip.is_advanced_itp_student, false),
    ip.college_name
  from public.assignments a
  join public.requests r
    on r.id = a.request_id
  join public.profiles p
    on p.id = a.interpreter_id
  left join public.interpreter_profiles ip
    on ip.profile_id = a.interpreter_id
  where r.requestor_id = auth.uid()
    and r.status = 'proposed'::public.request_status
    and a.status = 'proposed'::public.assignment_status;
$function$;

commit;
