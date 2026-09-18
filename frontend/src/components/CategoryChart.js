import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CategoryChart = ({ data }) => {
  const COLORS = [
<<<<<<< HEAD
    '#e5e5e5', '#a1a1aa', '#71717a', '#52525b',
    '#4ade80', '#f87171', '#d4d4d8', '#3f3f46'
=======
    '#ffffff', '#e5e5e5', '#d0d0d0', '#b0b0b0', 
    '#909090', '#707070', '#a0a0a0', '#c0c0c0'
>>>>>>> 172c077dd6946e1b9285de24f71a0ffe7546303c
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Filter data with transactions
  const chartData = data
    .filter(item => parseFloat(item.total_amount) > 0)
    .map(item => ({
      name: item.category_name,
      value: parseFloat(item.total_amount),
      count: item.transaction_count
    }));

  if (chartData.length === 0) {
    return (
      <div className="card">
        <h2>Transaksi per Kategori</h2>
        <div className="no-data">Belum ada data untuk ditampilkan</div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
<<<<<<< HEAD
        <div className="chart-tooltip">
          <p className="chart-tooltip-title">{payload[0].name}</p>
          <p className="chart-tooltip-value">{formatCurrency(payload[0].value)}</p>
          <p className="chart-tooltip-meta">{payload[0].payload.count} transaksi</p>
=======
        <div style={{
          background: 'rgba(20, 20, 20, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '12px 16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#ffffff' }}>{payload[0].name}</p>
          <p style={{ margin: '5px 0 0 0', color: '#e5e5e5', fontWeight: '600' }}>
            {formatCurrency(payload[0].value)}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.875rem', color: '#a0a0a0' }}>
            {payload[0].payload.count} transaksi
          </p>
>>>>>>> 172c077dd6946e1b9285de24f71a0ffe7546303c
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text 
        x={x} 
        y={y} 
<<<<<<< HEAD
        fill="#0a0a0a" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ 
          fontSize: '12px', 
          fontWeight: '700'
=======
        fill="black" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ 
          fontSize: '0.875rem', 
          fontWeight: '700',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
>>>>>>> 172c077dd6946e1b9285de24f71a0ffe7546303c
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="card">
      <h2>Transaksi per Kategori</h2>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            strokeWidth={2}
            stroke="rgba(0, 0, 0, 0.3)"
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
<<<<<<< HEAD
      <div className="category-list">
        <h3>Detail Kategori</h3>
        {chartData.map((item, index) => (
          <div key={index} className="category-row">
            <span className="category-name">
              <span
                className="category-dot"
                style={{ background: COLORS[index % COLORS.length] }}
                aria-hidden="true"
              />
              {item.name}
              <span className="category-count">{item.count}x</span>
            </span>
            <span className="category-value">{formatCurrency(item.value)}</span>
=======
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ color: '#d0d0d0', fontSize: '1rem', marginBottom: '1rem' }}>Detail Kategori</h3>
        {chartData.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            transition: 'all 0.2s ease',
            borderRadius: '8px',
            marginBottom: '0.25rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ display: 'flex', alignItems: 'center', color: '#d0d0d0' }}>
              <span style={{ 
                width: '14px', 
                height: '14px', 
                background: COLORS[index % COLORS.length],
                borderRadius: '3px',
                display: 'inline-block',
                marginRight: '10px',
              }}></span>
              {item.name}
              <span style={{ 
                marginLeft: '8px', 
                fontSize: '0.75rem', 
                color: '#808080',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                {item.count}x
              </span>
            </span>
            <span style={{ fontWeight: '700', color: '#ffffff' }}>
              {formatCurrency(item.value)}
            </span>
>>>>>>> 172c077dd6946e1b9285de24f71a0ffe7546303c
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
