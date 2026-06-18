"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Quote, ToggleLeft, ToggleRight } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"
import type { Testimonial } from "@/lib/data/types"

interface TestimonialsManagerProps {
  testimonials: Testimonial[]
}

export default function TestimonialsManager({ testimonials: initial }: TestimonialsManagerProps) {
  const [items, setItems] = useState<Testimonial[]>(initial)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ client_name: "", client_role: "", client_company: "", client_image_url: "", testimonial_text: "", rating: "5", event_type: "" })
  const supabase = createClient()

  const openNew = () => {
    setEditing(null)
    setForm({ client_name: "", client_role: "", client_company: "", client_image_url: "", testimonial_text: "", rating: "5", event_type: "" })
    setIsDialogOpen(true)
  }

  const openEdit = (item: Testimonial) => {
    setEditing(item)
    setForm({
      client_name: item.client_name,
      client_role: item.client_role || "",
      client_company: item.client_company || "",
      client_image_url: item.client_image_url || "",
      testimonial_text: item.testimonial_text,
      rating: String(item.rating ?? 5),
      event_type: item.event_type || "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      client_name: form.client_name,
      client_role: form.client_role || null,
      client_company: form.client_company || null,
      client_image_url: form.client_image_url || null,
      testimonial_text: form.testimonial_text,
      rating: form.rating ? Number(form.rating) : null,
      event_type: form.event_type || null,
    }

    if (editing) {
      const { data } = await supabase.from("testimonials").update(payload).eq("id", editing.id).select().single()
      if (data) setItems(items.map(i => i.id === editing.id ? data : i))
    } else {
      const { data } = await supabase.from("testimonials").insert({ ...payload, display_order: items.length }).select().single()
      if (data) setItems([...items, data])
    }
    setSaving(false)
    setIsDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return
    await supabase.from("testimonials").delete().eq("id", id)
    setItems(items.filter(i => i.id !== id))
  }

  const toggleActive = async (item: Testimonial) => {
    const { data } = await supabase.from("testimonials").update({ is_active: !item.is_active }).eq("id", item.id).select().single()
    if (data) setItems(items.map(i => i.id === item.id ? data : i))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-white/50 mt-1">Manage client quotes shown on the homepage</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" />Add Testimonial</Button>
      </div>

      <div className="grid gap-4">
        {items.length === 0 && (
          <div className="text-center py-16 text-white/40">No testimonials yet. Add your first one.</div>
        )}
        {items.map(item => (
          <div key={item.id} className={`group flex items-center gap-4 rounded-xl border border-white/8 bg-[#161616] px-4 py-3.5 transition-colors hover:border-white/15 ${!item.is_active ? "opacity-50" : ""}`}>
            {/* Avatar */}
            {item.client_image_url ? (
              <img src={item.client_image_url} alt="" className="w-11 h-11 rounded-full object-cover flex-shrink-0 ring-1 ring-white/10" />
            ) : (
              <div className="w-11 h-11 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0">
                <Quote className="w-4 h-4 text-white/30" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm text-white">{item.client_name}</span>
                {item.client_role && (
                  <span className="text-[11px] text-white/40 bg-white/6 px-1.5 py-0.5 rounded">{item.client_role}</span>
                )}
                {item.client_company && (
                  <span className="text-[11px] text-white/35">{item.client_company}</span>
                )}
              </div>
              <p className="text-white/45 text-xs mt-1 line-clamp-1 italic">
                &ldquo;{item.testimonial_text}&rdquo;
              </p>
            </div>

            {/* Status + actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border mr-1 ${
                item.is_active
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-white/5 text-white/30 border-white/10"
              }`}>
                {item.is_active ? "Active" : "Hidden"}
              </span>
              <button
                onClick={() => toggleActive(item)}
                className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-colors"
                title={item.is_active ? "Deactivate" : "Activate"}
              >
                {item.is_active ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
              </button>
              <button
                onClick={() => openEdit(item)}
                className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 pt-2">
            <div className="grid gap-2">
              <Label>Client Name *</Label>
              <Input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} placeholder="Nikita & Subohjeet" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Role / Title</Label>
                <Input value={form.client_role} onChange={e => setForm({ ...form, client_role: e.target.value })} placeholder="Bride" />
              </div>
              <div className="grid gap-2">
                <Label>Company / Event</Label>
                <Input value={form.client_company} onChange={e => setForm({ ...form, client_company: e.target.value })} placeholder="Wedding · Goa" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Event Type</Label>
                <Input value={form.event_type} onChange={e => setForm({ ...form, event_type: e.target.value })} placeholder="Wedding" />
              </div>
              <div className="grid gap-2">
                <Label>Rating (1–5)</Label>
                <Input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} placeholder="5" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Testimonial *</Label>
              <Textarea value={form.testimonial_text} onChange={e => setForm({ ...form, testimonial_text: e.target.value })} rows={4} placeholder="Their testimonial..." />
            </div>
            <div className="grid gap-2">
              <Label>Client Photo</Label>
              <ImageUpload
                value={form.client_image_url}
                onChange={(url) => setForm({ ...form, client_image_url: url })}
                folder="testimonials"
                aspectRatio="square"
                label="Client Photo"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave} disabled={saving || !form.client_name || !form.testimonial_text}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
