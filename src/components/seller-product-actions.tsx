"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProductAction, toggleProductStatusAction } from "@/app/actions/seller-product";

export function ToggleStatusButton({ productId, status }: { productId: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      className="btn-outline px-3 py-2 text-[10px]"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const data = new FormData();
          data.set("productId", productId);
          await toggleProductStatusAction(data);
          router.refresh();
        })
      }
    >
      {status === "ACTIVE" ? "Sembunyikan" : "Tayangkan"}
    </button>
  );
}

export function DeleteProductButton({ productId, name }: { productId: string; name: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      className="border border-accent px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-accent disabled:opacity-50"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Hapus produk "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        startTransition(async () => {
          const data = new FormData();
          data.set("productId", productId);
          await deleteProductAction(data);
          router.refresh();
        });
      }}
    >
      Hapus
    </button>
  );
}
