import Link from "next/link"
import { notFound } from "next/navigation"
import { getProjectBySlug } from "@/lib/data/queries"

interface PortfolioProjectPageProps {
  params: Promise<{ slug: string }>
}

export default async function PortfolioProjectPage({ params }: PortfolioProjectPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project || !project.is_active) notFound()

  const images = project.images?.length ? project.images : project.cover_image ? [{ id: `${project.id}-cover`, image_url: project.cover_image, caption: null }] : []

  return (
    <main className="min-h-screen bg-background py-32">
      <article className="container mx-auto max-w-6xl px-6">
        <Link href="/portfolio" className="text-sm font-medium text-primary hover:underline">← Back to portfolio</Link>
        <header className="mt-8 max-w-3xl">
          <span className="text-sm font-medium uppercase tracking-wide text-primary">Portfolio</span>
          <h1 className="mt-3 text-4xl font-bold text-foreground md:text-6xl">{project.title}</h1>
          {project.location && <p className="mt-3 text-lg text-muted-foreground">{project.location}</p>}
          {project.description && <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{project.description}</p>}
        </header>
        {images.length > 0 && (
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {images.map((image) => (
              <figure key={image.id} className="overflow-hidden rounded-xl bg-muted">
                <img src={image.image_url} alt={image.caption || project.title} className="w-full object-cover" />
                {image.caption && <figcaption className="p-3 text-sm text-muted-foreground">{image.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </article>
    </main>
  )
}
