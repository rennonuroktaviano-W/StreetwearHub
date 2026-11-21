import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ListingPage } from "@/components/catalog-listing";
import type { RawSearchParams } from "@/lib/catalog";

export const instant = false;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await prisma.brand.findUnique({ where: { slug }, select: { name: true, description: true } });
  if (!brand) return { title: "Brand tidak ditemukan" };
  return {
    title: `Brand ${brand.name}`,
    description: brand.description ?? `Jelajahi produk dari brand ${brand.name} di StreetwearHub.`,
    alternates: { canonical: `/brand/${slug}` },
  };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (!brand) notFound();

  return (
    <ListingPage
      eyebrow="BRAND"
      title={brand.name}
      description={brand.description}
      imageUrl={brand.logoUrl}
      breadcrumbLabel={brand.name}
      basePath={`/brand/${slug}`}
      scope={{ brandSlug: slug }}
      searchParams={searchParams}
    />
  );
}
