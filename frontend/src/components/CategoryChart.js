import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CategoryChart = ({ data }) => {
  const COLORS = [
    '#ffffff', '#e5e5e5', '#d0d0d0', '#b0b0b0', 
    '#909090', '#707070', '#a0a0a0', '#c0c0c0'
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
        fill="black" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ 
          fontSize: '0.875rem', 
          fontWeight: '700',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
