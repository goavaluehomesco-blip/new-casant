import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()

  const [{ count: projectsCount }, { count: inventoryCount }, { data: recentContacts }] = await Promise.all([
    supabase.from("gallery_projects").select("*", { count: "exact", head: true }),
    supabase.from("inventory_items").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_submissions")
      .select("id, name, email, phone, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-64">
        <AdminDashboard
          user={adminUser}
          stats={{
            unreadContacts: unreadCount,
            totalProjects: projectsCount || 0,
            totalInventory: inventoryCount || 0,
          }}
          recentContacts={recentContacts || []}
        />
      </div>
    </div>
  )
}
