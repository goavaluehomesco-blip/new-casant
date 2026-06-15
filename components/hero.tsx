"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { HeroSlide, CompanyInfo } from "@/lib/data/types"

// SVG icon components — clean, minimal, white
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  )
}

const SOCIAL_CONFIG = [
  { key: "social_facebook" as const, Icon: IconFacebook, label: "Facebook" },
  { key: "social_instagram" as const, Icon: IconInstagram, label: "Instagram" },
  { key: "social_linkedin" as const, Icon: IconLinkedIn, label: "LinkedIn" },
  { key: "social_youtube" as const, Icon: IconYouTube, label: "YouTube" },
]

interface HeroProps {
  slides?: HeroSlide[]
  companyInfo?: CompanyInfo | null
}

export function Hero({ slides, companyInfo }: HeroProps) {
  const [current, setCurrent] = useState(0)

  const activeSlides =
    slides && slides.length > 0
      ? slides
      : [
          {
            id: "default",
            title: "Your Trusted Partner for Every Event",
            subtitle: "Designing Unforgettable Celebrations",
            image_url: null,
            video_url: null,
            cta_text: "Get Quote",
            cta_link: "#contact",
            is_active: true,
            display_order: 1,
          } as unknown as HeroSlide,
        ]

  useEffect(() => {
    if (activeSlides.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [activeSlides.length])

  const slide = activeSlides[current]

  // Build list of social links that actually have a URL set
  const socialLinks = SOCIAL_CONFIG.filter(
    (s) => companyInfo?.[s.key]
  )

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background layers — cross-fade between slides */}
      {activeSlides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 z-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {s.video_url ? (
            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src={s.video_url} type="video/mp4" />
            </video>
          ) : s.image_url ? (
            <Image
              src={s.image_url}
              alt={s.title || "Hero background"}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
      ))}

      {/* Center content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-sans font-extrabold text-4xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight tracking-tight text-balance">
            {slide.title || "Your Trusted Partner for Every Event"}
          </h1>
          {slide.subtitle && (
            <p className="text-white/80 text-lg md:text-xl mb-8 text-balance">
              {slide.subtitle}
            </p>
          )}
          <Button
              size="lg"
              onClick={() => {
                const link = slide.cta_link
                if (link && link !== "#contact" && link !== "#") {
                  window.open(link, "_blank", "noopener,noreferrer")
                } else {
                  const text = encodeURIComponent(
                    "Hi Casant Events! I'd like to get a quote for my event."
                  )
                  window.open(`https://wa.me/919823291463?text=${text}`, "_blank", "noopener,noreferrer")
                }
              }}
              className="text-base px-10 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium tracking-wide"
            >
              {slide.cta_text || "Get Quote"}
            </Button>
        </div>
      </div>

      {/* Social icons — right edge vertical on desktop, bottom horizontal on mobile */}
      {socialLinks.length > 0 && (
        <>
          {/* Desktop: fixed vertical strip on right */}
          <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-1">
            {/* Top line */}
            <div className="w-px h-16 bg-white/30" />
            <div className="flex flex-col gap-3 py-3">
              {socialLinks.map(({ key, Icon, label }) => (
                <a
                  key={key}
                  href={companyInfo![key]!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex items-center justify-center w-9 h-9 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:scale-110"
                >
                  <Icon />
                </a>
              ))}
            </div>
            {/* Bottom line */}
            <div className="w-px h-16 bg-white/30" />
          </div>

          {/* Mobile: horizontal row just above the slide dots */}
          <div className="flex md:hidden absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex-row gap-3">
            {socialLinks.map(({ key, Icon, label }) => (
              <a
                key={key}
                href={companyInfo![key]!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-primary hover:border-primary transition-all duration-300"
              >
                <Icon />
              </a>
            ))}
          </div>
        </>
      )}

      {/* Slide dots */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  )
}
