"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Globe, Building2 } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"
import type { Clientele } from "@/lib/data/types"

interface ClienteleManagerProps {
  clientele: Clientele[]
}

const emptyForm = { name: "", image_url: "", website_url: "" }

export default function ClienteleManager({ clientele: initial }: ClienteleManagerProps) {
  const [items, setItems] = useState<Clientele[]>(initial)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Clientele | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const supabase = createClient()

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setIsDialogOpen(true)
  }

  const openEdit = (item: Clientele) => {
    setEditing(item)
    setForm({
      name: item.name,
      image_url: item.image_url || "",
      website_url: item.website_url || "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      image_url: form.image_url || null,
      website_url: form.website_url || null,
    }

    if (editing) {
      const { data } = await supabase
        .from("clientele")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single()
      if (data) setItems(items.map(i => i.id === editing.id ? data : i))
    } else {
      const { data } = await supabase
        .from("clientele")
        .insert({ ...payload, display_order: items.length + 1 })
        .select()
        .single()
      if (data) setItems([...items, data])
    }
    setSaving(false)
    setIsDialogOpen(false)
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    await supabase.from("clientele").delete().eq("id", id)
    setItems(items.filter(i => i.id !== id))
    setDeleting(null)
  }

  const toggleActive = async (item: Clientele) => {
    const { data } = await supabase
      .from("clientele")
      .update({ is_active: !item.is_active })
      .eq("id", item.id)
      .select()
      .single()
    if (data) setItems(items.map(i => i.id === item.id ? data : i))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Clientele</h1>
          <p className="text-sm text-white/50 mt-0.5">Brand logos and client names shown on the homepage</p>
        </div>
        <Button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
          <Plus className="w-4 h-4" />
          Add Client
        </Button>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-white/8 bg-[#161616] py-16 flex flex-col items-center gap-3">
          <Building2 className="w-10 h-10 text-white/20" />
          <p className="text-white/40 text-sm">No clients added yet.</p>
          <Button
            onClick={openNew}
            variant="outline"
            className="mt-1 bg-transparent border-white/15 text-white/60 hover:text-white hover:border-white/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Client
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group relative rounded-xl border border-white/8 bg-[#161616] overflow-hidden transition-all hover:border-white/20 ${!item.is_active ? "opacity-50" : ""}`}
            >
              {/* Logo area */}
              <div className="relative h-24 bg-[#0d0d0d] flex items-center justify-center overflow-hidden">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="max-w-[80%] max-h-[70%] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <Building2 className="w-7 h-7 text-white/20" />
                    <span className="text-[10px] text-white/25">No logo</span>
                  </div>
                )}
                {/* Status pill */}
                <span className={`absolute top-2 right-2 text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${
                  item.is_active
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                    : "bg-white/5 text-white/30 border-white/10"
                }`}>
                  {item.is_active ? "Active" : "Hidden"}
                </span>
              </div>

              {/* Footer */}
              <div className="px-2.5 py-2 border-t border-white/8">
                <div className="flex items-center justify-between gap-1 min-w-0">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{item.name}</p>
                    {item.website_url && (
                      <p className="text-[10px] text-white/35 truncate flex items-center gap-0.5 mt-0.5">
                        <Globe className="w-2.5 h-2.5 shrink-0" />
                        {item.website_url.replace(/^https?:\/\//, "")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => toggleActive(item)}
                      className="p-1 rounded-md text-white/30 hover:text-white hover:bg-white/8 transition-colors"
                      title={item.is_active ? "Deactivate" : "Activate"}
                    >
                      <span className={`block w-2.5 h-2.5 rounded-full border ${item.is_active ? "bg-emerald-400 border-emerald-400" : "border-white/30"}`} />
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1 rounded-md text-white/30 hover:text-white hover:bg-white/8 transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="p-1 rounded-md text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#111] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">{editing ? "Edit Client" : "Add Client"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Client / Brand Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Taj Hotels"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Logo Image</Label>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                folder="clientele"
                aspectRatio="wide"
                label="Logo (transparent PNG or SVG recommended)"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Website URL (optional)</Label>
              <Input
                value={form.website_url}
                onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                placeholder="https://example.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-500/50"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="bg-transparent border-white/15 text-white/60 hover:text-white hover:border-white/30"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Client"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
