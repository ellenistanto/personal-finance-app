# Contributing to Personal Finance Dashboard

Terima kasih telah tertarik untuk berkontribusi! 🎉

## Cara Berkontribusi

### 1. Fork dan Clone Repository

```bash
# Fork repository di GitHub
# Clone fork Anda
git clone https://github.com/your-username/personal-finance-app.git
cd personal-finance-app
```

### 2. Setup Development Environment

Ikuti panduan di [DEVELOPMENT.md](DEVELOPMENT.md) untuk setup environment lokal.

### 3. Create Feature Branch

```bash
git checkout -b feature/nama-fitur
# atau
git checkout -b bugfix/nama-bug
```

### 4. Make Changes

- Tulis code yang clean dan readable
- Follow coding conventions yang sudah ada
- Tambahkan comments jika diperlukan
- Test perubahan Anda secara menyeluruh

### 5. Commit Changes

```bash
git add .
git commit -m "Add: deskripsi fitur"
```

**Commit Message Convention:**
- `Add:` untuk fitur baru
- `Fix:` untuk bug fixes
- `Update:` untuk update fitur existing
- `Refactor:` untuk refactoring code
- `Docs:` untuk perubahan dokumentasi
- `Style:` untuk formatting, missing semi-colons, etc.

**Contoh:**
```
Add: export transaksi ke Excel
Fix: bug pada filter tanggal
Update: improve chart responsiveness
Refactor: simplify API endpoints
Docs: update README with new features
Style: format code with prettier
```

### 6. Push to GitHub

```bash
git push origin feature/nama-fitur
```

### 7. Create Pull Request

- Buka repository di GitHub
- Klik "New Pull Request"
- Pilih branch Anda
- Isi deskripsi PR dengan detail:
  - Apa yang diubah
  - Kenapa diubah
  - Cara testing
  - Screenshot (jika UI changes)

## Coding Standards

### JavaScript/React

```javascript
// ✅ Good
const handleSubmit = async (data) => {
  try {
    const response = await api.post('/transactions', data);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// ❌ Bad
const handleSubmit = async data => {
    const response = await api.post('/transactions', data)
    return response.data
}
```

### CSS

```css
/* ✅ Good - Organized, readable */
.transaction-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;
}

.transaction-item:hover {
  background-color: #f9fafb;
}

/* ❌ Bad - Messy, no structure */
.transaction-item{display:flex;padding:1rem;}
.transaction-item:hover{background-color:#f9fafb}
```

### Node.js/Express

```javascript
// ✅ Good - Proper error handling
app.get('/api/transactions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions');
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ❌ Bad - No error handling
app.get('/api/transactions', async (req, res) => {
  const result = await pool.query('SELECT * FROM transactions');
  res.json(result.rows);
});
```

## What to Contribute

### 🐛 Bug Reports

Jika menemukan bug:
1. Check apakah bug sudah direport di Issues
2. Jika belum, buat issue baru dengan:
   - Judul yang jelas
   - Langkah untuk reproduce bug
   - Expected behavior vs actual behavior
   - Screenshot/logs jika ada
   - Environment info (OS, browser, Node version)

### ✨ Feature Requests

Punya ide fitur baru?
1. Check apakah sudah ada di Issues atau CHANGELOG
2. Buat issue baru dengan label "enhancement"
3. Jelaskan:
   - Problem yang ingin diselesaikan
   - Solusi yang diusulkan
   - Alternatif yang sudah dipertimbangkan

### 📝 Documentation

- Improve existing docs
- Add examples
- Fix typos
- Translate to other languages

### 🎨 UI/UX Improvements

- Improve design
- Better user experience
- Accessibility improvements
- Mobile responsiveness

### 🧪 Testing

- Add unit tests
- Add integration tests
- Improve test coverage

## Priority Areas

Kami sangat welcome kontribusi di area ini:

1. **Authentication & Security**
   - JWT implementation
   - User registration/login
   - Password encryption

2. **Data Export**
   - Export to Excel
   - Export to PDF
   - CSV export

3. **Advanced Features**
   - Budget planning
   - Recurring transactions
   - Financial reports

4. **Testing**
   - Unit tests untuk components
   - Integration tests untuk API
   - E2E tests

5. **Performance**
   - Optimize database queries
   - Add caching
   - Lazy loading

## Code Review Process

1. Submit PR
2. Maintainer akan review dalam 1-3 hari
3. Jika ada feedback, lakukan perubahan
4. Setelah approved, PR akan di-merge

## Questions?

Jika ada pertanyaan:
- Buat issue dengan label "question"
- Atau hubungi maintainer

## License

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan under MIT License.

---

**Terima kasih atas kontribusi Anda! 🙏**
