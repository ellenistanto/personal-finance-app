const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const { Pool } = pg;

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('WARNING: DATABASE_URL is not set. Database-dependent endpoints will fail.');
}

// Create pool with SSL support for cloud PostgreSQL providers (Supabase, Neon, Railway, etc.)
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  // Supabase Transaction Pooler (PgBouncer) requires max 1 connection per serverless function
  max: 1,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
};

// Enable SSL for production (Vercel deploys to production)
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  poolConfig.ssl = {
    rejectUnauthorized: false, // Required for Supabase and other cloud PostgreSQL providers
  };
}

const pool = new Pool(poolConfig);

// Test connection
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit the process, just log the error
});

// Initialize database tables
const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        amount DECIMAL(15, 2) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
        category_id INTEGER REFERENCES categories(id),
        description TEXT,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default categories if not exists
    await client.query(`
      INSERT INTO categories (name, type) 
      SELECT * FROM (VALUES 
        ('Gaji', 'pemasukan'),
        ('Bonus', 'pemasukan'),
        ('Investasi', 'pemasukan'),
        ('Lainnya', 'pemasukan'),
        ('Makanan', 'pengeluaran'),
        ('Transport', 'pengeluaran'),
        ('Belanja', 'pengeluaran'),
        ('Tagihan', 'pengeluaran'),
        ('Hiburan', 'pengeluaran'),
        ('Kesehatan', 'pengeluaran'),
        ('Lainnya', 'pengeluaran')
      ) AS v(name, type)
      WHERE NOT EXISTS (SELECT 1 FROM categories LIMIT 1);
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

pool.initDatabase = initDatabase;
module.exports = pool;
