import { Hero } from "@/components/hero"
import { DiagonalDivider } from "@/components/diagonal-divider"
import { TrackRecord } from "@/components/track-record"
import { Services } from "@/components/services"
import { EquipmentShowcase } from "@/components/equipment-showcase"
import { FeaturedWork } from "@/components/featured-work"
import { About } from "@/components/about"
import { Testimonials } from "@/components/testimonials"
import { InstagramCarousel } from "@/components/instagram-carousel"
import { Contact } from "@/components/contact"
import { JobOpenings } from "@/components/job-openings"
import { NavigationWrapper } from "@/components/navigation-wrapper"
import { Footer } from "@/components/footer"
import {
  getActiveHeroSlides,
  getActiveServices,
  getActiveTeamMembers,
  getCompanyInfo,
  getFeaturedProjects,
  getInventoryCategories,
  getInventoryByCategory,
  getActiveTestimonials,
  getActiveInstagramPosts,
  getActiveJobPostings,
} from "@/lib/data/queries"

export default async function Home() {
  const [
    heroSlides, services, teamMembers, companyInfo,
    featuredProjects, inventoryCategories, inventoryByCategory,
    testimonials, instagramPosts, jobPostings, navigation,
  ] = await Promise.all([
    getActiveHeroSlides(),
    getActiveServices(),
    getActiveTeamMembers(),
    getCompanyInfo(),
    getFeaturedProjects(),
    getInventoryCategories(),
    getInventoryByCategory(),
    getActiveTestimonials(),
    getActiveInstagramPosts(),
    getActiveJobPostings(),
    NavigationWrapper({}),
  ])

  return (
    <main className="min-h-screen">
      {navigation}
      <Hero slides={heroSlides} companyInfo={companyInfo} />
      <DiagonalDivider imageUrl={companyInfo?.divider_image_url} />
      <TrackRecord companyInfo={companyInfo} />
      <Services services={services} />
      <EquipmentShowcase categories={inventoryCategories} inventoryByCategory={inventoryByCategory} />
      <FeaturedWork projects={featuredProjects} />
      <Testimonials testimonials={testimonials} />
      <InstagramCarousel posts={instagramPosts} companyInfo={companyInfo} />
      <About teamMembers={teamMembers} />
      <JobOpenings jobs={jobPostings} />
      <Contact companyInfo={companyInfo} />
      <Footer companyInfo={companyInfo} />
    </main>
  )
}
