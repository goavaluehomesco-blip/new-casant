"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, ImageIcon, ToggleLeft, ToggleRight, CheckCircle2 } from "lucide-react"
import ImageUpload from "@/components/admin/image-upload"
import { revalidateCompanyInfo } from "@/lib/actions/revalidate"
import type { LifeAtCasantImage } from "@/lib/data/types"

interface LifeAtCasantManagerProps {
  images: LifeAtCasantImage[]
  companyInfoId?: string | null
  heroImageUrl?: string | null
}

export default function LifeAtCasantManager({
  images: initial,
  companyInfoId = null,
  heroImageUrl = null,
}: LifeAtCasantManagerProps) {
  const [items, setItems] = useState<LifeAtCasantImage[]>(initial)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<LifeAtCasantImage | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ image_url: "", caption: "" })
  const supabase = createClient()

  const [heroImage, setHeroImage] = useState(heroImageUrl || "")
  const [savingHero, setSavingHero] = useState(false)
  const [heroSaved, setHeroSaved] = useState(false)
  const [heroError, setHeroError] = useState<string | null>(null)

  const handleSaveHero = async (nextUrl: string) => {
    setHeroImage(nextUrl)
    setSavingHero(true)
    setHeroError(null)
    try {
      if (companyInfoId) {
        const { error } = await supabase
          .from("company_info")
          .update({ life_at_casant_hero_image_url: nextUrl, updated_at: new Date().toISOString() })
          .eq("id", companyInfoId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("company_info")
          .insert([{ name: "Casant Events", life_at_casant_hero_image_url: nextUrl }])
        if (error) throw error
      }
      await revalidateCompanyInfo()
      setHeroSaved(true)
      setTimeout(() => setHeroSaved(false), 3000)
    } catch (err: unknown) {
      setHeroError(err instanceof Error ? err.message : "Failed to save background image")
    } finally {
      setSavingHero(false)
    }
  }

  const openNew = () => {
    setEditing(null)
    setForm({ image_url: "", caption: "" })
    setError(null)
    setIsDialogOpen(true)
  }

  const openEdit = (item: LifeAtCasantImage) => {
    setEditing(item)
    setForm({ image_url: item.image_url, caption: item.caption || "" })
    setError(null)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const payload = {
      image_url: form.image_url,
      caption: form.caption || null,
    }
    try {
      if (editing) {
        const { data, error } = await supabase
          .from("life_at_casant_images")
          .update(payload)
          .eq("id", editing.id)
          .select()
          .single()
        if (error) throw error
        if (data) setItems(items.map((i) => (i.id === editing.id ? data : i)))
      } else {
        const { data, error } = await supabase
          .from("life_at_casant_images")
          .insert({ ...payload, display_order: items.length })
          .select()
          .single()
        if (error) throw error
        if (data) setItems([...items, data])
      }
      setIsDialogOpen(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save photo")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return
    await supabase.from("life_at_casant_images").delete().eq("id", id)
    setItems(items.filter((i) => i.id !== id))
  }

  const toggleActive = async (item: LifeAtCasantImage) => {
    const { data } = await supabase
      .from("life_at_casant_images")
      .update({ is_active: !item.is_active })
      .eq("id", item.id)
      .select()
      .single()
    if (data) setItems(items.map((i) => (i.id === item.id ? data : i)))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Life at Casant</h1>
          <p className="text-white/50 mt-1">Manage the behind-the-scenes gallery shown on the About page and its own page</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Photo
        </Button>
      </div>

      <div className="mb-10 bg-[#161616] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-white">Page Background Image</h2>
          {heroSaved && (
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved
            </span>
          )}
        </div>
        <p className="text-xs text-white/40 mb-4">
          The banner image shown behind the &quot;Life at Casant&quot; heading at the top of the page.
        </p>
        <ImageUpload
          value={heroImage}
          onChange={handleSaveHero}
          folder="life-at-casant"
          aspectRatio="video"
          label="Upload background photo"
        />
        {savingHero && <p className="text-xs text-white/40 mt-2">Saving...</p>}
        {heroError && <p className="text-sm text-red-500 mt-2">{heroError}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.length === 0 && (
          <div className="col-span-full text-center py-16 text-white/40">No photos yet. Add your first one.</div>
        )}
        {items.map((item) => (
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
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              {editing ? "Edit Photo" : "Add Photo"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 pt-2">
            <div className="grid gap-2">
              <Label>Image *</Label>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                folder="life-at-casant"
                aspectRatio="square"
                label="Upload Photo"
              />
            </div>
            <div className="grid gap-2">
              <Label>Caption</Label>
              <Textarea
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
                rows={2}
                placeholder="Optional caption..."
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
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
