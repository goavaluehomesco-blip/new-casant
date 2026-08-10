import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import LifeAtCasantManager from "@/components/admin/life-at-casant-manager"

export default async function AdminLifeAtCasantPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()
  const { data: images } = await supabase
    .from("life_at_casant_images")
    .select("id, image_url, caption, display_order, is_active, created_at, updated_at")
    .order("display_order")

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-56">
        <LifeAtCasantManager images={images || []} />
      </div>
    </div>
  )
}
