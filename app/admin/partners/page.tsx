import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import PartnersManager from "@/components/admin/partners-manager"

export default async function AdminPartnersPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()

  const { data: partners } = await supabase
    .from("partners")
    .select("id, name, image_url, website_url, is_active, display_order, created_at, updated_at")
    .order("display_order")

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-56">
        <div className="p-6 md:p-8">
          <PartnersManager partners={partners || []} />
        </div>
      </div>
    </div>
  )
}
