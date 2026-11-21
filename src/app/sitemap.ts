import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const staticUrls: MetadataRoute.Sitemap = [
  { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
  { url: `${SITE_URL}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [products, categories, brands, sellers] = await Promise.all([
      prisma.product.findMany({
        where: { status: "ACTIVE", seller: { status: "APPROVED" } },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.brand.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.seller.findMany({
        where: { status: "APPROVED" },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticUrls,
      ...products.map((item) => ({
        url: `${SITE_URL}/produk/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...categories.map((item) => ({
        url: `${SITE_URL}/kategori/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...brands.map((item) => ({
        url: `${SITE_URL}/brand/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...sellers.map((item) => ({
        url: `${SITE_URL}/toko/${item.slug}`,
        lastModified: item.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticUrls;
  }
}
