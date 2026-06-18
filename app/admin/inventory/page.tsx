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
      .select("id, name, slug, description, icon, display_order, is_active, created_at, updated_at")
      .order("display_order"),
    supabase
      .from("inventory_items")
      .select("id, name, description, category_id, image_url, specifications, quantity, is_available, is_active, display_order, created_at, updated_at, inventory_categories(name, slug)")
      .order("display_order")
      .limit(200),
  ])

  const normalizedItems = (items || []).map((item) => ({
    ...item,
    inventory_categories: Array.isArray(item.inventory_categories)
      ? (item.inventory_categories[0] ?? null)
      : item.inventory_categories ?? null,
  }))

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-56">
        <InventoryManager categories={categories || []} items={normalizedItems} />
      </div>
    </div>
  )
}
