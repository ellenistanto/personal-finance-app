# Personal Finance Dashboard

Modern personal finance management application dengan liquid glass dark theme. Input transaksi via web dashboard atau Telegram bot.

## ✨ Features

- **Web Dashboard** - UI minimalis dengan glassmorphism effect
- **Telegram Bot Integration** - Input cepat via chat
- **Real-time Sync** - Data tersinkronisasi otomatis
- **Analytics** - Visualisasi data dengan chart
- **Filter & Search** - Filter transaksi by date, kategori, tipe
- **Responsive Design** - Support mobile, tablet, desktop
- **Dark Theme** - Monochrome color palette (hitam-putih-abu)

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Axios
- Recharts (Data visualization)
- Date-fns (Date formatting)

**Backend:**
- Node.js + Express
- PostgreSQL
- Telegram Bot API

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Telegram Bot Token

### Installation

1. **Clone repository**
```bash
git clone https://github.com/USERNAME/personal-finance-app.git
cd personal-finance-app
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Setup Database**
```bash
# Create PostgreSQL database
createdb personal_finance

# Or via psql
psql -U postgres
CREATE DATABASE personal_finance;
```

4. **Configure Environment Variables**

Backend `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/personal_finance
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

Frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. **Run Application**

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

Frontend: http://localhost:3000
Backend API: http://localhost:5000/api

## 📱 Telegram Bot Commands

- `/start` - Mulai bot dan lihat menu
- `/pemasukan <jumlah> <deskripsi>` - Catat pemasukan
- `/pengeluaran <jumlah> <deskripsi>` - Catat pengeluaran
- `/saldo` - Lihat ringkasan keuangan
- `/riwayat` - Lihat 10 transaksi terakhir

**Contoh:**
```
/pemasukan 5000000 gaji bulanan
/pengeluaran 150000 isi bensin
/saldo
```

## 🌐 Deploy ke Vercel (Gratis)

Lihat panduan lengkap di [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)

**Ringkasan:**
1. Setup database di Neon/Supabase (gratis)
2. Push code ke GitHub
3. Import project di Vercel
4. Set environment variables
5. Deploy!

## 📁 Project Structure

```
personal-finance-app/
├── backend/
│   ├── server.js           # Express server
│   ├── database.js         # PostgreSQL connection
│   ├── telegramBot.js      # Telegram bot logic
│   ├── schema.sql          # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css         # Main styles
│   │   ├── components/
│   │   │   ├── Summary.js
│   │   │   ├── TransactionForm.js
│   │   │   ├── TransactionList.js
│   │   │   ├── CategoryChart.js
│   │   │   └── FilterPanel.js
│   │   └── index.js
│   └── package.json
├── vercel.json             # Vercel config
└── README.md
```

## 🎨 UI/UX

- **Color Palette**: Monochrome (Black, White, Gray)
- **Design Style**: Minimalist, Clean, No Emoji
- **Theme**: Liquid Glass Dark Theme
- **Typography**: Inter font family
- **Responsive**: Mobile-first approach

## 🔒 Security

- Environment variables untuk sensitive data
- HTTPS enforced (Vercel auto)
- Database connection dengan SSL
- Input validation dan sanitization
- No hardcoded credentials

## 📊 API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/summary` - Get summary
- `GET /api/transactions/by-category` - Get by category
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories

### Health
- `GET /api/health` - Health check

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC License

## 👤 Author

Your Name

## 🙏 Acknowledgments

- React Team
- Vercel
- Telegram Bot API
- PostgreSQL

---

**Built with ❤️ using React + Node.js**