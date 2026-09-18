import React, { useState, useEffect } from 'react';

const TransactionForm = ({ 
  categories, 
  onSubmit, 
  editingTransaction, 
  onUpdate, 
  onCancelEdit 
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'pemasukan',
    category_id: '',
    description: ''
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category_id: editingTransaction.category_id || '',
        description: editingTransaction.description || ''
      });
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || formData.amount <= 0) {
      alert('Jumlah harus lebih dari 0');
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      category_id: formData.category_id ? parseInt(formData.category_id) : null
    };

    if (editingTransaction) {
      onUpdate(editingTransaction.id, transactionData);
    } else {
      onSubmit(transactionData);
    }

    // Reset form
    setFormData({
      amount: '',
      type: 'pemasukan',
      category_id: '',
      description: ''
    });
  };

  const handleCancel = () => {
    setFormData({
      amount: '',
      type: 'pemasukan',
      category_id: '',
      description: ''
    });
    onCancelEdit();
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div className="card">
      <h2>{editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tipe Transaksi</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
            required
          >
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
        </div>

        <div className="form-group">
          <label>Jumlah (Rp)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Masukkan jumlah"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>Kategori</label>
          <select 
            name="category_id" 
            value={formData.category_id} 
            onChange={handleChange}
          >
            <option value="">Pilih Kategori (Opsional)</option>
            {filteredCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Deskripsi</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tambahkan catatan (opsional)"
          />
        </div>

        <div className="button-group">
          {editingTransaction ? (
            <>
              <button type="submit" className="btn-primary">
                Update
              </button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                Batal
              </button>
            </>
          ) : (
            <button type="submit" className="btn-success">
              Tambah Transaksi
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
