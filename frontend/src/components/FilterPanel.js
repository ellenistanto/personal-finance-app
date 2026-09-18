import React, { useState } from 'react';
<<<<<<< HEAD
=======
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
>>>>>>> 172c077dd6946e1b9285de24f71a0ffe7546303c

const FilterPanel = ({ categories, filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

<<<<<<< HEAD
  const formatInputDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

=======
>>>>>>> 172c077dd6946e1b9285de24f71a0ffe7546303c
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
<<<<<<< HEAD
        start = formatInputDate(now);
        end = formatInputDate(now);
        break;
      case 'thisMonth':
        start = formatInputDate(new Date(now.getFullYear(), now.getMonth(), 1));
        end = formatInputDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
        break;
      case 'thisYear':
        start = formatInputDate(new Date(now.getFullYear(), 0, 1));
        end = formatInputDate(new Date(now.getFullYear(), 11, 31));
=======
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
>>>>>>> 172c077dd6946e1b9285de24f71a0ffe7546303c
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
<<<<<<< HEAD
              className="btn-secondary btn-compact" 
              onClick={() => setQuickFilter('today')}
=======
              className="btn-secondary" 
              onClick={() => setQuickFilter('today')}
              style={{ fontSize: '0.9rem', padding: '0.5rem' }}
>>>>>>> 172c077dd6946e1b9285de24f71a0ffe7546303c
            >
              Hari Ini
            </button>
            <button 
              type="button" 
<<<<<<< HEAD
              className="btn-secondary btn-compact" 
              onClick={() => setQuickFilter('thisMonth')}
=======
              className="btn-secondary" 
              onClick={() => setQuickFilter('thisMonth')}
              style={{ fontSize: '0.9rem', padding: '0.5rem' }}
>>>>>>> 172c077dd6946e1b9285de24f71a0ffe7546303c
            >
              Bulan Ini
            </button>
            <button 
              type="button" 
<<<<<<< HEAD
              className="btn-secondary btn-compact" 
              onClick={() => setQuickFilter('thisYear')}
=======
              className="btn-secondary" 
              onClick={() => setQuickFilter('thisYear')}
              style={{ fontSize: '0.9rem', padding: '0.5rem' }}
>>>>>>> 172c077dd6946e1b9285de24f71a0ffe7546303c
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
