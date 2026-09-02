# 🚀 Panduan Deploy Personal Finance App ke Vercel (GRATIS)

## 📋 Persiapan Sebelum Deploy

### 1. Buat Akun Vercel
- Buka https://vercel.com
- Klik "Sign Up" 
- Login dengan GitHub (recommended)

### 2. Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

---

## 🗄️ Setup Database (PostgreSQL Gratis)

Karena Vercel tidak menyediakan database, gunakan salah satu opsi gratis:

### **Opsi 1: Neon (Recommended - PostgreSQL Serverless)**
1. Buka https://neon.tech
2. Sign up dengan GitHub
3. Klik "Create Project"
4. Pilih region terdekat
5. Copy **Connection String** yang diberikan
   Format: `postgresql://user:password@host/database?sslmode=require`

### **Opsi 2: Supabase (PostgreSQL dengan UI)**
1. Buka https://supabase.com
2. Sign up dan buat project baru
3. Tunggu database setup selesai
4. Pergi ke Settings > Database
5. Copy **Connection String** (URI mode)

### **Opsi 3: ElephantSQL (PostgreSQL Gratis 20MB)**
1. Buka https://www.elephantsql.com
2. Sign up dan buat instance gratis (Tiny Turtle)
3. Copy **URL** dari dashboard

---

## 🔧 Persiapan Code untuk Deploy

### 1. Update Backend untuk Production

Buat file `backend/.env.production`:
```env
PORT=5000
DATABASE_URL=<paste_connection_string_dari_database_provider>
TELEGRAM_BOT_TOKEN=8771804122:AAGid7Q8TY6QCjtNDLCz6U4qYPXSdlJh9nUgg
NODE_ENV=production
```

### 2. Update Frontend untuk Production

File `frontend/.env.production` sudah ada, tapi perlu diupdate nanti dengan URL backend Vercel.

---

## 🌐 Deploy ke Vercel

### **Cara 1: Deploy via GitHub (Recommended)**

#### Step 1: Push ke GitHub
```bash
cd "D:\Learn Coding\Vibe Coding\personal-finance-app"
git init
git add .
git commit -m "Initial commit - Personal Finance App"
git branch -M main
```

Buat repository baru di GitHub, lalu:
```bash
git remote add origin https://github.com/USERNAME/personal-finance-app.git
git push -u origin main
```

#### Step 2: Import di Vercel
1. Login ke https://vercel.com/dashboard
2. Klik "Add New" > "Project"
3. Import repository GitHub Anda
4. Configure Project:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`

#### Step 3: Environment Variables
Tambahkan variable berikut di Vercel:

**Backend Variables:**
- `DATABASE_URL` = `<connection_string_dari_provider>`
- `TELEGRAM_BOT_TOKEN` = `8771804122:AAGid7Q8TY6QCjtNDLCz6U4qYPXSdlJh9nU`
- `NODE_ENV` = `production`

**Frontend Variables:**
- `REACT_APP_API_URL` = `https://your-app.vercel.app/api`

#### Step 4: Deploy
Klik "Deploy" dan tunggu prosesnya selesai.

---

### **Cara 2: Deploy via Vercel CLI**

```bash
cd "D:\Learn Coding\Vibe Coding\personal-finance-app"
vercel login
vercel
```

Ikuti prompt, lalu:
```bash
vercel env add DATABASE_URL
vercel env add TELEGRAM_BOT_TOKEN
vercel env add REACT_APP_API_URL
```

Deploy production:
```bash
vercel --prod
```

---

## ⚙️ Konfigurasi Tambahan

### 1. Setup Database Tables
Setelah deploy, jalankan migrations:

**Opsi A: Via Vercel Functions**
Backend akan auto-create tables saat pertama kali diakses.

**Opsi B: Manual via SQL Editor**
Buka SQL editor di Neon/Supabase/ElephantSQL, copy isi `backend/schema.sql` dan execute.

### 2. Update API URL di Frontend
Setelah deploy berhasil, Vercel akan memberikan URL seperti:
`https://personal-finance-app-xyz.vercel.app`

Update environment variable `REACT_APP_API_URL` di Vercel dashboard:
- Setting > Environment Variables
- Edit `REACT_APP_API_URL` 
- Value: `https://personal-finance-app-xyz.vercel.app/api`
- Redeploy

---

## 📱 Test Aplikasi

1. Buka URL Vercel app Anda
2. Test tambah transaksi via web
3. Test Telegram bot (bot sudah otomatis terhubung ke backend Vercel)

---

## 🔒 Tips Keamanan

1. **Jangan commit file `.env`** (sudah ada di .gitignore)
2. **Gunakan Environment Variables** di Vercel untuk sensitive data
3. **Enable SSL** - Vercel otomatis mengaktifkan HTTPS
4. **Backup database** secara berkala

---

## 🐛 Troubleshooting

### Database Connection Error
- Pastikan connection string benar
- Cek apakah IP Vercel diizinkan (biasanya otomatis untuk serverless DB)
- Tambahkan `?sslmode=require` di akhir connection string

### Build Failed
- Cek logs di Vercel dashboard
- Pastikan semua dependencies ada di package.json
- Verifikasi Node.js version compatibility

### API Not Working
- Cek environment variables sudah set
- Verifikasi routing di vercel.json
- Check function logs di Vercel dashboard

---

## 📚 Resources

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Supabase Docs: https://supabase.com/docs

---

## ✅ Checklist Deploy

- [ ] Database provider dipilih dan setup
- [ ] Connection string didapat
- [ ] Code di-push ke GitHub
- [ ] Project di-import ke Vercel
- [ ] Environment variables di-set
- [ ] Deploy berhasil
- [ ] Database tables dibuat
- [ ] Frontend bisa akses API
- [ ] Telegram bot terhubung
- [ ] Test semua fitur

**Selamat! Aplikasi Anda sudah online! 🎉**