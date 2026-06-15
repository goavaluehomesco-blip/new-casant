"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import type { GalleryProject } from "@/lib/data/types"

interface FeaturedWorkProps {
  projects?: GalleryProject[]
}

export function FeaturedWork({ projects }: FeaturedWorkProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const displayProjects = projects && projects.length > 0 ? projects : []

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div
          className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-primary font-medium tracking-wide text-sm uppercase">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">Featured Work</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A glimpse into the unforgettable moments we've helped create.
          </p>
        </div>

        {displayProjects.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            <p className="text-lg">No featured projects yet. Mark projects as featured in the admin panel.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
            {displayProjects.slice(0, 6).map((project, index) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className={`group relative overflow-hidden rounded-xl aspect-[4/3] block transition-all duration-700 shadow-md hover:shadow-xl ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {project.cover_image ? (
                  <Image
                    src={project.cover_image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-bold text-white">{project.title}</h3>
                  {project.location && <p className="text-white/70 text-sm mt-0.5">{project.location}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div
          className={`text-center mt-12 transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            View All Projects
            <span className="text-base">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
