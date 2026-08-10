import Link from "next/link"
import { ArrowRight, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LifeAtCasantImage } from "@/lib/data/types"

interface LifeAtCasantTeaserProps {
  images: LifeAtCasantImage[]
}

export function LifeAtCasantTeaser({ images }: LifeAtCasantTeaserProps) {
  if (!images || images.length === 0) return null

  const preview = images.slice(0, 5)

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <span className="text-primary font-medium tracking-wide text-sm uppercase">Behind The Scenes</span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-4 text-balance">
              Life at Casant
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The late nights, the team huddles, the small wins — a look at the people and moments that make
              Casant Events what it is.
            </p>
          </div>
          <Link href="/life-at-casant" className="shrink-0">
            <Button variant="outline" className="rounded-full gap-2">
              View Full Gallery
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <Link
          href="/life-at-casant"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-6xl mx-auto group"
          aria-label="View the full Life at Casant gallery"
        >
          {preview.map((image, index) => (
            <div
              key={image.id}
              className={`relative overflow-hidden rounded-xl bg-secondary ${
                index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.image_url}
                alt={image.caption || "Life at Casant"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              {image.caption && index === 0 && (
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent flex items-end p-4">
                  <p className="text-background text-sm font-medium leading-snug">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
          {preview.length < 5 &&
            Array.from({ length: 5 - preview.length }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="aspect-square rounded-xl bg-secondary flex items-center justify-center"
              >
                <ImageIcon className="w-6 h-6 text-muted-foreground/30" />
              </div>
            ))}
        </Link>
      </div>
    </section>
  )
}
