import { unstable_cache } from "next/cache"
import { createUnauthenticatedClient } from "@/lib/supabase/server"
import type {
  HeroSlide,
  Service,
  GalleryCategory,
  GalleryProject,
  GalleryImage,
  InventoryCategory,
  InventoryItem,
  TeamMember,
  CompanyInfo,
  Testimonial,
  InstagramPost,
  JobPosting,
  HrInfo,
  ServiceImage,
} from "./types"

// Hero Slides
async function _getActiveHeroSlides(): Promise<HeroSlide[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching hero slides:", error)
    return []
  }
  return data || []
}

export const getActiveHeroSlides = unstable_cache(
  _getActiveHeroSlides,
  ["hero-slides"],
  { revalidate: 3600, tags: ["hero-slides"] }
)

// Services
async function _getActiveServices(): Promise<Service[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching services:", error)
    return []
  }
  return data || []
}

export const getActiveServices = unstable_cache(
  _getActiveServices,
  ["services"],
  { revalidate: 3600, tags: ["services"] }
)

// Gallery Categories
async function _getGalleryCategories(): Promise<GalleryCategory[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("gallery_categories")
    .select("id, name, slug, description, image_url, display_order, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  if (error) { console.error("Error fetching gallery categories:", error); return [] }
  return data || []
}
export const getGalleryCategories = unstable_cache(
  _getGalleryCategories,
  ["gallery-categories"],
  { revalidate: 3600, tags: ["gallery-categories"] }
)

export async function getGalleryCategoryBySlug(slug: string): Promise<GalleryCategory | null> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("gallery_categories")
    .select("id, name, slug, description, image_url, display_order, is_active, created_at, updated_at")
    .eq("slug", slug)
    .single()
  if (error) { console.error("Error fetching gallery category:", error); return null }
  return data
}

// Gallery Projects — only fetch fields needed for listing; images fetched separately
async function _getFeaturedProjects(): Promise<GalleryProject[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("gallery_projects")
    .select("id, title, slug, description, cover_image, location, event_date, category_id, is_featured, is_active, display_order, created_at, updated_at")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6)
  if (error) { console.error("Error fetching featured projects:", error); return [] }
  return data || []
}
export const getFeaturedProjects = unstable_cache(
  _getFeaturedProjects,
  ["featured-projects"],
  { revalidate: 3600, tags: ["gallery-projects"] }
)

export async function getProjectsByCategory(categoryId: string): Promise<GalleryProject[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("gallery_projects")
    .select("id, title, slug, description, cover_image, location, event_date, category_id, is_featured, is_active, display_order, created_at, updated_at, images:gallery_images(id, project_id, image_url, caption, display_order, created_at)")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(20)
  if (error) { console.error("Error fetching gallery projects:", error); return [] }
  return (data || []) as unknown as GalleryProject[]
}

export async function getProjectsByCategorySlug(slug: string): Promise<GalleryProject[]> {
  const supabase = createUnauthenticatedClient()
  const { data: category, error: catError } = await supabase
    .from("gallery_categories")
    .select("id")
    .eq("slug", slug)
    .single()
  if (catError || !category) { console.error("Error fetching category:", catError); return [] }
  const { data, error } = await supabase
    .from("gallery_projects")
    .select("id, title, slug, description, cover_image, location, event_date, category_id, is_featured, is_active, display_order, created_at, updated_at, images:gallery_images(id, project_id, image_url, caption, display_order, created_at)")
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(20)
  if (error) { console.error("Error fetching gallery projects:", error); return [] }
  return (data || []) as unknown as GalleryProject[]
}

export async function getProjectBySlug(slug: string): Promise<GalleryProject | null> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("gallery_projects")
    .select("id, title, slug, description, cover_image, location, event_date, category_id, is_featured, is_active, display_order, created_at, updated_at, images:gallery_images(id, project_id, image_url, caption, display_order, created_at)")
    .eq("slug", slug)
    .single()
  if (error) { console.error("Error fetching project by slug:", error); return null }
  return data as unknown as GalleryProject
}

export async function getAllFeaturedImages(): Promise<(GalleryImage & { project: GalleryProject })[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("gallery_images")
    .select("id, image_url, caption, display_order, project:gallery_projects!inner(id, title, slug, is_featured, is_active, category:gallery_categories(id, name, slug))")
    .eq("gallery_projects.is_featured", true)
    .eq("gallery_projects.is_active", true)
    .order("display_order", { ascending: true })
    .limit(24)
  if (error) { console.error("Error fetching all featured images:", error); return [] }
  return (data as any) || []
}

// Inventory
async function _getInventoryCategories(): Promise<InventoryCategory[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("inventory_categories")
    .select("id, name, slug, description, icon, display_order, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  if (error) { console.error("Error fetching inventory categories:", error); return [] }
  return data || []
}
export const getInventoryCategories = unstable_cache(
  _getInventoryCategories,
  ["inventory-categories"],
  { revalidate: 3600, tags: ["inventory"] }
)

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("inventory_items")
    .select("id, name, description, category_id, image_url, specifications, quantity, is_available, is_active, display_order, created_at, updated_at")
    .eq("is_available", true)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(100)
  if (error) { console.error("Error fetching inventory items:", error); return [] }
  return data || []
}

async function _getInventoryByCategory(): Promise<Record<string, InventoryItem[]>> {
  const supabase = createUnauthenticatedClient()
  const { data: categories, error: catError } = await supabase
    .from("inventory_categories")
    .select("id, name, slug, display_order")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  if (catError || !categories) { console.error("Error fetching inventory categories:", catError); return {} }

  const { data: items, error: itemsError } = await supabase
    .from("inventory_items")
    .select("id, name, description, category_id, image_url, specifications, quantity, is_available, is_active, display_order, created_at, updated_at")
    .eq("is_available", true)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(100)
  if (itemsError || !items) { console.error("Error fetching inventory items:", itemsError); return {} }

  const result: Record<string, InventoryItem[]> = {}
  categories.forEach((cat) => {
    result[cat.slug] = items.filter((item) => item.category_id === cat.id)
  })
  return result
}
export const getInventoryByCategory = unstable_cache(
  _getInventoryByCategory,
  ["inventory-by-category"],
  { revalidate: 3600, tags: ["inventory"] }
)

// Team Members
async function _getActiveTeamMembers(): Promise<TeamMember[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("team_members")
    .select("id, name, role, bio, image_url, email, phone, linkedin, display_order, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  if (error) { console.error("Error fetching team members:", error); return [] }
  return (data || []) as TeamMember[]
}
export const getActiveTeamMembers = unstable_cache(
  _getActiveTeamMembers,
  ["team-members"],
  { revalidate: 7200, tags: ["team-members"] }
)

// Company Info
async function _getCompanyInfo(): Promise<CompanyInfo | null> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase.from("company_info").select("*").limit(1).single()
  if (error) { console.error("Error fetching company info:", error); return null }
  return data
}
export const getCompanyInfo = unstable_cache(
  _getCompanyInfo,
  ["company-info"],
  { revalidate: 7200, tags: ["company-info"] }
)

// Testimonials
async function _getActiveTestimonials(): Promise<Testimonial[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, client_name, client_title, quote, background_image_url, display_order, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(12)
  if (error) { console.error("Error fetching testimonials:", error); return [] }
  return (data || []) as unknown as Testimonial[]
}
export const getActiveTestimonials = unstable_cache(
  _getActiveTestimonials,
  ["testimonials"],
  { revalidate: 3600, tags: ["testimonials"] }
)

// Instagram Posts
async function _getActiveInstagramPosts(): Promise<InstagramPost[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("instagram_posts")
    .select("id, image_url, caption, post_url, display_order, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(9)
  if (error) { console.error("Error fetching instagram posts:", error); return [] }
  return (data || []) as InstagramPost[]
}
export const getActiveInstagramPosts = unstable_cache(
  _getActiveInstagramPosts,
  ["instagram-posts"],
  { revalidate: 1800, tags: ["instagram-posts"] }
)

// Job Postings
async function _getActiveJobPostings(): Promise<JobPosting[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("job_postings")
    .select("id, title, department, location, job_type, description, requirements, is_active, display_order, created_at, updated_at")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  if (error) { console.error("Error fetching job postings:", error); return [] }
  return (data || []) as JobPosting[]
}
export const getActiveJobPostings = unstable_cache(
  _getActiveJobPostings,
  ["job-postings"],
  { revalidate: 3600, tags: ["job-postings"] }
)

// HR Info
async function _getHrInfo(): Promise<HrInfo | null> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase.from("hr_info").select("*").limit(1).single()
  if (error) { console.error("Error fetching HR info:", error); return null }
  return data
}
export const getHrInfo = unstable_cache(
  _getHrInfo,
  ["hr-info"],
  { revalidate: 7200, tags: ["hr-info"] }
)

// Service Images
export async function getServiceImages(serviceId: string): Promise<ServiceImage[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("service_images")
    .select("id, service_id, image_url, caption, display_order, created_at")
    .eq("service_id", serviceId)
    .order("display_order", { ascending: true })
    .limit(10)
  if (error) { console.error("Error fetching service images:", error); return [] }
  return (data || []) as ServiceImage[]
}
