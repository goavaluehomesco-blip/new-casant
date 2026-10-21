import Link from "next/link"
import { getFeaturedProjects } from "@/lib/data/queries"

export const metadata = {
  title: "Portfolio - Casant Events",
  description: "Explore Casant Events projects and celebrations.",
}

export default async function PortfolioPage() {
  const projects = await getFeaturedProjects()

  return (
    <main className="min-h-screen bg-background py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-primary font-medium tracking-wide text-sm uppercase">Portfolio</span>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mt-4 mb-6">Featured Work</h1>
          <p className="text-lg text-muted-foreground">A glimpse into the unforgettable moments we&apos;ve helped create.</p>
        </div>
        {projects.length === 0 ? (
          <p className="text-center text-muted-foreground">No projects are available yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const image = project.cover_image || project.images?.[0]?.image_url
              return (
                <Link key={project.id} href={`/portfolio/${project.slug}`} className="group overflow-hidden rounded-xl border bg-card">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {image ? <img src={image} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-foreground">{project.title}</h2>
                    {project.location && <p className="mt-1 text-sm text-muted-foreground">{project.location}</p>}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
