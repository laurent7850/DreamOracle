import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const WEBHOOK_SECRET = process.env.BLOG_WEBHOOK_SECRET || "seopilot-dreamoracle-secret-2026"

// GET: list published blog posts
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 50,
    })
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Blog GET error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// POST: receive article from SEOPilot
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, content, metaTitle, metaDescription, wordCount } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, content" },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.upsert({
      where: { slug },
      update: {
        title,
        content,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        wordCount: wordCount || 0,
        status: "PUBLISHED",
      },
      create: {
        title,
        slug,
        content,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        wordCount: wordCount || 0,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error("Blog POST error:", error)
    return NextResponse.json(
      { error: "Failed to create post", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}
