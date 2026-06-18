import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import TeamManager from "@/components/admin/team-manager"

export default async function AdminTeamPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()
  const { data: teamMembers } = await supabase
    .from("team_members")
    .select("id, name, role, bio, image_url, email, phone, linkedin, display_order, is_active")
    .order("display_order")

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-56">
        <TeamManager members={teamMembers || []} />
      </div>
    </div>
  )
}
