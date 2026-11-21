import { ShopProfileForm } from "@/components/shop-profile-form";
import { requireSeller } from "@/lib/seller-guard";

export default async function SellerProfilePage() {
  const { seller } = await requireSeller({ allowPending: true });

  return (
    <div className="max-w-3xl space-y-6">
      <p className="text-sm text-muted">
        Lengkapi identitas toko agar pembeli mengenali brand kamu. Slug toko bersifat permanen.
      </p>
      {seller.status !== "APPROVED" && (
        <p role="status" className="border border-accent bg-accent/10 p-4 text-sm text-accent">
          Toko kamu berstatus {seller.status}. Lengkapi profil ini, lalu tunggu persetujuan admin untuk menayangkan produk.
        </p>
      )}
      <div className="card-sh p-5 md:p-8">
        <ShopProfileForm
          name={seller.name}
          description={seller.description}
          logoUrl={seller.logoUrl ?? ""}
          bannerUrl={seller.bannerUrl ?? ""}
          slug={seller.slug}
        />
      </div>
    </div>
  );
}
