import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const TransactionList = ({ transactions, loading, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="transaction-list">
        <h2>Daftar Transaksi</h2>
        <div className="loading">Memuat data...</div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <h2>Daftar Transaksi</h2>
        <div className="no-data">Belum ada transaksi. Tambahkan transaksi pertama Anda!</div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h2>Daftar Transaksi ({transactions.length})</h2>
      {transactions.map(transaction => (
        <div key={transaction.id} className="transaction-item">
          <div className="transaction-details">
            <div className={`transaction-type ${transaction.type}`}>
              {transaction.type}
            </div>
            <div className="transaction-description">
              {transaction.description || 'Tidak ada deskripsi'}
            </div>
            <div className="transaction-category">
              {transaction.category_name && `${transaction.category_name}`}
            </div>
            <div className="transaction-date">
              {formatDate(transaction.transaction_date)}
            </div>
          </div>

          <div className={`transaction-amount ${transaction.type}`}>
            {transaction.type === 'pemasukan' ? '+' : '-'}
            {formatCurrency(Math.abs(transaction.amount))}
          </div>

          <div className="transaction-actions">
            <button 
              className="btn-edit" 
              onClick={() => onEdit(transaction)}
            >
              Edit
            </button>
            <button 
              className="btn-delete" 
              onClick={() => onDelete(transaction.id)}
            >
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
