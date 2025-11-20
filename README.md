# SI-BANSOS (Sistem Informasi Bantuan Sosial)

Website manajemen Bantuan Sosial (Bansos) terpadu untuk tingkat Desa/RT/RW.  
Sistem mencakup dashboard monitoring, pengelolaan data penerima, penyaluran bantuan, serta portal aspirasi warga dengan pengelompokan kategori otomatis.

---

## 🚀 Fitur Utama

- **Dashboard Admin:** Statistik real-time data warga & status penyaluran bantuan.
- **Portal Warga:** Cek status penerima bantuan sosial berdasarkan NIK.
- **Aspirasi & Aduan:** Pelaporan warga (Infrastruktur, Sosial, Keamanan, dll).
- **Manajemen Data:** CRUD Data Bansos, Verifikasi/Approval, dan Kas RT.
- **Database:** MongoDB dengan Mongoose.

---

## 🛠️ Teknologi

- **Framework:** Next.js 14 (App Router)
- **Bahasa:** JavaScript / React
- **Styling:** Tailwind CSS
- **Database:** MongoDB + Mongoose
- **Icons:** Lucide React

---

## ⚙️ Persiapan Instalasi

Karena beberapa file konfigurasi sensitif tidak termasuk dalam repository, lakukan langkah-langkah berikut untuk menjalankan proyek.

### 1. Clone Repositori

```bash
git clone https://github.com/pep1918/Website-Bantuan-Sosial.git
cd Website-Bantuan-Sosial
```

### 2. Install dependecies
```bash
npm install
```
### 3. Konfigurasi File .env
Buat file .env di folder root, lalu isi:
```bash 
# Koneksi MongoDB (Local atau Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/db_bansos?retryWrites=true&w=majority
```
### 4. Membuat File Koneksi Database (src/lib/db.js)
```bash
import mongoose from 'mongoose';
const MONGODB_URI = "mongodb+srv://admin:<Password Kamu>@cluster0.pcedmmf.mongodb.net/?appName=Cluster0";
if (!MONGODB_URI) {
  throw new Error('Link Database belum diisi di file src/lib/db.js');
}
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
export default dbConnect;
```
### 5. ▶️ Cara Menjalankan Aplikasi
```bash 
npm run dev
```
