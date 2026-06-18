import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import { getCompanyInfo } from "@/lib/data/queries"
import AdminSidebar from "@/components/admin/admin-sidebar"
import SettingsManager from "@/components/admin/settings-manager"

export default async function AdminSettingsPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const companyInfo = await getCompanyInfo()

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-56">
        <SettingsManager companyInfo={companyInfo} />
      </div>
    </div>
  )
}
