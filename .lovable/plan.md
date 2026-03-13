

# Plan: Login dengan Google OAuth

## Ringkasan
Menambahkan tombol "Login dengan Google" di halaman Login dan Register, menggunakan Lovable Cloud managed Google OAuth (sudah tersedia otomatis, tidak perlu setup tambahan).

## Langkah Implementasi

### 1. Configure Social Login
Gunakan tool Configure Social Auth untuk generate modul `src/integrations/lovable/` dan install package `@lovable.dev/cloud-auth-js`. Ini akan menyediakan fungsi `lovable.auth.signInWithOAuth("google", ...)`.

### 2. Update Login.tsx
- Tambahkan tombol "Login dengan Google" dengan icon Google di bawah form email/password
- Tombol memanggil `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })`
- Tambah separator "atau" antara form dan tombol Google

### 3. Update Register.tsx
- Tambahkan tombol "Daftar dengan Google" yang sama, supaya user bisa langsung daftar tanpa form manual

### 4. PWA Compatibility
Project ini menggunakan service worker (`public/sw.js`). Perlu memastikan route `/~oauth` tidak di-cache oleh service worker agar redirect OAuth berjalan lancar.

## Detail Teknis

```
┌─────────────────────────┐
│       Login Page        │
│                         │
│  [Email field        ]  │
│  [Password field     ]  │
│  [    Login Button   ]  │
│                         │
│  ────── atau ──────     │
│                         │
│  [G Login dengan Google]│
│                         │
│  Belum punya akun?      │
└─────────────────────────┘
```

- **Files to change**: `src/pages/Login.tsx`, `src/pages/Register.tsx`, `public/sw.js`
- **Files to generate**: `src/integrations/lovable/` (via Configure Social Auth tool)
- **No database changes needed** — profile auto-creation trigger already exists via `handle_new_user()`

