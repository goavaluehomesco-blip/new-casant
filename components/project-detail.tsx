"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, X } from "lucide-react"
import type { GalleryProject, GalleryCategory } from "@/lib/data/types"

interface ProjectDetailProps {
  project: GalleryProject
  category: GalleryCategory | null
  backHref: string
  backLabel: string
}

export function ProjectDetail({ project, category, backHref, backLabel }: ProjectDetailProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const images = project.images || []

  const closeLightbox = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))
  const next = () => setLightboxIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i))

  return (
    <div>
      {/* Hero banner — cover image bleeds behind nav */}
      <section className="relative min-h-[520px] flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {project.cover_image ? (
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            {backLabel}
          </Link>
          <div className="max-w-3xl">
            {category && (
              <span className="text-primary font-medium tracking-wide text-sm uppercase">
                {category.name}
              </span>
            )}
            <h1 className="text-5xl md:text-6xl font-bold text-white mt-3 mb-4 text-balance">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
              {project.location && <span>{project.location}</span>}
              {project.event_date && (
                <span>
                  {new Date(project.event_date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {images.length > 0 && <span>{images.length} photos</span>}
            </div>
            {project.description && (
              <p className="text-white/80 mt-4 leading-relaxed text-lg max-w-xl">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Image Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          {images.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              No photos added yet for this event.
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="w-full block break-inside-avoid overflow-hidden rounded-xl group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Image
                    src={img.image_url}
                    alt={img.caption || `${project.title} photo ${idx + 1}`}
                    width={600}
                    height={400}
                    className="w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[lightboxIndex]?.image_url}
            alt={images[lightboxIndex]?.caption || `Photo ${lightboxIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {lightboxIndex < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-6 w-6 rotate-180" />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  )
}
