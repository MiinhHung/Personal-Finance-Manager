import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Skeleton, Empty, Alert, Space, Divider } from 'antd';
import { RobotOutlined, StarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import aiApi from '../api/aiApi';
import PageContainer from '../components/layout/PageContainer';
import AIInsightCard from '../components/analytics/AIInsightCard';

const { Title, Text, Paragraph } = Typography;

function AIInsightsPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const res = await aiApi.getInsights();
        setInsights(res.data.data);
      } catch (err) {
        console.error('Failed to fetch AI insights', err);
        setError(err.response?.data?.error?.message || 'Không thể kết nối với AI Advisor. Vui lòng kiểm tra API Key trong file .env');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <PageContainer>
      <div style={{ marginBottom: 32 }}>
        <Space align="center" size="middle">
          <div style={{ 
            padding: '12px', 
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <RobotOutlined style={{ fontSize: '32px', color: '#fff' }} />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Trợ lý AI Tài chính
            </Title>
            <Text type="secondary">Phân tích dữ liệu chi tiêu và đưa ra lời khuyên cá nhân hóa</Text>
          </div>
        </Space>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : error ? (
        <Alert
          message="Thông báo"
          description={error}
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ borderRadius: '12px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#fff' }}
        />
      ) : !insights ? (
        <Empty description="Không có dữ liệu phân tích" />
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card 
            bordered={false}
            style={{ 
              borderRadius: '20px', 
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <Title level={3} style={{ color: '#fff', marginBottom: 16 }}>
              <StarOutlined style={{ color: '#fbbf24', marginRight: 12 }} />
              Tóm tắt Phân tích
            </Title>
            <Paragraph style={{ color: '#cbd5e1', fontSize: '16px', lineHeight: '1.8' }}>
              {insights.summary}
            </Paragraph>
            
            <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <Title level={4} style={{ color: '#fff' }}>Chi tiết thói quen</Title>
            <Paragraph style={{ color: '#94a3b8', fontSize: '15px' }}>
              {insights.analysis}
            </Paragraph>
          </Card>

          <div>
            <Title level={3} style={{ color: '#fff', marginBottom: 24 }}>Gợi ý Thông minh</Title>
            <Row gutter={[20, 20]}>
              {insights.suggestions?.map((item, index) => (
                <Col xs={24} md={12} lg={8} key={index}>
                  <AIInsightCard 
                    title={item.title} 
                    content={item.content} 
                    type={index % 2 === 0 ? 'saving' : 'budgeting'}
                  />
                </Col>
              ))}
            </Row>
          </div>

          <Card 
            title={<Title level={4} style={{ margin: 0, color: '#fff' }}>Kế hoạch Ngân sách Đề xuất</Title>}
            style={{ 
              borderRadius: '20px', 
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}
          >
            <Paragraph style={{ color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>
              {insights.budgetPlan}
            </Paragraph>
          </Card>
        </Space>
      )}
    </PageContainer>
  );
}

export default AIInsightsPage;
