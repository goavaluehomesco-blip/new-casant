import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import HrManager from "@/components/admin/hr-manager"

export default async function AdminHrPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()

  const [jobsResult, hrResult] = await Promise.all([
    supabase.from("job_postings").select("id, title, department, location, job_type, description, requirements, is_active, display_order, created_at, updated_at").order("display_order"),
    supabase.from("hr_info").select("*").limit(1).maybeSingle(),
  ])
  const jobs = jobsResult.error?.code === "PGRST205" ? [] : (jobsResult.data || [])
  const hrInfo = hrResult.error?.code === "PGRST205" ? null : (hrResult.data || null)

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-56">
        <HrManager jobPostings={jobs} hrInfo={hrInfo} />
      </div>
    </div>
  )
}
