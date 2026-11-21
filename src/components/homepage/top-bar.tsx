import { MarqueeText } from "@/components/motion/marquee-text";

export function TopBar() {
  return (
    <div className="border-b border-mid bg-black-sh">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted md:px-8">
        <span className="shrink-0 bg-accent px-2 py-0.5 text-offwhite">Promo</span>
        <MarqueeText
          className="min-w-0 flex-1"
          items={[
            "Gratis ongkir di atas Rp300.000",
            "Drop baru setiap minggu",
            "Toko independen terverifikasi",
          ]}
        />
        <span className="hidden shrink-0 sm:inline">IDR / Indonesia</span>
      </div>
    </div>
  );
}
