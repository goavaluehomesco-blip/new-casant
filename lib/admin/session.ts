import { unstable_cache } from "next/cache"
import { createUnauthenticatedClient } from "@/lib/supabase/server"

// Cached unread count — re-fetches at most once every 60 seconds
const _getUnreadCount = unstable_cache(
  async () => {
    const supabase = createUnauthenticatedClient()
    const { count } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false)
    return count || 0
  },
  ["unread-count"],
  { revalidate: 60, tags: ["unread-count"] }
)

/**
 * Returns a static admin user object and unread count.
 * No authentication required.
 */
export async function requireAdminSession() {
  const unreadCount = await _getUnreadCount()

  const adminUser = {
    id: "admin",
    email: "admin@casantevents.com",
    full_name: "Admin",
    name: "Admin",
    role: "super_admin",
    is_active: true,
  }

  return { user: adminUser, adminUser, unreadCount }
}
