# Media Pembelajaran Berhitung (SvelteKit Static)

Aplikasi web statis, ringan, dan responsif untuk latihan penjumlahan bersusun (target anak SD).

## Fitur
- SvelteKit + `@sveltejs/adapter-static` (100% statis, bisa dihosting di GitHub Pages/Netlify/Vercel static).
- TailwindCSS untuk layout responsif dan cepat.
- Motion One untuk animasi mikro (tap/bounce/shake) berbasis Web Animations API.
- Navigasi Home/Next/Back di setiap halaman latihan.
- Emot reaksi ✅/❌, angka merah/biru dengan efek timbul (emboss).
- Data soal dari berkas JSON (tanpa backend).

## Prasyarat
- Node.js 18+ (disarankan 20+)

## Cara Menjalankan (Dev)
```bash
npm install
npm run dev
```
Buka: http://localhost:5173

## Build & Preview (Static)
```bash
npm run build
npm run preview
```
Hasil build ada di `build/`.

## Struktur Folder Ringkas
```
src/
  app.html
  app.css
  routes/
    +layout.svelte     # Navbar + frame
    +layout.js         # prerender = true
    +page.svelte       # Home
    petunjuk/+page.svelte
    latihan/[id]/+page.svelte
  lib/
    data/soal-1.json   # Contoh data soal
```

## Kustomisasi
- Tambah set soal: buat `src/lib/data/soal-2.json` lalu tambahkan rute atau selector.
- Ubah animasi: lihat penggunaan `motion` (Motion One) di file latihan.
- Tambah halaman: buat folder baru di `src/routes/.../+page.svelte`.

## Catatan Performansi
- Mayoritas animasi pakai `transform/opacity` (GPU-friendly).
- Perhatikan `prefers-reduced-motion` jika ingin menambah aksesibilitas.
- Tidak ada dependensi berat; gunakan Lottie hanya jika perlu.

Selamat mengembangkan! 🎉
