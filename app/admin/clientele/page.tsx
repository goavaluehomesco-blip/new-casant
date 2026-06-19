import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import ClienteleManager from "@/components/admin/clientele-manager"

export default async function AdminClientelePage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()

  const { data: clientele } = await supabase
    .from("clientele")
    .select("id, name, image_url, website_url, is_active, display_order, created_at, updated_at")
    .order("display_order")

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-56">
        <div className="p-6 md:p-8">
          <ClienteleManager clientele={clientele || []} />
        </div>
      </div>
    </div>
  )
}
