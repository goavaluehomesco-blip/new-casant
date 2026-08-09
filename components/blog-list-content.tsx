import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, ImageIcon } from "lucide-react"
import type { BlogPost } from "@/lib/data/types"

interface BlogListContentProps {
  posts: BlogPost[]
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function BlogListContent({ posts }: BlogListContentProps) {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">From The Journal</p>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">Stories &amp; Insights</h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
            Behind-the-scenes moments, planning tips, and highlights from our recent events.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-muted-foreground">No stories published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const collage = post.images?.length ? post.images : post.cover_image ? [post.cover_image] : []
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
                      {collage.length >= 3 ? (
                        <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-full">
                          <div className="relative row-span-2">
                            <Image
                              src={collage[0]}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                          <div className="relative">
                            <Image
                              src={collage[1]}
                              alt=""
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 50vw, 16vw"
                            />
                          </div>
                          <div className="relative">
                            <Image
                              src={collage[2]}
                              alt=""
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 50vw, 16vw"
                            />
                          </div>
                        </div>
                      ) : collage.length > 0 ? (
                        <Image
                          src={collage[0]}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    <div className="flex flex-col flex-1 p-6">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.created_at)}
                      </span>
                      <h2 className="font-bold text-foreground text-lg leading-snug text-balance group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      {post.description && (
                        <p className="text-muted-foreground text-sm mt-2 leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        Read Story
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
