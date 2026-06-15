import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import HeroManager from "@/components/admin/hero-manager"

export default async function AdminHeroPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()
  const { data: heroSlides } = await supabase
    .from("hero_slides")
    .select("id, title, subtitle, cta_text, cta_link, video_url, image_url, is_active, display_order")
    .order("display_order")

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-64">
        <HeroManager slides={heroSlides || []} />
      </div>
    </div>
  )
}
