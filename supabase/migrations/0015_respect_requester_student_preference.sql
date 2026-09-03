create or replace function public.match_interpreters_for_request(
  p_request_id uuid
)
returns table(
  interpreter_id uuid,
  full_name text,
  distance_miles numeric,
  within_service_radius boolean,
  service_radius_miles integer,
  languages text[],
  modalities text[],
  total_completed integer,
  active_workload integer,
  fit_score numeric
)
language plpgsql
stable
security definer
as $function$
declare
  v_req requests%rowtype;
begin
  if not is_coordinator_or_admin() then
    raise exception 'permission denied';
  end if;

  select *
  into v_req
  from requests
  where id = p_request_id;

  if not found then
    raise exception 'request not found';
  end if;

  return query
  with eligible as (
    select
      p.id as interpreter_id,
      p.full_name,
      ip.service_radius_miles,
      ip.languages,
      ip.modalities,
      ip.total_completed,
      ip.home_location,
      (
        st_distance(
          ip.home_location,
          v_req.event_location
        ) / 1609.344
      )::numeric(10,2) as distance_miles,
      (
        select count(*)::int
        from assignments a
        where a.interpreter_id = p.id
          and a.status in (
            'proposed',
            'pending_admin_release',
            'released',
            'accepted'
          )
      ) as active_workload
    from profiles p
    join interpreter_profiles ip
      on ip.profile_id = p.id
    where p.role = 'interpreter'
      and p.status = 'active'
      and ip.home_location is not null

      -- Interpreter must currently accept requests.
      and coalesce(
        ip.accepting_requests,
        true
      ) = true

      -- An unavailable-until date includes that date.
      and (
        ip.unavailable_until is null
        or ip.unavailable_until <
          v_req.event_start::date
      )

      -- Respect the requester's student preference.
      and (
        coalesce(
          v_req.student_interpreter_allowed,
          false
        ) = true
        or coalesce(
          ip.is_advanced_itp_student,
          false
        ) = false
      )

      -- COI hard filter: requestor's blocklist.
      and not exists (
        select 1
        from coi_blocks b
        where b.requestor_id =
          v_req.requestor_id
          and b.interpreter_id = p.id
      )

      -- Language overlap.
      and ip.languages &&
        v_req.languages_needed

      -- Modality match.
      and v_req.modality =
        any(ip.modalities)
  )
  select
    e.interpreter_id,
    e.full_name,
    e.distance_miles,
    (
      e.distance_miles <=
      e.service_radius_miles
    ) as within_service_radius,
    e.service_radius_miles,
    e.languages,
    e.modalities,
    e.total_completed,
    e.active_workload,
    case
      when e.distance_miles >
        e.service_radius_miles
      then 0
      else greatest(
        0,
        100
        - (e.distance_miles * 1.5)
        - (e.active_workload * 8)
        + least(
          15,
          e.total_completed * 1.5
        )
      )
    end::numeric(6,2) as fit_score
  from eligible e
  order by
    within_service_radius desc,
    fit_score desc,
    distance_miles asc
  limit 50;
end;
$function$;
