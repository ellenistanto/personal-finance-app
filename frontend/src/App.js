import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Summary from './components/Summary';
import CategoryChart from './components/CategoryChart';
import FilterPanel from './components/FilterPanel';

/*
 * API URL configuration:
 * - Uses REACT_APP_API_URL from Vercel Environment Variables if set
 * - Falls back to '/api' (relative path) which works on Vercel since
 *   frontend and backend are served from the same domain
 * - In local development, set REACT_APP_API_URL=http://localhost:5000/api
 *   in frontend/.env
 */
const API_URL = process.env.REACT_APP_API_URL || '/api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({
    total_pemasukan: 0,
    total_pengeluaran: 0,
    saldo: 0,
    total_transactions: 0
  });
  const [categoryData, setCategoryData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    categoryId: ''
  });
  const [loading, setLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    fetchTransactions();
    fetchSummary();
    fetchCategoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.type) params.type = filters.type;
      if (filters.categoryId) params.categoryId = filters.categoryId;

      const response = await axios.get(`${API_URL}/transactions`, { params });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await axios.get(`${API_URL}/transactions/summary`, { params });
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.type) params.type = filters.type;

      const response = await axios.get(`${API_URL}/transactions/by-category`, { params });
      setCategoryData(response.data);
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  const handleAddTransaction = async (transactionData) => {
    try {
      await axios.post(`${API_URL}/transactions`, transactionData);
      fetchTransactions();
      fetchSummary();
      fetchCategoryData();
    } catch (error) {
      console.error('Error adding transaction:', error);
      const errMsg = error.response?.data?.error || error.response?.data?.detail || 'Gagal menambahkan transaksi';
      alert(`❌ ${errMsg}`);
    }
  };

  const handleUpdateTransaction = async (id, transactionData) => {
    try {
      await axios.put(`${API_URL}/transactions/${id}`, transactionData);
      fetchTransactions();
      fetchSummary();
      fetchCategoryData();
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Gagal mengupdate transaksi');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        await axios.delete(`${API_URL}/transactions/${id}`);
        fetchTransactions();
        fetchSummary();
        fetchCategoryData();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Gagal menghapus transaksi');
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Personal Finance Dashboard</h1>
        <p>Kelola keuangan Anda dengan mudah</p>
      </header>

      <div className="container">
        <Summary summary={summary} />

        <div className="main-content">
          <div className="left-panel">
            <TransactionForm 
              categories={categories}
              onSubmit={handleAddTransaction}
              editingTransaction={editingTransaction}
              onUpdate={handleUpdateTransaction}
              onCancelEdit={() => setEditingTransaction(null)}
            />
            
            <FilterPanel 
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="right-panel">
            <CategoryChart data={categoryData} />
          </div>
        </div>

        <TransactionList 
          transactions={transactions}
          loading={loading}
          onEdit={setEditingTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>

      <footer className="app-footer">
        <p>Hubungkan dengan Telegram Bot untuk input cepat</p>
        <p>Gunakan /pemasukan atau /pengeluaran di bot Telegram Anda</p>
      </footer>
    </div>
  );
}

export default App;
