import React from "react";
import { NavLink } from "react-router-dom";
import SafeIcon from "../../common/SafeIcon";
import * as FiIcons from "react-icons/fi";

const navItems = [
  { path: "/", name: "Dashboard", icon: FiIcons.FiPieChart },
  { path: "/transactions", name: "Transactions", icon: FiIcons.FiList },
  { path: "/insights", name: "Insights", icon: FiIcons.FiTrendingUp },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Overlay for when sidebar is closed on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out
        lg:relative lg:inset-auto lg:transform-none
        ${sidebarOpen ? "translate-x-0 lg:w-64" : "-translate-x-full lg:-ml-64"}
      `}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <SafeIcon
            icon={FiIcons.FiHexagon}
            className="w-8 h-8 text-primary-600 dark:text-primary-500"
          />
          <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
            FinDash
          </span>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                }
              `}
            >
              <SafeIcon icon={item.icon} className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
