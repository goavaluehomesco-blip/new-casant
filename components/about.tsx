"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import type { TeamMember } from "@/lib/data/types"

const defaultDirectors = [
  {
    id: "1",
    name: "Rajesh Kumar",
    role: "Founder & CEO",
    image_url: "/placeholder.svg?height=320&width=400",
    bio: "25+ years of experience in event management. Rajesh founded Casant Events with a vision to transform how India celebrates.",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Creative Director",
    image_url: "/placeholder.svg?height=320&width=400",
    bio: "With an eye for design and detail, Priya brings artistic vision to every event, from intimate ceremonies to grand galas.",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "3",
    name: "Amit Patel",
    role: "Technical Director",
    image_url: "/placeholder.svg?height=320&width=400",
    bio: "A pioneer in event technology, Amit oversees all lighting, sound, and production operations with precision.",
    sort_order: 3,
    is_active: true,
  },
]

interface AboutProps {
  teamMembers?: TeamMember[]
}

export function About({ teamMembers }: AboutProps) {
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

  const directors = teamMembers && teamMembers.length > 0 ? teamMembers : defaultDirectors

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-primary font-medium tracking-wide text-sm uppercase">Our Team</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">Meet Our Directors</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The visionaries behind Casant Events - bringing together decades of experience in event management, creative
            design, and technical excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {directors.map((director, index) => (
            <div
              key={director.id}
              className={`overflow-hidden rounded-2xl border border-border bg-background hover:shadow-2xl transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={director.image_url || "/placeholder.svg?height=320&width=400"}
                  alt={director.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
              <div className="p-6 text-center">
                <h4 className="text-xl font-bold text-foreground mb-1">{director.name}</h4>
                <div className="text-primary font-medium mb-4">{director.role}</div>
                <p className="text-muted-foreground text-sm leading-relaxed">{director.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
