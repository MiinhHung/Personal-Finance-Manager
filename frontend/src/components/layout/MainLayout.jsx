import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  HomeOutlined,
  TransactionOutlined,
  TagsOutlined,
  LogoutOutlined,
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
          Finance
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
              label: 'Dashboard',
            },
            {
              key: 'transactions',
              icon: <TransactionOutlined />,
              label: 'Transactions',
            },
            {
              key: 'categories',
              icon: <TagsOutlined />,
              label: 'Categories',
            },
            {
              type: 'divider',
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              danger: true,
              label: 'Logout',
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
            Personal Finance Manager
          </Typography.Title>
          <Typography.Text style={{ color: '#e5e7eb' }}>
            Hello, <strong>{user?.fullName}</strong>
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