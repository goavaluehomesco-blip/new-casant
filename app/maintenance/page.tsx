import { getCompanyInfo } from "@/lib/data/queries"
import { Wrench } from "lucide-react"

export const metadata = {
  title: "Website Under Maintenance",
  description: "We are currently performing maintenance. Please check back soon.",
  robots: { index: false, follow: false },
}

export default async function MaintenancePage() {
  const companyInfo = await getCompanyInfo()
  const companyName = companyInfo?.name || "Casant Events"
  const logoUrl = companyInfo?.logo_url

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Logo */}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={companyName}
            className="h-16 object-contain mx-auto"
          />
        ) : (
          <h2 className="text-2xl font-bold text-white tracking-wide">{companyName}</h2>
        )}

        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-full p-6">
            <Wrench className="w-12 h-12 text-amber-400" strokeWidth={1.5} />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white">Website Under Maintenance</h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            We&apos;re currently working on some improvements to serve you better.
            We&apos;ll be back shortly. Thank you for your patience.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-6">
          <p className="text-slate-500 text-sm">
            For urgent inquiries, please contact us at{" "}
            {companyInfo?.email ? (
              <a
                href={`mailto:${companyInfo.email}`}
                className="text-amber-400 hover:text-amber-300 transition-colors"
              >
                {companyInfo.email}
              </a>
            ) : (
              <span className="text-amber-400">our email</span>
            )}
          </p>
          {companyInfo?.phone && (
            <p className="text-slate-500 text-sm mt-1">
              or call{" "}
              <a
                href={`tel:${companyInfo.phone}`}
                className="text-amber-400 hover:text-amber-300 transition-colors"
              >
                {companyInfo.phone}
              </a>
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
