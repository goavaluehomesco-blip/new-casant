import { NavigationWrapper } from "@/components/navigation-wrapper"
import { Footer } from "@/components/footer"
import { getFeaturedProjects } from "@/lib/data/queries"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Portfolio | Casant Events",
  description: "Explore our full collection of event productions — weddings, corporate events, and more.",
}

export default async function PortfolioPage() {
  const [projects, navigation] = await Promise.all([
    getFeaturedProjects(),
    NavigationWrapper({}),
  ])

  // Collect ALL images from all featured projects
  const allImages: { url: string; caption: string; projectTitle: string; projectSlug: string }[] = []
  for (const project of projects) {
    if (project.images && project.images.length > 0) {
      for (const img of project.images) {
        allImages.push({
          url: img.image_url,
          caption: img.caption || project.title,
          projectTitle: project.title,
          projectSlug: project.slug,
        })
      }
    } else if (project.cover_image) {
      allImages.push({
        url: project.cover_image,
        caption: project.title,
        projectTitle: project.title,
        projectSlug: project.slug,
      })
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {navigation}

      {/* Hero banner */}
      <section className="relative pt-40 pb-20 bg-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/80" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="text-primary font-medium tracking-widest text-sm uppercase">Portfolio</span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mt-4 mb-6 text-balance">
            All Projects
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Every frame tells a story. Explore the moments we've had the honour of creating.
          </p>
        </div>
      </section>

      {/* Masonry image grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {allImages.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">
                No featured images yet. Mark projects as featured and add images in the admin panel.
              </p>
              <Link href="/admin/weddings" className="text-primary underline mt-4 inline-block">
                Go to Admin
              </Link>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-sm mb-8 text-center">
                {allImages.length} photos across {projects.length} featured {projects.length === 1 ? "project" : "projects"}
              </p>
              {/* CSS columns masonry */}
              <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
                {allImages.map((img, i) => (
                  <div
                    key={i}
                    className="break-inside-avoid group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <Image
                      src={img.url}
                      alt={img.caption}
                      width={600}
                      height={400}
                      className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white text-sm font-medium leading-tight">{img.projectTitle}</p>
                      {img.caption !== img.projectTitle && (
                        <p className="text-white/70 text-xs mt-0.5">{img.caption}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
