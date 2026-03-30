// src/components/dashboard/SummaryCards.jsx
import React from 'react';
import { Row, Col, Card, Statistic, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, WalletOutlined, CalendarOutlined } from '@ant-design/icons';

function formatCurrency(amount) {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function SummaryCards({ summary, onIncomeClick, onExpenseClick }) {
  if (!summary) {
    return null;
  }

  const { month, totalIncome, totalExpense, balance } = summary;

  const cardStyle = {
    borderRadius: '16px',
    height: '100%',
  };

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={12} md={6}>
        <Card style={cardStyle} bodyStyle={{ padding: '20px' }}>
          <Space direction="vertical" size={0}>
             <CalendarOutlined style={{ fontSize: '20px', color: '#94a3b8', marginBottom: '8px' }} />
             <Statistic title="Tháng" value={month} valueStyle={{ fontSize: '20px', fontWeight: 'bold' }} />
          </Space>
        </Card>
      </Col>
      
      <Col xs={12} md={6}>
        <Card 
          style={cardStyle} 
          hoverable 
          onClick={onIncomeClick}
          bodyStyle={{ padding: '20px' }}
        >
          <Space direction="vertical" size={0}>
             <ArrowUpOutlined style={{ fontSize: '20px', color: '#22c55e', marginBottom: '8px' }} />
             <Statistic 
                title="Tổng Thu nhập" 
                value={totalIncome} 
                formatter={(val) => <span style={{ color: '#22c55e', fontWeight: '700' }}>{formatCurrency(val)}</span>}
                valueStyle={{ fontSize: '20px' }}
             />
          </Space>
        </Card>
      </Col>

      <Col xs={12} md={6}>
        <Card 
          style={cardStyle} 
          hoverable 
          onClick={onExpenseClick}
          bodyStyle={{ padding: '20px' }}
        >
          <Space direction="vertical" size={0}>
             <ArrowDownOutlined style={{ fontSize: '20px', color: '#ef4444', marginBottom: '8px' }} />
             <Statistic 
                title="Tổng Chi tiêu" 
                value={totalExpense} 
                formatter={(val) => <span style={{ color: '#ef4444', fontWeight: '700' }}>{formatCurrency(val)}</span>}
                valueStyle={{ fontSize: '20px' }}
             />
          </Space>
        </Card>
      </Col>

      <Col xs={12} md={6}>
        <Card style={cardStyle} bodyStyle={{ padding: '20px' }}>
          <Space direction="vertical" size={0}>
             <WalletOutlined style={{ fontSize: '20px', color: '#3b82f6', marginBottom: '8px' }} />
             <Statistic 
                title="Số dư" 
                value={balance} 
                formatter={(val) => (
                  <span style={{ color: val >= 0 ? '#22c55e' : '#ef4444', fontWeight: '700' }}>
                    {formatCurrency(val)}
                  </span>
                )}
                valueStyle={{ fontSize: '20px' }}
             />
          </Space>
        </Card>
      </Col>
    </Row>
  );
}

export default SummaryCards;