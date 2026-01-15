// src/pages/TransactionsPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  message,
  DatePicker,
} from 'antd';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import transactionsApi from '../api/transactionsApi';
import categoriesApi from '../api/categoriesApi';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionsTable from '../components/transactions/TransactionsTable';
import PageContainer from '../components/layout/PageContainer';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function TransactionsPage() {
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [filters, setFilters] = useState({
    type: '',
    from: '',
    to: '',
  });

  const [editingTransaction, setEditingTransaction] = useState(null);

  // Đọc query string để set filter (từ Dashboard click card)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    const fromParam = params.get('from');
    const toParam = params.get('to');

    setFilters({
      type:
        typeParam === 'income' || typeParam === 'expense'
          ? typeParam
          : '',
      from: fromParam || '',
      to: toParam || '',
    });
  }, [location.search]);

  // Load categories 1 lần
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesApi.getAll();
        const list = res.data.data.categories || [];
        setCategories(
          list.map((c) => ({
            categoryId: c.categoryId,
            name: c.name,
            type: c.type,
            isSystem: c.isSystem,
          })),
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load categories', err);
      }
    };

    fetchCategories();
  }, []);

  const fetchTransactions = async (pageParam = page) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const params = {
        page: pageParam,
        pageSize,
      };

      if (filters.type) params.type = filters.type;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const res = await transactionsApi.getList(params);
      const data = res.data.data;
      setTransactions(data.items || []);
      setPage(data.page);
      setTotalCount(data.totalCount);
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Không tải được danh sách giao dịch';
      setErrorMessage(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách khi filter thay đổi
  useEffect(() => {
    fetchTransactions(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.type, filters.from, filters.to]);

  const handleTypeChange = (e) => {
    const { value } = e.target;
    setFilters((prev) => ({ ...prev, type: value }));
  };

  const handleDateRangeChange = (dates) => {
    if (!dates || dates.length === 0) {
      setFilters((prev) => ({ ...prev, from: '', to: '' }));
    } else {
      setFilters((prev) => ({
        ...prev,
        from: dates[0].format('YYYY-MM-DD'),
        to: dates[1].format('YYYY-MM-DD'),
      }));
    }
  };

  const handleCreateOrUpdate = async (payload) => {
    try {
      if (editingTransaction) {
        await transactionsApi.update(editingTransaction.transactionId, payload);
        setEditingTransaction(null);
        message.success('Cập nhật giao dịch thành công');
      } else {
        await transactionsApi.create(payload);
        message.success('Thêm giao dịch thành công');
      }
      await fetchTransactions(1);
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Lưu giao dịch thất bại';
      message.error(msg);
    }
  };

  const handleEdit = (tx) => {
    setEditingTransaction(tx);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleDelete = async (tx) => {
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa giao dịch này?');
    if (!confirmDelete) return;
    try {
      await transactionsApi.remove(tx.transactionId);
      message.success('Xóa giao dịch thành công');
      await fetchTransactions(page);
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Xóa giao dịch thất bại';
      message.error(msg);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const rangeValue =
    filters.from && filters.to
      ? [dayjs(filters.from, 'YYYY-MM-DD'), dayjs(filters.to, 'YYYY-MM-DD')]
      : null;

  return (
    <PageContainer>
      <Title level={3} style={{ marginBottom: 16 }}>
        Giao dịch
      </Title>

      {/* Bộ lọc */}
      <Card title="Bộ lọc" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: '1 1 160px' }}>
            <label>Kiểu</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleTypeChange}
              style={inputStyle}
            >
              <option value="">Tất cả</option>
              <option value="income">Thu nhập</option>
              <option value="expense">Chi phí</option>
            </select>
          </div>
          <div style={{ flex: '1 1 260px' }}>
            <label>Khoảng thời gian</label>
            <RangePicker
              value={rangeValue}
              onChange={handleDateRangeChange}
              style={{ width: '100%', marginTop: 4 }}
              format="YYYY-MM-DD"
            />
          </div>
        </div>
      </Card>

      {/* Form thêm / sửa */}
      <Card
        title={editingTransaction ? 'Sửa giao dịch' : 'Thêm giao dịch'}
        style={{ marginBottom: 16 }}
      >
        <TransactionForm
          categories={categories}
          onSubmit={handleCreateOrUpdate}
          onCancelEdit={handleCancelEdit}
          editingTransaction={editingTransaction}
        />
      </Card>

      {/* Danh sách + phân trang */}
      <Card
        title="Danh sách giao dịch"
        extra={<Text>Tổng: {totalCount}</Text>}
      >
        {loading && <p>Đang tải...</p>}
        {errorMessage && !loading && (
          <p style={{ color: 'red', marginBottom: 8 }}>{errorMessage}</p>
        )}
        {!loading && !errorMessage && (
          <>
            <TransactionsTable
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => fetchTransactions(page - 1)}
              >
                Trước
              </button>
              <span>
                Trang {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => fetchTransactions(page + 1)}
              >
                Kế tiếp
              </button>
            </div>
          </>
        )}
      </Card>
    </PageContainer>
  );
}

const inputStyle = {
  width: '100%',
  padding: 6,
  boxSizing: 'border-box',
  marginTop: 4,
  backgroundColor: '#020617',
  border: '1px solid #4b5563',
  color: '#f9fafb',
};

export default TransactionsPage;