import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar } from "lucide-react"
import type { BlogPost } from "@/lib/data/types"

interface BlogPostContentProps {
  post: BlogPost
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const collage = post.images?.length ? post.images : post.cover_image ? [post.cover_image] : []

  return (
    <article className={post.hero_image ? "" : "pt-20"}>
      {/* Hero image */}
      {post.hero_image && (
        <section className="relative w-full h-[52vh] md:h-[70vh] min-h-[320px] max-h-[720px] overflow-hidden">
          <Image
            src={post.hero_image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-black/25" />
        </section>
      )}

      {/* Header */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Journal
          </Link>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            {formatDate(post.created_at)}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground text-balance leading-tight">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-muted-foreground text-lg mt-5 leading-relaxed">{post.description}</p>
          )}
        </div>
      </section>

      {/* Collage */}
      {collage.length > 0 && (
        <section className="py-10">
          <div className="container mx-auto px-6 max-w-3xl">
            {collage.length === 1 ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-border">
                <Image src={collage[0]} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {collage.map((url, i) => (
                  <div
                    key={i}
                    className={`relative rounded-2xl overflow-hidden border border-border ${
                      collage.length === 3 && i === 0 ? "col-span-2 aspect-video" : "aspect-square"
                    }`}
                  >
                    <Image src={url} alt={`${post.title} ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 384px" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Content blocks */}
      <section className="py-6 pb-24">
        <div className="container mx-auto px-6 max-w-3xl space-y-8">
          {post.content_blocks?.map((block, i) => {
            if (block.type === "text") {
              return (
                <p key={i} className="text-foreground/85 text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {block.value}
                </p>
              )
            }
            if (block.type === "image") {
              return (
                <figure key={i}>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-border">
                    <Image src={block.url} alt={block.caption || post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
                  </div>
                  {block.caption && (
                    <figcaption className="text-center text-sm text-muted-foreground mt-3">{block.caption}</figcaption>
                  )}
                </figure>
              )
            }
            return null
          })}
        </div>
      </section>
    </article>
  )
}
