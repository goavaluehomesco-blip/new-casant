import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import AdminSidebar from "@/components/admin/admin-sidebar"
import InventoryManager from "@/components/admin/inventory-manager"

export default async function AdminInventoryPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase
      .from("inventory_categories")
      .select("id, name, slug, description, icon, display_order, is_active")
      .order("display_order"),
    supabase
      .from("inventory_items")
      .select("id, name, description, category_id, image_url, quantity, is_available, is_active, display_order, inventory_categories(name, slug)")
      .order("display_order")
      .limit(200),
  ])

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-64">
        <InventoryManager categories={categories || []} items={items || []} />
      </div>
    </div>
  )
}
