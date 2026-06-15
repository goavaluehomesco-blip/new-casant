import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import ServicesManager from "@/components/admin/services-manager"

export default async function AdminServicesPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()
  const { data: services } = await supabase
    .from("services")
    .select("id, title, description, icon, image_url, is_active, display_order")
    .order("display_order", { ascending: true })

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-64">
        <ServicesManager services={services || []} />
      </div>
    </div>
  )
}
