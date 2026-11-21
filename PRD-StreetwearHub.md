# PRD: StreetwearHub

**Versi:** 1.0
**Tanggal:** 21 November 2026
**Status:** Draft
**Tipe:** Website / Web App (marketplace multi-seller)
**Stack:** Next.js (App Router, TypeScript), Tailwind CSS, PostgreSQL, Prisma

---

## 1. Ringkasan

StreetwearHub adalah marketplace fashion dan streetwear yang mempertemukan banyak seller independen dengan buyer. Platform ini menyediakan katalog terpusat, keranjang dan checkout bersama, serta dashboard untuk setiap seller mengelola toko dan pesanannya.

**Tujuan produk:**
- Memberi seller kecil dan brand independen akses ke pasar tanpa harus membangun website sendiri.
- Memberi buyer pengalaman belanja streetwear yang terkurasi, visual, dan mudah dijelajahi.
- Menghasilkan transaksi dari banyak seller dalam satu checkout.

**Target pengguna:**
- **Buyer**: anak muda usia 16–30 tahun yang mengikuti tren streetwear, aktif di media sosial, dan sensitif terhadap drop atau rilis terbatas.
- **Seller**: brand lokal kecil, reseller, dan pemilik clothing line yang belum punya website sendiri.
- **Admin**: tim internal yang mengurus verifikasi, moderasi, dan kualitas katalog.

---

## 2. Masalah yang Diselesaikan

| Pengguna | Masalah saat ini |
|---|---|
| Buyer | Produk streetwear tersebar di banyak akun Instagram dan marketplace umum, sulit dibandingkan dan sering kehabisan stok tanpa info jelas |
| Seller | Membangun website sendiri mahal, dan jualan di marketplace umum kalah visual dan sulit membangun identitas brand |
| Admin | Tidak ada cara terstruktur untuk menjaga kualitas dan kepercayaan antar seller |

---

## 3. Tujuan dan Metrik Keberhasilan

| Tujuan | Metrik | Target 3 bulan pertama |
|---|---|---|
| Seller aktif | Jumlah seller terverifikasi dengan minimal 1 produk aktif | 30 seller |
| Produk tersedia | Jumlah produk aktif dengan stok | 500 produk |
| Transaksi | Jumlah order berhasil | 300 order |
| Konversi | Persentase sesi yang berakhir checkout | Minimal 2% |
| Pengalaman | Rata-rata waktu muat halaman katalog (LCP) | Di bawah 2,5 detik |

---

## 4. Ruang Lingkup

### 4.1 Dalam scope (MVP, fase 1)
- Autentikasi (daftar, login, logout, lupa password)
- Role buyer, seller, dan admin
- Pendaftaran seller dan verifikasi oleh admin
- Dashboard seller: profil toko, CRUD produk, varian, stok, dan pesanan masuk
- Katalog: homepage, listing produk dengan filter dan sort, halaman kategori, halaman brand, halaman toko, halaman detail produk
- Keranjang yang dikelompokkan per toko
- Checkout dengan pembayaran via payment gateway
- Riwayat pesanan dan status pengiriman untuk buyer
- Panel admin dasar: verifikasi seller, kelola kategori dan brand, moderasi produk

### 4.2 Di luar scope (fase 2 dan seterusnya)
- Review dan rating produk
- Wishlist
- Chat buyer-seller
- Voucher dan promo
- Notifikasi WhatsApp dan email marketing
- Payout otomatis ke seller
- Integrasi ongkir real-time
- Aplikasi mobile native
- Fitur drop terjadwal dengan countdown dan antrean pembelian

---

## 5. Pengguna dan Persona

**Persona 1: Rafa (Buyer)**
Mahasiswa, sering belanja sneakers dan hoodie, mengikuti akun streetwear di Instagram. Ingin tahu kapan drop baru keluar dan cepat checkout di HP.

**Persona 2: Dina (Seller)**
Pemilik brand kaos lokal dengan 40 SKU. Belum punya website dan ingin toko online yang tetap terlihat keren, dengan stok yang mudah diatur.

**Persona 3: Bima (Admin)**
Bertugas memastikan seller baru valid dan produk yang tayang sesuai standar visual platform.

---

## 6. Kebutuhan Fungsional

### 6.1 Autentikasi dan Akun
- **FR-01** Pengguna dapat mendaftar dengan email dan password.
- **FR-02** Pengguna dapat login dan logout.
- **FR-03** Pengguna dapat reset password melalui email.
- **FR-04** Sistem menerapkan role (buyer, seller, admin) dan membatasi akses halaman sesuai role.
- **FR-05** Buyer dapat mengelola alamat pengiriman.

### 6.2 Seller
- **FR-10** Pengguna buyer dapat mengajukan diri menjadi seller dengan mengisi nama toko, deskripsi, dan data verifikasi.
- **FR-11** Seller baru berstatus "pending" dan tidak dapat menayangkan produk sampai disetujui admin.
- **FR-12** Seller dapat mengedit profil toko, termasuk logo dan banner.
- **FR-13** Seller dapat membuat, mengedit, menyembunyikan, dan menghapus produk.
- **FR-14** Setiap produk memiliki satu atau lebih varian (ukuran dan warna), dengan harga dan stok masing-masing.
- **FR-15** Seller dapat mengunggah hingga 8 gambar per produk dengan urutan yang bisa diatur.
- **FR-16** Seller dapat memperbarui stok secara manual maupun massal (bulk edit).
- **FR-17** Seller dapat melihat daftar pesanan yang berisi produk dari tokonya.
- **FR-18** Seller dapat mengubah status pesanan menjadi "dikemas" dan "dikirim" serta memasukkan nomor resi.

### 6.3 Katalog dan Pencarian
- **FR-20** Homepage menampilkan hero, kategori, produk terbaru (Fresh Drops), produk unggulan, dan informasi layanan.
- **FR-21** Pengguna dapat melihat katalog dengan filter kategori, brand, ukuran, warna, dan rentang harga.
- **FR-22** Pengguna dapat mengurutkan produk berdasarkan terbaru, harga terendah, harga tertinggi, dan terlaris.
- **FR-23** Pengguna dapat mencari produk berdasarkan nama, brand, dan nama toko.
- **FR-24** Halaman detail produk menampilkan galeri, harga, pilihan varian, deskripsi, informasi toko, dan produk terkait.
- **FR-25** Varian yang stoknya habis ditampilkan sebagai tidak tersedia dan tidak bisa dipilih.
- **FR-26** Produk dengan stok habis tetap tampil dengan label "Sold Out" dan tidak bisa dibeli.
- **FR-27** Setiap produk memiliki label otomatis: NEW (14 hari sejak tayang), LIMITED (stok di bawah 5), dan SOLD OUT.

### 6.4 Keranjang dan Checkout
- **FR-30** Pengguna guest dapat menambah produk ke keranjang. Keranjang disimpan di local storage dan digabung ke akun saat login.
- **FR-31** Keranjang dikelompokkan per toko dengan subtotal masing-masing.
- **FR-32** Stok divalidasi ulang di server saat checkout.
- **FR-33** Checkout membuat satu order untuk buyer yang dipecah menjadi order item per toko.
- **FR-34** Harga, nama produk, dan alamat disimpan sebagai snapshot pada saat transaksi.
- **FR-35** Pembayaran diproses melalui payment gateway (Midtrans atau Xendit) dengan metode VA, e-wallet, dan QRIS.
- **FR-36** Stok dikurangi saat pembayaran berhasil, bukan saat order dibuat.
- **FR-37** Order yang belum dibayar dibatalkan otomatis setelah 24 jam.

### 6.5 Pesanan
- **FR-40** Buyer dapat melihat riwayat dan detail pesanan.
- **FR-41** Status order: `menunggu_pembayaran`, `dibayar`, `dikemas`, `dikirim`, `selesai`, `dibatalkan`.
- **FR-42** Buyer menerima pembaruan status di halaman pesanan.
- **FR-43** Buyer dapat membatalkan order yang belum dibayar.

### 6.6 Admin
- **FR-50** Admin dapat melihat, menyetujui, atau menolak pengajuan seller.
- **FR-51** Admin dapat membuat, mengedit, dan menghapus kategori dan brand.
- **FR-52** Admin dapat menonaktifkan produk yang melanggar ketentuan platform.
- **FR-53** Admin dapat menonaktifkan akun seller.

---

## 7. Kebutuhan Non-Fungsional

| ID | Kategori | Kebutuhan |
|---|---|---|
| NFR-01 | Performa | LCP halaman katalog dan homepage di bawah 2,5 detik pada koneksi 4G |
| NFR-02 | Performa | Gambar produk dioptimasi dengan `next/image` dan format WebP/AVIF |
| NFR-03 | Responsivitas | Tampilan optimal pada layar 360px ke atas (mobile-first) |
| NFR-04 | Keamanan | Password di-hash dengan bcrypt atau argon2 |
| NFR-05 | Keamanan | Semua endpoint dashboard seller dan admin memverifikasi role di server |
| NFR-06 | Keamanan | Webhook pembayaran divalidasi dengan signature dari payment gateway |
| NFR-07 | Keandalan | Pengurangan stok menggunakan transaksi database untuk mencegah overselling |
| NFR-08 | Aksesibilitas | Kontras teks memenuhi WCAG AA, dan semua elemen interaktif dapat diakses dengan keyboard |
| NFR-09 | SEO | Halaman produk, kategori, dan toko memiliki metadata dan URL slug yang rapi, serta sitemap otomatis |
| NFR-10 | Skalabilitas | Database dirancang untuk ribuan produk dan ratusan seller tanpa perubahan arsitektur |

---

## 8. Panduan Desain

Referensi utama adalah homepage gelap bergaya streetwear dengan karakter berikut:

- **Top bar tipis** berisi info promo (misal gratis ongkir) dan pilihan mata uang atau wilayah.
- **Navbar hitam** dengan logo di kiri, menu tengah (Home, Shop, Collections, About), dan ikon search, akun, serta keranjang di kanan.
- **Hero gelap** dengan judul tebal berukuran besar, subjudul singkat, tombol CTA outline, dan foto model di sisi kanan.
- **Grid kategori 4 kolom** dengan gambar, judul, dan tautan "Shop Now" di bagian bawah.
- **Seksi Fresh Drops** dengan tata letak dua kolom, gambar model di tengah, dan tombol "View All".
- **Strip trust** berisi empat ikon: pengiriman cepat, pembayaran aman, pengembalian mudah, dan kualitas premium.
- **Featured Products** dalam grid 5 kolom dengan nama produk, harga, dan panah ke halaman detail.
- **Footer gelap** dengan logo, tagline, tautan sosial media, dan ajakan bergabung.

**Catatan penting:** referensi ini adalah website milik brand Wstablished. Untuk StreetwearHub, ambil pola tata letak dan gaya visualnya, tetapi **jangan memakai logo, nama, atau foto produk brand tersebut**. Gunakan identitas dan aset StreetwearHub sendiri.

**Token desain:**
- Warna: hitam `#0A0A0A`, putih `#F5F5F3`, abu `#8A8A8A`, aksen (ditentukan kemudian)
- Tipografi display: sans-serif tebal dan kapital (misal Archivo Black atau Anton); body: Inter
- Radius: 0 untuk tombol dan kartu
- Motion: transisi hover 200ms, tanpa animasi besar di halaman checkout

---

## 9. Alur Pengguna Utama

**Alur buyer:**
Homepage → katalog atau kategori → filter → detail produk → pilih varian → tambah ke keranjang → keranjang → checkout → pembayaran → halaman konfirmasi → riwayat pesanan.

**Alur seller:**
Daftar seller → menunggu verifikasi → disetujui → lengkapi profil toko → tambah produk dan varian → produk tayang → terima pesanan → kemas → input resi → selesai.

**Alur admin:**
Login → antrean seller baru → tinjau data → setujui atau tolak → pantau produk yang dilaporkan.

---

## 10. Asumsi dan Batasan

- Pengiriman dilakukan oleh seller masing-masing pada tahap awal, dengan input nomor resi manual.
- Pajak dan komisi platform belum diatur di fase 1.
- Pengembalian dana ditangani manual oleh admin.
- Pembayaran hanya dalam Rupiah.
- Bahasa antarmuka: Indonesia.

---

## 11. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Seller tidak memperbarui stok | Buyer kecewa karena order tidak bisa diproses | Pengingat stok rendah dan pembatalan otomatis jika tidak dikemas dalam 2 hari |
| Overselling saat banyak order bersamaan | Kepercayaan buyer turun | Transaksi database dan pengecekan stok saat pembayaran |
| Kualitas foto dan deskripsi rendah | Katalog terlihat tidak konsisten | Panduan foto untuk seller dan review admin sebelum tayang |
| Biaya payment gateway | Margin menipis | Hitung biaya per transaksi sejak awal |

---

## 12. Pertanyaan Terbuka

- Model monetisasi: komisi per transaksi, biaya langganan seller, atau kombinasi keduanya?
- Apakah seller wajib melalui verifikasi dokumen (KTP, NPWP, atau legalitas usaha)?
- Apakah buyer boleh checkout tanpa akun?
- Warna aksen utama StreetwearHub?
- Target wilayah awal: nasional atau kota tertentu?
