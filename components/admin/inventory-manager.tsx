"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Lightbulb, Speaker, Video, Save, X, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ImageUpload from "@/components/admin/image-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  display_order: number
  is_active: boolean
}

interface InventoryItem {
  id: string
  category_id: string
  name: string
  description: string | null
  specifications: string[]
  image_url: string | null
  quantity: number
  is_available: boolean
  is_active: boolean
  display_order: number
  inventory_categories: {
    name: string
    slug: string
  } | null
}

interface InventoryManagerProps {
  categories: Category[]
  items: InventoryItem[]
}

const iconMap: Record<string, React.ElementType> = {
  lightbulb: Lightbulb,
  speaker: Speaker,
  video: Video,
}

export default function InventoryManager({ categories, items }: InventoryManagerProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(categories[0]?.slug || "lights")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    specifications: [""],
    image_url: "",
    quantity: 1,
    is_available: true,
    is_active: true,
    category_id: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      specifications: [""],
      image_url: "",
      quantity: 1,
      is_available: true,
      is_active: true,
      category_id: categories.find((c) => c.slug === activeTab)?.id || "",
    })
    setEditingItem(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setFormData((prev) => ({
      ...prev,
      category_id: categories.find((c) => c.slug === activeTab)?.id || "",
    }))
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || "",
      specifications: item.specifications?.length ? item.specifications : [""],
      image_url: item.image_url || "",
      quantity: item.quantity,
      is_available: item.is_available,
      is_active: item.is_active,
      category_id: item.category_id,
    })
    setIsDialogOpen(true)
  }

  const handleSpecificationChange = (index: number, value: string) => {
    const newSpecs = [...formData.specifications]
    newSpecs[index] = value
    setFormData({ ...formData, specifications: newSpecs })
  }

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, ""],
    })
  }

  const removeSpecification = (index: number) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index)
    setFormData({ ...formData, specifications: newSpecs })
  }

  const handleSubmit = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const data = {
        name: formData.name,
        description: formData.description || null,
        specifications: formData.specifications.filter((s) => s.trim() !== ""),
        image_url: formData.image_url || null,
        quantity: formData.quantity,
        is_available: formData.is_available,
        is_active: formData.is_active,
        category_id: formData.category_id,
      }

      if (editingItem) {
        const { error } = await supabase.from("inventory_items").update(data).eq("id", editingItem.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("inventory_items").insert(data)
        if (error) throw error
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save item"
      setError(msg)
      console.error("Error saving item:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingItem) return

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.from("inventory_items").delete().eq("id", deletingItem.id)

      if (error) throw error

      setIsDeleteDialogOpen(false)
      setDeletingItem(null)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete item"
      setError(msg)
      console.error("Error deleting item:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = items.filter((item) => item.inventory_categories?.slug === activeTab)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
          <p className="text-slate-500">Manage your lighting, sound, and production equipment</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon || "lightbulb"] || Lightbulb
            return (
              <TabsTrigger key={category.slug} value={category.slug} className="flex items-center gap-2">
                <IconComponent className="w-4 h-4" />
                {category.name}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.slug} value={category.slug}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredItems.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <p className="text-slate-500">No items in this category yet.</p>
                    <Button variant="outline" className="mt-4 bg-transparent" onClick={openCreateDialog}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Item
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredItems.map((item) => (
                  <Card key={item.id} className={!item.is_active ? "opacity-60" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setDeletingItem(item)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {item.image_url && (
                        <div className="h-28 bg-slate-100 rounded-lg mb-3 overflow-hidden">
                          <img
                            src={item.image_url || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                      {item.specifications && item.specifications.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.specifications.map((spec, index) => (
                            <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            item.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.is_available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby={undefined} className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="LED Par Lights"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the equipment..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Item Image</Label>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                folder="inventory"
                aspectRatio="video"
                label="Item Image"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Specifications</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-slate-400" />
                    <Input
                      value={spec}
                      onChange={(e) => handleSpecificationChange(index, e.target.value)}
                      placeholder="e.g., 18x18W RGBWA+UV"
                    />
                    {formData.specifications.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecification(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number.parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Available</Label>
                <div className="flex items-center h-10">
                  <Switch
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Active</Label>
                <div className="flex items-center h-10">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            {error && <p className="text-sm text-red-600 flex-1">{error}</p>}
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
              disabled={isLoading || !formData.name || !formData.category_id}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingItem?.name}&quot;? This action cannot be undone.
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
