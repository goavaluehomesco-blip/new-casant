"use client"

import type React from "react"
import { useState } from "react"
import { Lightbulb, Volume2, Monitor, ArrowLeft, Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { InventoryCategory, InventoryItem } from "@/lib/data/types"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb, Volume2, Monitor,
  lightbulb: Lightbulb, speaker: Volume2, video: Monitor,
}

const defaultInventory: Record<string, InventoryItem[]> = {
  lights: [
    { id: "1", category_id: "1", name: "LED Par Lights", description: "High-output RGB LED par lights for stage and ambient lighting", image_url: null, specifications: { specs: ["RGBW color mixing", "300W output", "DMX control"] }, quantity: 50, is_available: true, is_active: true, display_order: 1, created_at: "", updated_at: "" },
    { id: "2", category_id: "1", name: "Moving Head Spotlights", description: "Professional moving head fixtures for dynamic lighting effects", image_url: null, specifications: { specs: ["360° pan/tilt", "Gobo patterns", "Prism effects"] }, quantity: 30, is_available: true, is_active: true, display_order: 2, created_at: "", updated_at: "" },
    { id: "3", category_id: "1", name: "Pin Spot Lights", description: "Focused beam lights ideal for highlighting centerpieces", image_url: null, specifications: { specs: ["Narrow beam", "LED tech", "Multiple colors"] }, quantity: 100, is_available: true, is_active: true, display_order: 3, created_at: "", updated_at: "" },
    { id: "4", category_id: "1", name: "String & Fairy Lights", description: "Elegant overhead lighting for magical ambiance", image_url: null, specifications: { specs: ["Edison bulbs", "Weatherproof", "Warm white glow"] }, quantity: 200, is_available: true, is_active: true, display_order: 4, created_at: "", updated_at: "" },
  ],
  sound: [
    { id: "5", category_id: "2", name: "Line Array System", description: "Premium sound system for large venues and outdoor events", image_url: null, specifications: { specs: ["15,000W power", "500-person coverage", "Digital processing"] }, quantity: 10, is_available: true, is_active: true, display_order: 1, created_at: "", updated_at: "" },
    { id: "6", category_id: "2", name: "Wireless Microphones", description: "Professional wireless microphone systems", image_url: null, specifications: { specs: ["UHF frequency", "Long battery life", "Multiple channels"] }, quantity: 50, is_available: true, is_active: true, display_order: 2, created_at: "", updated_at: "" },
    { id: "7", category_id: "2", name: "DJ Equipment Package", description: "Complete DJ setup with mixers and controllers", image_url: null, specifications: { specs: ["Pioneer CDJ players", "4-channel mixer", "Effect processors"] }, quantity: 5, is_available: true, is_active: true, display_order: 3, created_at: "", updated_at: "" },
    { id: "8", category_id: "2", name: "Powered Speakers", description: "Versatile powered speakers for medium venues", image_url: null, specifications: { specs: ["2,000W each", "Built-in processing", "Bluetooth"] }, quantity: 40, is_available: true, is_active: true, display_order: 4, created_at: "", updated_at: "" },
  ],
  production: [
    { id: "9", category_id: "3", name: "LED Video Wall", description: "High-resolution modular LED display system", image_url: null, specifications: { specs: ["4K resolution", "Modular panels", "Indoor/outdoor"] }, quantity: 100, is_available: true, is_active: true, display_order: 1, created_at: "", updated_at: "" },
    { id: "10", category_id: "3", name: "Projection System", description: "High-lumen projectors for large scale presentations", image_url: null, specifications: { specs: ["12,000 lumens", "4K capability", "Multiple formats"] }, quantity: 15, is_available: true, is_active: true, display_order: 2, created_at: "", updated_at: "" },
    { id: "11", category_id: "3", name: "Stage & Risers", description: "Modular staging systems in various configurations", image_url: null, specifications: { specs: ["Modular design", "Multiple heights", "ADA ramps"] }, quantity: 200, is_available: true, is_active: true, display_order: 3, created_at: "", updated_at: "" },
    { id: "12", category_id: "3", name: "Truss System", description: "Professional aluminum truss for rigging and support", image_url: null, specifications: { specs: ["Heavy-duty aluminum", "Various configs", "Ground support"] }, quantity: 300, is_available: true, is_active: true, display_order: 4, created_at: "", updated_at: "" },
  ],
}

const defaultCategories: InventoryCategory[] = [
  { id: "1", name: "Lights", slug: "lights", icon: "Lightbulb", description: "Professional stage and event lighting", display_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Sound", slug: "sound", icon: "Volume2", description: "High-quality audio and sound systems", display_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Production", slug: "production", icon: "Monitor", description: "Staging, LED walls, and production equipment", display_order: 3, is_active: true, created_at: "", updated_at: "" },
]

interface AllEquipmentContentProps {
  categories?: InventoryCategory[]
  inventoryByCategory?: Record<string, InventoryItem[]>
}

export function AllEquipmentContent({ categories, inventoryByCategory }: AllEquipmentContentProps) {
  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories
  const displayInventory = inventoryByCategory && Object.keys(inventoryByCategory).length > 0 ? inventoryByCategory : defaultInventory

  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState("")
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  const activeCategory = displayCategories[activeTab]
  const allItems = activeCategory ? (displayInventory[activeCategory.slug] || []) : []
  const filteredItems = search.trim()
    ? allItems.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase()))
    : allItems

  return (
    <div className="pt-20">
      {/* Header bar */}
      <section className="bg-foreground py-16">
        <div className="container mx-auto px-6">
          <Link href="/inventory" className="inline-flex items-center gap-2 text-background/60 hover:text-background text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Equipment
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-background mb-3 text-balance">All Equipment</h1>
          <p className="text-background/60 text-sm max-w-xl">
            Complete catalog of in-house equipment — owned and operated by our expert team.
          </p>
        </div>
      </section>

      {/* Sticky tab + search bar */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          {/* Tab pills */}
          <div className="inline-flex bg-secondary rounded-full p-1 gap-1">
            {displayCategories.map((cat, idx) => {
              const Icon = iconMap[cat.icon] || Lightbulb
              const isActive = activeTab === idx
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveTab(idx); setSearch("") }}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                    isActive ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              )
            })}
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-full h-9 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-12 bg-background min-h-[60vh]">
        <div className="container mx-auto px-6">
          {/* Category meta */}
          {activeCategory && (
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{activeCategory.name}</h2>
                {activeCategory.description && <p className="text-muted-foreground text-sm mt-0.5">{activeCategory.description}</p>}
              </div>
              <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              {search ? `No results for "${search}"` : "No equipment in this category yet."}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer overflow-hidden border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 rounded-xl p-0"
                >
                  {/* Image */}
                  <div className="relative h-36 bg-muted overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <Monitor className="w-10 h-10 text-muted-foreground/25" />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-3">Need Custom Equipment?</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto text-sm">
            Can't find what you're looking for? We source specialized equipment for unique events.
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="rounded-full px-10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>

      {/* Item dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent aria-describedby={undefined} className="max-w-lg">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold pr-8">{selectedItem.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                  {selectedItem.image_url ? (
                    <img src={selectedItem.image_url} alt={selectedItem.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Monitor className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{selectedItem.description}</p>
                {(selectedItem.specifications?.specs || []).length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">Specifications</h4>
                    <ul className="space-y-1.5">
                      {(selectedItem.specifications?.specs || []).map((s, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Link href="/contact">
                  <Button className="w-full rounded-full">Request Quote</Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
