"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CartCount } from "@/components/cart-count";
import { MobileMenu } from "@/components/homepage/mobile-menu";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?sort=newest", label: "Collections" },
  { href: "/about", label: "About" },
];

function SearchIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function AccountIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function NavbarShell({ accountHref }: { accountHref: string }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const solid = !isHome || scrolled;

  return (
    <header
      data-navbar
      className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
        solid ? "border-mid bg-black-sh/90 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <Link href="/" className="font-display text-2xl uppercase tracking-wide sm:text-3xl">
          Street<span className="text-accent">Hub</span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link text-xs font-bold uppercase tracking-[0.2em] text-offwhite">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link href="/shop" aria-label="Cari produk" className="text-offwhite transition-colors duration-200 hover:text-accent">
            <SearchIcon />
          </Link>
          <Link href={accountHref} aria-label="Akun" className="hidden text-offwhite transition-colors duration-200 hover:text-accent sm:block">
            <AccountIcon />
          </Link>
          <Link href="/keranjang" aria-label="Keranjang" className="relative text-offwhite transition-colors duration-200 hover:text-accent" data-cursor>
            <BagIcon />
            <CartCount />
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
