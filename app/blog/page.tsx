import { NavigationWrapper } from "@/components/navigation-wrapper"
import { Footer } from "@/components/footer"
import { BlogListContent } from "@/components/blog-list-content"
import { getAllBlogPosts, getCompanyInfo } from "@/lib/data/queries"

export const metadata = {
  title: "Blog - Casant Events",
  description: "Stories, planning tips, and behind-the-scenes moments from Casant Events.",
}

export default async function BlogPage() {
  const [posts, companyInfo, navigation] = await Promise.all([
    getAllBlogPosts(),
    getCompanyInfo(),
    NavigationWrapper({ variant: "dark" }),
  ])

  return (
    <main className="min-h-screen">
      {navigation}
      <BlogListContent posts={posts} />
      <Footer companyInfo={companyInfo} />
    </main>
  )
}
