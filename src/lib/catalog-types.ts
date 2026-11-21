export const PAGE_SIZE = 12;

export const SORTS = ["newest", "price-asc", "price-desc", "best-selling"] as const;
export type SortKey = (typeof SORTS)[number];

export type CatalogInput = {
  q?: string;
  category?: string;
  brand?: string;
  sizes: string[];
  colors: string[];
  minPrice?: number;
  maxPrice?: number;
  sort: SortKey;
  page: number;
  limit: number;
  categorySlug?: string;
  brandSlug?: string;
  sellerSlug?: string;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type FilterOptionItem = { id: string; name: string; slug: string };

export type FilterOptions = {
  categories: FilterOptionItem[];
  brands: FilterOptionItem[];
  sizes: string[];
  colors: string[];
};
