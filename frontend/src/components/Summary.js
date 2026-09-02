import React from 'react';

const Summary = ({ summary }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="summary-container">
      <div className="summary-card pemasukan">
        <div className="label">Total Pemasukan</div>
        <div className="amount">{formatCurrency(summary.total_pemasukan)}</div>
      </div>

      <div className="summary-card pengeluaran">
        <div className="label">Total Pengeluaran</div>
        <div className="amount">{formatCurrency(summary.total_pengeluaran)}</div>
      </div>

      <div className="summary-card saldo">
        <div className="label">Saldo</div>
        <div className="amount">{formatCurrency(summary.saldo)}</div>
      </div>
    </div>
  );
};

export default Summary;
