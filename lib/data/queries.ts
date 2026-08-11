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
  Clientele,
  Partner,
  BlogPost,
  LifeAtCasantImage,
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
    .select("id, title, slug, description, cover_image, location, event_date, category_id, is_featured, is_active, display_order, created_at, updated_at, images:gallery_images(id, project_id, image_url, caption, display_order, created_at)")
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

// Team Members — Directors (member_type may not exist until migration runs; falls back to all rows)
async function _getActiveTeamMembers(): Promise<TeamMember[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("team_members")
    .select(
      "id, name, role, bio, image_url, email, phone, linkedin, member_type, display_order, is_active, created_at, updated_at",
    )
    .eq("is_active", true)
    .eq("member_type", "director")
    .order("display_order", { ascending: true })
  if (error) {
    if (error.code === "42703" || error.message?.includes("member_type")) {
      // member_type column not migrated yet — treat every active member as a director
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("team_members")
        .select("id, name, role, bio, image_url, email, phone, linkedin, display_order, is_active, created_at, updated_at")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
      if (fallbackError) { console.error("Error fetching team members:", fallbackError); return [] }
      return (fallbackData || []).map((m) => ({ ...m, member_type: "director" })) as TeamMember[]
    }
    console.error("Error fetching team members:", error)
    return []
  }
  return (data || []) as TeamMember[]
}
export const getActiveTeamMembers = unstable_cache(
  _getActiveTeamMembers,
  ["team-members"],
  { revalidate: 7200, tags: ["team-members"] }
)

// Team Members — Employees (returns [] until member_type migration runs)
async function _getActiveEmployees(): Promise<TeamMember[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("team_members")
    .select(
      "id, name, role, bio, image_url, email, phone, linkedin, member_type, display_order, is_active, created_at, updated_at",
    )
    .eq("is_active", true)
    .eq("member_type", "employee")
    .order("display_order", { ascending: true })
  if (error) {
    if (error.code === "42703" || error.message?.includes("member_type")) return []
    console.error("Error fetching employees:", error)
    return []
  }
  return (data || []) as TeamMember[]
}
export const getActiveEmployees = unstable_cache(
  _getActiveEmployees,
  ["team-employees"],
  { revalidate: 7200, tags: ["team-members"] }
)

// Company Info
async function _getCompanyInfo(): Promise<CompanyInfo | null> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase.from("company_info").select("*").limit(1).single()
  if (error) {
    console.error("Error fetching company info:", error)
    return null
  }
  if (data) {
    // Supabase may return JSONB arrays as a raw JSON string — parse it if so
    if (typeof data.track_record_images === "string") {
      try { data.track_record_images = JSON.parse(data.track_record_images) } catch { data.track_record_images = [] }
    }
    if (!Array.isArray(data.track_record_images)) data.track_record_images = []
  }
  return data
}
export const getCompanyInfo = unstable_cache(
  _getCompanyInfo,
  ["company-info"],
  { revalidate: 60, tags: ["company-info"] }
)

// Testimonials
async function _getActiveTestimonials(): Promise<Testimonial[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, client_name, client_role, client_company, client_image_url, testimonial_text, rating, event_type, is_featured, is_active, display_order, created_at, updated_at")
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
    .from("instagram_feed")
    .select("id, image_url, caption, display_order, is_active, created_at")
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

// Job Postings — table may not exist yet; returns [] safely
async function _getActiveJobPostings(): Promise<JobPosting[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("job_postings")
    .select("id, title, department, location, job_type, description, requirements, is_active, display_order, created_at, updated_at")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  if (error) {
    if (error.code === "PGRST205" || error.message?.includes("schema cache")) return []
    console.error("Error fetching job postings:", error)
    return []
  }
  return (data || []) as JobPosting[]
}
export const getActiveJobPostings = unstable_cache(
  _getActiveJobPostings,
  ["job-postings"],
  { revalidate: 3600, tags: ["job-postings"] }
)

// HR Info — table may not exist yet; returns null safely
async function _getHrInfo(): Promise<HrInfo | null> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase.from("hr_info").select("*").limit(1).single()
  if (error) {
    if (error.code === "PGRST205" || error.message?.includes("schema cache")) return null
    console.error("Error fetching HR info:", error)
    return null
  }
  return data
}
export const getHrInfo = unstable_cache(
  _getHrInfo,
  ["hr-info"],
  { revalidate: 7200, tags: ["hr-info"] }
)

// Clientele — table may not exist until SQL is run; returns [] safely
async function _getActiveClientele(): Promise<Clientele[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("clientele")
    .select("id, name, image_url, website_url, is_active, display_order, created_at, updated_at")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  if (error) {
    if (error.code === "PGRST205" || error.message?.includes("schema cache") || error.message?.includes("does not exist")) return []
    console.error("Error fetching clientele:", error)
    return []
  }
  return (data || []) as Clientele[]
}
export const getActiveClientele = unstable_cache(
  _getActiveClientele,
  ["clientele"],
  { revalidate: 3600, tags: ["clientele"] }
)

// Partners — table may not exist until SQL is run; returns [] safely
async function _getActivePartners(): Promise<Partner[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("partners")
    .select("id, name, image_url, website_url, is_active, display_order, created_at, updated_at")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  if (error) {
    if (error.code === "PGRST205" || error.message?.includes("schema cache") || error.message?.includes("does not exist")) return []
    console.error("Error fetching partners:", error)
    return []
  }
  return (data || []) as Partner[]
}
export const getActivePartners = unstable_cache(
  _getActivePartners,
  ["partners"],
  { revalidate: 3600, tags: ["partners"] }
)

// Blog Posts — table may not exist until SQL is run; returns [] / null safely
function normalizeBlogPost(post: any): BlogPost {
  let images = post.images
  if (typeof images === "string") {
    try { images = JSON.parse(images) } catch { images = [] }
  }
  let content_blocks = post.content_blocks
  if (typeof content_blocks === "string") {
    try { content_blocks = JSON.parse(content_blocks) } catch { content_blocks = [] }
  }
  return {
    ...post,
    images: Array.isArray(images) ? images : [],
    content_blocks: Array.isArray(content_blocks) ? content_blocks : [],
  }
}

const BLOG_COLUMNS =
  "id, title, slug, description, cover_image, hero_image, images, content_blocks, is_active, display_order, created_at, updated_at"

async function _getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(BLOG_COLUMNS)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(3)
  if (error) {
    if (error.code === "PGRST205" || error.message?.includes("schema cache")) return []
    console.error("Error fetching featured blog posts:", error)
    return []
  }
  return (data || []).map(normalizeBlogPost)
}
export const getFeaturedBlogPosts = unstable_cache(
  _getFeaturedBlogPosts,
  ["featured-blog-posts"],
  { revalidate: 1800, tags: ["blog-posts"] }
)

async function _getAllBlogPosts(): Promise<BlogPost[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(BLOG_COLUMNS)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(100)
  if (error) {
    if (error.code === "PGRST205" || error.message?.includes("schema cache")) return []
    console.error("Error fetching blog posts:", error)
    return []
  }
  return (data || []).map(normalizeBlogPost)
}
export const getAllBlogPosts = unstable_cache(
  _getAllBlogPosts,
  ["all-blog-posts"],
  { revalidate: 1800, tags: ["blog-posts"] }
)

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(BLOG_COLUMNS)
    .eq("slug", slug)
    .eq("is_active", true)
    .single()
  if (error) {
    if (error.code !== "PGRST205" && !error.message?.includes("schema cache")) {
      console.error("Error fetching blog post by slug:", error)
    }
    return null
  }
  return normalizeBlogPost(data)
}

// Life at Casant Gallery — table may not exist until SQL is run; returns [] safely
async function _getActiveLifeAtCasantImages(): Promise<LifeAtCasantImage[]> {
  const supabase = createUnauthenticatedClient()
  const { data, error } = await supabase
    .from("life_at_casant_images")
    .select("id, image_url, caption, display_order, is_active, created_at, updated_at")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  if (error) {
    if (error.code === "PGRST205" || error.message?.includes("schema cache") || error.message?.includes("does not exist")) return []
    console.error("Error fetching Life at Casant images:", error)
    return []
  }
  return (data || []) as LifeAtCasantImage[]
}
export const getActiveLifeAtCasantImages = unstable_cache(
  _getActiveLifeAtCasantImages,
  ["life-at-casant-images"],
  { revalidate: 3600, tags: ["life-at-casant-images"] }
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
