# Deployment Guide - Personal Finance Dashboard

## 🚀 Deployment ke Platform Cloud

### Option 1: Deploy Backend ke Railway.app

1. **Persiapan**
   - Buat akun di [Railway.app](https://railway.app)
   - Install Railway CLI (opsional)

2. **Setup PostgreSQL di Railway**
   - Di Railway dashboard, klik "New Project"
   - Pilih "Provision PostgreSQL"
   - Copy connection string yang diberikan

3. **Deploy Backend**
   - Klik "New" → "GitHub Repo" atau "Empty Project"
   - Connect repository atau upload backend folder
   - Set environment variables:
     ```
     PORT=5000
     DATABASE_URL=postgresql://...
     TELEGRAM_BOT_TOKEN=your_bot_token
     ```
   - Railway akan otomatis detect Node.js dan deploy

4. **Get Backend URL**
   - Setelah deploy, Railway akan berikan URL (contoh: `https://xxx.railway.app`)
   - Copy URL ini untuk frontend

### Option 2: Deploy Backend ke Render.com

1. **Persiapan**
   - Buat akun di [Render.com](https://render.com)

2. **Setup PostgreSQL**
   - Di Render dashboard, klik "New +" → "PostgreSQL"
   - Tunggu database selesai dibuat
   - Copy "Internal Database URL"

3. **Deploy Backend**
   - Klik "New +" → "Web Service"
   - Connect repository atau upload code
   - Settings:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment**: Node
   - Set environment variables di "Environment" tab
   - Klik "Create Web Service"

### Frontend Deployment ke Vercel

1. **Persiapan**
   - Install Vercel CLI: `npm install -g vercel`
   - Atau gunakan Vercel Dashboard

2. **Update Environment Variable**
   - Edit file `frontend/.env.production`:
     ```
     REACT_APP_API_URL=https://your-backend-url.com/api
     ```

3. **Deploy via CLI**
   ```bash
   cd frontend
   vercel
   ```
   
4. **Atau Deploy via Dashboard**
   - Buka [Vercel Dashboard](https://vercel.com)
   - Klik "New Project"
   - Import repository
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Add Environment Variable: `REACT_APP_API_URL`
   - Deploy

### Frontend Deployment ke Netlify

1. **Build Production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Atau Deploy via Dashboard**
   - Drag & drop folder `build` ke Netlify
   - Atau connect repository dan set:
     - Build command: `npm run build`
     - Publish directory: `build`
     - Environment variables: `REACT_APP_API_URL`

## 🔐 Setup Telegram Bot untuk Production

1. **Update Webhook (Opsional)**
   - Untuk production, bisa pakai webhook mode
   - Edit `backend/telegramBot.js` jika ingin menggunakan webhook

2. **Restart Bot**
   - Setelah backend di-deploy, bot akan otomatis running
   - Test dengan kirim `/start` ke bot Anda

## ✅ Checklist Deployment

- [ ] PostgreSQL database sudah setup
- [ ] Backend sudah di-deploy dan running
- [ ] Environment variables backend sudah di-set
- [ ] Frontend sudah build dengan API URL yang benar
- [ ] Frontend sudah di-deploy
- [ ] Telegram bot bisa diakses dan merespons
- [ ] Test input transaksi via web
- [ ] Test input transaksi via Telegram
- [ ] Verifikasi data tersimpan di database

## 🧪 Testing Production

1. **Test Backend API**
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Test Frontend**
   - Buka URL frontend di browser
   - Coba tambah transaksi
   - Cek apakah data tersimpan

3. **Test Telegram Bot**
   - Kirim `/start` ke bot
   - Coba `/pemasukan 100000 test`
   - Cek di dashboard web apakah muncul

## 🐛 Troubleshooting Production

### Backend error 500
- Cek logs di Railway/Render dashboard
- Pastikan DATABASE_URL benar
- Pastikan semua environment variables sudah di-set

### Frontend tidak bisa fetch data
- Pastikan REACT_APP_API_URL sudah benar
- Cek CORS settings di backend
- Pastikan backend sudah running

### Telegram bot tidak merespons
- Cek logs backend
- Pastikan TELEGRAM_BOT_TOKEN valid
- Restart backend service

## 💰 Estimasi Biaya

### Free Tier Options:
- **Railway**: $5 credit gratis/bulan (cukup untuk project kecil)
- **Render**: Free tier dengan limitasi
- **Vercel**: Unlimited untuk personal projects
- **Netlify**: 100GB bandwidth/month gratis
- **Supabase PostgreSQL**: 500MB database gratis

### Untuk production dengan traffic tinggi:
- Railway: ~$5-20/month
- Render: ~$7-25/month
- Database cloud: ~$10-50/month

## 📊 Monitoring & Maintenance

1. **Setup Monitoring**
   - Gunakan Railway/Render built-in monitoring
   - Atau setup Sentry untuk error tracking

2. **Database Backup**
   - Railway: Otomatis backup
   - Render: Setup manual backup
   - Atau setup cron job untuk backup ke cloud storage

3. **Update Dependencies**
   ```bash
   npm update
   npm audit fix
   ```

---

**Good luck dengan deployment! 🚀**
