import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', animate = true, delay = 0 }) => {
  const baseClasses = "bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden";
  
  if (!animate) {
    return <div className={`${baseClasses} ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;