"use client"

import type { Clientele } from "@/lib/data/types"

interface ClienteleProps {
  clients: Clientele[]
}



function ClientCard({ client }: { client: Clientele }) {
  const inner = (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-5 h-full">
      {client.image_url ? (
        <img
          src={client.image_url}
          alt={client.name}
          className="max-h-10 max-w-[120px] w-auto object-contain opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
        />
      ) : (
        <span className="text-sm font-semibold text-white/50 group-hover:text-white/90 transition-colors duration-300 tracking-wide text-center leading-tight">
          {client.name}
        </span>
      )}
    </div>
  )

  if (client.website_url) {
    return (
      <a
        href={client.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/15 transition-all duration-300 min-w-[140px] h-[88px]"
        aria-label={client.name}
      >
        {inner}
      </a>
    )
  }

  return (
    <div className="group relative rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/15 transition-all duration-300 min-w-[140px] h-[88px]">
      {inner}
    </div>
  )
}

export function Clientele({ clients }: ClienteleProps) {
  if (!clients || clients.length === 0) return null

  const items = clients

  return (
    <section className="relative bg-[#080808] py-20 overflow-hidden">
      {/* Subtle top/bottom border lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-6 md:px-12 mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/35 mb-3">
          Trusted By
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white text-balance leading-tight">
          Brands That Rely on Us
        </h2>
        <p className="text-white/50 mt-3 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          From luxury hotels to corporate giants, we have crafted unforgettable events for the most discerning brands.
        </p>
      </div>

      {/* Desktop: static responsive grid */}
      <div className="hidden md:block container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {items.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      </div>

      {/* Mobile: auto-scrolling marquee */}
      <div className="md:hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-3 px-6 overflow-x-auto scrollbar-none snap-x snap-mandatory">
          {items.map((client) => (
            <div key={client.id} className="snap-start shrink-0 w-[140px]">
              <ClientCard client={client} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
