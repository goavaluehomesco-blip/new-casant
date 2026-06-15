import { notFound } from "next/navigation"
import { getProjectBySlug, getGalleryCategoryBySlug } from "@/lib/data/queries"
import { ProjectDetail } from "@/components/project-detail"

export default async function WeddingProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [project, category] = await Promise.all([
    getProjectBySlug(slug),
    getGalleryCategoryBySlug("weddings"),
  ])

  if (!project) notFound()

  return <ProjectDetail project={project} category={category} backHref="/weddings" backLabel="Back to Weddings" />
}
