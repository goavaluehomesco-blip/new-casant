"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Save, X, ImageIcon, Calendar, MapPin, Star, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ImageUpload from "@/components/admin/image-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save project"
      setError(msg)
      console.error("Error saving project:", err)
    } finally {
      setIsLoading(false)
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
      <Card className="border-blue-100 bg-blue-50/40">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-slate-700">
            <Settings2 className="w-4 h-4 text-blue-500" />
            Page Settings — Banner &amp; Header
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                value={categoryData.name}
                onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })}
                placeholder="e.g. Wedding Events"
              />
            </div>
            <div className="space-y-2">
              <Label>Page Description</Label>
              <Input
                value={categoryData.description}
                onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })}
                placeholder="Short description shown under the title..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Banner Background Image</Label>
            <ImageUpload
              value={categoryData.image_url}
              onChange={(url) => setCategoryData({ ...categoryData, image_url: url })}
              folder="gallery-banners"
              aspectRatio="video"
              label="Banner Image (shown behind the page title)"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveCategory}
              disabled={isCategorySaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isCategorySaving ? "Saving..." : "Save Page Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

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
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <ImageIcon className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/50">No event groups yet.</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => { resetForm(); setIsDialogOpen(true) }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Event Group
                </Button>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <Card key={project.id} className={`overflow-hidden ${!project.is_active ? "opacity-60" : ""}`}>
                <div className="h-36 bg-slate-100 relative overflow-hidden">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-white/30" />
                    </div>
                  )}
                  {project.is_featured && (
                    <Badge className="absolute top-2 left-2 bg-amber-500">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <button
                    onClick={() => openImagesDialog(project)}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-700 text-xs px-2 py-1 rounded flex items-center gap-1 shadow"
                  >
                    <ImageIcon className="w-3 h-3" />
                    {project.gallery_images?.length || 0} photos
                  </button>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{project.title}</CardTitle>
                      <div className="flex gap-2 mt-1 text-xs text-white/40">
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
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => { setDeletingProject(project); setIsDeleteDialogOpen(true) }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-white/50 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <button
                      onClick={() => openImagesDialog(project)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Manage photos
                    </button>
                    <span className={`text-xs px-2 py-1 rounded ${project.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-white/50"}`}>
                      {project.is_active ? "Published" : "Draft"}
                    </span>
                  </div>
                </CardContent>
              </Card>
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
