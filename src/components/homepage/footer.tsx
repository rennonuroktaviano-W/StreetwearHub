"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMotionPrefs } from "@/components/motion/use-motion-prefs";

const SOCIALS = ["IG", "TT", "X", "YT"];
const TAGLINE = "Marketplace fashion dan streetwear dari toko independen. Dibuat untuk yang berani tampil beda.";

export function Footer() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(0);
  const { reduced, ready } = useMotionPrefs();

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced || !ready) {
      setShown(TAGLINE.length);
      return;
    }
    let timer = 0;
    let count = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setInterval(() => {
          count = Math.min(count + 2, TAGLINE.length);
          setShown(count);
          if (count >= TAGLINE.length) window.clearInterval(timer);
        }, 22);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [reduced, ready]);

  return (
    <footer className="border-t border-mid bg-black-sh">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-display text-3xl uppercase text-offwhite">
            Street<span className="text-accent">Hub</span>
          </p>
          <p ref={ref} className="mt-3 max-w-xs text-xs leading-relaxed text-muted" aria-label={TAGLINE}>
            {TAGLINE.slice(0, shown)}
            <span aria-hidden className={shown < TAGLINE.length ? "ml-0.5 inline-block h-3 w-px animate-pulse bg-accent" : "hidden"} />
          </p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((social) => (
              <motion.div key={social} whileHover={!reduced ? { scale: 1.1 } : undefined} transition={{ duration: 0.2 }}>
                <Link
                  href="/about"
                  aria-label={`StreetwearHub di ${social}`}
                  className="flex h-9 w-9 items-center justify-center border border-mid text-[10px] font-bold text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  {social}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-offwhite">Belanja</h2>
          <ul className="space-y-2.5 text-xs text-muted">
            <li><Link href="/shop" className="transition-colors duration-200 hover:text-offwhite">Semua Produk</Link></li>
            <li><Link href="/shop?sort=newest" className="transition-colors duration-200 hover:text-offwhite">Fresh Drops</Link></li>
            <li><Link href="/keranjang" className="transition-colors duration-200 hover:text-offwhite">Keranjang</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-offwhite">Akun</h2>
          <ul className="space-y-2.5 text-xs text-muted">
            <li><Link href="/login" className="transition-colors duration-200 hover:text-offwhite">Masuk</Link></li>
            <li><Link href="/register" className="transition-colors duration-200 hover:text-offwhite">Daftar</Link></li>
            <li><Link href="/akun/pesanan" className="transition-colors duration-200 hover:text-offwhite">Pesanan Saya</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl uppercase leading-tight text-offwhite">Jual bareng kami.</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Punya brand sendiri? Buka toko di StreetwearHub dan jangkau pembeli di seluruh Indonesia.
          </p>
          <Link href="/seller/daftar" className="btn-accent mt-5">Gabung Seller</Link>
        </div>
      </div>
      <div className="border-t border-mid px-5 py-5 text-center text-[10px] uppercase tracking-[0.2em] text-muted">
        © 2026 StreetwearHub. Seluruh hak dilindungi.
      </div>
    </footer>
  );
}
