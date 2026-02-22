# Insta App

Aplikasi media sosial mirip Instagram (InstaApp) yang dibangun dengan menggunakan arsitektur modern (monolith via Inertia.js). Fokus utama pada keamanan, skalabilitas, dan UI/UX yang profesional.

## 🚀 Tech Stack Saat Ini

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 19, Inertia.js, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL
- **Environment & Deployment**: Docker & Docker Compose

## ✨ Gambaran & Fitur Project Saat Ini

- **Manajemen Postingan**: Fitur CRUD untuk Post, dikendalikan melalui `PostPolicy` untuk sistem otorisasi dan keamanan akses data.
- **UI/UX & Desain**: 
  - Komponen antarmuka yang modern, dinamis, dan responsif.
  - Implementasi *Reusable Layout Component* yang digunakan di berbagai halaman seperti `welcome.tsx` dan halaman pembuatan post.
  - Dukungan **Dark Mode** yang telah disesuaikan agar tetap terlihat jelas dan nyaman dibaca.
- **Infrastruktur Docker**: 
  - Project telah di-dockerize untuk mempermudah proses development (`Dockerfile.local`, `docker-compose.yml`).
  - Terdapat konfigurasi Dockerfile yang juga dipersiapkan untuk environment production.

## 🛠️ Menjalankan Project Secara Lokal

### Menggunakan Docker
Project ini sudah dilengkapi dengan Docker Compose, jalankan perintah berikut:
```bash
docker-compose up -d --build
```

### Tanpa Docker (Manual)
1. Install dependensi PHP & Node.js:
   ```bash
   composer install
   npm install
   ```
2. Salin `.env.example` menjadi `.env`, lalu konfigurasikan koneksi PostgreSQL Anda.
3. Generate secret key & jalankan migrasi database:
   ```bash
   php artisan key:generate
   php artisan migrate
   ```
4. Jalankan development server:
   ```bash
   # Terminal 1 (Backend)
   php artisan serve

   # Terminal 2 (Frontend Vite Server)
   npm run dev
   ```