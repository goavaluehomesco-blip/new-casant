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
          src={client.image_url || "/placeholder.svg"}
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
        className="group relative rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/15 transition-all duration-300 min-w-[160px] h-[92px] shrink-0"
        aria-label={client.name}
      >
        {inner}
      </a>
    )
  }

  return (
    <div className="group relative rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/15 transition-all duration-300 min-w-[160px] h-[92px] shrink-0">
      {inner}
    </div>
  )
}

function MarqueeRow({
  clients,
  reverse = false,
  speed = 40,
}: {
  clients: Clientele[]
  reverse?: boolean
  speed?: number
}) {
  return (
    <div className="group/row relative overflow-hidden">
      <div
        className="flex gap-3 w-max"
        style={{
          animation: `${reverse ? "casant-marquee-reverse" : "casant-marquee"} ${speed}s linear infinite`,
        }}
      >
        <div className="flex gap-3 shrink-0 group-hover/row:[animation-play-state:paused]">
          {clients.map((client) => (
            <ClientCard key={`a-${client.id}`} client={client} />
          ))}
        </div>
        <div className="flex gap-3 shrink-0" aria-hidden="true">
          {clients.map((client) => (
            <ClientCard key={`b-${client.id}`} client={client} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function Clientele({ clients }: ClienteleProps) {
  if (!clients || clients.length === 0) return null

  // Split into two rows for a richer layout when there are enough logos, moving in opposite directions.
  const shouldSplit = clients.length >= 8
  const midpoint = Math.ceil(clients.length / 2)
  const rowOne = shouldSplit ? clients.slice(0, midpoint) : clients
  const rowTwo = shouldSplit ? clients.slice(midpoint) : []

  return (
    <section className="relative bg-[#080808] py-20 overflow-hidden">
      {/* Keyframes for the infinite marquee — duplicated track scrolls -50% so it loops seamlessly */}
      <style>{`
        @keyframes casant-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes casant-marquee-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .group\\/row [style*="casant-marquee"] {
            animation: none !important;
          }
        }
      `}</style>

      {/* Subtle top/bottom border lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-6 md:px-12 mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/35 mb-3">Trusted By</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white text-balance leading-tight">
          Brands That Rely on Us
        </h2>
        <p className="text-white/50 mt-3 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          From luxury hotels to corporate giants, we have crafted unforgettable events for the most discerning
          brands.
        </p>
      </div>

      {/* Auto-scrolling logo carousel */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-3">
          <MarqueeRow clients={rowOne} speed={Math.max(28, rowOne.length * 4)} />
          {rowTwo.length > 0 && (
            <MarqueeRow clients={rowTwo} reverse speed={Math.max(28, rowTwo.length * 4)} />
          )}
        </div>
      </div>
    </section>
  )
}
