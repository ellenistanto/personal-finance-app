import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

const FilterPanel = ({ categories, filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      type: '',
      categoryId: ''
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const setQuickFilter = (type) => {
    const now = new Date();
    let start, end;

    switch(type) {
      case 'today':
        start = format(now, 'yyyy-MM-dd');
        end = format(now, 'yyyy-MM-dd');
        break;
      case 'thisMonth':
        start = format(startOfMonth(now), 'yyyy-MM-dd');
        end = format(endOfMonth(now), 'yyyy-MM-dd');
        break;
      case 'thisYear':
        start = format(startOfYear(now), 'yyyy-MM-dd');
        end = format(endOfYear(now), 'yyyy-MM-dd');
        break;
      default:
        start = '';
        end = '';
    }

    const newFilters = {
      ...localFilters,
      startDate: start,
      endDate: end
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filter-panel">
      <h2>Filter Transaksi</h2>
      
      <div className="filter-grid">
        <div className="form-group">
          <label>Filter Cepat</label>
          <div className="button-group">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setQuickFilter('today')}
              style={{ fontSize: '0.9rem', padding: '0.5rem' }}
            >
              Hari Ini
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setQuickFilter('thisMonth')}
              style={{ fontSize: '0.9rem', padding: '0.5rem' }}
            >
              Bulan Ini
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => setQuickFilter('thisYear')}
              style={{ fontSize: '0.9rem', padding: '0.5rem' }}
            >
              Tahun Ini
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Tanggal Mulai</label>
          <input
            type="date"
            name="startDate"
            value={localFilters.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Tanggal Akhir</label>
          <input
            type="date"
            name="endDate"
            value={localFilters.endDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Tipe Transaksi</label>
          <select 
            name="type" 
            value={localFilters.type} 
            onChange={handleChange}
          >
            <option value="">Semua Tipe</option>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
        </div>

        <div className="form-group">
          <label>Kategori</label>
          <select 
            name="categoryId" 
            value={localFilters.categoryId} 
            onChange={handleChange}
          >
            <option value="">Semua Kategori</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name} ({category.type})
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="btn-primary" 
            onClick={handleApply}
          >
            Terapkan Filter
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
