export interface HeroSlide {
  id: string
  title: string
  subtitle: string | null
  video_url: string | null
  image_url: string | null
  cta_text: string | null
  cta_link: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  image_url: string | null
  link: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface GalleryCategory {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GalleryProject {
  id: string
  category_id: string
  title: string
  slug: string
  description: string | null
  cover_image: string | null
  location: string | null
  event_date: string | null
  is_featured: boolean
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
  images?: GalleryImage[]
}

export interface GalleryImage {
  id: string
  project_id: string
  image_url: string
  caption: string | null
  display_order: number
  created_at: string
}

export interface InventoryCategory {
  id: string
  name: string
  slug: string
  icon: string
  description: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InventoryItem {
  id: string
  category_id: string
  name: string
  description: string | null
  image_url: string | null
  specifications: {
    specs?: string[]
    applications?: string[]
  } | null
  quantity: number
  is_available: boolean
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string | null
  image_url: string | null
  email: string | null
  phone: string | null
  linkedin: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CompanyInfo {
  id: string
  name: string
  tagline: string | null
  about_short: string | null
  about_full: string | null
  years_experience: number
  clients_count: number
  projects_count: number
  hotels_count: number
  email: string | null
  phone: string | null
  address: string | null
  logo_url: string | null
  divider_image_url: string | null
  track_record_images: string[]
  social_facebook: string | null
  social_instagram: string | null
  social_linkedin: string | null
  social_youtube: string | null
  inventory_hero_image_url: string | null
  maintenance_mode: boolean
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  event_type: string | null
  event_date: string | null
  message: string | null
  is_read: boolean
  is_archived: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  client_name: string
  client_role: string | null
  client_company: string | null
  client_image_url: string | null
  testimonial_text: string
  rating: number | null
  event_type: string | null
  is_featured: boolean
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface InstagramPost {
  id: string
  image_url: string
  caption: string | null
  is_active: boolean
  display_order: number
  created_at: string
}

export interface JobPosting {
  id: string
  title: string
  department: string | null
  location: string | null
  job_type: string
  description: string
  requirements: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface HrInfo {
  id: string
  heading: string
  subheading: string | null
  description: string | null
  hr_name: string | null
  hr_email: string | null
  hr_phone: string | null
  hr_image_url: string | null
  created_at: string
  updated_at: string
}

export interface ServiceImage {
  id: string
  service_id: string
  image_url: string
  caption: string | null
  display_order: number
  created_at: string
}
