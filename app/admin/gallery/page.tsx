import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AllGalleryManager from "@/components/admin/all-gallery-manager"

export default async function AdminGalleryPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()

  const [{ data: categories }, { data: projects }] = await Promise.all([
    supabase
      .from("gallery_categories")
      .select("id, name, slug, description, display_order, is_active")
      .order("display_order"),
    supabase
      .from("gallery_projects")
      .select("id, title, slug, description, cover_image_url, category_id, is_featured, is_active, display_order, created_at, gallery_images(id, image_url, caption, display_order), gallery_categories(name, slug)")
      .order("display_order")
      .limit(200),
  ])

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-64">
        <AllGalleryManager projects={projects || []} categories={categories || []} />
      </div>
    </div>
  )
}
