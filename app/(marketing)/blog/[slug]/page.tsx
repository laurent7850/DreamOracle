import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import { Moon, ArrowLeft, Calendar, Clock } from "lucide-react"
import type { Metadata } from "next"
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd"

export const dynamic = "force-dynamic"

async function getPost(slug: string) {
  try {
    return await prisma.blogPost.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
    })
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Article introuvable" }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || undefined,
    alternates: {
      canonical: `https://dreamoracle.eu/blog/${slug}`,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      url: `https://dreamoracle.eu/blog/${slug}`,
      ...(post.featuredImage ? { images: [post.featuredImage] } : {}),
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-night">
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: "https://dreamoracle.eu" },
          { name: "Blog", url: "https://dreamoracle.eu/blog" },
          { name: post.title, url: `https://dreamoracle.eu/blog/${slug}` },
        ]}
      />
      <ArticleJsonLd
        title={post.title}
        description={post.metaDescription || undefined}
        url={`https://dreamoracle.eu/blog/${slug}`}
        publishedTime={post.publishedAt?.toISOString()}
        modifiedTime={post.updatedAt?.toISOString()}
        image={post.featuredImage || undefined}
      />
      {/* Navigation */}
      <nav className="border-b border-mystic-900/30 bg-night/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Moon className="h-6 w-6 text-mystic-400" />
            <span className="font-display text-xl text-lunar">DreamOracle</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/blog"
              className="text-sm text-lunar/70 transition-colors hover:text-mystic-300"
            >
              Blog
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-mystic-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-mystic-500"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-lunar/50 transition-colors hover:text-mystic-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au blog
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight text-lunar sm:text-4xl">
              {post.title}
            </h1>
            {post.metaDescription && (
              <p className="mt-4 font-body text-lg leading-relaxed text-lunar/50">
                {post.metaDescription}
              </p>
            )}
            <div className="mt-6 flex items-center gap-4 text-sm text-lunar/40">
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
              {post.wordCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {Math.ceil(post.wordCount / 200)} min de lecture
                </span>
              )}
            </div>
          </header>

          {post.featuredImage && (
            <div className="relative mb-8 overflow-hidden rounded-2xl" style={{ maxHeight: '400px' }}>
              <Image
                src={post.featuredImage}
                alt={post.title}
                width={768}
                height={400}
                className="w-full object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          <div className="border-t border-mystic-900/20 pt-8">
            <div
              className="prose prose-lg prose-invert max-w-none prose-headings:font-display prose-headings:text-lunar prose-p:font-body prose-p:text-lunar/70 prose-a:text-mystic-400 prose-strong:text-lunar prose-li:text-lunar/70 prose-hr:border-mystic-900/20"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>
        </article>

        <div className="mt-12 border-t border-mystic-900/20 pt-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-mystic-400 transition-colors hover:text-mystic-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Voir tous les articles
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/symbols"
              className="text-mystic-400 transition-colors hover:text-mystic-300"
            >
              Dictionnaire des symboles
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-mystic-600 px-4 py-2 text-white transition-colors hover:bg-mystic-500"
            >
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-mystic-900/20 bg-night-dark py-8">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-body text-sm text-lunar/40">
            &copy; {new Date().getFullYear()} DreamOracle. Tous droits reserves.
          </p>
        </div>
      </footer>
    </div>
  )
}
