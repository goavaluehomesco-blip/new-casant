import { NavigationWrapper } from "@/components/navigation-wrapper"
import { Footer } from "@/components/footer"
import { AboutContent } from "@/components/about-content"
import { getActiveTeamMembers, getCompanyInfo, getActiveLifeAtCasantImages } from "@/lib/data/queries"

export const metadata = {
  title: "About Us - Casant Events",
  description: "Learn about Casant Events - 25 years of creating unforgettable event experiences",
}

export default async function AboutPage() {
  const [teamMembers, companyInfo, lifeAtCasantImages, navigation] = await Promise.all([
    getActiveTeamMembers(),
    getCompanyInfo(),
    getActiveLifeAtCasantImages(),
    NavigationWrapper({ variant: "dark" }),
  ])

  return (
    <main className="min-h-screen">
      {navigation}
      <AboutContent teamMembers={teamMembers} companyInfo={companyInfo} lifeAtCasantImages={lifeAtCasantImages} />
      <Footer companyInfo={companyInfo} />
    </main>
  )
}
