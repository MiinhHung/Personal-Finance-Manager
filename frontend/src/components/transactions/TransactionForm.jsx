// src/components/transactions/TransactionForm.jsx
import React, { useEffect, useState } from 'react';

const emptyForm = {
  type: 'expense',
  categoryId: '',
  amount: '',
  transactionDate: '',
  description: '',
};

function toInputDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  // yyyy-MM-dd
  return d.toISOString().slice(0, 10);
}

function TransactionForm({ categories, onSubmit, onCancelEdit, editingTransaction }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Khi chuyển sang edit 1 giao dịch khác, cập nhật form
  useEffect(() => {
    if (editingTransaction) {
      setForm({
        type: editingTransaction.type,
        categoryId: editingTransaction.category?.categoryId || '',
        amount: editingTransaction.amount.toString(),
        transactionDate: toInputDate(editingTransaction.transactionDate),
        description: editingTransaction.description || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingTransaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        type: form.type,
        amount: Number(form.amount),
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        transactionDate: form.transactionDate,
        description: form.description,
      });
      if (!editingTransaction) {
        setForm(emptyForm);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === form.type);

  return (
    <div style={{ marginBottom: 24, padding: 16, border: '1px solid #374151', borderRadius: 8 }}>
      <h3 style={{ marginBottom: 12 }}>
        {editingTransaction ? 'Sửa giao dịch' : 'Thêm giao dịch mới'}
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ flex: '1 1 120px' }}>
          <label>Loại</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="income">Thu nhập</option>
            <option value="expense">Chi phí</option>
          </select>
        </div>

        <div style={{ flex: '1 1 160px' }}>
          <label>Danh mục</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">-- Chọn danh mục --</option>
            {filteredCategories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 140px' }}>
          <label>Số tiền</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            style={inputStyle}
            required
            min="0"
            placeholder="0"
          />
        </div>

        <div style={{ flex: '1 1 160px' }}>
          <label>Ngày</label>
          <input
            type="date"
            name="transactionDate"
            value={form.transactionDate}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>

        <div style={{ flex: '1 1 220px' }}>
          <label>Mô tả / Ghi chú</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Ví dụ: Ăn trưa, Lương tháng 1..."
          />
        </div>

        <div style={{ flexBasis: '100%', marginTop: 8 }}>
          <button
            type="submit"
            disabled={submitting}
            style={btnStyle}
          >
            {submitting ? 'Đang lưu...' : editingTransaction ? 'Cập nhật' : 'Thêm giao dịch'}
          </button>
          {editingTransaction && (
            <button type="button" onClick={onCancelEdit} style={{ ...btnStyle, marginLeft: 8 }}>
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: 6,
  boxSizing: 'border-box',
  marginTop: 4,
  backgroundColor: '#111827',
  border: '1px solid #4b5563',
  color: '#f9fafb',
};

const btnStyle = {
  padding: '8px 16px',
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default TransactionForm;