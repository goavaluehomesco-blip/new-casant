import { NavigationWrapper } from "@/components/navigation-wrapper"
import { Footer } from "@/components/footer"
import { CorporateContent } from "@/components/corporate-content"
import { getProjectsByCategorySlug, getGalleryCategoryBySlug, getCompanyInfo } from "@/lib/data/queries"

export const metadata = {
  title: "Corporate Events - Casant Events",
  description: "Professional corporate event management services",
}

export default async function CorporatePage() {
  const [projects, category, companyInfo, navigation] = await Promise.all([
    getProjectsByCategorySlug("corporate"),
    getGalleryCategoryBySlug("corporate"),
    getCompanyInfo(),
    NavigationWrapper({}),
  ])

  return (
    <main className="min-h-screen">
      {navigation}
      <CorporateContent projects={projects} category={category} />
      <Footer companyInfo={companyInfo} />
    </main>
  )
}
