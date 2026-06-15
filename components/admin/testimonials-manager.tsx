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
  const [form, setForm] = useState({ client_name: "", client_title: "", quote: "", background_image_url: "" })
  const supabase = createClient()

  const openNew = () => {
    setEditing(null)
    setForm({ client_name: "", client_title: "", quote: "", background_image_url: "" })
    setIsDialogOpen(true)
  }

  const openEdit = (item: Testimonial) => {
    setEditing(item)
    setForm({
      client_name: item.client_name,
      client_title: item.client_title || "",
      quote: item.quote,
      background_image_url: item.background_image_url || "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      client_name: form.client_name,
      client_title: form.client_title || null,
      quote: form.quote,
      background_image_url: form.background_image_url || null,
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
          <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
          <p className="text-slate-500 mt-1">Manage client quotes shown on the homepage</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" />Add Testimonial</Button>
      </div>

      <div className="grid gap-4">
        {items.length === 0 && (
          <div className="text-center py-16 text-slate-400">No testimonials yet. Add your first one.</div>
        )}
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4 items-start">
            {item.background_image_url ? (
              <img src={item.background_image_url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Quote className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-slate-900">{item.client_name}</span>
                {item.client_title && <span className="text-xs text-slate-400">{item.client_title}</span>}
              </div>
              <p className="text-slate-500 text-sm line-clamp-2 italic">"{item.quote}"</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => toggleActive(item)} className="text-slate-400 hover:text-primary transition-colors" title={item.is_active ? "Active" : "Inactive"}>
                {item.is_active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
              <Button size="sm" variant="ghost" onClick={() => openEdit(item)}><Pencil className="w-4 h-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
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
            <div className="grid gap-2">
              <Label>Client Title / Event</Label>
              <Input value={form.client_title} onChange={e => setForm({ ...form, client_title: e.target.value })} placeholder="Wedding · Goa" />
            </div>
            <div className="grid gap-2">
              <Label>Quote *</Label>
              <Textarea value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} rows={5} placeholder="Their testimonial..." />
            </div>
            <div className="grid gap-2">
              <Label>Background Image</Label>
              <ImageUpload
                value={form.background_image_url}
                onChange={(url) => setForm({ ...form, background_image_url: url })}
                folder="testimonials"
                aspectRatio="video"
                label="Background Image"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave} disabled={saving || !form.client_name || !form.quote}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
