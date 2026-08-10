import { NavigationWrapper } from "@/components/navigation-wrapper"
import { Footer } from "@/components/footer"
import { getActiveLifeAtCasantImages, getCompanyInfo } from "@/lib/data/queries"
import { ImageIcon } from "lucide-react"

export const metadata = {
  title: "Life at Casant - Casant Events",
  description: "A look behind the scenes at the people and moments that make Casant Events what it is.",
}

export default async function LifeAtCasantPage() {
  const [images, companyInfo, navigation] = await Promise.all([
    getActiveLifeAtCasantImages(),
    getCompanyInfo(),
    NavigationWrapper({ variant: "dark" }),
  ])

  return (
    <main className="min-h-screen">
      {navigation}

      <section className="relative pt-40 pb-20 bg-foreground">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl">
            <span className="text-primary font-medium tracking-wide text-sm uppercase">Behind The Scenes</span>
            <h1 className="text-5xl md:text-6xl font-bold text-background mt-4 mb-6 text-balance">
              Life at Casant
            </h1>
            <p className="text-lg text-background/70 leading-relaxed">
              The late nights, the team huddles, the small wins — a look at the people and moments that make
              Casant Events what it is.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          {images.length === 0 ? (
            <div className="max-w-6xl mx-auto text-center py-24 border border-dashed border-border rounded-2xl">
              <ImageIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">More moments coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {images.map((image) => (
                <figure
                  key={image.id}
                  className="group relative overflow-hidden rounded-2xl bg-secondary aspect-[4/5]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.image_url}
                    alt={image.caption || "Life at Casant"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {image.caption && (
                    <figcaption className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/0 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-background text-sm font-medium leading-snug">{image.caption}</p>
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer companyInfo={companyInfo} />
    </main>
  )
}
