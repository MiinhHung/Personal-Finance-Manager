// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{ padding: 24, textAlign: 'center', marginTop: 80 }}>
      <h2 style={{ fontSize: '48px', color: '#ef4444' }}>404</h2>
      <h3 style={{ marginBottom: 24 }}>Không tìm thấy trang yêu cầu</h3>
      <p style={{ fontSize: '18px' }}>
        Quay lại <Link to="/dashboard" style={{ color: '#3b82f6', fontWeight: 'bold' }}>Tổng quan</Link> hoặc <Link to="/login" style={{ color: '#3b82f6', fontWeight: 'bold' }}>Đăng nhập</Link>.
      </p>
    </div>
  );
}

export default NotFoundPage;