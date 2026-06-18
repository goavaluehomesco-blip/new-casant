import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { createClient } from "@/lib/supabase/server"
import DatabaseMonitor from "@/components/admin/database-monitor"

export default async function AdminDatabasePage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()
  const { count } = await supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("is_read", false).eq("is_archived", false)

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminSidebar user={adminUser} unreadCount={count ?? 0} />
      <div className="lg:pl-56">
        <DatabaseMonitor />
      </div>
    </div>
  )
}
