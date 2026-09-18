# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend-url.com/api
```

## Endpoints

### 1. Health Check
**GET** `/health`

Response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

### 2. Get All Transactions
**GET** `/transactions`

Query Parameters:
- `startDate` (optional): Filter start date (YYYY-MM-DD)
- `endDate` (optional): Filter end date (YYYY-MM-DD)
- `type` (optional): Filter by type (`pemasukan` or `pengeluaran`)
- `categoryId` (optional): Filter by category ID

Response:
```json
[
  {
    "id": 1,
    "amount": "1000000.00",
    "type": "pemasukan",
    "category_id": 1,
    "category_name": "Gaji",
    "category_type": "pemasukan",
    "description": "Gaji bulanan",
    "transaction_date": "2026-09-02T20:00:00.000Z",
    "created_at": "2026-09-02T20:00:00.000Z"
  }
]
```

---

### 3. Get Transaction Summary
**GET** `/transactions/summary`

Query Parameters:
- `startDate` (optional): Filter start date (YYYY-MM-DD)
- `endDate` (optional): Filter end date (YYYY-MM-DD)

Response:
```json
{
  "total_pemasukan": "5000000.00",
  "total_pengeluaran": "2000000.00",
  "saldo": "3000000.00",
  "total_transactions": 25
}
```

---

### 4. Get Transactions by Category
**GET** `/transactions/by-category`

Query Parameters:
- `startDate` (optional): Filter start date (YYYY-MM-DD)
- `endDate` (optional): Filter end date (YYYY-MM-DD)
- `type` (optional): Filter by type (`pemasukan` or `pengeluaran`)

Response:
```json
[
  {
    "category_name": "Gaji",
    "category_type": "pemasukan",
    "total_amount": "5000000.00",
    "transaction_count": 5
  }
]
```

---

### 5. Create Transaction
**POST** `/transactions`

Request Body:
```json
{
  "amount": 1000000,
  "type": "pemasukan",
  "category_id": 1,
  "description": "Gaji bulanan"
}
```

Response:
```json
{
  "id": 1,
  "amount": "1000000.00",
  "type": "pemasukan",
  "category_id": 1,
  "description": "Gaji bulanan",
  "transaction_date": "2026-09-02T20:00:00.000Z",
  "created_at": "2026-09-02T20:00:00.000Z"
}
```

---

### 6. Update Transaction
**PUT** `/transactions/:id`

Request Body:
```json
{
  "amount": 1500000,
  "type": "pemasukan",
  "category_id": 1,
  "description": "Gaji bulanan + bonus"
}
```

Response:
```json
{
  "id": 1,
  "amount": "1500000.00",
  "type": "pemasukan",
  "category_id": 1,
  "description": "Gaji bulanan + bonus",
  "transaction_date": "2026-09-02T20:00:00.000Z",
  "created_at": "2026-09-02T20:00:00.000Z"
}
```

---

### 7. Delete Transaction
**DELETE** `/transactions/:id`

Response:
```json
{
  "message": "Transaction deleted successfully"
}
```

---

### 8. Get All Categories
**GET** `/categories`

Response:
```json
[
  {
    "id": 1,
    "name": "Gaji",
    "type": "pemasukan",
    "created_at": "2026-09-02T20:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Makanan",
    "type": "pengeluaran",
    "created_at": "2026-09-02T20:00:00.000Z"
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Amount and type are required"
}
```

### 404 Not Found
```json
{
  "error": "Transaction not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Telegram Bot Commands

### `/start`
Memulai bot dan menampilkan panduan penggunaan

### `/pemasukan <jumlah> <deskripsi>`
Mencatat pemasukan baru

Example:
```
/pemasukan 1000000 gaji bulanan
```

Response:
```
✅ Pemasukan berhasil dicatat!

💰 Jumlah: Rp 1.000.000
📝 Deskripsi: gaji bulanan
```

### `/pengeluaran <jumlah> <deskripsi>`
Mencatat pengeluaran baru

Example:
```
/pengeluaran 50000 makan siang
```

Response:
```
✅ Pengeluaran berhasil dicatat!

💸 Jumlah: Rp 50.000
📝 Deskripsi: makan siang
```

### `/saldo`
Menampilkan ringkasan keuangan

Response:
```
📊 RINGKASAN KEUANGAN

💰 Total Pemasukan: Rp 5.000.000
💸 Total Pengeluaran: Rp 2.000.000
━━━━━━━━━━━━━━━━━
💵 Saldo: Rp 3.000.000
```

### `/riwayat`
Menampilkan 10 transaksi terakhir

Response:
```
📋 RIWAYAT TRANSAKSI (10 Terakhir)

1. 💰 PEMASUKAN
   Rp 1.000.000
   gaji bulanan
   02/09/2026

2. 💸 PENGELUARAN
   Rp 50.000
   makan siang
   02/09/2026
```

---

## Rate Limiting

Saat ini tidak ada rate limiting. Untuk production, disarankan menggunakan rate limiting middleware seperti `express-rate-limit`.

## CORS

CORS sudah di-enable untuk semua origins. Untuk production, update CORS config di `backend/server.js`:

```javascript
app.use(cors({
  origin: 'https://your-frontend-url.com'
}));
```

## Authentication

Saat ini API tidak menggunakan authentication. Untuk menambahkan authentication:

1. Install JWT: `npm install jsonwebtoken`
2. Tambahkan middleware authentication
3. Protect endpoints yang memerlukan auth

## Database Schema

### Table: categories
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table: transactions
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(15, 2) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
  category_id INTEGER REFERENCES categories(id),
  description TEXT,
  transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
