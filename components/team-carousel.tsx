"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TeamMember } from "@/lib/data/types"

interface TeamCarouselProps {
  members: TeamMember[]
  eyebrow?: string
  title?: string
  description?: string
}

export function TeamCarousel({
  members,
  eyebrow = "Our People",
  title = "The Casant Team",
  description = "Every celebration is built by hands you rarely see. Meet the people behind our productions.",
}: TeamCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  if (!members || members.length === 0) return null

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector("[data-card]") as HTMLElement | null
    const amount = (card?.offsetWidth || 260) + 24
    track.scrollBy({ left: amount * direction, behavior: "smooth" })
  }

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between gap-6 mb-12 max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <span className="text-primary font-medium tracking-wide text-sm uppercase">{eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-4 text-balance">{title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <div className="hidden md:flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous team member"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => scrollByCard(1)}
              aria-label="Next team member"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-px-6 scrollbar-none max-w-6xl mx-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {members.map((member) => (
            <div
              key={member.id}
              data-card
              className="snap-start shrink-0 w-[220px] sm:w-[260px] rounded-2xl overflow-hidden border border-border bg-background shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-[260px] sm:h-[300px] bg-secondary">
                {member.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-bold text-foreground leading-tight">{member.name}</h4>
                <p className="text-sm text-primary font-medium mt-0.5">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
