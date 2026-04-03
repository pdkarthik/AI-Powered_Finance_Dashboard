import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Notification from '../common/Notification';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-light dark:bg-background-dark p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto relative">
            <Outlet />
          </div>
        </main>
      </div>

      <Notification />
    </div>
  );
};

export default Layout;