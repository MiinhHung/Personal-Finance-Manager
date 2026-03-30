import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Input, Button, Typography, Row, Col, Alert } from 'antd';
import { UserOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onFinish = async (values) => {
    setErrorMessage('');
    setSubmitting(true);
    try {
      await login({ email: values.email, password: values.password });
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0f172a' }}>
      <Row style={{ width: '100%' }}>
        {/* Left Side - Branding */}
        <Col xs={0} lg={12} style={{ 
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          color: 'white'
        }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center' }}
          >
            <RocketOutlined style={{ fontSize: '100px', marginBottom: '32px' }} />
            <Title level={1} style={{ color: 'white', fontWeight: 800 }}>Finance Manager</Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px' }}>
              Quản lý tài chính cá nhân thông minh và hiệu quả.
            </Text>
          </motion.div>
        </Col>

        {/* Right Side - Form */}
        <Col xs={24} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ width: '100%', maxWidth: '400px' }}
          >
            <div style={{ 
              background: 'rgba(30, 41, 59, 0.7)', 
              backdropFilter: 'blur(16px)',
              padding: '40px',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Title level={2} style={{ color: 'white', margin: 0 }}>Chào mừng trở lại</Title>
                <Text style={{ color: '#94a3b8' }}>Đăng nhập để vào bảng điều khiển</Text>
              </div>

              {errorMessage && (
                <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 24 }} />
              )}

              <Form layout="vertical" onFinish={onFinish} size="large">
                <Form.Item 
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập Email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: '#94a3b8' }} />} 
                    placeholder="Email của bạn" 
                    style={{ background: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                  />
                </Form.Item>

                <Form.Item 
                  name="password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                  <Input.Password 
                    prefix={<LockOutlined style={{ color: '#94a3b8' }} />} 
                    placeholder="Mật khẩu" 
                    style={{ background: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={submitting} 
                    block 
                    style={{ 
                      height: '48px', 
                      borderRadius: '12px', 
                      background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '16px'
                    }}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>

              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Text style={{ color: '#94a3b8' }}>Chưa có tài khoản? </Text>
                <Link to="/register" style={{ color: '#3b82f6', fontWeight: 600 }}>Đăng ký ngay</Link>
              </div>
            </div>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}

export default LoginPage;