import Link from "next/link";

export function TopBar() {
  return (
    <div className="border-b border-mid bg-black-sh">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted md:px-8">
        <p className="truncate">
          <span className="mr-2 bg-accent px-2 py-0.5 text-offwhite">Promo</span>
          Gratis ongkir di atas Rp300.000
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden sm:inline">IDR / Indonesia</span>
          <Link href="/about" className="transition-colors duration-200 hover:text-offwhite">
            Bantuan
          </Link>
        </div>
      </div>
    </div>
  );
}
