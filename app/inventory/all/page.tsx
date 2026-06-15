import { NavigationWrapper } from "@/components/navigation-wrapper"
import { Footer } from "@/components/footer"
import { AllEquipmentContent } from "@/components/all-equipment-content"
import { getInventoryCategories, getInventoryByCategory } from "@/lib/data/queries"

export const metadata = {
  title: "All Equipment - Casant Events",
  description: "Browse our complete in-house inventory of lighting, sound, and production equipment",
}

export default async function AllEquipmentPage() {
  const [categories, inventoryByCategory, navigation] = await Promise.all([
    getInventoryCategories(),
    getInventoryByCategory(),
    NavigationWrapper({ variant: "dark" }),
  ])

  return (
    <main className="min-h-screen">
      {navigation}
      <AllEquipmentContent categories={categories} inventoryByCategory={inventoryByCategory} />
      <Footer />
    </main>
  )
}
