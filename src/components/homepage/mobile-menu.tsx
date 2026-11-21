"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const MENU = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 border border-mid text-offwhite transition-colors duration-200 hover:border-muted"
      >
        <span className="block h-px w-4 bg-current" />
        <span className="block h-px w-4 bg-current" />
        <span className="block h-px w-4 bg-current" />
      </button>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Navigasi mobile"
          className="absolute inset-x-0 top-full border-b border-mid bg-black-sh px-5 py-4"
        >
          <ul className="flex flex-col">
            {MENU.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-mid py-3 text-xs font-bold uppercase tracking-[0.2em] text-offwhite transition-colors duration-200 hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
