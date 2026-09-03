const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./database.js');
const { initTelegramBot } = require('./telegramBot.js');
const initDatabase = pool.initDatabase;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration: allow Vercel deployments and localhost
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain or localhost
    if (
      origin.includes('.vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    // Allow custom domain if set
    if (process.env.ALLOWED_ORIGIN && origin === process.env.ALLOWED_ORIGIN) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize database (track the promise so we can wait for it in serverless)
let dbInitialized = false;
const dbInitPromise = initDatabase().then(() => {
  initTelegramBot();
  dbInitialized = true;
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  dbInitialized = true; // Mark as initialized even on failure to avoid blocking forever
});

// Middleware: wait for database initialization before processing requests
// This ensures tables exist before any API route queries the database
// In warm starts (Vercel Fluid Compute), dbInitialized is already true
app.use(async (req, res, next) => {
  if (dbInitialized) {
    return next();
  }
  if (dbInitPromise) {
    try {
      await dbInitPromise;
    } catch (e) {
      // Database init failed, routes will return 500
    }
  }
  next();
});

// Routes

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const { startDate, endDate, type, categoryId } = req.query;
    
    let query = `
      SELECT t.*, c.name as category_name, c.type as category_type
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (startDate) {
      query += ` AND t.transaction_date >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      query += ` AND t.transaction_date <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    if (type) {
      query += ` AND t.type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    if (categoryId) {
      query += ` AND t.category_id = $${paramCount}`;
      params.push(categoryId);
      paramCount++;
    }

    query += ' ORDER BY t.transaction_date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get transaction summary
app.get('/api/transactions/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END), 0) as total_pemasukan,
        COALESCE(SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END), 0) as total_pengeluaran,
        COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE -amount END), 0) as saldo,
        COUNT(*) as total_transactions
      FROM transactions
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (startDate) {
      query += ` AND transaction_date >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      query += ` AND transaction_date <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    const result = await pool.query(query, params);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching summary:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get transactions by category
app.get('/api/transactions/by-category', async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    let query = `
      SELECT 
        c.name as category_name,
        c.type as category_type,
        COALESCE(SUM(t.amount), 0) as total_amount,
        COUNT(t.id) as transaction_count
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id
    `;
    const params = [];
    let paramCount = 1;
    const conditions = [];

    if (startDate) {
      conditions.push(`t.transaction_date >= $${paramCount}`);
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      conditions.push(`t.transaction_date <= $${paramCount}`);
      params.push(endDate);
      paramCount++;
    }

    if (type) {
      conditions.push(`c.type = $${paramCount}`);
      params.push(type);
      paramCount++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY c.id, c.name, c.type ORDER BY total_amount DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching by category:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { amount, type, category_id, description } = req.body;

    if (!amount || !type) {
      return res.status(400).json({ error: 'Amount and type are required' });
    }

    if (type !== 'pemasukan' && type !== 'pengeluaran') {
      return res.status(400).json({ error: 'Type must be pemasukan or pengeluaran' });
    }

    const result = await pool.query(
      `INSERT INTO transactions (amount, type, category_id, description) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [amount, type, category_id || null, description || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating transaction:', error.message, '| Code:', error.code);
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured. Set DATABASE_URL environment variable.' });
    }
    if (error.code === '42P01') {
      return res.status(500).json({ error: 'Database tables not initialized.', detail: error.message });
    }
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Invalid category_id. Category does not exist.' });
    }
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      return res.status(500).json({ error: 'Cannot connect to database. Check DATABASE_URL in Vercel env vars.', detail: error.message });
    }
    res.status(500).json({ error: 'Internal server error', detail: error.message });
  }
});

// Update transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category_id, description } = req.body;

    const result = await pool.query(
      `UPDATE transactions 
       SET amount = $1, type = $2, category_id = $3, description = $4
       WHERE id = $5 RETURNING *`,
      [amount, type, category_id || null, description || '', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating transaction:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories ORDER BY type, name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error.message || error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware (must be after all routes)
// Prevents unhandled errors from leaving the function in an undefined state
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message || err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: 'Internal server error' });
});

// Only start listening in local development (not in Vercel serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export app for Vercel
module.exports = app;
