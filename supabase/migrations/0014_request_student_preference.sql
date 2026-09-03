begin;

alter table public.requests
  add column if not exists
    student_interpreter_allowed boolean
    not null default false;

commit;
