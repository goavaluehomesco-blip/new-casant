import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import GalleryManager from "@/components/admin/gallery-manager"

export default async function AdminWeddingsPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("gallery_categories")
    .select("id, name, slug, description, image_url, display_order, is_active")
    .eq("slug", "weddings")
    .single()

  const { data: projectsData } = await supabase
    .from("gallery_projects")
    .select("id, title, slug, description, cover_image, location, event_date, category_id, is_featured, is_active, display_order, created_at, gallery_images(id, image_url, caption, display_order)")
    .eq("category_id", category?.id)
    .order("display_order")
    .limit(200)

  const projects = (projectsData || []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    location: p.location,
    event_date: p.event_date,
    cover_image: p.cover_image,
    is_featured: p.is_featured,
    is_active: p.is_active,
    display_order: p.display_order,
    gallery_images: Array.isArray(p.gallery_images) ? p.gallery_images : [],
  }))

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-64">
        <GalleryManager
          title="Weddings Gallery"
          description="Manage your wedding portfolio"
          categoryId={category?.id || ""}
          categorySlug="weddings"
          projects={projects}
          category={category ?? null}
        />
      </div>
    </div>
  )
}
