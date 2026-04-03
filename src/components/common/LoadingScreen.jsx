import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center p-12">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
    />
    <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Fetching data...</p>
  </div>
);

export default LoadingScreen;