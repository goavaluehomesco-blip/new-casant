import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import TeamManager from "@/components/admin/team-manager"

export default async function AdminTeamPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()
  const { data: teamMembers, error } = await supabase
    .from("team_members")
    .select("id, name, role, bio, image_url, email, phone, linkedin, member_type, display_order, is_active")
    .order("display_order")

  // Fallback if the member_type migration hasn't been run yet — treat everyone as a director
  const members =
    error && (error.code === "42703" || error.message?.includes("member_type"))
      ? (
          await supabase
            .from("team_members")
            .select("id, name, role, bio, image_url, email, phone, linkedin, display_order, is_active")
            .order("display_order")
        ).data?.map((m) => ({ ...m, member_type: "director" as const })) || []
      : teamMembers || []

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-56">
        <TeamManager members={members} />
      </div>
    </div>
  )
}
