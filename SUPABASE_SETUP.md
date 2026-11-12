# Supabase registration setup

The registration form creates an account in Supabase Auth and sends the
registrant's full name as user metadata. To also create a row in the
`public.profiles` table, install the database trigger:

1. Open the Supabase project and go to **SQL Editor**.
2. Open `supabase-schema.sql`, paste its contents into a new query, and run it.
3. In **Authentication → URL Configuration**, set the Site URL to the deployed
   site URL and add the exact `verify.html` URL (and local development URL, if
   needed) to Redirect URLs. The confirmation link redirects to this page, which
   displays **Successfully Verified** only after Supabase returns a session.
4. Keep email confirmation enabled under **Authentication → Providers → Email**
   if users should confirm their addresses before signing in.

The trigger creates the profile when Supabase Auth creates the user, including
while email confirmation is pending. Row-level security lets each signed-in
user read only their own profile. Registered accounts are listed under
**Authentication → Users**; profile rows are in **Table Editor → profiles**.

Use only the project's public publishable key in browser code. Never put a
service-role or secret key in this site.
