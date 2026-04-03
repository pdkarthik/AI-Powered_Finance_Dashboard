import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const Notification = () => {
  const notification = useSelector(state => state.finance.notification);

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`
              flex items-center p-4 rounded-xl shadow-2xl border pointer-events-auto min-w-[280px]
              ${notification.type === 'error' 
                ? 'bg-red-50 border-red-100 text-red-800 dark:bg-red-900/90 dark:border-red-800 dark:text-red-100' 
                : 'bg-white border-gray-100 text-gray-800 dark:bg-gray-800/90 dark:border-gray-700 dark:text-white'
              }
            `}
          >
            <div className={`p-2 rounded-full mr-3 ${
              notification.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'
            }`}>
              <SafeIcon 
                icon={notification.type === 'error' ? FiIcons.FiAlertCircle : FiIcons.FiCheckCircle} 
                className="w-5 h-5" 
              />
            </div>
            <p className="text-sm font-medium">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;