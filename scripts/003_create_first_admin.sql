-- Run this after creating your first admin user via Supabase Auth
-- Replace 'YOUR_USER_ID' with the actual user ID from auth.users

-- To create an admin, first sign up via the website, then run:
-- INSERT INTO admin_users (id, email, full_name, role, is_active)
-- SELECT id, email, 'Admin Name', 'super_admin', true
-- FROM auth.users
-- WHERE email = 'your-admin-email@example.com';

-- Example (uncomment and modify):
-- INSERT INTO admin_users (id, email, full_name, role, is_active)
-- VALUES (
--   '00000000-0000-0000-0000-000000000000', -- Replace with actual UUID
--   'admin@casantevents.com',
--   'Admin User',
--   'super_admin',
--   true
-- );
