# Employee Work Logging and Remuneration App

## 📋 Deskripsi Proyek

Aplikasi ini memungkinkan pencatatan pekerjaan pegawai serta perhitungan remunerasi secara otomatis.  
Fitur utama:

- Mencatat detail tugas, jam kerja, tarif per jam, dan biaya tambahan.
- Perhitungan otomatis total remunerasi.
- Jika lebih dari satu pegawai mengerjakan tugas, remunerasi dibagi prorata berdasarkan jam kerja masing-masing.

---

## 🏧 Arsitektur Solusi

**Alur Data:**

1. **Frontend (Next.js)** berinteraksi dengan **Backend (Laravel API)**.
2. Pengguna melakukan operasi CRUD (Create, Read, Update, Delete) melalui antarmuka web.
3. Permintaan API dikirim ke Laravel Backend yang mengelola database.
4. Data yang diambil dari API ditampilkan di Frontend, termasuk perhitungan total remunerasi.

**Diagram Alur:**

```
[Frontend (Next.js)] → API Request → [Backend (Laravel)] → Database (MySQL)
[Frontend (Next.js)] ← API Response ← [Backend (Laravel)]
```

---

## 🎨 Penjelasan Desain

- **Laravel** dipilih sebagai backend karena kekuatan Eloquent ORM untuk pengelolaan data dan kemudahan pembuatan API RESTful.
- **Next.js** dipilih sebagai frontend karena kemampuannya dalam server-side rendering (SSR) dan integrasi API yang mudah.

### 👉 Perhitungan Remunerasi Berdasarkan Implementasi:

- **Base Fee (Gaji Pokok per Pegawai)**:

  ```
  base_fee = hourly_rate × hours_spent
  ```

- **Additional Fee**:

  - **User-specific (biaya tambahan khusus user)**:
    ```
    user_additional_fee = ∑ additional_fee dari user
    ```
  - **Group-specific (biaya tambahan grup)**:
    ```
    group_additional_fee_per_member = total_group_additional_fee / total_members
    ```

- **Total Additional Fee (per Pegawai)**:

  ```
  total_additional_fee = user_additional_fee + group_additional_fee_per_member
  ```

- **Total Remunerasi Pegawai**:

  ```
  total_fee = base_fee + total_additional_fee
  ```

- **Jika User Login sebagai Employee**:
  - Data remunerasi difilter untuk hanya menampilkan data diri sendiri.

---

## ⚙️ Setup & Deploy

### Backend (Laravel)

1. Clone repository.
2. Jalankan perintah:
   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   ```
3. Atur koneksi database di file `.env`.
4. Jalankan migrasi database:
   ```bash
   php artisan migrate
   ```
5. Jalankan seeder database untuk membuat data dummy:
   ```bash
   php artisan db:seed
   ```
   Seeder akan membuat data:
   - Roles: `admin`, `manager` dan `employee`.
   - User: `admin@example.com` dengan password `password` dan role sebagai `admin`.
6. Jalankan server Laravel:
   ```bash
   php artisan serve
   ```

### Frontend (Next.js)

1. Pindah ke direktori frontend.
2. Jalankan perintah:
   ```bash
   npm install
   cp .env.example .env
   ```
3. Atur file `.env` untuk URL API backend.
4. Jalankan server development:
   ```bash
   npm run dev
   ```

---

## 🚧 Tantangan & Solusi

| Tantangan                                                                         | Solusi                                                                                                         |
| :-------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| Menghitung pembagian remunerasi saat pekerjaan dikerjakan lebih dari satu pegawai | Membuat fungsi pembagian prorata berdasarkan total jam kerja seluruh pegawai dalam satu tugas.                 |
| Menjaga konsistensi data antar Frontend dan Backend                               | Menggunakan validasi di sisi Laravel API serta validasi di Frontend form input.                                |
| Integrasi API antara Next.js dan Laravel                                          | Menggunakan library `axios` di Next.js untuk komunikasi dengan API Laravel dengan error handling yang memadai. |

---

## 🔗 Dokumentasi API

Untuk dokumentasi lengkap dan testing endpoint API, dapat diakses melalui link Postman berikut:

[Postman API Documentation](https://www.postman.com/rohmatext/workspace/pt-aic/collection/4732663-cd4c6136-facf-4f65-be58-9fe414f687a8?action=share&creator=4732663)
