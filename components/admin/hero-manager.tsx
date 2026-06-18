"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Save, Video, ImageIcon } from "lucide-react"
import { revalidateHeroSlides } from "@/lib/actions/revalidate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ImageUpload from "@/components/admin/image-upload"
import VideoUpload from "@/components/admin/video-upload"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
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

interface HeroSlide {
  id: string
  title: string
  subtitle: string | null
  video_url: string | null
  image_url: string | null
  cta_text: string
  cta_link: string
  is_active: boolean
  display_order: number
}

interface HeroManagerProps {
  slides: HeroSlide[]
}

export default function HeroManager({ slides }: HeroManagerProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [deletingSlide, setDeletingSlide] = useState<HeroSlide | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    video_url: "",
    image_url: "",
    cta_text: "Get Quote",
    cta_link: "/contact",
    is_active: true,
  })

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      video_url: "",
      image_url: "",
      cta_text: "Get Quote",
      cta_link: "/contact",
      is_active: true,
    })
    setEditingSlide(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (slide: HeroSlide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || "",
      video_url: slide.video_url || "",
      image_url: slide.image_url || "",
      cta_text: slide.cta_text,
      cta_link: slide.cta_link,
      is_active: slide.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const data = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        video_url: formData.video_url || null,
        image_url: formData.image_url || null,
        cta_text: formData.cta_text,
        cta_link: formData.cta_link,
        is_active: formData.is_active,
      }

      if (editingSlide) {
        const { error } = await supabase.from("hero_slides").update(data).eq("id", editingSlide.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("hero_slides").insert({
          ...data,
          display_order: slides.length,
        })
        if (error) throw error
      }

      setIsDialogOpen(false)
      resetForm()
      await revalidateHeroSlides()
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save slide"
      setError(msg)
      console.error("Error saving slide:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingSlide) return

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.from("hero_slides").delete().eq("id", deletingSlide.id)

      if (error) throw error

      setIsDeleteDialogOpen(false)
      setDeletingSlide(null)
      await revalidateHeroSlides()
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete slide"
      setError(msg)
      console.error("Error deleting slide:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Hero Section</h1>
          <p className="text-white/50">Manage your homepage hero slides</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Slide
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {slides.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <Video className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/50">No hero slides yet.</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Slide
              </Button>
            </CardContent>
          </Card>
        ) : (
          slides.map((slide) => (
            <div
              key={slide.id}
              className={`group relative rounded-xl overflow-hidden border border-white/8 bg-[#161616] transition-all duration-200 hover:border-white/20 ${!slide.is_active ? "opacity-50" : ""}`}
            >
              {/* Preview */}
              <div className="relative h-40 bg-[#0a0a0a] overflow-hidden">
                {slide.video_url ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <Video className="w-8 h-8 text-white/30" />
                    <span className="text-xs text-white/40">Video slide</span>
                  </div>
                ) : slide.image_url ? (
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="w-8 h-8 text-white/30" />
                    <span className="text-xs text-white/40">No media</span>
                  </div>
                )}

                {/* Gradient overlay with title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm leading-tight line-clamp-1">{slide.title}</p>
                  {slide.subtitle && (
                    <p className="text-white/60 text-xs mt-0.5 line-clamp-1">{slide.subtitle}</p>
                  )}
                </div>

                {/* Status pill */}
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      slide.is_active
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                        : "bg-white/5 text-white/40 border-white/10"
                    }`}
                  >
                    {slide.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-3 py-2.5 border-t border-white/8">
                <span className="text-[11px] text-white/35 truncate max-w-[100px]">{slide.cta_text}</span>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => openEditDialog(slide)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setDeletingSlide(slide); setIsDeleteDialogOpen(true) }}
                    className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSlide ? "Edit Hero Slide" : "Add Hero Slide"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Plan Your Next Event With Us"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Creating unforgettable moments..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Video (MP4/MOV/WebM)</Label>
                <VideoUpload
                  value={formData.video_url}
                  onChange={(url) => setFormData({ ...formData, video_url: url })}
                  folder="hero"
                  label="Hero Video"
                />
              </div>
              <div className="space-y-2">
                <Label>Fallback Image</Label>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  folder="hero"
                  aspectRatio="video"
                  label="Hero Image"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cta_text">Button Text</Label>
                <Input
                  id="cta_text"
                  value={formData.cta_text}
                  onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                  placeholder="Get Quote"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta_link">Button Link</Label>
                <Input
                  id="cta_link"
                  value={formData.cta_link}
                  onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                  placeholder="/contact"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label>Active (visible on website)</Label>
            </div>
          </div>
          <DialogFooter className="flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            {error && (
              <p className="text-sm text-red-600 flex-1">{error}</p>
            )}
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                resetForm()
                setError(null)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !formData.title}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slide</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hero slide? This action cannot be undone.
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
