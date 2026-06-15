import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import SettingsManager from "@/components/admin/settings-manager"

export default async function AdminSettingsPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()
  const { data: companyInfo } = await supabase.from("company_info").select("*").single()

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-64">
        <SettingsManager companyInfo={companyInfo} />
      </div>
    </div>
  )
}
