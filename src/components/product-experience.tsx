"use client";

import { useState, type ReactNode } from "react";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchasePanel, type PurchaseVariant } from "@/components/product-purchase-panel";

export function ProductExperience({
  images,
  name,
  productId,
  productSlug,
  image,
  sellerName,
  sellerSlug,
  variants,
  details,
  modelUrl,
}: {
  images: { url: string; alt: string | null }[];
  name: string;
  productId: string;
  productSlug: string;
  image: string | null;
  sellerName: string;
  sellerSlug: string;
  variants: PurchaseVariant[];
  details?: ReactNode;
  modelUrl?: string | null;
}) {
  const [color, setColor] = useState<string | null>(variants.find((v) => v.stock > 0)?.color ?? null);

  return (
    <div className="contents">
      <ProductGallery images={images} name={name} color={color} show3D modelUrl={modelUrl} />
      <div>
        {details}
        <ProductPurchasePanel
        productId={productId}
        productName={name}
        productSlug={productSlug}
        image={image}
        sellerName={sellerName}
        sellerSlug={sellerSlug}
        variants={variants}
          onColorChange={setColor}
        />
      </div>
    </div>
  );
}
