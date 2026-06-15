-- =====================================================
-- FIX: Infinite recursion in admin_users RLS policies
-- RUN THIS SCRIPT TO FIX THE ERROR
-- =====================================================

-- Step 1: Create security definer functions FIRST (these bypass RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND is_active = true AND role = 'super_admin'
  );
$$;

-- Step 2: Drop ALL existing policies that cause recursion

-- Admin users policies (the source of recursion)
DROP POLICY IF EXISTS "Admin read own admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin insert admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin update admin_users" ON admin_users;
DROP POLICY IF EXISTS "Read own admin record" ON admin_users;
DROP POLICY IF EXISTS "Super admin manage all" ON admin_users;
DROP POLICY IF EXISTS "Users read own admin record" ON admin_users;
DROP POLICY IF EXISTS "Super admin read all" ON admin_users;
DROP POLICY IF EXISTS "Super admin insert" ON admin_users;
DROP POLICY IF EXISTS "Admin update own or super admin" ON admin_users;

-- Drop admin full access policies on all tables
DROP POLICY IF EXISTS "Admin full access hero_slides" ON hero_slides;
DROP POLICY IF EXISTS "Admin full access services" ON services;
DROP POLICY IF EXISTS "Admin full access gallery_categories" ON gallery_categories;
DROP POLICY IF EXISTS "Admin full access gallery_projects" ON gallery_projects;
DROP POLICY IF EXISTS "Admin full access gallery_images" ON gallery_images;
DROP POLICY IF EXISTS "Admin full access inventory_categories" ON inventory_categories;
DROP POLICY IF EXISTS "Admin full access inventory_items" ON inventory_items;
DROP POLICY IF EXISTS "Admin full access team_members" ON team_members;
DROP POLICY IF EXISTS "Admin full access company_info" ON company_info;
DROP POLICY IF EXISTS "Admin full access contact_submissions" ON contact_submissions;

-- Step 3: Recreate admin_users policies WITHOUT recursion
-- Users can read their own record
CREATE POLICY "Users can read own record" ON admin_users 
  FOR SELECT 
  USING (id = auth.uid());

-- Step 4: Recreate admin policies using security definer functions

CREATE POLICY "Admin manage hero_slides" ON hero_slides 
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage services" ON services 
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage gallery_categories" ON gallery_categories 
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage gallery_projects" ON gallery_projects 
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage gallery_images" ON gallery_images 
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage inventory_categories" ON inventory_categories 
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage inventory_items" ON inventory_items 
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage team_members" ON team_members 
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage company_info" ON company_info 
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admin manage contact_submissions" ON contact_submissions 
  FOR ALL USING (public.is_admin());

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO anon, authenticated;
