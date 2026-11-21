# StreetwearHub

Marketplace fashion & streetwear multi-seller (MVP Fase 1) sesuai `PRD-StreetwearHub.md`.

**Stack:** Next.js 16 (App Router, TypeScript, Cache Components), Tailwind CSS 4, Prisma 7 + PostgreSQL, Midtrans Snap.

## Fitur

- Autentikasi: daftar, login, logout, reset password, session httpOnly, role buyer/seller/admin.
- Buyer: katalog + filter/sort/search, kategori/brand/toko, detail produk & varian, keranjang per toko (localStorage), checkout, riwayat & status pesanan, alamat pengiriman.
- Seller: pengajuan + verifikasi, profil toko, CRUD produk & varian, galeri, bulk stok, pesanan masuk, input resi.
- Admin: verifikasi seller, kelola kategori/brand, moderasi produk, nonaktifkan seller.
- Pembayaran: Midtrans Snap (VA/e-wallet/QRIS), webhook SHA512, stok dipotong saat pembayaran berhasil dalam transaksi Serializable, auto-cancel 24 jam.

## Setup lokal

Butuh **PostgreSQL 15+** dan **Node.js 20.9+**.

```bash
npm install
cp .env.example .env
# isi DATABASE_URL, dan (opsional) kunci Midtrans
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Buka http://localhost:3000.

Admin default dari seed: `admin@streetwearhub.id` / `Admin12345!` (bisa diubah lewat `SEED_ADMIN_EMAIL` dan `SEED_ADMIN_PASSWORD`).

Tanpa kunci Midtrans, checkout tetap berjalan dalam **mode development** (order dibuat, pembayaran tidak diproses). Webhook akan menolak notifikasi jika `MIDTRANS_SERVER_KEY` kosong.

## Environment

| Variabel | Keterangan |
|---|---|
| `DATABASE_URL` | Connection string PostgreSQL |
| `MIDTRANS_SERVER_KEY` | Server key Midtrans (verifikasi webhook & Snap) |
| `MIDTRANS_CLIENT_KEY` | Client key server |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | Client key untuk Snap JS di browser |
| `CRON_SECRET` | Bearer token untuk `GET /api/cron/cancel-expired` |
| `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | Kredensial admin saat seed |
| `SMTP_URL` | Opsional; jika ada, email reset password dikirim |

Auto-cancel juga tersedia sebagai Vercel Cron tiap jam (`vercel.json`).

## Script

```bash
npm run dev            # development
npm run build          # production build
npm run start          # jalankan hasil build
npm run lint           # ESLint
npm run typecheck      # TypeScript
npm run prisma:generate
npm run prisma:migrate # deploy migrasi
npm run prisma:seed    # seed admin + kategori + brand
```

## Catatan

- Aksen warna: `#E63946` (PRD menyerahkan keputusan warna aksen; mudah diubah di `src/app/globals.css`).
- Aset visual dibuat sendiri (SVG), tidak memakai logo/foto brand referensi.
- Password di-hash bcrypt; session & token reset disimpan sebagai hash SHA-256.
- Semua endpoint seller/admin memverifikasi role di server.
