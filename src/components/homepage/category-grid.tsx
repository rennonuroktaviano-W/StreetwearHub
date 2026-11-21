import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/data/home";
import { StaggerGroup } from "@/components/motion/stagger-group";

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-8" aria-labelledby="category-title">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">Jelajahi</p>
          <h2 id="category-title" className="font-display text-3xl uppercase text-offwhite md:text-4xl">
            Kategori
          </h2>
        </div>
        <Link href="/shop" className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted transition-colors duration-200 hover:text-offwhite">
          Semua Kategori
        </Link>
      </div>
      <StaggerGroup className="grid grid-cols-2 gap-px border border-mid bg-mid md:grid-cols-4" stagger={0.1}>
        {CATEGORIES.map((category) => (
          <Link
            key={category.name}
            href={`/shop?kategori=${encodeURIComponent(category.name)}`}
            className="category-card group relative aspect-square overflow-hidden bg-charcoal"
            data-cursor
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="category-image object-cover opacity-80 transition-transform duration-200 group-hover:scale-105"
            />
            <span className="category-overlay absolute inset-0 bg-black-sh/0 transition-colors duration-200 group-hover:bg-black-sh/40" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black-sh via-black-sh/70 to-transparent p-4 pt-12">
              <h3 className="category-title font-display text-xl uppercase text-offwhite transition-transform duration-200 md:text-2xl">
                {category.name}
              </h3>
              <span className="category-rule mt-1 block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-200" aria-hidden />
              <p className="mt-1.5 text-[10px] uppercase tracking-widest text-muted">{category.count} produk</p>
              <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                Shop Now →
              </span>
            </div>
          </Link>
        ))}
      </StaggerGroup>
    </section>
  );
}
