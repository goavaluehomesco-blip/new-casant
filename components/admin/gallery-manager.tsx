"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Save, X, ImageIcon, Calendar, MapPin, Star, Settings2 } from "lucide-react"
import { revalidateGallery } from "@/lib/actions/revalidate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ImageUpload from "@/components/admin/image-upload"
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

interface GalleryImage {
  id: string
  image_url: string
  caption: string | null
  display_order: number
}

interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  location: string | null
  event_date: string | null
  cover_image: string | null
  is_featured: boolean
  is_active: boolean
  display_order: number
  gallery_images: GalleryImage[]
}

interface Category {
  id: string
  name: string
  description: string | null
  image_url: string | null
}

interface GalleryManagerProps {
  title: string
  description: string
  categoryId: string
  categorySlug: string
  projects: Project[]
  category?: Category | null
}

export default function GalleryManager({
  title,
  description,
  categoryId,
  categorySlug,
  projects,
  category: initialCategory,
}: GalleryManagerProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isImagesDialogOpen, setIsImagesDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [managingImagesProject, setManagingImagesProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCategorySaving, setIsCategorySaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Category banner state
  const [categoryData, setCategoryData] = useState({
    name: initialCategory?.name || title,
    description: initialCategory?.description || "",
    image_url: initialCategory?.image_url || "",
  })

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    event_date: "",
    cover_image: "",
    is_featured: false,
    is_active: true,
  })

  const [imageForm, setImageForm] = useState({
    image_url: "",
    caption: "",
  })

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const resetForm = () => {
    setFormData({ title: "", description: "", location: "", event_date: "", cover_image: "", is_featured: false, is_active: true })
    setEditingProject(null)
  }

  const openEditDialog = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || "",
      location: project.location || "",
      event_date: project.event_date || "",
      cover_image: project.cover_image || "",
      is_featured: project.is_featured,
      is_active: project.is_active,
    })
    setIsDialogOpen(true)
  }

  const openImagesDialog = (project: Project) => {
    setManagingImagesProject(project)
    setIsImagesDialogOpen(true)
  }

  // Save category banner / title / description
  const handleSaveCategory = async () => {
    if (!categoryId) return
    const supabase = createClient()
    setIsCategorySaving(true)
    try {
      const { error } = await supabase
        .from("gallery_categories")
        .update({
          name: categoryData.name,
          description: categoryData.description || null,
          image_url: categoryData.image_url || null,
        })
        .eq("id", categoryId)
      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error("Error saving category:", err)
    } finally {
      setIsCategorySaving(false)
    }
  }

  const handleSubmit = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    try {
      const slug = generateSlug(formData.title)
      const data = {
        title: formData.title,
        slug: editingProject ? editingProject.slug : `${slug}-${Date.now()}`,
        description: formData.description || null,
        location: formData.location || null,
        event_date: formData.event_date || null,
        cover_image: formData.cover_image || null,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        category_id: categoryId,
        display_order: editingProject ? editingProject.display_order : projects.length + 1,
      }

      if (editingProject) {
        const { error } = await supabase.from("gallery_projects").update(data).eq("id", editingProject.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("gallery_projects").insert(data)
        if (error) throw error
      }

      setIsDialogOpen(false)
      resetForm()
      await revalidateGallery()
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save project"
      setError(msg)
      console.error("Error saving project:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFeatured = async (project: Project) => {
    const supabase = createClient()
    try {
      const { error } = await supabase
        .from("gallery_projects")
        .update({ is_featured: !project.is_featured })
        .eq("id", project.id)
      if (error) throw error
      await revalidateGallery()
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update"
      setError(msg)
    }
  }

  const handleDelete = async () => {
    if (!deletingProject) return
    const supabase = createClient()
    setIsLoading(true)
    try {
      const { error } = await supabase.from("gallery_projects").delete().eq("id", deletingProject.id)
      if (error) throw error
      setIsDeleteDialogOpen(false)
      setDeletingProject(null)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete project"
      setError(msg)
      console.error("Error deleting project:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddImage = async () => {
    if (!managingImagesProject || !imageForm.image_url) return
    const supabase = createClient()
    setIsLoading(true)
    try {
      const { error } = await supabase.from("gallery_images").insert({
        project_id: managingImagesProject.id,
        image_url: imageForm.image_url,
        caption: imageForm.caption || null,
        display_order: managingImagesProject.gallery_images.length,
      })
      if (error) throw error
      setImageForm({ image_url: "", caption: "" })

      const { data: updatedProject } = await supabase
        .from("gallery_projects")
        .select("*, gallery_images(*)")
        .eq("id", managingImagesProject.id)
        .single()
      if (updatedProject) setManagingImagesProject(updatedProject)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add image"
      setError(msg)
      console.error("Error adding image:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    const supabase = createClient()
    try {
      const { error } = await supabase.from("gallery_images").delete().eq("id", imageId)
      if (error) throw error
      if (managingImagesProject) {
        setManagingImagesProject({
          ...managingImagesProject,
          gallery_images: managingImagesProject.gallery_images.filter((img) => img.id !== imageId),
        })
      }
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete image"
      setError(msg)
      console.error("Error deleting image:", err)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Category Settings */}
      <div className="rounded-xl border border-white/10 bg-[#161616] p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Settings2 className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-white">Page Settings — Banner &amp; Header</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white/60 text-xs">Page Title</Label>
            <Input
              value={categoryData.name}
              onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
              placeholder="e.g. Wedding Events"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/60 text-xs">Page Description</Label>
            <Input
              value={categoryData.description}
              onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
              placeholder="Short description shown under the title..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-500/50"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-white/60 text-xs">Banner Background Image</Label>
          <ImageUpload
            value={categoryData.image_url}
            onChange={(url) => setCategoryData({ ...categoryData, image_url: url })}
            folder="gallery-banners"
            aspectRatio="video"
            label="Banner Image (shown behind the page title)"
          />
        </div>
        <div className="flex justify-end pt-1">
          <Button
            onClick={handleSaveCategory}
            disabled={isCategorySaving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isCategorySaving ? "Saving..." : "Save Page Settings"}
          </Button>
        </div>
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-white/50">{description}</p>
          </div>
          <Button
            onClick={() => { resetForm(); setIsDialogOpen(true) }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event Group
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {projects.length === 0 ? (
            <div className="col-span-full rounded-xl border border-white/8 bg-[#161616] py-14 flex flex-col items-center gap-3">
              <ImageIcon className="w-10 h-10 text-white/20" />
              <p className="text-white/40 text-sm">No event groups yet.</p>
              <Button
                variant="outline"
                className="mt-1 bg-transparent border-white/15 text-white/60 hover:text-white hover:border-white/30"
                onClick={() => { resetForm(); setIsDialogOpen(true) }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Event Group
              </Button>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className={`group relative rounded-xl overflow-hidden border border-white/8 bg-[#161616] transition-all hover:border-white/20 ${!project.is_active ? "opacity-50" : ""}`}
              >
                {/* Cover image */}
                <div className="relative h-36 bg-[#0a0a0a] overflow-hidden">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white/20" />
                    </div>
                  )}
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Status pill */}
                  <span className={`absolute top-2.5 right-2.5 text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    project.is_active
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                      : "bg-white/5 text-white/40 border-white/10"
                  }`}>
                    {project.is_active ? "Published" : "Draft"}
                  </span>

                  {/* Featured toggle */}
                  <button
                    onClick={() => handleToggleFeatured(project)}
                    title={project.is_featured ? "Remove from featured" : "Mark as featured"}
                    className={`absolute top-2.5 left-2.5 text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 transition-colors ${
                      project.is_featured
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30"
                        : "bg-black/40 text-white/30 border-white/10 hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-500/10"
                    }`}
                  >
                    <Star className={`w-2.5 h-2.5 ${project.is_featured ? "fill-amber-400" : ""}`} />
                    {project.is_featured ? "Featured" : "Feature"}
                  </button>

                  {/* Photo count pill */}
                  <button
                    onClick={() => openImagesDialog(project)}
                    className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[10px] text-white/70 bg-black/50 hover:bg-black/70 px-2 py-0.5 rounded-full transition-colors"
                  >
                    <ImageIcon className="w-3 h-3" />
                    {project.gallery_images?.length || 0}
                  </button>
                </div>

                {/* Body */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-sm font-semibold text-white leading-tight line-clamp-1">{project.title}</p>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => openEditDialog(project)}
                        className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { setDeletingProject(project); setIsDeleteDialogOpen(true) }}
                        className="p-1.5 rounded-lg text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-1 text-[11px] text-white/35">
                    {project.location && (
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" />{project.location}
                      </span>
                    )}
                    {project.event_date && (
                      <span className="flex items-center gap-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(project.event_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-white/8 px-3 py-2">
                  <button
                    onClick={() => openImagesDialog(project)}
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-white/45 hover:text-white transition-colors py-0.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Manage Photos
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Event Group" : "Add New Event Group"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Couple / Event Name</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Nikita & Subohjeet"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the event..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Goa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Thumbnail Image</Label>
              <ImageUpload
                value={formData.cover_image}
                onChange={(url) => setFormData({ ...formData, cover_image: url })}
                folder="gallery"
                aspectRatio="video"
                label="Thumbnail shown on the card"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Published</Label>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            {error && <p className="text-sm text-red-600 flex-1">{error}</p>}
            <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); setError(null) }}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isLoading || !formData.title} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Event Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Images Management Dialog */}
      <Dialog open={isImagesDialogOpen} onOpenChange={setIsImagesDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Photos — {managingImagesProject?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-slate-50 rounded-lg space-y-3">
              <h4 className="font-medium text-sm">Add Photo</h4>
              <ImageUpload
                value={imageForm.image_url}
                onChange={(url) => setImageForm({ ...imageForm, image_url: url })}
                folder="gallery"
                aspectRatio="video"
                label="Photo"
              />
              <Input
                placeholder="Caption (optional)"
                value={imageForm.caption}
                onChange={(e) => setImageForm({ ...imageForm, caption: e.target.value })}
              />
              <Button onClick={handleAddImage} disabled={isLoading || !imageForm.image_url} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {managingImagesProject?.gallery_images?.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                    <img src={image.image_url} alt={image.caption || "Photo"} className="w-full h-full object-cover" />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  {image.caption && <p className="text-xs text-white/50 mt-1 truncate">{image.caption}</p>}
                </div>
              ))}
              {(!managingImagesProject?.gallery_images || managingImagesProject.gallery_images.length === 0) && (
                <div className="col-span-3 text-center py-8 text-white/40 text-sm">No photos yet. Add some above.</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingProject?.title}&quot;? All photos in this group will also be deleted. This action cannot be undone.
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
