"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Mail, Phone, Calendar, Archive, Trash2, MailOpen, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  event_type: string | null
  event_date: string | null
  message: string | null
  is_read: boolean
  is_archived: boolean
  created_at: string
}

interface ContactsManagerProps {
  contacts: Contact[]
}

export default function ContactsManager({ contacts }: ContactsManagerProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all")
  const [localContacts, setLocalContacts] = useState<Contact[]>(contacts)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredContacts = localContacts.filter((contact) => {
    if (filter === "unread") return !contact.is_read && !contact.is_archived
    if (filter === "archived") return contact.is_archived
    return !contact.is_archived
  })

  const markAsRead = async (contact: Contact) => {
    if (contact.is_read) return

    const supabase = createClient()
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", contact.id)

    setLocalContacts((prev) => prev.map((c) => c.id === contact.id ? { ...c, is_read: true } : c))
    setSelectedContact((prev) => prev?.id === contact.id ? { ...prev, is_read: true } : prev)
    router.refresh()
  }

  const toggleArchive = async (contact: Contact) => {
    const supabase = createClient()
    const newArchived = !contact.is_archived
    await supabase.from("contact_submissions").update({ is_archived: newArchived }).eq("id", contact.id)

    setLocalContacts((prev) => prev.map((c) => c.id === contact.id ? { ...c, is_archived: newArchived } : c))
    setSelectedContact(null)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!deletingContact) return

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", deletingContact.id)

      if (error) throw error

      setLocalContacts((prev) => prev.filter((c) => c.id !== deletingContact.id))
      setIsDeleteDialogOpen(false)
      setDeletingContact(null)
      setSelectedContact(null)
      router.refresh()
    } catch (err) {
      console.error("Error deleting contact:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const openContact = async (contact: Contact) => {
    setSelectedContact(contact)
    await markAsRead(contact)
  }

  const unreadCount = localContacts.filter((c) => !c.is_read && !c.is_archived).length
  const archivedCount = localContacts.filter((c) => c.is_archived).length

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
          <p className="text-white/50">
            {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/40" />
          <Select value={filter} onValueChange={(v: "all" | "unread" | "archived") => setFilter(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="unread">Unread ({unreadCount})</SelectItem>
              <SelectItem value="archived">Archived ({archivedCount})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredContacts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/50">
                {filter === "unread"
                  ? "No unread messages"
                  : filter === "archived"
                    ? "No archived messages"
                    : "No contact submissions yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredContacts.map((contact) => (
            <Card
              key={contact.id}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                !contact.is_read ? "bg-blue-50 border-blue-200" : ""
              }`}
              onClick={() => openContact(contact)}
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        !contact.is_read ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      {!contact.is_read ? (
                        <Mail className="w-5 h-5 text-white" />
                      ) : (
                        <MailOpen className="w-5 h-5 text-white/50" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${!contact.is_read ? "text-white" : "text-slate-700"}`}>
                          {contact.name}
                        </h3>
                        {!contact.is_read && <Badge className="bg-blue-600 text-white text-[10px]">New</Badge>}
                      </div>
                      <p className="text-sm text-white/50">{contact.email}</p>
                      {contact.phone && <p className="text-sm text-white/60 mt-1">{contact.phone}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/50">{new Date(contact.created_at).toLocaleDateString()}</p>
                    {contact.event_type && (
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        {contact.event_type}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Contact Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent aria-describedby={undefined} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {selectedContact?.name}</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-white/40" />
                  <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                    {selectedContact.email}
                  </a>
                </div>
                {selectedContact.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-white/40" />
                    <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline">
                      {selectedContact.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-white/50">
                {selectedContact.event_type && <Badge variant="outline">{selectedContact.event_type}</Badge>}
                {selectedContact.event_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedContact.event_date).toLocaleDateString()}
                  </span>
                )}
              </div>

              {selectedContact.message && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              )}

              <div className="text-xs text-white/40">
                Received: {new Date(selectedContact.created_at).toLocaleString()}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => toggleArchive(selectedContact)}>
                  <Archive className="w-4 h-4 mr-2" />
                  {selectedContact.is_archived ? "Unarchive" : "Archive"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                  onClick={() => {
                    setDeletingContact(selectedContact)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button size="sm" className="ml-auto bg-blue-600 hover:bg-blue-700" asChild>
                  <a href={`mailto:${selectedContact.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Reply
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message from &quot;{deletingContact?.name}&quot;? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
