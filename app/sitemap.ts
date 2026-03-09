import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dreamoracle.eu";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: "2026-02-26",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: "2026-02-06",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: "2026-02-17",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cgv`,
      lastModified: "2026-02-06",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: "2026-02-06",
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true, publishedAt: true },
    });
    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: (post.updatedAt || post.publishedAt || new Date()).toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB not available at build time, skip blog posts
  }

  return [...staticPages, ...blogPages];
}
