"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Save, Layers, Images, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
import ImageUpload from "@/components/admin/image-upload"

interface Service {
  id: string
  title: string
  description: string | null
  icon: string | null
  image_url: string | null
  link: string | null
  display_order: number
  is_active: boolean
}

interface ServiceImage {
  id: string
  service_id: string
  image_url: string
  caption: string | null
  display_order: number
}

interface ServicesManagerProps {
  services: Service[]
}

const ICON_OPTIONS = [
  { value: "Heart", label: "Heart (Weddings)" },
  { value: "Building2", label: "Building (Corporate)" },
  { value: "Lightbulb", label: "Lightbulb (Lighting)" },
  { value: "Volume2", label: "Speaker (Sound)" },
  { value: "Monitor", label: "Monitor (Production)" },
  { value: "Star", label: "Star" },
  { value: "Camera", label: "Camera" },
  { value: "Music", label: "Music" },
]

export default function ServicesManager({ services }: ServicesManagerProps) {
  const router = useRouter()

  // Service edit/create state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingService, setDeletingService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Photos panel state
  const [photosService, setPhotosService] = useState<Service | null>(null)
  const [serviceImages, setServiceImages] = useState<ServiceImage[]>([])
  const [isPhotosOpen, setIsPhotosOpen] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newCaption, setNewCaption] = useState("")
  const [isAddingPhoto, setIsAddingPhoto] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)

  const emptyForm = {
    title: "",
    description: "",
    icon: "Star",
    image_url: "",
    link: "",
    display_order: services.length + 1,
    is_active: true,
  }
  const [formData, setFormData] = useState(emptyForm)

  const resetForm = () => {
    setFormData({ ...emptyForm, display_order: services.length + 1 })
    setEditingService(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description || "",
      icon: service.icon || "Star",
      image_url: service.image_url || "",
      link: service.link || "",
      display_order: service.display_order,
      is_active: service.is_active,
    })
    setIsDialogOpen(true)
  }

  // Load images for a service
  const openPhotosPanel = async (service: Service) => {
    setPhotosService(service)
    setIsPhotosOpen(true)
    await loadServiceImages(service.id)
  }

  const loadServiceImages = async (serviceId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from("service_images")
      .select("*")
      .eq("service_id", serviceId)
      .order("display_order", { ascending: true })
    setServiceImages(data || [])
  }

  const handleAddPhoto = async () => {
    if (!photosService || !newImageUrl) return
    const supabase = createClient()
    setIsAddingPhoto(true)
    try {
      const { error } = await supabase.from("service_images").insert({
        service_id: photosService.id,
        image_url: newImageUrl,
        caption: newCaption || null,
        display_order: serviceImages.length + 1,
      })
      if (error) throw error
      setNewImageUrl("")
      setNewCaption("")
      await loadServiceImages(photosService.id)
    } catch (err) {
      console.error("Error adding photo:", err)
    } finally {
      setIsAddingPhoto(false)
    }
  }

  const handleDeletePhoto = async (imageId: string) => {
    const supabase = createClient()
    setDeletingImageId(imageId)
    try {
      const { error } = await supabase.from("service_images").delete().eq("id", imageId)
      if (error) throw error
      setServiceImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch (err) {
      console.error("Error deleting photo:", err)
    } finally {
      setDeletingImageId(null)
    }
  }

  const handleSubmit = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    try {
      const data = {
        title: formData.title,
        description: formData.description || null,
        icon: formData.icon || null,
        image_url: formData.image_url || null,
        link: formData.link || null,
        display_order: formData.display_order,
        is_active: formData.is_active,
      }
      if (editingService) {
        const { error } = await supabase.from("services").update(data).eq("id", editingService.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("services").insert(data)
        if (error) throw error
      }
      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save service"
      setError(msg)
      console.error("Error saving service:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingService) return
    const supabase = createClient()
    setIsLoading(true)
    try {
      const { error } = await supabase.from("services").delete().eq("id", deletingService.id)
      if (error) throw error
      setIsDeleteDialogOpen(false)
      setDeletingService(null)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete service"
      setError(msg)
      console.error("Error deleting service:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-white/50">Manage the services shown on the home page</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {services.length === 0 ? (
          <div className="col-span-full rounded-xl border border-white/8 bg-[#161616] py-14 flex flex-col items-center gap-3">
            <Layers className="w-10 h-10 text-white/20" />
            <p className="text-white/40 text-sm">No services yet.</p>
            <Button variant="outline" className="mt-1 bg-transparent border-white/15 text-white/60 hover:text-white hover:border-white/30" onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Service
            </Button>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className={`group relative rounded-xl overflow-hidden border border-white/8 bg-[#161616] transition-all hover:border-white/20 ${!service.is_active ? "opacity-50" : ""}`}
            >
              {/* Image */}
              <div className="relative h-36 bg-[#0a0a0a] overflow-hidden">
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layers className="w-8 h-8 text-white/20" />
                  </div>
                )}
                {/* Status pill */}
                <span className={`absolute top-2.5 right-2.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                  service.is_active
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                    : "bg-white/5 text-white/40 border-white/10"
                }`}>
                  {service.is_active ? "Active" : "Hidden"}
                </span>
              </div>

              {/* Body */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white leading-tight truncate">{service.title}</p>
                    {service.icon && (
                      <p className="text-[11px] text-white/35 mt-0.5">Icon: {service.icon}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => openEditDialog(service)}
                      className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setDeletingService(service); setIsDeleteDialogOpen(true) }}
                      className="p-1.5 rounded-lg text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {service.description && (
                  <p className="text-[11px] text-white/40 mt-1.5 line-clamp-2 leading-relaxed">{service.description}</p>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/8 px-3 py-2">
                <button
                  onClick={() => openPhotosPanel(service)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs text-white/45 hover:text-white transition-colors py-0.5"
                >
                  <Images className="w-3.5 h-3.5" />
                  Manage Photos
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Photos Panel Dialog ── */}
      <Dialog open={isPhotosOpen} onOpenChange={setIsPhotosOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Images className="w-5 h-5" />
              Photos — {photosService?.title}
            </DialogTitle>
          </DialogHeader>

          {/* Upload new photo */}
          <div className="border rounded-xl p-4 bg-slate-50 space-y-3">
            <p className="text-sm font-medium text-slate-700">Add a new photo</p>
            <ImageUpload
              value={newImageUrl}
              onChange={(url) => setNewImageUrl(url)}
              folder="service-gallery"
              label="Upload Photo"
            />
            <Input
              placeholder="Caption (optional)"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
            />
            <Button
              onClick={handleAddPhoto}
              disabled={isAddingPhoto || !newImageUrl}
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isAddingPhoto ? "Adding..." : "Add Photo"}
            </Button>
          </div>

          {/* Existing photos grid */}
          {serviceImages.length === 0 ? (
            <div className="text-center py-10 text-white/40">
              <Images className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No photos yet. Upload the first one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {serviceImages.map((img) => (
                <div key={img.id} className="group relative rounded-lg overflow-hidden aspect-square bg-slate-100">
                  <img src={img.image_url} alt={img.caption || ""} className="w-full h-full object-cover" />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1.5 truncate">
                      {img.caption}
                    </div>
                  )}
                  <button
                    onClick={() => handleDeletePhoto(img.id)}
                    disabled={deletingImageId === img.id}
                    className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPhotosOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Weddings"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <select
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this service..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link">Link URL</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/inventory"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="services"
                aspectRatio="video"
                label="Cover Image"
              />
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
            {error && <p className="text-sm text-red-600 flex-1">{error}</p>}
            <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); setError(null) }}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !formData.title}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingService?.title}&quot;? This action cannot be undone.
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
