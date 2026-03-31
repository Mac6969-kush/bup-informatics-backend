insert into roles (name) values
('owner'), ('admin'), ('managerial'), ('regular'), ('finance'), ('hr'), ('global_health')
on conflict (name) do nothing;

with seeded_users as (
  insert into app_users (email, full_name, password_hash, employee_type, scope)
  values
  ('owner@bup.local', 'Mac Owner', crypt('datamac', gen_salt('bf')), 'ops', 'Operations'),
  ('admin@bup.local', 'Admin User', crypt('datamac', gen_salt('bf')), 'ops', 'Operations'),
  ('manager@bup.local', 'Study Coordinator', crypt('datamac', gen_salt('bf')), 'study', 'Thotoetso Study'),
  ('finance@bup.local', 'Finance User', crypt('datamac', gen_salt('bf')), 'ops', 'Operations'),
  ('studya@bup.local', 'Study A User', crypt('datamac', gen_salt('bf')), 'study', 'Study A')
  on conflict (email) do nothing
  returning id, email
)
insert into user_roles (user_id, role_id)
select u.id, r.id
from app_users u
join roles r on (
  (u.email = 'owner@bup.local' and r.name = 'owner') or
  (u.email = 'admin@bup.local' and r.name = 'admin') or
  (u.email = 'manager@bup.local' and r.name = 'managerial') or
  (u.email = 'finance@bup.local' and r.name in ('regular','finance')) or
  (u.email = 'studya@bup.local' and r.name = 'regular')
)
on conflict do nothing;

insert into studies (name, slug, status)
values
('Thotoetso Study', 'thotoetso-study', 'active'),
('Study A', 'study-a', 'active'),
('Study B', 'study-b', 'active')
on conflict (name) do nothing;
