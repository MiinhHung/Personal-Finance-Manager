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
  Segmented,
  Space,
} from 'antd';
import { PlusOutlined, BarChartOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import reportsApi from '../api/reportsApi';
import transactionsApi from '../api/transactionsApi';
import categoriesApi from '../api/categoriesApi';
import SummaryCards from '../components/dashboard/SummaryCards';
import CategoryChart from '../components/dashboard/CategoryChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import TrendChart from '../components/dashboard/TrendChart';
import PageContainer from '../components/layout/PageContainer';
import QuickAddTransactionModal from '../components/dashboard/QuickAddTransactionModal';

const { Title } = Typography;

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [byCategoryData, setByCategoryData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [trendGroupBy, setTrendGroupBy] = useState('day');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddSubmitting, setQuickAddSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchTrendData = async (groupBy) => {
    try {
      setTrendLoading(true);
      let from, to;
      const now = dayjs();

      if (groupBy === 'day') {
        from = now.subtract(14, 'day').format('YYYY-MM-DD');
        to = now.format('YYYY-MM-DD');
      } else if (groupBy === 'week') {
        from = now.subtract(8, 'week').startOf('week').format('YYYY-MM-DD');
        to = now.format('YYYY-MM-DD');
      } else if (groupBy === 'month') {
        from = now.subtract(6, 'month').startOf('month').format('YYYY-MM-DD');
        to = now.format('YYYY-MM-DD');
      } else if (groupBy === 'year') {
        from = now.subtract(3, 'year').startOf('year').format('YYYY-MM-DD');
        to = now.format('YYYY-MM-DD');
      }

      const res = await reportsApi.getTrend({ from, to, groupBy });
      setTrendData(res.data.data.trend);
    } catch (err) {
      console.error('Failed to fetch trend data', err);
    } finally {
      setTrendLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const now = dayjs();
      const monthParam = now.format('YYYY-MM');
      const from = now.startOf('month').format('YYYY-MM-DD');
      const to = now.endOf('month').format('YYYY-MM-DD');

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
      setCategories(list);
      
      await fetchTrendData(trendGroupBy);
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Không tải được dữ liệu dashboard';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleGroupByChange = (value) => {
    setTrendGroupBy(value);
    fetchTrendData(value);
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
      const msg = err.response?.data?.error?.message || 'Thêm giao dịch thất bại';
      message.error(msg);
    } finally {
      setQuickAddSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: '16px' }}>
        <div>
           <Title level={2} style={{ margin: 0, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Tổng quan Tài chính
          </Title>
          <Typography.Text type="secondary">Theo dõi thu nhập và chi tiêu của bạn</Typography.Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setQuickAddOpen(true)}
          style={{ borderRadius: '12px' }}
        >
          Ghi chép nhanh
        </Button>
      </div>

      {loading ? (
        <Skeleton active />
      ) : (
        <>
          <SummaryCards
            summary={summary}
            onIncomeClick={() => navigate('/transactions?type=income')}
            onExpenseClick={() => navigate('/transactions?type=expense')}
          />

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24}>
              <Card 
                title={
                  <Space>
                    <BarChartOutlined />
                    <span>Xu hướng Tài chính</span>
                  </Space>
                }
                extra={
                  <Segmented
                    options={[
                      { label: 'Ngày', value: 'day' },
                      { label: 'Tuần', value: 'week' },
                      { label: 'Tháng', value: 'month' },
                      { label: 'Năm', value: 'year' },
                    ]}
                    value={trendGroupBy}
                    onChange={handleGroupByChange}
                    disabled={trendLoading}
                  />
                }
              >
                {trendLoading ? <Skeleton active /> : <TrendChart data={trendData} />}
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Phân bổ Chi tiêu (Tháng này)">
                <CategoryChart data={byCategoryData} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <HistoryOutlined />
                    <span>Giao dịch Gần đây</span>
                  </Space>
                }
                extra={<Button type="link" onClick={() => navigate('/transactions')}>Xem tất cả</Button>}
              >
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