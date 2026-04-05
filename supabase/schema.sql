create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'manager', 'team_member');
create type public.client_status as enum ('lead', 'active', 'inactive');
create type public.project_status as enum ('planning', 'active', 'at_risk', 'completed');
create type public.task_status as enum ('todo', 'in_progress', 'review', 'done');
create type public.task_priority as enum ('low', 'medium', 'high', 'urgent');
create type public.notification_kind as enum ('mention', 'task', 'project');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role public.user_role not null default 'team_member',
  avatar_url text,
  title text,
  activity_status text default 'Available',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  status public.client_status not null default 'lead',
  industry text,
  notes text,
  owner_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  description text,
  status public.project_status not null default 'planning',
  deadline date,
  budget numeric(12, 2),
  progress integer not null default 0 check (progress between 0 and 100),
  owner_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  assigned_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (project_id, user_id)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status public.task_status not null default 'todo',
  priority public.task_priority not null default 'medium',
  assignee_id uuid references public.users(id) on delete set null,
  due_date date,
  sort_order numeric(10, 2) not null default 1000,
  attachments_count integer not null default 0,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.users(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  body text not null,
  kind public.notification_kind not null default 'task',
  read boolean not null default false,
  related_entity_id uuid,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_clients_owner_id on public.clients(owner_id);
create index if not exists idx_clients_status on public.clients(status);
create index if not exists idx_projects_client_id on public.projects(client_id);
create index if not exists idx_projects_owner_id on public.projects(owner_id);
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_project_members_project_id on public.project_members(project_id);
create index if not exists idx_project_members_user_id on public.project_members(user_id);
create index if not exists idx_tasks_project_id on public.tasks(project_id);
create index if not exists idx_tasks_assignee_id on public.tasks(assignee_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_comments_task_id on public.comments(task_id);
create index if not exists idx_activity_logs_actor_id on public.activity_logs(actor_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_read on public.notifications(read);

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row execute procedure public.set_updated_at();

drop trigger if exists set_clients_updated_at on public.clients;
create trigger set_clients_updated_at
before update on public.clients
for each row execute procedure public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute procedure public.set_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'team_member')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks enable row level security;
alter table public.comments enable row level security;
alter table public.activity_logs enable row level security;
alter table public.notifications enable row level security;

create policy "users can view profiles"
on public.users
for select
to authenticated
using (true);

drop policy if exists "users can update own profile" on public.users;
create policy "users can update own profile"
on public.users
for update
to authenticated
using (
  auth.uid() = id
  or exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role = 'admin'
  )
)
with check (
  auth.uid() = id
  or exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role = 'admin'
  )
);

drop policy if exists "users can insert own profile" on public.users;
create policy "users can insert own profile"
on public.users
for insert
to authenticated
with check (auth.uid() = id);

create policy "authenticated users can view clients"
on public.clients
for select
to authenticated
using (true);

create policy "managers and admins manage clients"
on public.clients
for all
to authenticated
using (
  exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role in ('admin', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role in ('admin', 'manager')
  )
);

create policy "authenticated users can view projects"
on public.projects
for select
to authenticated
using (true);

drop policy if exists "managers and admins manage projects" on public.projects;
create policy "managers and admins manage projects"
on public.projects
for all
to authenticated
using (
  exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role in ('admin', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role in ('admin', 'manager')
  )
);

create policy "authenticated users can view project members"
on public.project_members
for select
to authenticated
using (true);

drop policy if exists "managers and admins manage project members" on public.project_members;
create policy "managers and admins manage project members"
on public.project_members
for all
to authenticated
using (
  exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role in ('admin', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role in ('admin', 'manager')
  )
);

create policy "team can view tasks"
on public.tasks
for select
to authenticated
using (true);

create policy "team can manage tasks on assigned projects"
on public.tasks
for all
to authenticated
using (
  exists (
    select 1
    from public.project_members pm
    where pm.project_id = tasks.project_id
      and pm.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role in ('admin', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.project_members pm
    where pm.project_id = tasks.project_id
      and pm.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role in ('admin', 'manager')
  )
);

create policy "team can view comments"
on public.comments
for select
to authenticated
using (true);

create policy "team can insert comments"
on public.comments
for insert
to authenticated
with check (auth.uid() = author_id);

create policy "users can view own notifications"
on public.notifications
for select
to authenticated
using (auth.uid() = user_id);

create policy "users can update own notifications"
on public.notifications
for update
to authenticated
using (auth.uid() = user_id);

drop policy if exists "admins can view activity logs" on public.activity_logs;
create policy "users can view relevant activity logs"
on public.activity_logs
for select
to authenticated
using (
  actor_id = auth.uid()
  or exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.role = 'admin'
  )
);

drop policy if exists "users can insert own activity logs" on public.activity_logs;
create policy "users can insert own activity logs"
on public.activity_logs
for insert
to authenticated
with check (actor_id = auth.uid());

drop policy if exists "authenticated users can insert notifications" on public.notifications;
create policy "authenticated users can insert notifications"
on public.notifications
for insert
to authenticated
with check (auth.uid() is not null);
