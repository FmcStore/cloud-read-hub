

# 🎨 FmcComic - Full Rebuild Plan

## Overview
Rebuild website komik FmcComic dari vanilla HTML/JS ke React modern dengan desain colorful & vibrant, sistem auth, cloud sync, dan PWA support. Menggunakan mock data untuk komik.

---

## 1. 🎨 UI/UX - Colorful & Vibrant Design

### Homepage
- **Hero Banner** besar dengan komik featured, gradient warna-warni (purple → blue → amber), animasi smooth
- **Horizontal scroll** "Populer Hari Ini" dengan card yang punya gradient border dan glow effect
- **Grid "Rilis Terbaru"** dengan card komik yang colorful — hover effect dengan scale + shadow berwarna
- **Sidebar "Proyek Kami"** dengan list kompak
- Warna accent: kombinasi amber, purple, cyan, pink — bukan hanya amber saja

### Navigation
- **Desktop**: Navbar atas dengan glassmorphism + gradient accent
- **Mobile**: Bottom navigation bar dengan icon animasi (active state berwarna vibrant)
- Tombol search, bookmark, dan profile user

### Halaman List Komik (Ongoing / Completed / Genre)
- Grid responsif dengan filter (genre, tipe, status)
- Search bar dengan autocomplete
- Pagination

### Halaman Detail Komik
- Banner besar dengan cover komik + info (judul, genre badges berwarna, rating, sinopsis)
- Daftar chapter yang bisa di-scroll
- Tombol Bookmark (heart icon) dan status "Sudah Dibaca"

### Halaman Baca Komik (Reader)
- Mode baca vertical scroll (long strip)
- Progress bar di atas
- Tap untuk hide/show UI
- Navigasi chapter (prev/next)
- Tombol fullscreen

### Halaman History & Bookmark
- List komik yang pernah dibaca dengan progress chapter
- List komik yang di-bookmark
- Bisa hapus satu-satu atau semua

---

## 2. 🔐 Auth System (Supabase)

- **Register** dengan email + password
- **Login** dengan email + password
- **Profile page** sederhana (avatar, username)
- Protected routes: Bookmark & History hanya bisa diakses jika login
- Logout

---

## 3. ☁️ Cloud Sync

- **History baca**: Otomatis simpan komik + chapter terakhir yang dibaca ke database
- **Bookmark**: Simpan/hapus komik favorit ke database
- Saat login di device baru, semua data otomatis muncul kembali

---

## 4. 📱 PWA Support

- Bisa diinstall sebagai aplikasi dari browser
- Icon dan splash screen FmcComic
- Halaman `/install` dengan instruksi install

---

## 5. 📦 Mock Data

- Data komik menggunakan mock data hardcoded (judul, cover image, genre, chapter list, halaman komik)
- Sekitar 10-15 komik contoh dengan beberapa chapter dan halaman dummy
- Struktur data siap diganti ke API asli nanti

---

## Halaman yang Akan Dibuat
1. `/` — Homepage
2. `/ongoing` — List komik ongoing
3. `/completed` — List komik tamat
4. `/comic/:slug` — Detail komik
5. `/comic/:slug/:chapter` — Baca komik
6. `/login` — Login
7. `/register` — Register
8. `/profile` — Profile user
9. `/bookmarks` — Daftar bookmark
10. `/history` — Riwayat baca
11. `/install` — Panduan install PWA

