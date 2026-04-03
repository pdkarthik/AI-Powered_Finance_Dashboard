import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRole, toggleTheme } from '../../store/actions';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Button from '../common/Button';

const Header = ({ setMobileOpen }) => {
  const dispatch = useDispatch();
  const { role, isDarkMode } = useSelector(state => state.finance);

  return (
    <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 -ml-2 mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <SafeIcon icon={FiIcons.FiMenu} className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">
          Overview
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => dispatch(setRole('viewer'))}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              role === 'viewer' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Viewer
          </button>
          <button
            onClick={() => dispatch(setRole('admin'))}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              role === 'admin' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Admin
          </button>
        </div>

        <Button variant="ghost" size="sm" onClick={() => dispatch(toggleTheme())} className="!p-2 rounded-full">
          <SafeIcon icon={isDarkMode ? FiIcons.FiSun : FiIcons.FiMoon} className="w-5 h-5" />
        </Button>
        
        <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
          JD
        </div>
      </div>
    </header>
  );
};

export default Header;