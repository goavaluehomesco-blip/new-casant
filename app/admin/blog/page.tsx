import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import BlogManager from "@/components/admin/blog-manager"

export default async function AdminBlogPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, description, cover_image, images, content_blocks, is_active, display_order, created_at, updated_at")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })

  const posts = error?.code === "PGRST205" ? [] : (data || [])
  const normalizedPosts = posts.map((p: any) => ({
    ...p,
    images: Array.isArray(p.images) ? p.images : typeof p.images === "string" ? JSON.parse(p.images || "[]") : [],
    content_blocks: Array.isArray(p.content_blocks)
      ? p.content_blocks
      : typeof p.content_blocks === "string"
        ? JSON.parse(p.content_blocks || "[]")
        : [],
  }))

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-56">
        <BlogManager posts={normalizedPosts} />
      </div>
    </div>
  )
}
