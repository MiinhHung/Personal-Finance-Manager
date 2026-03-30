import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#36CFC9', '#F97316', '#22C55E', '#3B82F6', '#E11D48', '#A855F7', '#14B8A6'];

function formatCurrency(amount) {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Không có dữ liệu chi tiêu trong khoảng thời gian này
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.categoryName || 'Chưa phân loại',
    value: item.totalAmount,
  }));

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={(entry) => `${entry.name} (${Math.round(entry.percent * 100)}%)`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(value)}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;