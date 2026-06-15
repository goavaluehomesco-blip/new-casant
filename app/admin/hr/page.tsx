import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import HrManager from "@/components/admin/hr-manager"

export default async function AdminHrPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()

  const [{ data: jobs }, { data: hrInfo }] = await Promise.all([
    supabase.from("job_postings").select("id, title, department, location, type, description, requirements, is_active, display_order, created_at").order("display_order"),
    supabase.from("hr_info").select("*").limit(1).single(),
  ])

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-64">
        <HrManager jobPostings={jobs || []} hrInfo={hrInfo || null} />
      </div>
    </div>
  )
}
