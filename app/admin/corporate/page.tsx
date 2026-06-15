import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import { GalleryProject } from "@/lib/data/types"
import AdminSidebar from "@/components/admin/admin-sidebar"
import GalleryManager from "@/components/admin/gallery-manager"

export default async function AdminCorporatePage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("gallery_categories")
    .select("id, name, slug, description, display_order, is_active")
    .eq("slug", "corporate")
    .single()

  const { data: projectsData } = await supabase
    .from("gallery_projects")
    .select("id, title, slug, description, cover_image, location, event_date, category_id, is_featured, is_active, display_order, created_at, gallery_images(id, image_url, caption, display_order)")
    .eq("category_id", category?.id)
    .order("display_order")
    .limit(200)

  const projects: GalleryProject[] = (projectsData || []).map((p: any) => ({
    ...p,
    images: p.gallery_images || [],
    updated_at: p.created_at,
  }))

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-64">
        <GalleryManager
          title="Corporate Events Gallery"
          description="Manage your corporate events portfolio"
          categoryId={category?.id || ""}
          categorySlug="corporate"
          projects={projects}
          category={category ?? null}
        />
      </div>
    </div>
  )
}
