"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Lightbulb, Volume2, Monitor, ChevronLeft, ChevronRight, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import type { InventoryCategory, InventoryItem, CompanyInfo } from "@/lib/data/types"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Volume2,
  Monitor,
  lightbulb: Lightbulb,
  speaker: Volume2,
  video: Monitor,
}

const categoryBg: Record<string, string> = {
  lights: "from-amber-500/20 to-yellow-400/10",
  sound: "from-blue-500/20 to-cyan-400/10",
  production: "from-violet-500/20 to-purple-400/10",
}

const defaultInventory: Record<string, InventoryItem[]> = {
  lights: [
    {
      id: "1", category_id: "1", name: "LED Par Lights", description: "High-output RGB LED par lights perfect for stage and ambient lighting",
      image_url: null, specifications: { specs: ["RGBW color mixing", "300W output", "DMX control"], applications: ["Stage lighting", "Uplighting"] },
      quantity: 50, is_available: true, is_active: true, display_order: 1, created_at: "", updated_at: "",
    },
    {
      id: "2", category_id: "1", name: "Moving Head Spotlights", description: "Professional moving head fixtures for dynamic lighting effects",
      image_url: null, specifications: { specs: ["360° pan/tilt", "Gobo patterns", "Prism effects"], applications: ["Concerts", "Awards ceremonies"] },
      quantity: 30, is_available: true, is_active: true, display_order: 2, created_at: "", updated_at: "",
    },
    {
      id: "3", category_id: "1", name: "Pin Spot Lights", description: "Focused beam lights ideal for highlighting centerpieces",
      image_url: null, specifications: { specs: ["Narrow beam", "LED tech", "Multiple colors"], applications: ["Table centerpieces", "Display highlights"] },
      quantity: 100, is_available: true, is_active: true, display_order: 3, created_at: "", updated_at: "",
    },
    {
      id: "4", category_id: "1", name: "String & Fairy Lights", description: "Elegant overhead lighting for magical ambiance",
      image_url: null, specifications: { specs: ["Edison bulbs", "Weatherproof", "Warm white"], applications: ["Outdoor events", "Rustic weddings"] },
      quantity: 200, is_available: true, is_active: true, display_order: 4, created_at: "", updated_at: "",
    },
  ],
  sound: [
    {
      id: "5", category_id: "2", name: "Line Array System", description: "Premium sound system for large venues and outdoor events",
      image_url: null, specifications: { specs: ["15,000W power", "500-person coverage", "Digital processing"], applications: ["Concerts", "Festivals"] },
      quantity: 10, is_available: true, is_active: true, display_order: 1, created_at: "", updated_at: "",
    },
    {
      id: "6", category_id: "2", name: "Wireless Microphones", description: "Professional wireless microphone systems",
      image_url: null, specifications: { specs: ["UHF frequency", "Long battery", "Multiple channels"], applications: ["Speeches", "Presentations"] },
      quantity: 50, is_available: true, is_active: true, display_order: 2, created_at: "", updated_at: "",
    },
    {
      id: "7", category_id: "2", name: "DJ Equipment Package", description: "Complete DJ setup with mixers and controllers",
      image_url: null, specifications: { specs: ["Pioneer CDJ players", "4-channel mixer", "Effect processors"], applications: ["Wedding receptions", "Dance parties"] },
      quantity: 5, is_available: true, is_active: true, display_order: 3, created_at: "", updated_at: "",
    },
    {
      id: "8", category_id: "2", name: "Powered Speakers", description: "Versatile powered speakers for medium venues",
      image_url: null, specifications: { specs: ["2,000W each", "Built-in processing", "Bluetooth"], applications: ["Meetings", "Ceremonies"] },
      quantity: 40, is_available: true, is_active: true, display_order: 4, created_at: "", updated_at: "",
    },
  ],
  production: [
    {
      id: "9", category_id: "3", name: "LED Video Wall", description: "High-resolution modular LED display system",
      image_url: null, specifications: { specs: ["4K resolution", "Modular panels", "Indoor/outdoor"], applications: ["Product launches", "Conferences"] },
      quantity: 100, is_available: true, is_active: true, display_order: 1, created_at: "", updated_at: "",
    },
    {
      id: "10", category_id: "3", name: "Projection System", description: "High-lumen projectors for large scale presentations",
      image_url: null, specifications: { specs: ["12,000 lumens", "4K capability", "Multiple formats"], applications: ["Conferences", "Trade shows"] },
      quantity: 15, is_available: true, is_active: true, display_order: 2, created_at: "", updated_at: "",
    },
    {
      id: "11", category_id: "3", name: "Stage & Risers", description: "Modular staging systems in various configurations",
      image_url: null, specifications: { specs: ["Modular design", "Multiple heights", "ADA ramps available"], applications: ["Ceremonies", "Performances"] },
      quantity: 200, is_available: true, is_active: true, display_order: 3, created_at: "", updated_at: "",
    },
    {
      id: "12", category_id: "3", name: "Truss System", description: "Professional aluminum truss for rigging and support",
      image_url: null, specifications: { specs: ["Heavy-duty aluminum", "Various configurations", "Ground support"], applications: ["Lighting rigs", "Scenic elements"] },
      quantity: 300, is_available: true, is_active: true, display_order: 4, created_at: "", updated_at: "",
    },
  ],
}

const defaultCategories: InventoryCategory[] = [
  { id: "1", name: "Lights", slug: "lights", icon: "Lightbulb", description: null, display_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Sound", slug: "sound", icon: "Volume2", description: null, display_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Production", slug: "production", icon: "Monitor", description: null, display_order: 3, is_active: true, created_at: "", updated_at: "" },
]

interface InventoryContentProps {
  categories?: InventoryCategory[]
  inventoryByCategory?: Record<string, InventoryItem[]>
  companyInfo?: CompanyInfo | null
}

function ItemCard({ item, onClick }: { item: InventoryItem; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative flex-shrink-0 w-72 md:w-80 cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-card border border-border"
    >
      <div className="relative h-52 bg-muted overflow-hidden">
        {item.image_url ? (
          <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="320px" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <Monitor className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
      </div>
    </div>
  )
}

export function InventoryContent({ categories, inventoryByCategory, companyInfo }: InventoryContentProps) {
  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories
  const displayInventory = inventoryByCategory && Object.keys(inventoryByCategory).length > 0 ? inventoryByCategory : defaultInventory

  const [activeTab, setActiveTab] = useState(0)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const activeCategory = displayCategories[activeTab]
  const activeItems = activeCategory ? (displayInventory[activeCategory.slug] || []) : []
  const VISIBLE = 3

  const canPrev = carouselIndex > 0
  const canNext = carouselIndex < activeItems.length - VISIBLE

  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    autoPlayRef.current = setInterval(() => {
      setCarouselIndex((prev) => {
        const max = activeItems.length - VISIBLE
        if (max <= 0) return 0
        return prev >= max ? 0 : prev + 1
      })
    }, 3500)
  }, [activeItems.length])

  useEffect(() => {
    setCarouselIndex(0)
    resetAutoPlay()
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current) }
  }, [activeTab, resetAutoPlay])

  const handlePrev = () => {
    setCarouselIndex((p) => Math.max(0, p - 1))
    resetAutoPlay()
  }

  const handleNext = () => {
    setCarouselIndex((p) => Math.min(activeItems.length - VISIBLE, p + 1))
    resetAutoPlay()
  }

  const handleTabChange = (idx: number) => {
    setActiveTab(idx)
    setCarouselIndex(0)
  }

  const getSpecs = (item: InventoryItem) => item.specifications?.specs || []

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-28 overflow-hidden bg-foreground">
        {companyInfo?.inventory_hero_image_url ? (
          <Image
            src={companyInfo.inventory_hero_image_url}
            alt="Inventory hero"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 opacity-10 diagonal-stripes" />
        )}
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <span className="text-primary font-medium tracking-widest text-xs uppercase">All In-House</span>
            <h1 className="text-5xl md:text-6xl font-bold text-background mt-3 mb-5 text-balance">Our Equipment</h1>
            <p className="text-base text-background/70 leading-relaxed max-w-xl">
              Premium lighting, sound, and production equipment — all owned and operated by our expert team for complete quality control.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Tabs + Carousel */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">

          {/* Tab Pills */}
          <div className="flex justify-center mb-14">
            <div className="inline-flex bg-secondary rounded-full p-1 gap-1">
              {displayCategories.map((cat, idx) => {
                const Icon = iconMap[cat.icon] || Lightbulb
                const isActive = activeTab === idx
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleTabChange(idx)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Category heading */}
          {activeCategory && (
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground">{activeCategory.name}</h2>
              {activeCategory.description && (
                <p className="text-muted-foreground mt-2 text-sm">{activeCategory.description}</p>
              )}
            </div>
          )}

          {/* Carousel */}
          <div className="relative">
            {/* Prev button */}
            <button
              onClick={handlePrev}
              disabled={!canPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-4 md:-translate-x-6 w-10 h-10 rounded-full bg-background border border-border shadow-lg flex items-center justify-center disabled:opacity-30 hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="overflow-hidden mx-4">
              <div
                ref={carouselRef}
                className="flex gap-5 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(calc(-${carouselIndex} * (320px + 20px)))` }}
              >
                {activeItems.length > 0 ? (
                  activeItems.map((item) => (
                    <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                  ))
                ) : (
                  <div className="w-full py-20 text-center text-muted-foreground">
                    No items available in this category yet.
                  </div>
                )}
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              disabled={!canNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-4 md:translate-x-6 w-10 h-10 rounded-full bg-background border border-border shadow-lg flex items-center justify-center disabled:opacity-30 hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots */}
          {activeItems.length > VISIBLE && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: activeItems.length - VISIBLE + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCarouselIndex(i); resetAutoPlay() }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === carouselIndex ? "bg-primary w-6" : "bg-border"
                  }`}
                />
              ))}
            </div>
          )}

          {/* View All CTA */}
          <div className="text-center mt-14">
            <Link href="/inventory/all">
              <Button size="lg" className="rounded-full px-10 gap-2 group">
                View All Equipment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why In-House */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-primary font-medium tracking-widest text-xs uppercase">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-foreground mt-3 mb-4">All Equipment In-House</h2>
            <p className="text-muted-foreground leading-relaxed">
              Unlike other event companies, we own all our equipment — better quality, competitive pricing, and reliable service.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { n: "1", title: "Quality Guaranteed", text: "All equipment is maintained and tested by our expert technicians before every event." },
              { n: "2", title: "Competitive Pricing", text: "No middlemen or rental fees — we pass the savings directly to you with transparent pricing." },
              { n: "3", title: "Expert Support", text: "Our skilled technicians are always on-site to ensure flawless setup and operation." },
            ].map((f) => (
              <Card key={f.n} className="p-8 text-center border-0 shadow-md">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl font-bold text-primary">{f.n}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent aria-describedby={undefined} className="max-w-3xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold pr-8">{selectedItem.name}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6 mt-2">
                <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
                  {selectedItem.image_url ? (
                    <Image src={selectedItem.image_url} alt={selectedItem.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Monitor className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">{selectedItem.description}</p>
                  {getSpecs(selectedItem).length > 0 && (
                    <div className="mb-5">
                      <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">Specifications</h4>
                      <ul className="space-y-2">
                        {getSpecs(selectedItem).map((spec, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Link href="/contact">
                    <Button className="w-full rounded-full mt-2">Request Quote</Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
