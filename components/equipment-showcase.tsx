"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Lightbulb, Volume2, Monitor, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { InventoryCategory, InventoryItem } from "@/lib/data/types"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb, lightbulb: Lightbulb,
  Volume2, speaker: Volume2,
  Monitor, video: Monitor,
}

// Fallback data so the section always renders even with empty DB
const defaultCategories: InventoryCategory[] = [
  { id: "1", name: "Lights", slug: "lights", icon: "lightbulb", description: "Professional stage and event lighting", display_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Sound", slug: "sound", icon: "speaker", description: "High-quality audio systems", display_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Production", slug: "production", icon: "video", description: "Staging, LED walls and production gear", display_order: 3, is_active: true, created_at: "", updated_at: "" },
]

const defaultInventory: Record<string, InventoryItem[]> = {
  lights: [
    { id: "l1", category_id: "1", name: "LED Par Lights", description: "High-output RGBWA+UV par lights", image_url: null, specifications: null, quantity: 50, is_available: true, is_active: true, display_order: 1, created_at: "", updated_at: "" },
    { id: "l2", category_id: "1", name: "Moving Head Spots", description: "350W moving head fixtures", image_url: null, specifications: null, quantity: 30, is_available: true, is_active: true, display_order: 2, created_at: "", updated_at: "" },
    { id: "l3", category_id: "1", name: "LED Wall Washers", description: "Linear LED wash fixtures", image_url: null, specifications: null, quantity: 40, is_available: true, is_active: true, display_order: 3, created_at: "", updated_at: "" },
    { id: "l4", category_id: "1", name: "Follow Spots", description: "1200W HMI follow spotlights", image_url: null, specifications: null, quantity: 8, is_available: true, is_active: true, display_order: 4, created_at: "", updated_at: "" },
  ],
  sound: [
    { id: "s1", category_id: "2", name: "Line Array Systems", description: "JBL VTX large-format arrays", image_url: null, specifications: null, quantity: 10, is_available: true, is_active: true, display_order: 1, created_at: "", updated_at: "" },
    { id: "s2", category_id: "2", name: "Subwoofers", description: "Dual 18\" 2000W subwoofers", image_url: null, specifications: null, quantity: 12, is_available: true, is_active: true, display_order: 2, created_at: "", updated_at: "" },
    { id: "s3", category_id: "2", name: "Digital Mixing Consoles", description: "96-channel digital consoles", image_url: null, specifications: null, quantity: 5, is_available: true, is_active: true, display_order: 3, created_at: "", updated_at: "" },
    { id: "s4", category_id: "2", name: "Wireless Microphones", description: "Digital UHF wireless systems", image_url: null, specifications: null, quantity: 50, is_available: true, is_active: true, display_order: 4, created_at: "", updated_at: "" },
  ],
  production: [
    { id: "p1", category_id: "3", name: "LED Video Walls", description: "P2.9 & P3.9 modular LED displays", image_url: null, specifications: null, quantity: 200, is_available: true, is_active: true, display_order: 1, created_at: "", updated_at: "" },
    { id: "p2", category_id: "3", name: "Staging Systems", description: "Modular aluminium stage platforms", image_url: null, specifications: null, quantity: 100, is_available: true, is_active: true, display_order: 2, created_at: "", updated_at: "" },
    { id: "p3", category_id: "3", name: "Truss Systems", description: "Box & triangle aluminium truss", image_url: null, specifications: null, quantity: 300, is_available: true, is_active: true, display_order: 3, created_at: "", updated_at: "" },
    { id: "p4", category_id: "3", name: "Special Effects", description: "CO2 jets, confetti & cold spark", image_url: null, specifications: null, quantity: 20, is_available: true, is_active: true, display_order: 4, created_at: "", updated_at: "" },
  ],
}

const categoryAccent: Record<string, { bg: string; text: string; dot: string }> = {
  lights: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  sound: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  production: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
}

interface EquipmentShowcaseProps {
  categories?: InventoryCategory[]
  inventoryByCategory?: Record<string, InventoryItem[]>
}

function ItemCard({ item, accent }: { item: InventoryItem; accent: { bg: string; text: string; dot: string } }) {
  return (
    <div className="flex-shrink-0 w-64 rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300 group">
      {/* Image area */}
      <div className="relative h-44 bg-muted overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="256px"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${accent.bg}`}>
            <Monitor className={`w-10 h-10 ${accent.text} opacity-40`} />
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-1">{item.name}</h3>
        <p className="text-muted-foreground text-xs mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
      </div>
    </div>
  )
}

export function EquipmentShowcase({ categories, inventoryByCategory }: EquipmentShowcaseProps) {
  const cats = categories && categories.length > 0 ? categories : defaultCategories
  const inv = inventoryByCategory && Object.keys(inventoryByCategory).length > 0 ? inventoryByCategory : defaultInventory

  const [activeTab, setActiveTab] = useState(0)
  const [index, setIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const activeCategory = cats[activeTab]
  const items = activeCategory ? (inv[activeCategory.slug] ?? []) : []
  const CARD_W = 256 + 16 // w-64 = 256px + gap-4 = 16px
  const VISIBLE = 3
  const maxIndex = Math.max(0, items.length - VISIBLE)

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    if (items.length <= VISIBLE) return
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 3500)
  }, [items.length, maxIndex, stopTimer])

  useEffect(() => {
    setIndex(0)
    startTimer()
    return stopTimer
  }, [activeTab, startTimer, stopTimer])

  const goTo = (i: number) => {
    setIndex(i)
    startTimer()
  }

  const accent = categoryAccent[activeCategory?.slug ?? "lights"] ?? categoryAccent.lights

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <span className="text-primary font-medium tracking-widest text-xs uppercase">In-House Equipment</span>
          <h2 className="text-4xl font-bold text-foreground mt-2 text-balance">Our Equipment</h2>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
            All owned and operated by our expert team — quality you can rely on.
          </p>
        </div>

        {/* View all link */}
        <div className="flex justify-center mb-10">
          <Link href="/inventory/all">
            <Button variant="outline" className="rounded-full gap-2 group shrink-0">
              View All Equipment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Tab pills */}
        <div className="flex justify-center gap-2 mb-10">
          {cats.map((cat, idx) => {
            const Icon = iconMap[cat.icon ?? ""] ?? Lightbulb
            const isActive = activeTab === idx
            const a = categoryAccent[cat.slug] ?? categoryAccent.lights
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveTab(idx); setIndex(0) }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition-all duration-250 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-transparent shadow-sm"
                    : "bg-transparent text-muted-foreground border-border hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            )
          })}
        </div>

        {/* Carousel track */}
        <div className="relative px-10">
          {/* Left arrow */}
          <button
            onClick={() => goTo(Math.max(0, index - 1))}
            disabled={index === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background border border-border shadow flex items-center justify-center disabled:opacity-20 hover:bg-secondary transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Overflow clip */}
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-4 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${index * CARD_W}px)` }}
            >
              {items.length > 0 ? (
                items.map((item) => (
                  <ItemCard key={item.id} item={item} accent={accent} />
                ))
              ) : (
                <p className="text-muted-foreground py-16 text-sm">No items in this category yet.</p>
              )}
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={() => goTo(Math.min(maxIndex, index + 1))}
            disabled={index >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background border border-border shadow flex items-center justify-center disabled:opacity-20 hover:bg-secondary transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dot indicators */}
        {items.length > VISIBLE && (
          <div className="flex justify-center gap-1.5 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? `${accent.dot} w-6` : "bg-border w-1.5"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
