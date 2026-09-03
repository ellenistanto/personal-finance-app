const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const pool = require('./database.js');

dotenv.config();

let bot = null;

// Only initialize bot if token is provided
if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'your_telegram_bot_token_here') {
  bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
}

// Store user states for conversation flow
const userStates = {};

const initTelegramBot = () => {
  if (!bot) {
    console.log('Telegram bot token not configured. Skipping bot initialization...');
    return;
  }

  // Skip polling initialization in Vercel/serverless environment
  // Polling does not work in serverless functions (they spin up/down per request)
  // The bot will need webhook mode for serverless environments
  if (process.env.VERCEL) {
    console.log('Running on Vercel. Telegram bot polling is disabled for serverless environment.');
    return;
  }

  console.log('Telegram bot is running...');

  // Command: /start
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      `Selamat datang di Personal Finance Bot! 🏦\n\n` +
      `Gunakan perintah berikut:\n` +
      `/pemasukan <jumlah> <deskripsi> - Catat pemasukan\n` +
      `/pengeluaran <jumlah> <deskripsi> - Catat pengeluaran\n` +
      `/saldo - Lihat saldo dan ringkasan\n` +
      `/riwayat - Lihat 10 transaksi terakhir\n\n` +
      `Contoh: /pemasukan 1000000 gaji bulanan`
    );
  });

  // Command: /pemasukan
  bot.onText(/\/pemasukan (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const input = match[1].trim().split(' ');

    if (input.length < 1) {
      bot.sendMessage(chatId, '❌ Format salah! Gunakan: /pemasukan <jumlah> <deskripsi>');
      return;
    }

    const amount = parseFloat(input[0]);
    const description = input.slice(1).join(' ') || 'Pemasukan';

    if (isNaN(amount) || amount <= 0) {
      bot.sendMessage(chatId, '❌ Jumlah harus berupa angka positif!');
      return;
    }

    try {
      // Get default category for pemasukan
      const categoryResult = await pool.query(
        `SELECT id FROM categories WHERE type = 'pemasukan' AND name = 'Lainnya' LIMIT 1`
      );

      const categoryId = categoryResult.rows[0]?.id || null;

      await pool.query(
        `INSERT INTO transactions (amount, type, category_id, description) VALUES ($1, $2, $3, $4)`,
        [amount, 'pemasukan', categoryId, description]
      );

      bot.sendMessage(
        chatId,
        `✅ Pemasukan berhasil dicatat!\n\n` +
        `💰 Jumlah: Rp ${amount.toLocaleString('id-ID')}\n` +
        `📝 Deskripsi: ${description}`
      );
    } catch (error) {
      console.error('Error adding pemasukan:', error);
      bot.sendMessage(chatId, '❌ Terjadi kesalahan saat menyimpan data.');
    }
  });

  // Command: /pengeluaran
  bot.onText(/\/pengeluaran (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const input = match[1].trim().split(' ');

    if (input.length < 1) {
      bot.sendMessage(chatId, '❌ Format salah! Gunakan: /pengeluaran <jumlah> <deskripsi>');
      return;
    }

    const amount = parseFloat(input[0]);
    const description = input.slice(1).join(' ') || 'Pengeluaran';

    if (isNaN(amount) || amount <= 0) {
      bot.sendMessage(chatId, '❌ Jumlah harus berupa angka positif!');
      return;
    }

    try {
      // Get default category for pengeluaran
      const categoryResult = await pool.query(
        `SELECT id FROM categories WHERE type = 'pengeluaran' AND name = 'Lainnya' LIMIT 1`
      );

      const categoryId = categoryResult.rows[0]?.id || null;

      await pool.query(
        `INSERT INTO transactions (amount, type, category_id, description) VALUES ($1, $2, $3, $4)`,
        [amount, 'pengeluaran', categoryId, description]
      );

      bot.sendMessage(
        chatId,
        `✅ Pengeluaran berhasil dicatat!\n\n` +
        `💸 Jumlah: Rp ${amount.toLocaleString('id-ID')}\n` +
        `📝 Deskripsi: ${description}`
      );
    } catch (error) {
      console.error('Error adding pengeluaran:', error);
      bot.sendMessage(chatId, '❌ Terjadi kesalahan saat menyimpan data.');
    }
  });

  // Command: /saldo
  bot.onText(/\/saldo/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const result = await pool.query(`
        SELECT 
          COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END), 0) as total_pemasukan,
          COALESCE(SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END), 0) as total_pengeluaran,
          COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE -amount END), 0) as saldo
        FROM transactions
      `);

      const { total_pemasukan, total_pengeluaran, saldo } = result.rows[0];

      bot.sendMessage(
        chatId,
        `📊 RINGKASAN KEUANGAN\n\n` +
        `💰 Total Pemasukan: Rp ${parseFloat(total_pemasukan).toLocaleString('id-ID')}\n` +
        `💸 Total Pengeluaran: Rp ${parseFloat(total_pengeluaran).toLocaleString('id-ID')}\n` +
        `━━━━━━━━━━━━━━━━━\n` +
        `💵 Saldo: Rp ${parseFloat(saldo).toLocaleString('id-ID')}`
      );
    } catch (error) {
      console.error('Error getting saldo:', error);
      bot.sendMessage(chatId, '❌ Terjadi kesalahan saat mengambil data.');
    }
  });

  // Command: /riwayat
  bot.onText(/\/riwayat/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const result = await pool.query(`
        SELECT amount, type, description, transaction_date
        FROM transactions
        ORDER BY transaction_date DESC
        LIMIT 10
      `);

      if (result.rows.length === 0) {
        bot.sendMessage(chatId, '📭 Belum ada transaksi.');
        return;
      }

      let message = '📋 RIWAYAT TRANSAKSI (10 Terakhir)\n\n';

      result.rows.forEach((row, index) => {
        const icon = row.type === 'pemasukan' ? '💰' : '💸';
        const date = new Date(row.transaction_date).toLocaleDateString('id-ID');
        message += `${index + 1}. ${icon} ${row.type.toUpperCase()}\n`;
        message += `   Rp ${parseFloat(row.amount).toLocaleString('id-ID')}\n`;
        message += `   ${row.description}\n`;
        message += `   ${date}\n\n`;
      });

      bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error getting riwayat:', error);
      bot.sendMessage(chatId, '❌ Terjadi kesalahan saat mengambil data.');
    }
  });
};

module.exports = { bot, initTelegramBot };
