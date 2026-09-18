# 🚀 Panduan Lengkap Deploy Personal Finance App ke Vercel

Panduan step-by-step untuk deploy Personal Finance Dashboard ke Vercel dengan database PostgreSQL cloud (Supabase/Neon).

---

## 📋 Daftar Isi

1. [Persiapan Awal](#persiapan-awal)
2. [Setup Database PostgreSQL Cloud](#setup-database-postgresql-cloud)
3. [Persiapan Project untuk Vercel](#persiapan-project-untuk-vercel)
4. [Deploy Backend ke Vercel](#deploy-backend-ke-vercel)
5. [Deploy Frontend ke Vercel](#deploy-frontend-ke-vercel)
6. [Setup Telegram Bot](#setup-telegram-bot)
7. [Testing & Verifikasi](#testing--verifikasi)
8. [Troubleshooting](#troubleshooting)
9. [Custom Domain (Opsional)](#custom-domain-opsional)

---

## 1. Persiapan Awal

### Requirement:
- ✅ Akun GitHub (untuk push code)
- ✅ Akun Vercel (gratis) - [Daftar di sini](https://vercel.com/signup)
- ✅ Akun Supabase atau Neon (gratis) - untuk database PostgreSQL
- ✅ Telegram Bot Token - dapatkan dari [@BotFather](https://t.me/BotFather)
- ✅ Node.js 18+ terinstall di komputer Anda
- ✅ Git terinstall

### Install Vercel CLI:

```bash
# Install globally
npm install -g vercel

# Verifikasi instalasi
vercel --version

# Login ke Vercel
vercel login
```

Ikuti instruksi untuk login via browser atau email.

---

## 2. Setup Database PostgreSQL Cloud

### Opsi A: Menggunakan Supabase (Recommended)

#### Langkah-langkah:

1. **Buat Akun & Project Baru**
   - Kunjungi [supabase.com](https://supabase.com)
   - Klik "Start your project" → "New project"
   - Isi:
     - **Name**: `personal-finance-db`
     - **Database Password**: Buat password kuat (simpan ini!)
     - **Region**: Pilih terdekat (Singapore/Asia Southeast)
   - Klik "Create new project"

2. **Dapatkan Database Connection String**
   - Tunggu project selesai dibuat (~2 menit)
   - Buka project → Settings → Database
   - Scroll ke "Connection string" → Pilih "URI"
   - Copy connection string yang muncul:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
     ```
   - **Ganti `[YOUR-PASSWORD]`** dengan password yang Anda buat tadi

3. **Setup Database Schema**
   - Buka tab "SQL Editor" di Supabase dashboard
   - Copy isi file `backend/schema.sql` dari project Anda
   - Paste ke SQL Editor
   - Klik "Run" untuk membuat tabel

4. **Simpan Credentials**
   ```env
   # Simpan ini untuk nanti:
   DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
   ```

### Opsi B: Menggunakan Neon

#### Langkah-langkah:

1. **Buat Akun & Project**
   - Kunjungi [neon.tech](https://neon.tech)
   - Klik "Sign up" dan buat akun
   - Klik "Create a project"
   - Pilih region terdekat (Singapore recommended)

2. **Dapatkan Connection String**
   - Setelah project dibuat, copy connection string:
     ```
     postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb
     ```

3. **Setup Schema**
   - Di Neon dashboard, buka "SQL Editor"
   - Copy & paste isi `backend/schema.sql`
   - Run query

---

## 3. Persiapan Project untuk Vercel

### A. Struktur Project

Backend sudah dikonversi ke CommonJS (menggunakan `require` dan `module.exports`) agar kompatibel dengan Vercel Serverless Functions. File `api/index.js` sudah ada sebagai entry point alternatif.

### B. File `vercel.json` di root project:

File ini sudah ada dan dikonfigurasi dengan benar:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### C. `backend/package.json`:

Backend sudah dikonfigurasi dengan benar (CommonJS, tanpa `"type": "module"`):
```

### D. Update `frontend/package.json`:

Tambahkan script build untuk Vercel:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "vercel-build": "npm run build"
  }
}
```

### E. Buat file `.env.example` di root:

```env
# Backend Environment Variables
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/database
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Frontend Environment Variables
REACT_APP_API_URL=https://your-app.vercel.app/api
```

---

## 4. Deploy Backend ke Vercel

### Cara 1: Deploy via Vercel CLI (Recommended)

1. **Push Code ke GitHub**

   ```bash
   # Di root project
   git init
   git add .
   git commit -m "Initial commit - ready for Vercel"
   
   # Buat repository di GitHub, lalu:
   git remote add origin https://github.com/USERNAME/personal-finance-app.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy ke Vercel**

   ```bash
   # Di root project
   vercel
   ```

3. **Jawab pertanyaan CLI:**

   ```
   ? Set up and deploy "~/personal-finance-app"? [Y/n] y
   ? Which scope do you want to deploy to? Your Name
   ? Link to existing project? [y/N] n
   ? What's your project's name? personal-finance-app
   ? In which directory is your code located? ./
   ```

4. **Setup Environment Variables**

   Setelah deploy pertama, set environment variables:

   ```bash
   # Set DATABASE_URL
   vercel env add DATABASE_URL production
   # Paste connection string dari Supabase/Neon
   
   # Set TELEGRAM_BOT_TOKEN
   vercel env add TELEGRAM_BOT_TOKEN production
   # Paste bot token dari BotFather
   
   # Set untuk preview & development juga
   vercel env add DATABASE_URL preview
   vercel env add DATABASE_URL development
   
   vercel env add TELEGRAM_BOT_TOKEN preview
   vercel env add TELEGRAM_BOT_TOKEN development
   ```

5. **Deploy ke Production**

   ```bash
   vercel --prod
   ```

6. **Simpan URL Backend**
   
   Setelah deploy selesai, Vercel akan memberikan URL seperti:
   ```
   https://personal-finance-app.vercel.app
   ```
   
   Backend API Anda akan di: `https://personal-finance-app.vercel.app/api`

### Cara 2: Deploy via Vercel Dashboard

1. **Login ke Vercel Dashboard**
   - Buka [vercel.com/dashboard](https://vercel.com/dashboard)
   - Klik "Add New..." → "Project"

2. **Import Repository**
   - Klik "Import Git Repository"
   - Pilih repository `personal-finance-app`
   - Klik "Import"

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root)
   - **Build Command**: (kosongkan atau `npm install`)
   - **Output Directory**: (kosongkan)

4. **Environment Variables**
   
   Klik "Environment Variables", tambahkan:
   
   | Name | Value | Environments |
   |------|-------|--------------|
   | `DATABASE_URL` | `postgresql://...` | Production, Preview, Development |
   | `TELEGRAM_BOT_TOKEN` | `123456:ABC...` | Production, Preview, Development |
   | `NODE_ENV` | `production` | Production |

5. **Deploy**
   - Klik "Deploy"
   - Tunggu proses build (~2-5 menit)

---

## 5. Deploy Frontend ke Vercel

Frontend akan otomatis di-deploy bersamaan dengan backend jika menggunakan konfigurasi di atas.

### Update Frontend Environment Variables:

1. **Via CLI:**

   ```bash
   vercel env add REACT_APP_API_URL production
   # Input: https://personal-finance-app.vercel.app/api
   
   vercel env add REACT_APP_API_URL preview
   vercel env add REACT_APP_API_URL development
   ```

2. **Via Dashboard:**
   - Buka project di Vercel dashboard
   - Settings → Environment Variables
   - Add variable:
     - **Name**: `REACT_APP_API_URL`
     - **Value**: `https://personal-finance-app.vercel.app/api`
     - **Environments**: Production, Preview, Development

3. **Redeploy:**

   ```bash
   vercel --prod
   ```

   Atau klik "Redeploy" di dashboard.

---

## 6. Setup Telegram Bot

### Update Bot untuk Production

1. **Test Bot Connection**
   
   Setelah backend di-deploy, bot akan otomatis running di serverless mode.

2. **Test Bot di Telegram**
   
   - Buka Telegram, cari bot Anda
   - Kirim: `/start`
   - Seharusnya bot merespons

3. **Setup Webhook (Opsional - Advanced)**

   Untuk production yang lebih stabil, gunakan webhook mode:

   ```javascript
   // backend/telegramBot.js
   const TelegramBot = require('node-telegram-bot-api');
   const token = process.env.TELEGRAM_BOT_TOKEN;
   
   // Untuk Vercel, gunakan webhook
   const bot = new TelegramBot(token);
   
   // Set webhook
   const url = process.env.VERCEL_URL || 'https://your-app.vercel.app';
   bot.setWebHook(`${url}/api/telegram-webhook`);
   
   module.exports = bot;
   ```

---

## 7. Testing & Verifikasi

### A. Test Backend API

1. **Health Check:**
   ```bash
   curl https://personal-finance-app.vercel.app/api/health
   ```
   
   Response yang benar:
   ```json
   {"status":"OK","timestamp":"2026-09-03T00:00:00.000Z"}
   ```

2. **Test Get Transactions:**
   ```bash
   curl https://personal-finance-app.vercel.app/api/transactions
   ```

3. **Test Create Transaction:**
   ```bash
   curl -X POST https://personal-finance-app.vercel.app/api/transactions \
     -H "Content-Type: application/json" \
     -d '{
       "type": "income",
       "amount": 100000,
       "description": "Test transaction",
       "category": "salary",
       "date": "2026-09-03"
     }'
   ```

### B. Test Frontend

1. **Buka URL Production:**
   ```
   https://personal-finance-app.vercel.app
   ```

2. **Test Fitur:**
   - ✅ Halaman loading dengan benar
   - ✅ Form add transaction berfungsi
   - ✅ Data tersimpan ke database
   - ✅ Chart & summary muncul
   - ✅ Filter berfungsi

### C. Test Telegram Bot

1. **Basic Commands:**
   ```
   /start
   /saldo
   /riwayat
   ```

2. **Add Transaction:**
   ```
   /pemasukan 500000 Gaji bulanan
   /pengeluaran 50000 Bensin
   ```

3. **Verifikasi di Web:**
   - Buka dashboard web
   - Cek apakah transaksi dari Telegram muncul

### D. Test Database Connection

```bash
# Login ke Supabase SQL Editor atau Neon SQL Editor
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;
```

---

## 8. Troubleshooting

### ❌ Error: "Database connection failed"

**Solusi:**
1. Cek DATABASE_URL di environment variables
2. Pastikan format connection string benar
3. Test connection string di SQL editor
4. Cek apakah IP Vercel diizinkan di database firewall

### ❌ Error: "Cannot GET /api/health"

**Solusi:**
1. Cek file `api/index.js` sudah dibuat
2. Cek `vercel.json` routes configuration
3. Cek logs di Vercel dashboard: Settings → Functions → View Logs
4. Pastikan `backend/server.js` meng-export `app`

### ❌ Frontend tidak bisa fetch data

**Solusi:**
1. Cek `REACT_APP_API_URL` di environment variables
2. Buka Network tab di browser DevTools
3. Cek CORS settings di backend:
   ```javascript
   // backend/server.js
   app.use(cors({
     origin: [
       'http://localhost:3000',
       'https://personal-finance-app.vercel.app',
       'https://*.vercel.app'
     ]
   }));
   ```
4. Redeploy setelah update CORS

### ❌ Telegram bot tidak merespons

**Solusi:**
1. Cek TELEGRAM_BOT_TOKEN di environment variables
2. Cek logs backend di Vercel
3. Test token manual:
   ```bash
   curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe
   ```
4. Restart bot dengan redeploy

### ❌ Error: "Function execution timeout"

**Solusi:**
1. Buat `vercel.json` dengan timeout lebih panjang:
   ```json
   {
     "functions": {
       "api/*.js": {
         "maxDuration": 10
       }
     }
   }
   ```
2. Optimasi query database
3. Tambahkan connection pooling

### ❌ Environment variables tidak terbaca

**Solusi:**
1. Pastikan nama variable benar (case-sensitive)
2. Redeploy setelah menambah environment variables
3. Cek environment yang dipilih (Production/Preview/Development)
4. Untuk React, pastikan prefix `REACT_APP_`

### ❌ Build failed

**Solusi:**
1. Cek build logs di Vercel dashboard
2. Test build di local:
   ```bash
   cd frontend
   npm run build
   ```
3. Pastikan semua dependencies ada di `package.json`
4. Cek Node.js version di `package.json`:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

---

## 9. Custom Domain (Opsional)

### Menambahkan Domain Custom

1. **Beli Domain**
   - Beli di Namecheap, GoDaddy, atau Cloudflare

2. **Tambahkan ke Vercel**
   - Buka project → Settings → Domains
   - Klik "Add"
   - Input domain Anda: `finance.yourdomain.com`
   - Klik "Add"

3. **Setup DNS**
   
   Di registrar domain Anda, tambahkan DNS record:
   
   **Untuk subdomain:**
   ```
   Type: CNAME
   Name: finance
   Value: cname.vercel-dns.com
   ```
   
   **Untuk root domain:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

4. **Verifikasi**
   - Tunggu propagasi DNS (~5-30 menit)
   - Vercel otomatis generate SSL certificate
   - Test akses: `https://finance.yourdomain.com`

---

## 10. Monitoring & Maintenance

### A. Monitoring di Vercel Dashboard

1. **Analytics**
   - Buka project → Analytics
   - Lihat visitor count, page views, performance

2. **Logs**
   - Settings → Functions → View Logs
   - Monitor error & request logs real-time

3. **Performance**
   - Lihat function execution time
   - Monitor bandwidth usage

### B. Setup Alerts (Pro Plan)

```javascript
// Tambahkan error tracking
try {
  // Your code
} catch (error) {
  console.error('Error:', error);
  // Send to error tracking service
}
```

### C. Backup Database

1. **Supabase:**
   - Otomatis backup setiap hari (free tier)
   - Manual backup: Dashboard → Database → Backups

2. **Neon:**
   - Buat snapshot manual di dashboard
   - Setup scheduled backup

### D. Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update safely
npm update

# Audit security
npm audit
npm audit fix
```

---

## 11. Estimasi Biaya

### Free Tier (Gratis Selamanya):

✅ **Vercel Free Plan:**
- Unlimited personal projects
- 100 GB bandwidth/month
- Serverless Functions: 100 GB-hours
- 100 builds/month

✅ **Supabase Free Plan:**
- 500 MB database
- 5 GB bandwidth
- 2 GB file storage

✅ **Neon Free Plan:**
- 0.5 GB database
- 1 shared vCPU

**Total: GRATIS untuk personal use**

### Jika Traffic Tinggi:

**Vercel Pro ($20/month):**
- 1 TB bandwidth
- Unlimited builds
- Advanced analytics

**Supabase Pro ($25/month):**
- 8 GB database
- 50 GB bandwidth

**Total: ~$45/month untuk production app**

---

## 12. Next Steps

Setelah deploy berhasil:

- ✅ Setup monitoring & alerts
- ✅ Tambahkan fitur authentication
- ✅ Implementasi caching
- ✅ Optimasi performa
- ✅ Setup CI/CD dengan GitHub Actions
- ✅ Tambahkan testing (unit & integration)
- ✅ Dokumentasi API dengan Swagger
- ✅ Setup custom domain

---

## 13. Useful Links

- 📚 [Vercel Documentation](https://vercel.com/docs)
- 📚 [Supabase Documentation](https://supabase.com/docs)
- 📚 [Neon Documentation](https://neon.tech/docs)
- 📚 [Telegram Bot API](https://core.telegram.org/bots/api)
- 💬 [Vercel Community](https://github.com/vercel/vercel/discussions)
- 💬 [Supabase Discord](https://discord.supabase.com)

---

## 14. Checklist Deployment

Gunakan checklist ini untuk memastikan semua langkah sudah dilakukan:

### Persiapan:
- [ ] Akun Vercel sudah dibuat
- [ ] Akun Supabase/Neon sudah dibuat
- [ ] Telegram Bot Token sudah didapat
- [ ] Code sudah di GitHub
- [ ] Vercel CLI terinstall

### Database:
- [ ] PostgreSQL database sudah dibuat
- [ ] Schema sudah di-run
- [ ] Connection string sudah disimpan
- [ ] Test koneksi berhasil

### Backend:
- [ ] File `api/index.js` sudah dibuat
- [ ] File `vercel.json` sudah dikonfigurasi
- [ ] Environment variables sudah di-set
- [ ] Backend berhasil di-deploy
- [ ] API endpoint bisa diakses
- [ ] Health check return OK

### Frontend:
- [ ] `REACT_APP_API_URL` sudah di-set
- [ ] Frontend berhasil build
- [ ] Frontend berhasil di-deploy
- [ ] Halaman bisa diakses
- [ ] Bisa fetch data dari backend

### Telegram:
- [ ] Bot token sudah di-set
- [ ] Bot merespons `/start`
- [ ] Bisa input transaksi via bot
- [ ] Data dari bot masuk ke database

### Testing:
- [ ] Test add transaction via web
- [ ] Test add transaction via Telegram
- [ ] Test filter & search
- [ ] Test chart rendering
- [ ] Test di mobile browser
- [ ] Test CORS
- [ ] Load testing (optional)

### Production:
- [ ] Custom domain sudah setup (optional)
- [ ] SSL certificate aktif
- [ ] Monitoring sudah diaktifkan
- [ ] Error tracking sudah disetup
- [ ] Backup database sudah dijadwalkan

---

## 🎉 Selamat!

Jika semua checklist sudah ✅, aplikasi Anda sudah **LIVE di production**!

Share link Anda: `https://personal-finance-app.vercel.app`

---

**Dibuat dengan ❤️ untuk Personal Finance Dashboard**

*Last updated: September 2026*
