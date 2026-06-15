import { getCompanyInfo } from "@/lib/data/queries"
import { Navigation } from "@/components/navigation"

interface NavigationWrapperProps {
  variant?: "light" | "dark"
}

export async function NavigationWrapper({ variant = "light" }: NavigationWrapperProps) {
  const companyInfo = await getCompanyInfo()
  return <Navigation variant={variant} logoUrl={companyInfo?.logo_url} />
}
