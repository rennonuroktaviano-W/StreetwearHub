"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type GalleryImage = { url: string; alt: string | null };

export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const list = images.length ? images : [{ url: "", alt: null }];
  const safeIndex = Math.min(active, list.length - 1);
  const current = list[safeIndex];

  useEffect(() => {
    if (!fullscreen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
      if (event.key === "ArrowRight") setActive((i) => (i + 1) % list.length);
      if (event.key === "ArrowLeft") setActive((i) => (i - 1 + list.length) % list.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fullscreen, list.length]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setFullscreen(true)}
        className="relative block aspect-[3/4] w-full overflow-hidden border border-line bg-[#141414]"
        aria-label="Perbesar gambar produk"
      >
        {current.url ? (
          <Image
            key={current.url}
            src={current.url}
            alt={current.alt ?? name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain"
          />
        ) : (
          <span className="flex h-full items-center justify-center font-display text-7xl text-[#242424]">SH</span>
        )}
      </button>

      {list.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {list.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Lihat gambar ${index + 1}`}
              aria-current={index === safeIndex}
              className={`relative h-20 w-16 shrink-0 overflow-hidden border ${
                index === safeIndex ? "border-accent" : "border-line hover:border-paper"
              } bg-[#141414]`}
            >
              {image.url ? (
                <Image src={image.url} alt={image.alt ?? `${name} ${index + 1}`} fill sizes="64px" className="object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-xs text-muted">SH</span>
              )}
            </button>
          ))}
        </div>
      )}

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Galeri gambar produk"
          onClick={() => setFullscreen(false)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 text-3xl text-paper hover:text-accent"
            onClick={() => setFullscreen(false)}
            aria-label="Tutup"
          >
            ×
          </button>
          <div className="relative h-full w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            {current.url && (
              <Image src={current.url} alt={current.alt ?? name} fill sizes="100vw" className="object-contain" />
            )}
          </div>
          {list.length > 1 && (
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                className="border border-line px-4 py-2 text-xs font-bold uppercase hover:border-accent"
                onClick={() => setActive((i) => (i - 1 + list.length) % list.length)}
              >
                Sebelumnya
              </button>
              <button
                type="button"
                className="border border-line px-4 py-2 text-xs font-bold uppercase hover:border-accent"
                onClick={() => setActive((i) => (i + 1) % list.length)}
              >
                Berikutnya
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
