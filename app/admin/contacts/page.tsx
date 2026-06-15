import { createClient } from "@/lib/supabase/server"
import { requireAdminSession } from "@/lib/admin/session"
import { ContactSubmission } from "@/lib/data/types"
import AdminSidebar from "@/components/admin/admin-sidebar"
import ContactsManager from "@/components/admin/contacts-manager"

export default async function AdminContactsPage() {
  const { adminUser, unreadCount } = await requireAdminSession()
  const supabase = await createClient()
  const { data: contacts } = await supabase
    .from("contact_submissions")
    .select("id, name, email, phone, event_type, event_date, message, is_read, is_archived, created_at")
    .order("created_at", { ascending: false })
    .limit(100)

  const typedContacts: ContactSubmission[] = (contacts || []) as ContactSubmission[]

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar user={adminUser} unreadCount={unreadCount} />
      <div className="lg:pl-64">
        <ContactsManager contacts={typedContacts} />
      </div>
    </div>
  )
}
