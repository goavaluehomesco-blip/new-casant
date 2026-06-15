"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Star, StarOff, Images } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

interface GalleryProject {
  id: string
  title: string
  description: string | null
  cover_image: string | null
  is_featured: boolean
  is_active: boolean
  location: string | null
  event_date: string | null
  category_id: string
  gallery_categories: { name: string; slug: string } | null
  gallery_images: { id: string }[]
}

interface GalleryCategory {
  id: string
  name: string
  slug: string
}

interface Props {
  projects: GalleryProject[]
  categories: GalleryCategory[]
}

export default function AllGalleryManager({ projects: initialProjects, categories }: Props) {
  const [projects, setProjects] = useState(initialProjects)
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const filtered = activeTab === "all"
    ? projects
    : activeTab === "featured"
    ? projects.filter((p) => p.is_featured)
    : projects.filter((p) => p.category_id === activeTab)

  const featuredCount = projects.filter((p) => p.is_featured).length

  const toggleFeatured = async (project: GalleryProject) => {
    setLoading(project.id)
    const newVal = !project.is_featured
    const { error } = await supabase
      .from("gallery_projects")
      .update({ is_featured: newVal })
      .eq("id", project.id)

    if (!error) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, is_featured: newVal } : p))
      )
      router.refresh()
    }
    setLoading(null)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gallery / Portfolio</h1>
          <p className="text-slate-500 text-sm mt-1">
            Toggle projects as Featured to show them in the "Featured Work" section on the homepage.
          </p>
        </div>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {featuredCount} Featured
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All ({projects.length})</TabsTrigger>
          <TabsTrigger value="featured">
            <Star className="w-3.5 h-3.5 mr-1 text-yellow-500" />
            Featured ({featuredCount})
          </TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id}>
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Images className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((project) => (
            <Card
              key={project.id}
              className={`overflow-hidden transition-all ${project.is_featured ? "ring-2 ring-yellow-400" : ""}`}
            >
              <div className="h-32 bg-slate-100 relative overflow-hidden">
                {project.cover_image ? (
                  <img
                    src={project.cover_image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Images className="w-8 h-8" />
                  </div>
                )}
                {project.is_featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="font-medium text-sm text-slate-800 truncate">{project.title}</p>
                <p className="text-xs text-slate-400 mb-3">
                  {project.gallery_categories?.name || "—"} · {project.gallery_images?.length || 0} photos
                </p>
                <Button
                  size="sm"
                  variant={project.is_featured ? "default" : "outline"}
                  className={`w-full text-xs h-7 ${project.is_featured ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-0" : ""}`}
                  onClick={() => toggleFeatured(project)}
                  disabled={loading === project.id}
                >
                  {project.is_featured ? (
                    <><StarOff className="w-3 h-3 mr-1" /> Unfeature</>
                  ) : (
                    <><Star className="w-3 h-3 mr-1" /> Set Featured</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
