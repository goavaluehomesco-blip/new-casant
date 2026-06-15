import { NavigationWrapper } from "@/components/navigation-wrapper"
import { Footer } from "@/components/footer"
import { InventoryContent } from "@/components/inventory-content"
import { getInventoryCategories, getInventoryByCategory, getCompanyInfo } from "@/lib/data/queries"

export const metadata = {
  title: "Inventory - Casant Events",
  description: "Premium event equipment and production services",
}

export default async function InventoryPage() {
  const [categories, inventoryByCategory, companyInfo, navigation] = await Promise.all([
    getInventoryCategories(),
    getInventoryByCategory(),
    getCompanyInfo(),
    NavigationWrapper({ variant: "dark" }),
  ])

  return (
    <main className="min-h-screen">
      {navigation}
      <InventoryContent categories={categories} inventoryByCategory={inventoryByCategory} companyInfo={companyInfo} />
      <Footer />
    </main>
  )
}
