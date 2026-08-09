import { notFound } from "next/navigation"
import { NavigationWrapper } from "@/components/navigation-wrapper"
import { Footer } from "@/components/footer"
import { BlogPostContent } from "@/components/blog-post-content"
import { getBlogPostBySlug, getCompanyInfo } from "@/lib/data/queries"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: "Blog - Casant Events" }
  return {
    title: `${post.title} - Casant Events`,
    description: post.description || undefined,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [post, companyInfo, navigation] = await Promise.all([
    getBlogPostBySlug(slug),
    getCompanyInfo(),
    NavigationWrapper({ variant: "dark" }),
  ])

  if (!post) notFound()

  return (
    <main className="min-h-screen">
      {navigation}
      <BlogPostContent post={post} />
      <Footer companyInfo={companyInfo} />
    </main>
  )
}
