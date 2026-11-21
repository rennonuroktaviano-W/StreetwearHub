import { prisma } from "@/lib/prisma";
import { AdminActionForm } from "@/components/admin-action-form";
import { deleteBrandFormAction, saveBrandAction } from "@/app/actions/admin";

export default async function AdminBrandPage() {
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });

  return (
    <section className="space-y-10">
      <div>
        <h2 className="font-display text-2xl uppercase">Brand</h2>
        <p className="mt-1 text-sm text-muted">Kelola brand yang tersedia di marketplace.</p>
      </div>
      <div className="card-sh p-5">
        <h3 className="font-display text-xl uppercase">Tambah Brand</h3>
        <div className="mt-4">
          <AdminActionForm
            action={saveBrandAction}
            submitLabel="Simpan Brand"
            fields={[
              { name: "name", label: "Nama", required: true },
              { name: "slug", label: "Slug (opsional)" },
              { name: "description", label: "Deskripsi", textarea: true },
              { name: "logoUrl", label: "URL Logo", type: "url" },
            ]}
          />
        </div>
      </div>
      <div className="card-sh p-5">
        <h3 className="font-display text-xl uppercase">Daftar Brand</h3>
        {brands.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Belum ada brand.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {brands.map((brand) => (
              <li key={brand.id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0">
                <div className="min-w-0">
                  <p className="font-semibold">{brand.name}</p>
                  <p className="text-xs text-muted">/{brand.slug}{brand.description ? ` · ${brand.description}` : ""}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <AdminActionForm
                    compact
                    action={saveBrandAction}
                    submitLabel="Update"
                    fields={[
                      { name: "id", label: "ID", value: brand.id, type: "hidden" },
                      { name: "name", label: "Nama", value: brand.name, required: true },
                      { name: "slug", label: "Slug", value: brand.slug },
                      { name: "logoUrl", label: "URL Logo", value: brand.logoUrl ?? "", type: "url" },
                    ]}
                  />
                  <form action={deleteBrandFormAction}>
                    <input type="hidden" name="id" value={brand.id} />
                    <button type="submit" className="btn-outline">Hapus</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
