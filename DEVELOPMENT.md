# Development Setup Guide

## Prerequisites

Pastikan Anda sudah menginstall:
- Node.js (v14 atau lebih baru) - [Download](https://nodejs.org/)
- PostgreSQL (v12 atau lebih baru) - [Download](https://www.postgresql.org/download/)
- Git - [Download](https://git-scm.com/)
- Code Editor (VS Code recommended) - [Download](https://code.visualstudio.com/)

## Step-by-Step Setup

### 1. Setup PostgreSQL Database

#### Windows:
1. Buka pgAdmin atau psql
2. Buat database baru:
```sql
CREATE DATABASE personal_finance;
```

#### Mac/Linux:
```bash
psql -U postgres
CREATE DATABASE personal_finance;
\q
```

### 2. Clone & Install Dependencies

```bash
# Clone repository (jika dari git)
git clone <repository-url>
cd personal-finance-app

# Atau jika sudah ada folder
cd personal-finance-app

# Install dependencies root
npm install

# Install semua dependencies (backend + frontend)
npm run install-all
```

### 3. Setup Backend

```bash
cd backend

# Copy .env.example ke .env
cp .env.example .env

# Edit file .env dengan konfigurasi Anda
```

Edit file `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/personal_finance
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

**Cara mendapatkan Telegram Bot Token:**
1. Buka Telegram
2. Cari @BotFather
3. Kirim `/newbot`
4. Ikuti instruksi
5. Copy token yang diberikan

### 4. Setup Frontend

```bash
cd ../frontend

# File .env sudah dibuat otomatis
# Cek isinya:
cat .env
```

Pastikan berisi:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Run Database Migration

Backend akan otomatis membuat table saat pertama kali dijalankan. Atau bisa manual:

```bash
cd backend
psql -U postgres -d personal_finance -f schema.sql
```

### 6. Start Development Servers

#### Option 1: Run semuanya dengan 1 command (dari root folder)
```bash
npm run dev
```

#### Option 2: Run manual (perlu 2 terminal)

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### 7. Verify Installation

1. **Backend**: Buka http://localhost:5000/api/health
   - Harus melihat: `{"status":"OK","message":"Server is running"}`

2. **Frontend**: Buka http://localhost:3000
   - Dashboard harus muncul

3. **Database**: Check dengan psql
   ```bash
   psql -U postgres -d personal_finance
   \dt
   ```
   Harus melihat tables: `categories` dan `transactions`

4. **Telegram Bot**: 
   - Cari bot Anda di Telegram
   - Kirim `/start`
   - Bot harus merespons dengan panduan

## Common Issues & Solutions

### Issue: Backend error "Database connection failed"
**Solution:**
- Pastikan PostgreSQL running
- Check `DATABASE_URL` di `.env`
- Test connection: `psql -U postgres -d personal_finance`

### Issue: Frontend error "Network Error"
**Solution:**
- Pastikan backend running di port 5000
- Check `REACT_APP_API_URL` di frontend/.env
- Clear browser cache

### Issue: Telegram bot tidak merespons
**Solution:**
- Check `TELEGRAM_BOT_TOKEN` di backend/.env
- Pastikan backend running
- Check logs di terminal backend

### Issue: Port 3000 or 5000 already in use
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: npm install error
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

## Development Tools

### Recommended VS Code Extensions:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- PostgreSQL (by Chris Kolkman)
- Thunder Client (untuk test API)

### Database GUI Tools:
- pgAdmin (sudah include dengan PostgreSQL)
- DBeaver (free, cross-platform)
- TablePlus (Mac/Windows)

## Testing

### Test Backend API with curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get categories
curl http://localhost:5000/api/categories

# Create transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount":100000,"type":"pemasukan","description":"Test"}'

# Get transactions
curl http://localhost:5000/api/transactions
```

### Test Telegram Bot:
1. Buka bot di Telegram
2. `/start` - Lihat panduan
3. `/pemasukan 100000 test` - Tambah pemasukan
4. `/saldo` - Lihat saldo
5. Cek dashboard web, transaksi harus muncul

## Development Workflow

1. **Backend Changes:**
   - Edit files di `backend/`
   - Server auto-restart dengan nodemon
   - Check terminal untuk errors

2. **Frontend Changes:**
   - Edit files di `frontend/src/`
   - Browser auto-reload dengan React hot reload
   - Check browser console untuk errors

3. **Database Changes:**
   - Edit `backend/database.js` untuk schema
   - Restart backend server
   - Atau run migration manual

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/nama-fitur

# Make changes and commit
git add .
git commit -m "Add: fitur baru"

# Push to remote
git push origin feature/nama-fitur

# Create pull request di GitHub
```

## Next Steps

- [ ] Customize kategori sesuai kebutuhan
- [ ] Tambah validasi form lebih detail
- [ ] Implement authentication (JWT)
- [ ] Add unit tests
- [ ] Setup CI/CD
- [ ] Deploy to production

---

**Happy Coding! 🚀**

Jika ada masalah, cek console/terminal untuk error message atau buat issue di repository.
