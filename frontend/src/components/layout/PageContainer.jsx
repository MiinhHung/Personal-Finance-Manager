// src/components/layout/PageContainer.jsx
import React from 'react';
import { motion as Motion } from 'framer-motion';

function PageContainer({ children }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </Motion.div>
  );
}

export default PageContainer;