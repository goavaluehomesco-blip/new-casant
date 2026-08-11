"use client"

import type { Partner } from "@/lib/data/types"

function PartnerCard({ partner }: { partner: Partner }) {
  const inner = (
    <div className="flex items-center justify-center h-full px-8 py-8">
      {partner.image_url ? (
        <img
          src={partner.image_url || "/placeholder.svg"}
          alt={partner.name}
          className="max-h-14 max-w-[160px] w-auto object-contain opacity-80 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
        />
      ) : (
        <span className="text-base font-semibold text-white/60 group-hover:text-white transition-colors duration-300 tracking-wide text-center leading-tight">
          {partner.name}
        </span>
      )}
    </div>
  )

  const className =
    "group relative flex items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 aspect-[3/2]"

  if (partner.website_url) {
    return (
      <a
        href={partner.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={partner.name}
      >
        {inner}
      </a>
    )
  }

  return <div className={className}>{inner}</div>
}

interface PartnersProps {
  partners: Partner[]
}

export function Partners({ partners }: PartnersProps) {
  if (!partners || partners.length === 0) return null

  return (
    <section className="relative bg-[#0a0a0a] py-20 overflow-hidden">
      {/* Subtle top border line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/35 mb-3">Our Network</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white text-balance leading-tight">
            Partners We Collaborate With
          </h2>
          <p className="text-white/50 mt-3 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            We work hand in hand with trusted vendors and industry partners to bring every event to life.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  )
}
