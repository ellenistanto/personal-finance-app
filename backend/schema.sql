-- Personal Finance Dashboard Database Schema

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories for pemasukan
INSERT INTO categories (name, type) VALUES
('Gaji', 'pemasukan'),
('Bonus', 'pemasukan'),
('Investasi', 'pemasukan'),
('Lainnya', 'pemasukan');

-- Insert default categories for pengeluaran
INSERT INTO categories (name, type) VALUES
('Makanan', 'pengeluaran'),
('Transport', 'pengeluaran'),
('Belanja', 'pengeluaran'),
('Tagihan', 'pengeluaran'),
('Hiburan', 'pengeluaran'),
('Kesehatan', 'pengeluaran'),
('Lainnya', 'pengeluaran');

-- Create indexes for better performance
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_categories_type ON categories(type);

-- Sample data for testing (optional)
-- INSERT INTO transactions (amount, type, category_id, description) VALUES
-- (5000000, 'pemasukan', 1, 'Gaji bulan September'),
-- (100000, 'pengeluaran', 5, 'Makan siang'),
-- (50000, 'pengeluaran', 6, 'Ongkos transport'),
-- (200000, 'pengeluaran', 7, 'Belanja bulanan');
