// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Row,
  Col,
  Card,
  Skeleton,
  Button,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import reportsApi from '../api/reportsApi';
import transactionsApi from '../api/transactionsApi';
import categoriesApi from '../api/categoriesApi';
import SummaryCards from '../components/dashboard/SummaryCards';
import CategoryChart from '../components/dashboard/CategoryChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import PageContainer from '../components/layout/PageContainer';
import QuickAddTransactionModal from '../components/dashboard/QuickAddTransactionModal';

const { Title } = Typography;

function getCurrentMonthInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const monthStr = String(month).padStart(2, '0');

  const from = `${year}-${monthStr}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${monthStr}-${lastDay}`;

  return {
    monthParam: `${year}-${monthStr}`,
    from,
    to,
  };
}

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [byCategoryData, setByCategoryData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddSubmitting, setQuickAddSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const { monthParam, from, to } = getCurrentMonthInfo();

      const [summaryRes, byCatRes, recentRes, categoriesRes] = await Promise.all([
        reportsApi.getMonthlySummary(monthParam),
        reportsApi.getByCategory({ from, to, type: 'expense' }),
        transactionsApi.getRecent(5),
        categoriesApi.getAll(),
      ]);

      setSummary(summaryRes.data.data.summary);
      setByCategoryData(byCatRes.data.data.items);
      setRecentTransactions(recentRes.data.data.transactions);

      const list = categoriesRes.data.data.categories || [];
      setCategories(
        list.map((c) => ({
          categoryId: c.categoryId,
          name: c.name,
          type: c.type,
          isSystem: c.isSystem,
        })),
      );
    } catch (err) {
      const msg =
        err.response?.data?.error?.message || 'Không tải được dữ liệu dashboard';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleIncomeClick = () => {
    const { from, to } = getCurrentMonthInfo();
    navigate(`/transactions?type=income&from=${from}&to=${to}`);
  };

  const handleExpenseClick = () => {
    const { from, to } = getCurrentMonthInfo();
    navigate(`/transactions?type=expense&from=${from}&to=${to}`);
  };

  const handleQuickAddSubmit = async (payload, form) => {
    try {
      setQuickAddSubmitting(true);
      await transactionsApi.create(payload);
      message.success('Thêm giao dịch thành công');
      form.resetFields();
      setQuickAddOpen(false);
      fetchDashboardData();
    } catch (err) {
      const msg =
        err.response?.data?.error?.message || 'Thêm giao dịch thất bại';
      message.error(msg);
    } finally {
      setQuickAddSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Dashboard
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setQuickAddOpen(true)}
        >
          Thêm giao dịch nhanh
        </Button>
      </div>

      {loading && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {[1, 2, 3, 4].map((n) => (
              <Col key={n} xs={24} md={6}>
                <Card>
                  <Skeleton active paragraph={{ rows: 1 }} />
                </Card>
              </Col>
            ))}
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card>
                <Skeleton active paragraph={{ rows: 6 }} />
              </Card>
            </Col>
          </Row>
        </>
      )}

      {errorMessage && !loading && (
        <p style={{ color: 'red', marginBottom: 16 }}>{errorMessage}</p>
      )}

      {!loading && !errorMessage && (
        <>
          <SummaryCards
            summary={summary}
            onIncomeClick={handleIncomeClick}
            onExpenseClick={handleExpenseClick}
          />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title="Expenses by Category (This Month)">
                <CategoryChart data={byCategoryData} />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Recent Transactions">
                <RecentTransactions transactions={recentTransactions} />
              </Card>
            </Col>
          </Row>
        </>
      )}

      <QuickAddTransactionModal
        open={quickAddOpen}
        onCancel={() => setQuickAddOpen(false)}
        onSubmit={handleQuickAddSubmit}
        submitting={quickAddSubmitting}
        categories={categories}
      />
    </PageContainer>
  );
}

export default DashboardPage;