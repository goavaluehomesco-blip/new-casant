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
      .select("id, name, slug, description, image_url, display_order, is_active, created_at, updated_at")
      .order("display_order"),
    supabase
      .from("gallery_projects")
      .select("id, title, slug, description, cover_image, location, event_date, category_id, is_featured, is_active, display_order, created_at, updated_at, gallery_images(id, image_url, caption, display_order), gallery_categories(name, slug)")
      .order("display_order")
      .limit(200),
  ])

  const normalizedProjects = (projects || []).map((p) => ({
    ...p,
    gallery_categories: Array.isArray(p.gallery_categories)
      ? (p.gallery_categories[0] ?? null)
      : p.gallery_categories ?? null,
    gallery_images: Array.isArray(p.gallery_images) ? p.gallery_images : [],
  }))

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-56">
        <AllGalleryManager projects={normalizedProjects} categories={categories || []} />
      </div>
    </div>
  )
}
