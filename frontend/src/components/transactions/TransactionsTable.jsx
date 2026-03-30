// src/components/transactions/TransactionsTable.jsx
import React from 'react';

function formatCurrency(amount) {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('vi-VN');
}

function TransactionsTable({ transactions, onEdit, onDelete }) {
  if (!transactions || transactions.length === 0) {
    return <p>Không tìm thấy giao dịch nào.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
      <thead>
        <tr>
          <th style={thStyle}>Ngày</th>
          <th style={thStyle}>Loại</th>
          <th style={thStyle}>Danh mục</th>
          <th style={thStyle}>Số tiền</th>
          <th style={thStyle}>Ghi chú</th>
          <th style={thStyle}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx.transactionId}>
            <td style={tdStyle}>{formatDate(tx.transactionDate)}</td>
            <td style={{ ...tdStyle, color: tx.type === 'income' ? '#22c55e' : '#ef4444' }}>
              {tx.type === 'income' ? 'Thu nhập' : 'Chi phí'}
            </td>
            <td style={tdStyle}>{tx.category?.name || 'Chưa phân loại'}</td>
            <td style={tdStyle}>{formatCurrency(tx.amount)}</td>
            <td style={tdStyle}>{tx.description}</td>
            <td style={tdStyle}>
              <button
                type="button"
                onClick={() => onEdit(tx)}
                style={{ ...btnSmallStyle, marginRight: 8 }}
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => onDelete(tx)}
                style={{ ...btnSmallStyle, color: '#ef4444' }}
              >
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '6px 4px',
  borderBottom: '1px solid #4b5563',
};

const tdStyle = {
  padding: '6px 4px',
  borderBottom: '1px solid #1f2937',
  fontSize: 14,
};

const btnSmallStyle = {
  padding: '4px 8px',
  fontSize: '12px',
  cursor: 'pointer',
  backgroundColor: '#1f2937',
  color: '#e5e7eb',
  border: '1px solid #374151',
  borderRadius: '4px',
};

export default TransactionsTable;