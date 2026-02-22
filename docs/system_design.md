# InstaApp: System Design & Architecture Document

## 1. System Overview
InstaApp adalah platform media sosial yang mengadaptasi fitur inti Instagram, dikembangkan dengan arsitektur **Decoupled**. Backend berfungsi murni sebagai penyedia RESTful API berbasis **Laravel (PHP)** dan menggunakan **PostgreSQL** sebagai basis datanya. API yang terstruktur dan stateless ini akan dikonsumsi oleh aplikasi Frontend yang dibuat menggunakan **React** dan distyling dengan **Tailwind CSS**.

---

## 2. Architecture & Design Principles
- **Decoupled Architecture:** Pemisahan total antara Backend (API) dan Frontend (Client).
- **Clean Architecture:** Menghindari *Fat Controllers*. Logika bisnis yang kompleks (seperti memproses unggahan media sekaligus memicu notifikasi atau event) **WAJIB** diabstraksi ke dalam **Service Layer** (contoh: `PostService`) atau **Action Classes** (contoh: `CreatePostAction`).
- **Stateless API:** Komunikasi bersifat *stateless* menggunakan autentikasi berbasis token.

---

## 3. Database Architecture (PostgreSQL)

### 3.1. Entity Relationship
- **User** `1:N` **Post** (Seorang user dapat memiliki banyak post)
- **User** `1:N` **Comment** (Seorang user dapat menulis banyak komentar)
- **Post** `1:N` **Comment** (Sebuah post dapat memuat banyak komentar)
- **User** `N:M` **Post** (Seorang user dapat menyukai banyak post, direlasikan melalui tabel pivot `Likes`)

### 3.2. Schema & Migrations

#### `users` Table
- `id` (Primary Key, BigInt / UUID)
- `name` (String)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String)
- `avatar_path` (String, Nullable)
- `timestamps`

#### `posts` Table
- `id` (Primary Key, BigInt)
- `user_id` (Foreign Key -> `users.id`, Constrained, Cascade on Delete)
- `caption` (Text, Nullable)
- `media_path` (String) - *Hanya menyimpan path, BUKAN base64 string.*
- `timestamps`

#### `comments` Table
- `id` (Primary Key, BigInt)
- `post_id` (Foreign Key -> `posts.id`, Constrained, Cascade on Delete)
- `user_id` (Foreign Key -> `users.id`, Constrained, Cascade on Delete)
- `content` (Text)
- `timestamps`

#### `likes` Table (Pivot)
- `id` (Primary Key, BigInt)
- `user_id` (Foreign Key -> `users.id`, Constrained, Cascade on Delete)
- `post_id` (Foreign Key -> `posts.id`, Constrained, Cascade on Delete)
- `timestamps`
- **Constraint Penting:** `Unique(['user_id', 'post_id'])` WAJIB ditambahkan untuk mencegah anomali di level database seperti satu *user* me-like *post* yang sama berulang kali.

### 3.3. Database Performance
- **Eager Loading:** Untuk mencegah masalah performa de-fakto **N+1 Query Problem**, pengambilan *feed* atau list entitas harus mengimplementasikan Eager Loading.
- *Contoh:* Gunakan `Post::with(['user', 'comments.user'])->withCount(['likes', 'comments'])->paginate();` agar *query* database tetap efisien meskipun data berjumlah besar.

---

## 4. API Design & Standardized Responses

### 4.1. Response Formatting (API Resources)
Untuk memastikan struktur *response* (metadata, data, links, pagination) selalu konsisten dan *predictable* bagi Frontend, **SELURUH** *response* entitas wajib direalisasikan melalui class **Laravel JsonResource** (contoh: `PostResource`, `UserResource`).

**Contoh Standar Struktur Respons:**
```json
{
    "data": {
        "id": 1,
        "caption": "Pemandangan indah hari ini!",
        "media_url": "http://localhost/storage/posts/img_123.jpg",
        "created_at": "2023-10-01T12:00:00.000000Z",
        "author": {
            "id": 5,
            "username": "johndoe",
            "avatar_url": null
        },
        "likes_count": 42,
        "comments_count": 5
    }
}
```

### 4.2. Logika Interaksi Sosial (Like/Unlike)
- Aksi *Like* menggunakan mekanisme **Toggle**.
- API akan memanggil metode `toggle()` pada relasi `belongsToMany` Eloquent (contoh: `$user->likedPosts()->toggle($post->id)`).
- Dikombinasikan dengan *Unique Constraint*, hal ini membuat operasi menyukai *post* aman dari kondisi pertarungan (*race condition*).

---

## 5. Security & Identity

### 5.1. Authentication
- Menggunakan **Laravel Sanctum** untuk menerbitkan API Tokens (*Personal Access Tokens*).
- Setiap pengaksesan ke *endpoint* yang mengubah *state* (Create, Update, Delete) atau akses privasi wajib dilindungi oleh middleware `auth:sanctum`.

### 5.2. Strict Authorization
- Implementasikan **Laravel Policies** (misal: `PostPolicy`, `CommentPolicy`) untuk mengidentifikasi kepemilikan.
- **Aturan:** Tindakan destruktif atau pengubahan (khususnya metode `update` dan `delete`) HANYA diizinkan jika identitas pemohon (*authenticated user*) sama dengan entitas pemilik data (`user_id`).
- Jika aturan ini dilanggar, API secara otomatis menolak dengan statuss code `403 Forbidden`.

---

## 6. Media Handling & Uploads

### 6.1. Validation Rules
Setiap unggahan foto wajib melewati setidaknya lapisan validasi ketat (menggunakan *FormRequests*) guna memastikan server tidak mengeksekusi file berbahaya atau file membengkak:
```php
'media' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'] // Maksimal 2MB
```

### 6.2. Storage Mechanism
- **Larangan Keras:** Data gambar **TIDAK BOLEH** disimpan di dalam kolom Database dalam wujud `base64` text.
- File media disimpan di konfigurasi disk *public* (di dalam *storage/app/public/posts*).
- Database hanya menyimpan *file path* relatifnya saja (misal `posts/abcdef.webp`).
- Model atau class API Resource nantinya mem-format URL penuh dari *path* tersebut agar Frontend tinggal langsung menggunakannya pada tag `<img />`. (Ingat untuk mengeksekusi `php artisan storage:link`).
