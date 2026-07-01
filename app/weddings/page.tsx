import { NavigationWrapper } from "@/components/navigation-wrapper"
import { Footer } from "@/components/footer"
import { WeddingsContent } from "@/components/weddings-content"
import { getProjectsByCategorySlug, getGalleryCategoryBySlug, getCompanyInfo } from "@/lib/data/queries"

export const metadata = {
  title: "Weddings - Casant Events",
  description: "Creating dream weddings with elegance and precision",
}

export default async function WeddingsPage() {
  const [projects, category, companyInfo, navigation] = await Promise.all([
    getProjectsByCategorySlug("weddings"),
    getGalleryCategoryBySlug("weddings"),
    getCompanyInfo(),
    NavigationWrapper({}),
  ])

  return (
    <main className="min-h-screen">
      {navigation}
      <WeddingsContent projects={projects} category={category} />
      <Footer companyInfo={companyInfo} />
    </main>
  )
}
