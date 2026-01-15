// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>404 - Page not found</h2>
      <p>
        Go to <Link to="/dashboard">Dashboard</Link> or <Link to="/login">Login</Link>.
      </p>
    </div>
  );
}

export default NotFoundPage;