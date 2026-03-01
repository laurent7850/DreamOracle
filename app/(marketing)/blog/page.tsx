import Link from "next/link"
import type { Metadata } from "next"
import { prisma } from "@/lib/db"
import { Moon, Calendar, Clock, ArrowRight, BookOpen } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Blog - DreamOracle",
  description:
    "Articles, guides et insights sur l'interpretation des reves, la symbolique onirique et le developpement personnel.",
}

async function getPublishedPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 50,
    })
    return posts
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="min-h-screen bg-night">
      {/* Navigation */}
      <nav className="border-b border-mystic-900/30 bg-night/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Moon className="h-6 w-6 text-mystic-400" />
            <span className="font-display text-xl text-lunar">DreamOracle</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-lunar/70 transition-colors hover:text-mystic-300"
            >
              Accueil
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-lunar/70 transition-colors hover:text-mystic-300"
            >
              Tarifs
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

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-mystic-900/20">
        <div className="absolute inset-0 bg-gradient-to-b from-mystic-950/40 to-night" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-mystic-700/30 bg-mystic-950/50 px-4 py-1.5 text-sm font-medium text-mystic-300">
              <BookOpen className="h-4 w-4" />
              Blog
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-lunar sm:text-5xl">
              Explorez le monde des{" "}
              <span className="bg-gradient-to-r from-mystic-400 to-mystic-300 bg-clip-text text-transparent">
                reves
              </span>
            </h1>
            <p className="mt-6 font-body text-lg leading-8 text-lunar/60">
              Articles et guides sur l&apos;interpretation des reves, la
              symbolique onirique et le developpement personnel.
            </p>
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="py-16 text-center">
              <Moon className="mx-auto h-12 w-12 text-mystic-800" />
              <p className="mt-4 font-body text-lunar/50">
                Aucun article publie pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-mystic-900/30 bg-night-light transition-all hover:-translate-y-1 hover:border-mystic-700/50 hover:shadow-lg hover:shadow-mystic-900/20"
                >
                  {post.featuredImage ? (
                    <div className="h-48 overflow-hidden rounded-t-2xl">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center rounded-t-2xl bg-gradient-to-br from-mystic-950 to-night-light">
                      <Moon className="h-16 w-16 text-mystic-800 transition-colors group-hover:text-mystic-500" />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-lg font-semibold text-lunar transition-colors group-hover:text-mystic-300 line-clamp-2">
                      {post.title}
                    </h2>

                    {post.metaDescription && (
                      <p className="mt-2 flex-1 font-body text-sm text-lunar/50 line-clamp-3">
                        {post.metaDescription}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-mystic-900/20 pt-4">
                      <div className="flex items-center gap-4 text-xs text-lunar/40">
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(post.publishedAt).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        )}
                        {post.wordCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {Math.ceil(post.wordCount / 200)} min
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 text-xs font-medium text-mystic-400 opacity-0 transition-opacity group-hover:opacity-100">
                        Lire
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
