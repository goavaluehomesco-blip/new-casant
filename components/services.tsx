"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Service } from "@/lib/data/types"
import { Lightbulb, Volume2, Monitor, Heart, Building2, Star, Camera, Music } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Volume2,
  Monitor,
  Heart,
  Building2,
  Star,
  Camera,
  Music,
}

const defaultServices = [
  {
    id: "1",
    icon: "Lightbulb",
    title: "Lighting",
    description:
      "State-of-the-art LED, moving heads, and ambient lighting solutions for any venue. All equipment owned and operated by our expert team.",
    image_url: "/placeholder.svg?height=224&width=400",
    link: "/inventory",
    is_active: true,
    sort_order: 1,
  },
  {
    id: "2",
    icon: "Volume2",
    title: "Sound",
    description:
      "Crystal-clear audio systems from intimate gatherings to large-scale concerts. Premium speakers, mixers, and wireless microphones.",
    image_url: "/placeholder.svg?height=224&width=400",
    link: "/inventory",
    is_active: true,
    sort_order: 2,
  },
  {
    id: "3",
    icon: "Monitor",
    title: "Production",
    description:
      "Complete production services including LED walls, staging, truss systems, and technical direction. End-to-end event production.",
    image_url: "/placeholder.svg?height=224&width=400",
    link: "/inventory",
    is_active: true,
    sort_order: 3,
  },
]

interface ServicesProps {
  services?: Service[]
}

export function Services({ services }: ServicesProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const displayServices = services && services.length > 0 ? services : defaultServices

  return (
    <section ref={sectionRef} className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-primary font-medium tracking-wide text-sm uppercase">All In-House</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">Our Services</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Everything under one roof. We own all our equipment and employ skilled technicians, ensuring quality control
            and competitive pricing for your events.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayServices.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Lightbulb
            return (
              <Link key={service.id} href={service.link || "/inventory"}>
                <div
                  className={`group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 h-full rounded-2xl border border-border bg-background ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="relative h-56 overflow-hidden rounded-t-2xl">
                    <Image
                      src={service.image_url || "/placeholder.svg?height=224&width=400"}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                      <div className="p-3 bg-primary rounded-full">
                        <IconComponent className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
