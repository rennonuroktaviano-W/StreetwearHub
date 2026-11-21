import { prisma } from "@/lib/prisma";
import { approveSellerFormAction, disableSellerFormAction, rejectSellerFormAction } from "@/app/actions/admin";

export default async function AdminSellersPage() {
  const sellers = await prisma.seller.findMany({
    where: { status: { in: ["PENDING", "APPROVED", "REJECTED", "DISABLED"] } },
    include: { user: { select: { email: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
  });

  return (
    <section aria-labelledby="sellers-title" className="space-y-6">
      <div>
        <h2 id="sellers-title" className="font-display text-2xl uppercase">Verifikasi Seller</h2>
        <p className="mt-1 text-sm text-muted">Setujui atau tolak pendaftaran toko baru.</p>
      </div>
      {sellers.length === 0 ? (
        <p className="card-sh p-8 text-center text-sm text-muted">Belum ada seller terdaftar.</p>
      ) : (
        <ul className="space-y-4">
          {sellers.map((seller) => (
            <li key={seller.id} className="card-sh p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-xl uppercase">{seller.name}</p>
                  <p className="text-xs text-muted">{seller.user.email} · /shop/{seller.slug}</p>
                  <p className="mt-2 text-sm text-muted">{seller.description}</p>
                  {seller.rejectionNote ? <p className="mt-2 text-xs text-accent">Catatan: {seller.rejectionNote}</p> : null}
                </div>
                <span className="border border-accent px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
                  {seller.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {seller.status !== "APPROVED" ? (
                  <form action={approveSellerFormAction}>
                    <input type="hidden" name="id" value={seller.id} />
                    <button type="submit" className="btn-accent">Setujui</button>
                  </form>
                ) : null}
                {seller.status !== "REJECTED" ? (
                  <form action={rejectSellerFormAction} className="flex flex-wrap items-end gap-3">
                    <input type="hidden" name="id" value={seller.id} />
                    <input name="note" className="input-sh max-w-64" placeholder="Alasan penolakan" maxLength={500} />
                    <button type="submit" className="btn-outline">Tolak</button>
                  </form>
                ) : null}
                {seller.status === "APPROVED" || seller.status === "DISABLED" ? (
                  <form action={disableSellerFormAction}>
                    <input type="hidden" name="id" value={seller.id} />
                    <button type="submit" className="btn-outline">Nonaktifkan</button>
                  </form>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
