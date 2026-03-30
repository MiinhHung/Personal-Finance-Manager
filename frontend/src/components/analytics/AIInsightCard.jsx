import React from 'react';
import { Card, Typography, Space } from 'antd';
import { BulbOutlined, RocketOutlined, DollarOutlined, LineChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const getIcon = (type) => {
  switch (type) {
    case 'saving': return <BulbOutlined style={{ fontSize: '24px', color: '#fbbf24' }} />;
    case 'investing': return <RocketOutlined style={{ fontSize: '24px', color: '#8b5cf6' }} />;
    case 'budgeting': return <DollarOutlined style={{ fontSize: '24px', color: '#10b981' }} />;
    default: return <LineChartOutlined style={{ fontSize: '24px', color: '#3b82f6' }} />;
  }
};

function AIInsightCard({ title, content, type = 'saving' }) {
  return (
    <Card
      hoverable
      style={{
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(10px)',
        height: '100%',
      }}
      bodyStyle={{ padding: '24px' }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '12px', 
          background: 'rgba(255, 255, 255, 0.05)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          {getIcon(type)}
        </div>
        <div>
          <Title level={4} style={{ margin: 0, color: '#f8fafc' }}>
            {title}
          </Title>
          <Text style={{ color: '#94a3b8', display: 'block', marginTop: '8px', lineHeight: '1.6' }}>
            {content}
          </Text>
        </div>
      </Space>
    </Card>
  );
}

export default AIInsightCard;
