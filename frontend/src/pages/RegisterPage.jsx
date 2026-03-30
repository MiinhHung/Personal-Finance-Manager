import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Input, Button, Typography, Row, Col, Alert, Progress } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return setPasswordStrength(0);
    if (pwd.length > 7) score += 40;
    if (/[A-Za-z]/.test(pwd)) score += 30;
    if (/\d/.test(pwd)) score += 30;
    setPasswordStrength(score);
  };

  const getProgressColor = () => {
    if (passwordStrength < 50) return '#ef4444';
    if (passwordStrength < 80) return '#f59e0b';
    return '#10b981';
  };

  const onFinish = async (values) => {
    setErrorMessage('');
    setSubmitting(true);

    try {
      await register({ 
        fullName: values.fullName, 
        email: values.email, 
        password: values.password 
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        'Đăng ký thất bại. Vui lòng thử lại.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0f172a' }}>
      <Row style={{ width: '100%' }}>
        {/* Left Side */}
        <Col xs={0} lg={12} style={{ 
          background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
          color: 'white'
        }}>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center' }}
          >
            <SafetyCertificateOutlined style={{ fontSize: '100px', marginBottom: '32px' }} />
            <Title level={1} style={{ color: 'white', fontWeight: 800 }}>Bắt đầu ngay</Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px' }}>
              Tạo tài khoản miễn phí để quản lý chi tiêu cá nhân an toàn và thông minh.
            </Text>
          </motion.div>
        </Col>

        {/* Right Side */}
        <Col xs={24} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ width: '100%', maxWidth: '450px' }}
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
                <Title level={2} style={{ color: 'white', margin: 0 }}>Đăng ký tài khoản</Title>
                <Text style={{ color: '#94a3b8' }}>Tham gia cùng hàng ngàn người dùng khác</Text>
              </div>

              {errorMessage && (
                <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 24 }} />
              )}

              <Form layout="vertical" onFinish={onFinish} size="large">
                <Form.Item 
                  name="fullName"
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: '#94a3b8' }} />} 
                    placeholder="Họ và tên" 
                    style={{ background: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                  />
                </Form.Item>

                <Form.Item 
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập Email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined style={{ color: '#94a3b8' }} />} 
                    placeholder="Email của bạn" 
                    style={{ background: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                  />
                </Form.Item>

                <Form.Item 
                  name="password"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 8, message: 'Mật khẩu phải chứa ít nhất 8 ký tự!' },
                    { pattern: /^(?=.*[A-Za-z])(?=.*\d)/, message: 'Mật khẩu phải chứa ít nhất 1 chữ cái và 1 chữ số!' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined style={{ color: '#94a3b8' }} />} 
                    placeholder="Mật khẩu (Ít nhất 8 ký tự, 1 chữ cái, 1 chữ số)" 
                    onChange={(e) => calculatePasswordStrength(e.target.value)}
                    style={{ background: 'rgba(15, 23, 42, 0.5)', borderColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}
                  />
                </Form.Item>
                
                {passwordStrength > 0 && (
                  <div style={{ marginBottom: 24, marginTop: -12 }}>
                    <Progress 
                      percent={passwordStrength} 
                      showInfo={false} 
                      strokeColor={getProgressColor()}
                      size="small"
                    />
                    <Text style={{ color: getProgressColor(), fontSize: '12px' }}>
                      {passwordStrength < 50 ? 'Yếu' : passwordStrength < 80 ? 'Trung bình' : 'Mạnh'}
                    </Text>
                  </div>
                )}

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={submitting} 
                    block 
                    style={{ 
                      height: '48px', 
                      borderRadius: '12px', 
                      background: 'linear-gradient(to right, #4f46e5, #c026d3)',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '16px'
                    }}
                  >
                    Đăng ký
                  </Button>
                </Form.Item>
              </Form>

              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Text style={{ color: '#94a3b8' }}>Đã có tài khoản? </Text>
                <Link to="/login" style={{ color: '#c026d3', fontWeight: 600 }}>Đăng nhập ngay</Link>
              </div>
            </div>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
}

export default RegisterPage;