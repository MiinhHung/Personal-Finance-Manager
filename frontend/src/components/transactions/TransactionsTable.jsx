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
    return <p>No transactions found.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
      <thead>
        <tr>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Type</th>
          <th style={thStyle}>Category</th>
          <th style={thStyle}>Amount</th>
          <th style={thStyle}>Description</th>
          <th style={thStyle}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx.transactionId}>
            <td style={tdStyle}>{formatDate(tx.transactionDate)}</td>
            <td style={{ ...tdStyle, color: tx.type === 'income' ? '#22c55e' : '#ef4444' }}>
              {tx.type}
            </td>
            <td style={tdStyle}>{tx.category?.name || 'Uncategorized'}</td>
            <td style={tdStyle}>{formatCurrency(tx.amount)}</td>
            <td style={tdStyle}>{tx.description}</td>
            <td style={tdStyle}>
              <button
                type="button"
                onClick={() => onEdit(tx)}
                style={{ marginRight: 8 }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(tx)}
              >
                Delete
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

export default TransactionsTable;