"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import type { Testimonial } from "@/lib/data/types"

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const items = testimonials.length > 0 ? testimonials : [
    {
      id: "1",
      client_name: "Nikita & Subohjeet",
      client_title: "Wedding · Goa",
      quote: "I am still in shock at how beautiful our wedding looked. Walking into the venue for the first time felt like stepping into a literal fairytale. Casant Events took every disorganized idea I had and turned it into a breathtaking reality. From the stunning floral arrangements to the way the lighting changed the entire mood of the room, everything was perfection.",
      background_image_url: null,
      is_active: true,
      display_order: 1,
      created_at: "",
      updated_at: "",
    },
  ]

  const goTo = useCallback((index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setIsAnimating(false)
    }, 300)
  }, [isAnimating])

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % items.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [current, items.length, goTo])

  const item = items[current]

  return (
    <section className="relative h-[620px] md:h-[580px] overflow-hidden">
      {/* Background image */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? "opacity-0" : "opacity-100"}`}
      >
        {item.background_image_url ? (
          <Image
            src={item.background_image_url}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />
        )}
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Content grid: quote left | label right */}
      <div className="relative z-10 h-full container mx-auto px-8 md:px-16 flex items-center">
        <div className="grid md:grid-cols-[1fr_280px] gap-12 w-full items-center">
          {/* Left: quote */}
          <div className={`transition-all duration-500 ${isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
            <span className="text-white/50 text-6xl font-serif leading-none select-none">"</span>
            <p className="text-white/90 text-lg md:text-xl italic leading-relaxed font-light -mt-4 mb-8 max-w-2xl">
              {item.quote}
            </p>
            <div>
              <p className="text-white font-bold text-sm tracking-widest uppercase">{item.client_name}</p>
              {item.client_title && (
                <p className="text-white/60 text-xs tracking-wide mt-1">{item.client_title}</p>
              )}
            </div>
          </div>

          {/* Right: section label + nav */}
          <div className="hidden md:flex flex-col items-end gap-6">
            <div className="text-right">
              <p className="text-white/50 text-xs tracking-[0.3em] uppercase mb-2">Kind Words</p>
              <h2 className="text-white text-4xl font-bold leading-tight">
                From Our<br />Clients
              </h2>
            </div>

            {/* Nav dots + arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => goTo((current - 1 + items.length) % items.length)}
                className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors"
                aria-label="Previous testimonial"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div className="flex gap-1.5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"}`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => goTo((current + 1) % items.length)}
                className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors"
                aria-label="Next testimonial"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 md:hidden">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
