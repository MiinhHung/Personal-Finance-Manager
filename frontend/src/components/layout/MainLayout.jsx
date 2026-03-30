import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  HomeOutlined,
  TransactionOutlined,
  TagsOutlined,
  LogoutOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Header, Sider, Content } = Layout;

function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const selectedKey = (() => {
    if (location.pathname.startsWith('/dashboard')) return 'dashboard';
    if (location.pathname.startsWith('/transactions')) return 'transactions';
    if (location.pathname.startsWith('/categories')) return 'categories';
    if (location.pathname.startsWith('/ai-insights')) return 'ai-insights';
    return 'dashboard';
  })();

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
      return;
    }
    if (key === 'dashboard') navigate('/dashboard');
    if (key === 'transactions') navigate('/transactions');
    if (key === 'categories') navigate('/categories');
    if (key === 'ai-insights') navigate('/ai-insights');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div
          style={{
            height: 48,
            margin: 16,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          Tài chính
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={[
            {
              key: 'dashboard',
              icon: <HomeOutlined />,
              label: 'Tổng quan',
            },
            {
              key: 'transactions',
              icon: <TransactionOutlined />,
              label: 'Giao dịch',
            },
            {
              key: 'categories',
              icon: <TagsOutlined />,
              label: 'Danh mục',
            },
            {
              key: 'ai-insights',
              icon: <RobotOutlined />,
              label: 'Gợi ý AI',
            },
            {
              type: 'divider',
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              danger: true,
              label: 'Đăng xuất',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(15,23,42,0.9)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Typography.Title level={4} style={{ margin: 0, color: '#e5e7eb' }}>
            Quản lý Tài chính Cá nhân
          </Typography.Title>
          <Typography.Text style={{ color: '#e5e7eb' }}>
            Xin chào, <strong>{user?.fullName}</strong>
          </Typography.Text>
        </Header>
        <Content style={{ margin: 16 }}>
          <div
            style={{
              padding: 16,
              background: '#020617',
              borderRadius: 8,
              minHeight: 'calc(100vh - 120px)',
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;