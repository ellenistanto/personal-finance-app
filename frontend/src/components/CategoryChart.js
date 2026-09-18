import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CategoryChart = ({ data }) => {
  const COLORS = [
    '#e5e5e5', '#a1a1aa', '#71717a', '#52525b',
    '#4ade80', '#f87171', '#d4d4d8', '#3f3f46'
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
        <div className="chart-tooltip">
          <p className="chart-tooltip-title">{payload[0].name}</p>
          <p className="chart-tooltip-value">{formatCurrency(payload[0].value)}</p>
          <p className="chart-tooltip-meta">{payload[0].payload.count} transaksi</p>
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
        fill="#0a0a0a" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        style={{ 
          fontSize: '12px', 
          fontWeight: '700'
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
