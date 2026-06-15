"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { GalleryProject, GalleryCategory } from "@/lib/data/types"

interface WeddingsContentProps {
  projects?: GalleryProject[]
  category?: GalleryCategory | null
}

export function WeddingsContent({ projects, category }: WeddingsContentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const displayProjects = projects && projects.length > 0 ? projects : []

  return (
    <div>
      {/* Hero / Banner — bleeds behind fixed nav */}
      <section className="relative py-32 overflow-hidden min-h-[480px] flex items-end pb-20">
        <div className="absolute inset-0 z-0">
          {category?.image_url ? (
            <Image src={category.image_url} alt="Wedding Celebration" fill className="object-cover" sizes="100vw" priority />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <span className="text-primary font-medium tracking-wide text-sm uppercase">Wedding Gallery</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mt-4 mb-6 text-balance">
              {category?.name || "Wedding Events"}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              {category?.description || "Beautiful wedding celebrations we have had the honor of creating."}
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section ref={sectionRef} className="py-24 bg-background">
        <div className="container mx-auto px-6">
          {displayProjects.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              No wedding events yet. Add some from the admin panel.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {displayProjects.map((project, index) => (
                <Link key={project.id} href={`/weddings/${project.slug}`}>
                  <div
                    className={`group relative h-72 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Image
                      src={project.cover_image || `/placeholder.svg?height=288&width=400`}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                      {project.location && <p className="text-white/75 text-sm">{project.location}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
