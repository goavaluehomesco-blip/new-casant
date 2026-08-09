"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ImageIcon,
  Type,
  ArrowUp,
  ArrowDown,
  Calendar,
  BookOpen,
  ExternalLink,
} from "lucide-react"
import { revalidateBlog } from "@/lib/actions/revalidate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ImageUpload from "@/components/admin/image-upload"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import type { BlogPost, BlogContentBlock } from "@/lib/data/types"

interface BlogManagerProps {
  posts: BlogPost[]
}

const emptyForm = {
  title: "",
  description: "",
  cover_image: "",
  hero_image: "",
  images: [] as string[],
  content_blocks: [] as BlogContentBlock[],
  is_active: true,
}

export default function BlogManager({ posts }: BlogManagerProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingPost(null)
    setError(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      description: post.description || "",
      cover_image: post.cover_image || "",
      hero_image: post.hero_image || "",
      images: post.images || [],
      content_blocks: post.content_blocks || [],
      is_active: post.is_active,
    })
    setIsDialogOpen(true)
  }

  // --- Collage image helpers ---
  const addCollageImage = () => {
    if (formData.images.length >= 6) return
    setFormData({ ...formData, images: [...formData.images, ""] })
  }
  const updateCollageImage = (index: number, url: string) => {
    const next = [...formData.images]
    next[index] = url
    setFormData({ ...formData, images: next })
  }
  const removeCollageImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })
  }

  // --- Content block helpers ---
  const addTextBlock = () => {
    setFormData({
      ...formData,
      content_blocks: [...formData.content_blocks, { type: "text", value: "" }],
    })
  }
  const addImageBlock = () => {
    setFormData({
      ...formData,
      content_blocks: [...formData.content_blocks, { type: "image", url: "", caption: "" }],
    })
  }
  const updateBlock = (index: number, block: BlogContentBlock) => {
    const next = [...formData.content_blocks]
    next[index] = block
    setFormData({ ...formData, content_blocks: next })
  }
  const removeBlock = (index: number) => {
    setFormData({ ...formData, content_blocks: formData.content_blocks.filter((_, i) => i !== index) })
  }
  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= formData.content_blocks.length) return
    const next = [...formData.content_blocks]
    ;[next[index], next[target]] = [next[target], next[index]]
    setFormData({ ...formData, content_blocks: next })
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError("Title is required")
      return
    }
    const supabase = createClient()
    setIsSaving(true)
    setError(null)
    try {
      const slug = editingPost ? editingPost.slug : `${generateSlug(formData.title)}-${Date.now()}`
      const cleanImages = formData.images.filter((url) => url.trim())
      const cleanBlocks = formData.content_blocks.filter(
        (b) => (b.type === "text" && b.value.trim()) || (b.type === "image" && b.url.trim()),
      )
      const payload = {
        title: formData.title.trim(),
        slug,
        description: formData.description.trim() || null,
        cover_image: formData.cover_image || cleanImages[0] || null,
        hero_image: formData.hero_image || null,
        images: cleanImages,
        content_blocks: cleanBlocks,
        is_active: formData.is_active,
        display_order: editingPost ? editingPost.display_order : posts.length,
      }

      if (editingPost) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingPost.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload)
        if (error) throw error
      }

      setIsDialogOpen(false)
      resetForm()
      await revalidateBlog()
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save blog post"
      setError(msg)
      console.error("[v0] Blog save error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async (post: BlogPost) => {
    const supabase = createClient()
    try {
      const { error } = await supabase.from("blog_posts").update({ is_active: !post.is_active }).eq("id", post.id)
      if (error) throw error
      await revalidateBlog()
      router.refresh()
    } catch (err) {
      console.error("[v0] Blog toggle error:", err)
    }
  }

  const handleDelete = async () => {
    if (!deletingPost) return
    const supabase = createClient()
    setIsDeleting(true)
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", deletingPost.id)
      if (error) throw error
      setIsDeleteDialogOpen(false)
      setDeletingPost(null)
      await revalidateBlog()
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete blog post"
      setError(msg)
      console.error("[v0] Blog delete error:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-white/50">
            Manage the stories shown in the landing page Blog section and the public /blog page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/blog"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm text-white/45 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Blog
          </a>
          <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {error && !isDialogOpen && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.length === 0 ? (
          <div className="col-span-full rounded-xl border border-white/8 bg-[#161616] py-14 flex flex-col items-center gap-3">
            <BookOpen className="w-10 h-10 text-white/20" />
            <p className="text-white/40 text-sm">No blog posts yet.</p>
            <Button
              variant="outline"
              className="mt-1 bg-transparent border-white/15 text-white/60 hover:text-white hover:border-white/30"
              onClick={openCreateDialog}
            >
              <Plus className="w-4 h-4 mr-2" />
              Write First Post
            </Button>
          </div>
        ) : (
          posts.map((post) => {
            const thumb = post.cover_image || post.images?.[0]
            return (
              <div
                key={post.id}
                className={`group relative rounded-xl overflow-hidden border border-white/8 bg-[#161616] transition-all hover:border-white/20 ${
                  !post.is_active ? "opacity-50" : ""
                }`}
              >
                <div className="relative h-36 bg-[#0a0a0a] overflow-hidden">
                  {thumb ? (
                    <img src={thumb} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <button
                    onClick={() => handleToggleActive(post)}
                    className={`absolute top-2.5 right-2.5 text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors ${
                      post.is_active
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25"
                        : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {post.is_active ? "Published" : "Draft"}
                  </button>
                  <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[10px] text-white/70 bg-black/50 px-2 py-0.5 rounded-full">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-3">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-sm font-semibold text-white leading-tight line-clamp-2">{post.title}</p>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => openEditDialog(post)}
                        className="p-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/8 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingPost(post)
                          setIsDeleteDialogOpen(true)
                        }}
                        className="p-1.5 rounded-lg text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {post.description && (
                    <p className="text-[11px] text-white/40 mt-1 line-clamp-2">{post.description}</p>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
        <DialogContent aria-describedby={undefined} className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "New Blog Post"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-500">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label>Hero Image (optional)</Label>
              <p className="text-xs text-muted-foreground">
                A full-width banner shown at the very top of the post, above the title. Leave empty to skip it.
              </p>
              <ImageUpload
                value={formData.hero_image}
                onChange={(url) => setFormData({ ...formData, hero_image: url })}
                folder="blog"
                aspectRatio="video"
                label="Hero banner"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. 5 Tips for Planning a Destination Wedding"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A short excerpt shown on the card and listing page..."
                rows={2}
              />
            </div>

            {/* Collage images */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Cover / Collage Images</Label>
                {formData.images.length < 6 && (
                  <Button type="button" variant="outline" size="sm" onClick={addCollageImage}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Image
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Add one image for a single cover photo, or several images to show a collage on the card.
              </p>
              {formData.images.length === 0 ? (
                <ImageUpload
                  value=""
                  onChange={(url) => setFormData({ ...formData, images: [url] })}
                  folder="blog"
                  aspectRatio="video"
                  label="Cover image"
                />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.images.map((url, i) => (
                    <div key={i} className="relative">
                      <ImageUpload
                        value={url}
                        onChange={(newUrl) => updateCollageImage(i, newUrl)}
                        folder="blog"
                        aspectRatio="square"
                        label={`Image ${i + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeCollageImage(i)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content blocks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Content</Label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={addTextBlock}>
                    <Type className="w-3.5 h-3.5 mr-1" />
                    Add Text
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={addImageBlock}>
                    <ImageIcon className="w-3.5 h-3.5 mr-1" />
                    Add Image
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Build the post from top to bottom. Insert an image block right after any paragraph to place it there.
              </p>

              {formData.content_blocks.length === 0 ? (
                <p className="text-sm text-muted-foreground border border-dashed rounded-lg p-6 text-center">
                  No content blocks yet. Add a text or image block to start writing.
                </p>
              ) : (
                <div className="space-y-3">
                  {formData.content_blocks.map((block, i) => (
                    <div key={i} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          {block.type === "text" ? (
                            <>
                              <Type className="w-3.5 h-3.5" /> Text block
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-3.5 h-3.5" /> Image block
                            </>
                          )}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveBlock(i, -1)}
                            disabled={i === 0}
                            className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBlock(i, 1)}
                            disabled={i === formData.content_blocks.length - 1}
                            className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlock(i)}
                            className="p-1 rounded text-red-500/70 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {block.type === "text" ? (
                        <Textarea
                          value={block.value}
                          onChange={(e) => updateBlock(i, { type: "text", value: e.target.value })}
                          placeholder="Write a paragraph..."
                          rows={4}
                        />
                      ) : (
                        <div className="space-y-2">
                          <ImageUpload
                            value={block.url}
                            onChange={(url) => updateBlock(i, { ...block, url })}
                            folder="blog"
                            aspectRatio="video"
                            label="Block image"
                          />
                          <Input
                            value={block.caption || ""}
                            onChange={(e) => updateBlock(i, { ...block, caption: e.target.value })}
                            placeholder="Optional caption..."
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label className="cursor-pointer">Published (visible on the website)</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deletingPost?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
