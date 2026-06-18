import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import InstagramManager from "@/components/admin/instagram-manager"

export default async function AdminInstagramPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("instagram_feed")
    .select("id, image_url, caption, display_order, is_active, created_at")
    .order("display_order")

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-64">
        <InstagramManager posts={posts || []} />
      </div>
    </div>
  )
}
