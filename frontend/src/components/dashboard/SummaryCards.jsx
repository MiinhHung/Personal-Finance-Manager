// src/components/dashboard/SummaryCards.jsx
import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';

function formatCurrency(amount) {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

const clickableStyle = { cursor: 'pointer' };

function SummaryCards({ summary, onIncomeClick, onExpenseClick }) {
  if (!summary) {
    return <p>No summary data.</p>;
  }

  const { month, totalIncome, totalExpense, balance } = summary;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} md={6}>
        <Card hoverable>
          <Statistic title="Month" value={month} />
        </Card>
      </Col>
      <Col xs={24} md={6}>
        <Card
          hoverable
          onClick={onIncomeClick}
          style={onIncomeClick ? clickableStyle : undefined}
        >
          <Statistic
            title="Total Income"
            value={totalIncome}
            valueRender={() => (
              <span style={{ color: '#22c55e' }}>{formatCurrency(totalIncome)}</span>
            )}
          />
        </Card>
      </Col>
      <Col xs={24} md={6}>
        <Card
          hoverable
          onClick={onExpenseClick}
          style={onExpenseClick ? clickableStyle : undefined}
        >
          <Statistic
            title="Total Expense"
            value={totalExpense}
            valueRender={() => (
              <span style={{ color: '#ef4444' }}>{formatCurrency(totalExpense)}</span>
            )}
          />
        </Card>
      </Col>
      <Col xs={24} md={6}>
        <Card hoverable>
          <Statistic
            title="Balance"
            value={balance}
            valueRender={() => (
              <span style={{ color: balance >= 0 ? '#22c55e' : '#ef4444' }}>
                {formatCurrency(balance)}
              </span>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
}

export default SummaryCards;