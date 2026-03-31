create extension if not exists pgcrypto;

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  password_hash text not null,
  employee_type text not null check (employee_type in ('ops', 'study')),
  scope text,
  is_active boolean not null default true,
  entra_object_id text,
  created_at timestamptz not null default now()
);

create table if not exists user_roles (
  user_id uuid not null references app_users(id) on delete cascade,
  role_id uuid not null references roles(id) on delete cascade,
  primary key (user_id, role_id)
);

create table if not exists studies (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  status text not null check (status in ('active', 'archived', 'deleted')) default 'active',
  created_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists datasets (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references studies(id) on delete cascade,
  source_file_id uuid,
  name text not null,
  columns_json jsonb not null default '[]'::jsonb,
  inferred_types_json jsonb not null default '{}'::jsonb,
  row_count integer not null default 0,
  column_count integer not null default 0,
  profile_json jsonb not null default '{}'::jsonb,
  created_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references studies(id) on delete cascade,
  uploaded_by uuid references app_users(id),
  original_name text not null,
  stored_name text not null,
  mime_type text,
  byte_size bigint not null default 0,
  storage_path text not null,
  folder_path text not null default 'BUP/',
  dataset_id uuid references datasets(id) on delete set null,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now()
);

alter table datasets
  add constraint if not exists datasets_source_file_fk
  foreign key (source_file_id) references files(id) on delete set null;

create table if not exists summaries (
  id uuid primary key default gen_random_uuid(),
  study_id uuid not null references studies(id) on delete cascade,
  dataset_id uuid references datasets(id) on delete set null,
  title text not null,
  mode text not null default 'standard',
  body_html text not null,
  created_by uuid references app_users(id),
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  study_id uuid references studies(id) on delete set null,
  requested_by uuid references app_users(id),
  requested_to uuid references app_users(id),
  title text not null,
  detail text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
