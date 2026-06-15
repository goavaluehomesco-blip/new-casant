import { notFound } from "next/navigation"
import { getProjectBySlug, getGalleryCategoryBySlug } from "@/lib/data/queries"
import { ProjectDetail } from "@/components/project-detail"

export default async function CorporateProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [project, category] = await Promise.all([
    getProjectBySlug(slug),
    getGalleryCategoryBySlug("corporate"),
  ])

  if (!project) notFound()

  return <ProjectDetail project={project} category={category} backHref="/corporate" backLabel="Back to Corporate Events" />
}
