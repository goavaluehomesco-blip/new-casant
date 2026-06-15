"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import type { TeamMember, CompanyInfo } from "@/lib/data/types"

const defaultDirectors: TeamMember[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    role: "Founder & CEO",
    image_url: "/indian-businessman-portrait-professional.jpg",
    bio: "25+ years of experience in event management. Rajesh founded Casant Events with a vision to transform how India celebrates.",
    email: null,
    phone: null,
    linkedin: null,
    display_order: 1,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Creative Director",
    image_url: "/indian-businesswoman-portrait-professional-smiling.jpg",
    bio: "With an eye for design and detail, Priya brings artistic vision to every event, from intimate ceremonies to grand galas.",
    email: null,
    phone: null,
    linkedin: null,
    display_order: 2,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    name: "Amit Patel",
    role: "Technical Director",
    image_url: "/indian-man-portrait-formal-professional.jpg",
    bio: "A pioneer in event technology, Amit oversees all lighting, sound, and production operations with precision.",
    email: null,
    phone: null,
    linkedin: null,
    display_order: 3,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
]

interface AboutContentProps {
  teamMembers?: TeamMember[]
  companyInfo?: CompanyInfo | null
}

export function AboutContent({ teamMembers, companyInfo }: AboutContentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const directors = teamMembers && teamMembers.length > 0 ? teamMembers : defaultDirectors
  const yearsInBusiness = companyInfo?.years_experience || 25

  const milestones = [
    { year: "1998", event: "Casant Events founded with a small lighting inventory" },
    { year: "2005", event: "Expanded to include professional sound systems" },
    { year: "2010", event: "Launched full production services with LED video walls" },
    { year: "2015", event: "Opened state-of-the-art warehouse facility" },
    { year: "2020", event: "Completed 1000+ successful events milestone" },
    { year: "2023", event: `Celebrating ${yearsInBusiness} years of excellence` },
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/event-team-working-behind-scenes.jpg"
            alt="Casant Events Team"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/50" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <span className="text-primary font-medium tracking-wide text-sm uppercase">Our Story</span>
            <h1 className="text-5xl md:text-6xl font-bold text-background mt-4 mb-6">
              About {companyInfo?.name || "Casant Events"}
            </h1>
            <p className="text-lg text-background/80 leading-relaxed">
              {companyInfo?.tagline ||
                "For over 25 years, we've been transforming visions into unforgettable experiences. From humble beginnings to becoming one of India's premier event production companies."}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section ref={sectionRef} className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <div
              className={`transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
              }`}
            >
              <span className="text-primary font-medium tracking-wide text-sm uppercase">Since 1998</span>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                {yearsInBusiness} Years of Creating Memories
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {companyInfo?.about_full ||
                  "Casant Events was born from a passion for bringing celebrations to life. What started as a small lighting rental service in Mumbai has grown into a comprehensive event production company serving clients across India."}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Today, we own one of the largest inventories of professional event equipment in the region. Our in-house
                team of technicians, designers, and coordinators work together to deliver exceptional experiences for
                every client.
              </p>

              <div className="space-y-4">
                {[
                  "100% In-house equipment - no rentals",
                  "Expert technicians with 10+ years experience",
                  "End-to-end event production services",
                  `Trusted by ${companyInfo?.hotels_count || 100}+ hotels and venues`,
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
              }`}
            >
              <div className="relative">
                <Image
                  src="/event-setup-behind-scenes-team.jpg"
                  alt="Casant Events Setup"
                  width={600}
                  height={600}
                  className="rounded-2xl shadow-2xl w-full h-auto"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                />
                <div className="absolute -bottom-8 -left-8 bg-primary text-primary-foreground p-8 rounded-2xl shadow-xl">
                  <div className="text-5xl font-bold">{yearsInBusiness}+</div>
                  <div className="text-sm font-medium">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-primary font-medium tracking-wide text-sm uppercase">Our Journey</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4">Milestones</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2" />

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center gap-8 mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                    <div className="text-3xl font-bold text-primary mb-2">{milestone.year}</div>
                    <p className="text-muted-foreground">{milestone.event}</p>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background" />
                  <div className="w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Directors */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-primary font-medium tracking-wide text-sm uppercase">Leadership</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">Meet Our Directors</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The visionaries behind Casant Events - bringing together decades of experience in event management,
              creative design, and technical excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {directors.map((director) => (
              <div
                key={director.id}
                className="overflow-hidden rounded-2xl border border-border shadow-xl hover:shadow-2xl transition-all duration-500"
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

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">Ready to Work With Us?</h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Let's create something extraordinary together. Contact us today to discuss your next event.
          </p>
          <Link href="/#contact">
            <Button size="lg" variant="secondary" className="rounded-full px-10">
              Get In Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
