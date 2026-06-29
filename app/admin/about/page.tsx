import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import { getCompanyInfo } from "@/lib/data/queries"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AboutManager from "@/components/admin/about-manager"

export default async function AdminAboutPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const companyInfo = await getCompanyInfo()

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-56">
        <div className="p-6 lg:p-12">
          <AboutManager companyInfo={companyInfo} />
        </div>
      </div>
    </div>
  )
}
