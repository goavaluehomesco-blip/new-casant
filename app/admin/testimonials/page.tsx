import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import TestimonialsManager from "@/components/admin/testimonials-manager"

export default async function AdminTestimonialsPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, client_name, client_role, client_company, client_image_url, testimonial_text, rating, event_type, is_featured, is_active, display_order, created_at, updated_at")
    .order("display_order")

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-64">
        <TestimonialsManager testimonials={testimonials || []} />
      </div>
    </div>
  )
}
