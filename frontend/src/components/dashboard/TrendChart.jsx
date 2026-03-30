// src/components/dashboard/TrendChart.jsx
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '10px',
          borderRadius: '8px',
          backdropFilter: 'blur(4px)',
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>{label}</p>
        <p style={{ margin: 0, color: '#22c55e' }}>Thu nhập: {payload[0].value.toLocaleString()} ₫</p>
        <p style={{ margin: 0, color: '#ef4444' }}>Chi tiêu: {payload[1].value.toLocaleString()} ₫</p>
      </div>
    );
  }
  return null;
};

function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Không có dữ liệu xu hướng
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="period" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" />
          <Area
            type="monotone"
            dataKey="totalIncome"
            name="Thu nhập"
            stroke="#22c55e"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />
          <Area
            type="monotone"
            dataKey="totalExpense"
            name="Chi tiêu"
            stroke="#ef4444"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorExpense)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendChart;
