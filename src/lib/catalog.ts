import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";
import { PAGE_SIZE, SORTS } from "@/lib/catalog-types";
import type { CatalogInput, RawSearchParams, SortKey } from "@/lib/catalog-types";

export { PAGE_SIZE, SORTS } from "@/lib/catalog-types";
export type { CatalogInput, FilterOptions, RawSearchParams, SortKey } from "@/lib/catalog-types";

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function toList(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value : value ? [value] : [];
  return [...new Set(raw.map((item) => item.trim()).filter(Boolean))].slice(0, 30);
}

function toPositiveInt(value: string | string[] | undefined, fallback: number, max: number): number {
  const raw = first(value);
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

function toPrice(value: string | string[] | undefined): number | undefined {
  const raw = first(value);
  if (!raw || raw.trim() === "") return undefined;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return Math.min(Math.floor(parsed), 1_000_000_000);
}

export function parseCatalogParams(params: RawSearchParams): CatalogInput {
  const rawSort = first(params.sort);
  const sort: SortKey = SORTS.includes(rawSort as SortKey) ? (rawSort as SortKey) : "newest";
  const minPrice = toPrice(params.minPrice);
  const maxPrice = toPrice(params.maxPrice);

  return {
    q: first(params.q)?.trim().slice(0, 100) || undefined,
    category: first(params.category)?.trim().slice(0, 100) || undefined,
    brand: first(params.brand)?.trim().slice(0, 100) || undefined,
    sizes: toList(params.size),
    colors: toList(params.color),
    minPrice: minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice ? undefined : minPrice,
    maxPrice: minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice ? undefined : maxPrice,
    sort,
    page: toPositiveInt(params.page, 1, 10_000),
    limit: PAGE_SIZE,
  };
}

function sortOrder(sort: SortKey): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "best-selling":
      return [{ soldCount: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }];
    default:
      return [{ publishedAt: "desc" }, { createdAt: "desc" }];
  }
}

export function buildCatalogWhere(input: CatalogInput): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
    seller: { status: "APPROVED" },
  };

  if (input.categorySlug) {
    where.category = { slug: input.categorySlug };
  } else if (input.category) {
    where.category = { slug: input.category };
  }

  if (input.brandSlug) {
    where.brand = { slug: input.brandSlug };
  } else if (input.brand) {
    where.brand = { slug: input.brand };
  }

  if (input.sellerSlug) {
    where.seller = { status: "APPROVED", slug: input.sellerSlug };
  }

  if (input.q) {
    where.OR = [
      { name: { contains: input.q, mode: "insensitive" } },
      { brand: { name: { contains: input.q, mode: "insensitive" } } },
      { seller: { name: { contains: input.q, mode: "insensitive" } } },
    ];
  }

  const variantFilters: Prisma.ProductVariantWhereInput[] = [];
  if (input.sizes.length) variantFilters.push({ size: { in: input.sizes } });
  if (input.colors.length) variantFilters.push({ color: { in: input.colors } });
  if (input.minPrice !== undefined) variantFilters.push({ price: { gte: input.minPrice } });
  if (input.maxPrice !== undefined) variantFilters.push({ price: { lte: input.maxPrice } });
  if (variantFilters.length) {
    where.variants = { some: { AND: variantFilters } };
  }

  return where;
}

export const productCardInclude = {
  images: { orderBy: { position: "asc" }, take: 1 },
  variants: { orderBy: { position: "asc" } },
  seller: { select: { name: true, slug: true } },
  brand: { select: { name: true } },
} satisfies Prisma.ProductInclude;

export async function getCatalog(input: CatalogInput) {
  const where = buildCatalogWhere(input);
  const skip = (input.page - 1) * input.limit;
  const priceSort = input.sort === "price-asc" || input.sort === "price-desc";

  if (priceSort) {
    const ranked = await prisma.product.findMany({
      where,
      select: {
        id: true,
        variants: { select: { price: true } },
      },
    });
    const direction = input.sort === "price-asc" ? 1 : -1;
    ranked.sort((a, b) => {
      const aPrice = a.variants.length ? Math.min(...a.variants.map((v) => v.price)) : 0;
      const bPrice = b.variants.length ? Math.min(...b.variants.map((v) => v.price)) : 0;
      return direction * (aPrice - bPrice);
    });
    const total = ranked.length;
    const ids = ranked.slice(skip, skip + input.limit).map((item) => item.id);
    const products = ids.length
      ? await prisma.product.findMany({
          where: { id: { in: ids } },
          include: productCardInclude,
        })
      : [];
    products.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

    return {
      products,
      total,
      page: input.page,
      totalPages: Math.max(1, Math.ceil(total / input.limit)),
    };
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: sortOrder(input.sort),
      skip,
      take: input.limit,
      include: productCardInclude,
    }),
  ]);

  return {
    products,
    total,
    page: input.page,
    totalPages: Math.max(1, Math.ceil(total / input.limit)),
  };
}

export async function getFilterOptions() {
  const [categories, brands, variantData] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.productVariant.findMany({
      where: {
        product: { status: "ACTIVE", seller: { status: "APPROVED" } },
      },
      select: { size: true, color: true },
      distinct: ["size"],
    }),
  ]);

  const colorRows = await prisma.productVariant.findMany({
    where: { product: { status: "ACTIVE", seller: { status: "APPROVED" } } },
    select: { color: true },
    distinct: ["color"],
  });

  const sizes = [...new Set(variantData.map((v) => v.size).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const colors = [...new Set(colorRows.map((v) => v.color).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  return { categories, brands, sizes, colors };
}

