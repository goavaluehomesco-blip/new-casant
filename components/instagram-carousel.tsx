"use client"

import { useRef } from "react"
import Image from "next/image"
import type { InstagramPost, CompanyInfo } from "@/lib/data/types"
import { Instagram } from "lucide-react"

interface InstagramCarouselProps {
  posts: InstagramPost[]
  companyInfo?: CompanyInfo | null
}

export function InstagramCarousel({ posts, companyInfo }: InstagramCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const instagramUrl = companyInfo?.social_instagram || null
  const handle = instagramUrl
    ? "@" + instagramUrl.replace(/https?:\/\/(www\.)?instagram\.com\/?/, "").replace(/\/$/, "")
    : "@casantevents"

  if (posts.length === 0) return null

  // Repeat posts enough times so the track is always wider than the viewport
  // and the loop seam is never visible. Minimum 12 items total.
  const minRepeats = Math.ceil(12 / posts.length)
  const repeated = Array.from({ length: minRepeats }, () => posts).flat()

  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-1">Follow Along</p>
            <h2 className="text-3xl font-bold text-foreground">Our Instagram</h2>
          </div>
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              <Instagram className="w-4 h-4" />
              {handle}
            </a>
          )}
        </div>
      </div>

      {/* Auto-scrolling track */}
      <div className="relative">
        <div
          ref={trackRef}
          className="flex gap-3 animate-instagram-scroll"
          style={{
            width: "max-content",
            ["--scroll-amount" as string]: `-${(100 / minRepeats).toFixed(4)}%`,
          }}
        >
          {repeated.map((post, i) => (
            <a
              key={`${post.id}-${i}`}
              href={instagramUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex-shrink-0 w-52 h-52 md:w-64 md:h-64 rounded-xl overflow-hidden group"
            >
              <Image
                src={post.image_url}
                alt={post.caption || "Instagram post"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="256px"
                loading="lazy"
              />
              {post.caption && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <p className="text-white text-xs leading-relaxed line-clamp-3">{post.caption}</p>
                </div>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Instagram className="w-4 h-4 text-white drop-shadow" />
              </div>
            </a>
          ))}
        </div>

        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>
    </section>
  )
}
