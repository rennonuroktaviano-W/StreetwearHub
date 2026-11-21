import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ListingPage } from "@/components/catalog-listing";
import type { RawSearchParams } from "@/lib/catalog";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug }, select: { name: true, description: true } });
  if (!category) return { title: "Kategori tidak ditemukan" };
  return {
    title: `Kategori ${category.name}`,
    description: category.description ?? `Jelajahi produk streetwear kategori ${category.name} di StreetwearHub.`,
    alternates: { canonical: `/kategori/${slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  return (
    <ListingPage
      eyebrow="KATEGORI"
      title={category.name}
      description={category.description}
      imageUrl={category.imageUrl}
      breadcrumbLabel={category.name}
      basePath={`/kategori/${slug}`}
      scope={{ categorySlug: slug }}
      searchParams={searchParams}
    />
  );
}
