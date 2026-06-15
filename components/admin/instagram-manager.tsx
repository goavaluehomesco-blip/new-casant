"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Instagram, ToggleLeft, ToggleRight } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"
import type { InstagramPost } from "@/lib/data/types"

interface InstagramManagerProps {
  posts: InstagramPost[]
}

export default function InstagramManager({ posts: initial }: InstagramManagerProps) {
  const [items, setItems] = useState<InstagramPost[]>(initial)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<InstagramPost | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ image_url: "", caption: "", post_url: "" })
  const supabase = createClient()

  const openNew = () => {
    setEditing(null)
    setForm({ image_url: "", caption: "", post_url: "" })
    setIsDialogOpen(true)
  }

  const openEdit = (item: InstagramPost) => {
    setEditing(item)
    setForm({ image_url: item.image_url, caption: item.caption || "", post_url: item.post_url || "" })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      image_url: form.image_url,
      caption: form.caption || null,
      post_url: form.post_url || null,
    }
    if (editing) {
      const { data } = await supabase.from("instagram_posts").update(payload).eq("id", editing.id).select().single()
      if (data) setItems(items.map(i => i.id === editing.id ? data : i))
    } else {
      const { data } = await supabase.from("instagram_posts").insert({ ...payload, display_order: items.length }).select().single()
      if (data) setItems([...items, data])
    }
    setSaving(false)
    setIsDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return
    await supabase.from("instagram_posts").delete().eq("id", id)
    setItems(items.filter(i => i.id !== id))
  }

  const toggleActive = async (item: InstagramPost) => {
    const { data } = await supabase.from("instagram_posts").update({ is_active: !item.is_active }).eq("id", item.id).select().single()
    if (data) setItems(items.map(i => i.id === item.id ? data : i))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Instagram Carousel</h1>
          <p className="text-slate-500 mt-1">Manage photos shown in the homepage Instagram feed</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" />Add Photo</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.length === 0 && (
          <div className="col-span-full text-center py-16 text-slate-400">No posts yet. Add your first photo.</div>
        )}
        {items.map(item => (
          <div key={item.id} className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100">
            <img src={item.image_url} alt={item.caption || ""} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              {item.caption && <p className="text-white text-xs line-clamp-3">{item.caption}</p>}
              <div className="flex justify-between items-center">
                <button onClick={() => toggleActive(item)} className="text-white/70 hover:text-white transition-colors">
                  {item.is_active ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="text-white h-7 w-7 p-0" onClick={() => openEdit(item)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-300 h-7 w-7 p-0" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
            {!item.is_active && (
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">Hidden</div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Instagram className="w-4 h-4" />{editing ? "Edit Photo" : "Add Photo"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 pt-2">
            <div className="grid gap-2">
              <Label>Image *</Label>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                folder="instagram"
                aspectRatio="square"
                label="Upload Photo"
              />
            </div>
            <div className="grid gap-2">
              <Label>Caption</Label>
              <Textarea value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} rows={2} placeholder="Optional caption..." />
            </div>
            <div className="grid gap-2">
              <Label>Instagram Post URL</Label>
              <Input value={form.post_url} onChange={e => setForm({ ...form, post_url: e.target.value })} placeholder="https://instagram.com/p/..." />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave} disabled={saving || !form.image_url}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
