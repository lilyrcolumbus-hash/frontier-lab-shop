-- Read-only demo admin account for the portfolio.
-- Step 1 (Supabase dashboard): Authentication -> Users -> Add user -> Create new user
--   email: demo@myfrontierlab.com   password: FrontierDemo-2026   tick "Auto Confirm User"
-- Step 2: run this in the SQL Editor. It gives that user access to the store. The app itself
-- (lib/with-store-admin.ts) refuses every write from this account and hides customer data.
insert into public.store_members (id, "storeId", "userId", role)
select 'demo-readonly-member', s.id, u.id::text, 'owner'
from public.stores s
cross join auth.users u
where u.email = 'demo@myfrontierlab.com'
on conflict do nothing;
