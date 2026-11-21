import { prisma } from "@/lib/prisma";
import { AdminActionForm } from "@/components/admin-action-form";
import { deleteCategoryFormAction, saveCategoryAction } from "@/app/actions/admin";

export const instant = false;

export default async function AdminKategoriPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <section className="space-y-10">
      <div>
        <h2 className="font-display text-2xl uppercase">Kategori</h2>
        <p className="mt-1 text-sm text-muted">Kelola kategori produk marketplace.</p>
      </div>
      <div className="card-sh p-5">
        <h3 className="font-display text-xl uppercase">Tambah Kategori</h3>
        <div className="mt-4">
          <AdminActionForm
            action={saveCategoryAction}
            submitLabel="Simpan Kategori"
            fields={[
              { name: "name", label: "Nama", required: true },
              { name: "slug", label: "Slug (opsional)" },
              { name: "description", label: "Deskripsi", textarea: true },
              { name: "imageUrl", label: "URL Gambar", type: "url" },
            ]}
          />
        </div>
      </div>
      <div className="card-sh p-5">
        <h3 className="font-display text-xl uppercase">Daftar Kategori</h3>
        {categories.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Belum ada kategori.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {categories.map((category) => (
              <li key={category.id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0">
                <div className="min-w-0">
                  <p className="font-semibold">{category.name}</p>
                  <p className="text-xs text-muted">/{category.slug}{category.description ? ` · ${category.description}` : ""}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <AdminActionForm
                    compact
                    action={saveCategoryAction}
                    submitLabel="Update"
                    fields={[
                      { name: "id", label: "ID", value: category.id, type: "hidden" },
                      { name: "name", label: "Nama", value: category.name, required: true },
                      { name: "slug", label: "Slug", value: category.slug },
                      { name: "imageUrl", label: "URL Gambar", value: category.imageUrl ?? "", type: "url" },
                    ]}
                  />
                  <form action={deleteCategoryFormAction}>
                    <input type="hidden" name="id" value={category.id} />
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
