const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const pool = require('./database.js');

dotenv.config();

let bot = null;

// Initialize bot
if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'your_telegram_bot_token_here') {
  // Use polling only for local development (not on Vercel)
  const isServerless = !!process.env.VERCEL;
  bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: !isServerless,
  });
} else {
  console.warn('TELEGRAM_BOT_TOKEN is not set or using placeholder.');
}

// Process single message asynchronously (serverless-compatible)
const processMessage = async (msg) => {
  if (!bot || !msg || !msg.text) return;

  const chatId = msg.chat.id;
  const text = msg.text.trim();

  console.log(`[Telegram] Processing message from ${chatId}: "${text}"`);

  try {
    // Command: /start
    if (text.startsWith('/start')) {
      await bot.sendMessage(
        chatId,
        `Selamat datang di Personal Finance Bot! 🏦\n\n` +
        `Gunakan perintah berikut:\n` +
        `/pemasukan <jumlah> <deskripsi> - Catat pemasukan\n` +
        `/pengeluaran <jumlah> <deskripsi> - Catat pengeluaran\n` +
        `/saldo - Lihat saldo dan ringkasan\n` +
        `/riwayat - Lihat 10 transaksi terakhir\n\n` +
        `Contoh: /pemasukan 1000000 gaji bulanan`
      );
      return;
    }

    // Command: /pemasukan
    if (text.startsWith('/pemasukan')) {
      const parts = text.replace('/pemasukan', '').trim().split(' ');
      if (parts.length === 0 || !parts[0]) {
        await bot.sendMessage(chatId, '❌ Format salah! Gunakan: /pemasukan <jumlah> <deskripsi>');
        return;
      }

      const amount = parseFloat(parts[0]);
      const description = parts.slice(1).join(' ') || 'Pemasukan';

      if (isNaN(amount) || amount <= 0) {
        await bot.sendMessage(chatId, '❌ Jumlah harus berupa angka positif!');
        return;
      }

      const categoryResult = await pool.query(
        `SELECT id FROM categories WHERE type = 'pemasukan' AND name = 'Lainnya' LIMIT 1`
      );
      const categoryId = categoryResult.rows[0]?.id || null;

      await pool.query(
        `INSERT INTO transactions (amount, type, category_id, description) VALUES ($1, $2, $3, $4)`,
        [amount, 'pemasukan', categoryId, description]
      );

      await bot.sendMessage(
        chatId,
        `✅ Pemasukan berhasil dicatat!\n\n` +
        `💰 Jumlah: Rp ${amount.toLocaleString('id-ID')}\n` +
        `📝 Deskripsi: ${description}`
      );
      return;
    }

    // Command: /pengeluaran
    if (text.startsWith('/pengeluaran')) {
      const parts = text.replace('/pengeluaran', '').trim().split(' ');
      if (parts.length === 0 || !parts[0]) {
        await bot.sendMessage(chatId, '❌ Format salah! Gunakan: /pengeluaran <jumlah> <deskripsi>');
        return;
      }

      const amount = parseFloat(parts[0]);
      const description = parts.slice(1).join(' ') || 'Pengeluaran';

      if (isNaN(amount) || amount <= 0) {
        await bot.sendMessage(chatId, '❌ Jumlah harus berupa angka positif!');
        return;
      }

      const categoryResult = await pool.query(
        `SELECT id FROM categories WHERE type = 'pengeluaran' AND name = 'Lainnya' LIMIT 1`
      );
      const categoryId = categoryResult.rows[0]?.id || null;

      await pool.query(
        `INSERT INTO transactions (amount, type, category_id, description) VALUES ($1, $2, $3, $4)`,
        [amount, 'pengeluaran', categoryId, description]
      );

      await bot.sendMessage(
        chatId,
        `✅ Pengeluaran berhasil dicatat!\n\n` +
        `💸 Jumlah: Rp ${amount.toLocaleString('id-ID')}\n` +
        `📝 Deskripsi: ${description}`
      );
      return;
    }

    // Command: /saldo
    if (text.startsWith('/saldo')) {
      const result = await pool.query(`
        SELECT 
          COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END), 0) as total_pemasukan,
          COALESCE(SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END), 0) as total_pengeluaran,
          COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE -amount END), 0) as saldo
        FROM transactions
      `);

      const { total_pemasukan, total_pengeluaran, saldo } = result.rows[0];

      await bot.sendMessage(
        chatId,
        `📊 RINGKASAN KEUANGAN\n\n` +
        `💰 Total Pemasukan: Rp ${parseFloat(total_pemasukan).toLocaleString('id-ID')}\n` +
        `💸 Total Pengeluaran: Rp ${parseFloat(total_pengeluaran).toLocaleString('id-ID')}\n` +
        `━━━━━━━━━━━━━━━━━\n` +
        `💵 Saldo: Rp ${parseFloat(saldo).toLocaleString('id-ID')}`
      );
      return;
    }

    // Command: /riwayat
    if (text.startsWith('/riwayat')) {
      const result = await pool.query(`
        SELECT amount, type, description, transaction_date
        FROM transactions
        ORDER BY transaction_date DESC
        LIMIT 10
      `);

      if (result.rows.length === 0) {
        await bot.sendMessage(chatId, '📭 Belum ada transaksi.');
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

      await bot.sendMessage(chatId, message);
      return;
    }

    // If message is unknown, ignore or send help
  } catch (error) {
    console.error('[Telegram] Error processing message:', error);
    try {
      await bot.sendMessage(chatId, '❌ Terjadi kesalahan saat memproses permintaan.');
    } catch (sendErr) {
      console.error('[Telegram] Error sending error message:', sendErr);
    }
  }
};

// Handle incoming webhook update from Telegram (awaitable in Vercel!)
const handleUpdate = async (update) => {
  if (!bot) {
    console.warn('[Telegram Webhook] Bot not initialized. Check TELEGRAM_BOT_TOKEN.');
    return;
  }
  if (update && update.message) {
    await processMessage(update.message);
  }
};

// Setup polling listener for local development
const initTelegramBot = () => {
  if (!bot) {
    console.log('Telegram bot token not configured. Skipping bot initialization...');
    return;
  }

  if (!process.env.VERCEL) {
    console.log('Telegram bot is running in polling mode (local)...');
    bot.on('message', async (msg) => {
      await processMessage(msg);
    });
  } else {
    console.log('Telegram bot configured in webhook mode (Vercel).');
  }
};

module.exports = { bot, initTelegramBot, handleUpdate };
