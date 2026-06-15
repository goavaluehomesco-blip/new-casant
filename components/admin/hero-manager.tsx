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
import { Card, CardContent } from "@/components/ui/card"
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
          <h1 className="text-2xl font-bold text-slate-800">Hero Section</h1>
          <p className="text-slate-500">Manage your homepage hero slides</p>
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
              <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No hero slides yet.</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Slide
              </Button>
            </CardContent>
          </Card>
        ) : (
          slides.map((slide) => (
            <Card key={slide.id} className={`overflow-hidden ${!slide.is_active ? "opacity-60" : ""}`}>
              <div className="h-36 bg-slate-900 relative overflow-hidden">
                {slide.video_url ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-12 h-12 text-slate-500" />
                    <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                      Video
                    </span>
                  </div>
                ) : slide.image_url ? (
                  <img
                    src={slide.image_url || "/placeholder.svg"}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-slate-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{slide.title}</h3>
                    {slide.subtitle && <p className="text-white/70 text-sm">{slide.subtitle}</p>}
                  </div>
                </div>
              </div>
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        slide.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {slide.is_active ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs text-slate-500">CTA: {slide.cta_text}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(slide)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setDeletingSlide(slide)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
