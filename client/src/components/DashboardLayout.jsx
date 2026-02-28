import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Waves, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children, dashboardMenuItems, publicMenuItems }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 flex-col">
        
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-3">
            <Waves className="w-8 h-8 text-ocean-600" />
            <div>
              <h1 className="text-xl font-display font-bold text-gray-900">Oceano Con Vista</h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-ocean-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-ocean-100 text-ocean-700 text-xs rounded capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable Middle Section */}
        <nav className="flex-1 overflow-y-auto p-4">
          
          {/* Dashboard Navigation FIRST */}
          {dashboardMenuItems && dashboardMenuItems.length > 0 && (
            <div className="mb-6">
              <div className="space-y-1">
                {dashboardMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-ocean-50 text-ocean-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Separator */}
          {dashboardMenuItems && dashboardMenuItems.length > 0 && publicMenuItems && (
            <div className="border-t border-gray-200 my-4"></div>
          )}

          {/* Public Site Navigation SECOND */}
          {publicMenuItems && publicMenuItems.length > 0 && (
            <div>
              <div className="space-y-1">
                {publicMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-ocean-50 text-ocean-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Sign Out Button - Fixed at Bottom */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu className="w-6 h-6 text-gray-900" />
      </button>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 z-50 flex flex-col"
            >
              {/* Close Button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Logo Section */}
              <div className="p-6 border-b border-gray-200">
                <Link to="/" className="flex items-center space-x-3">
                  <Waves className="w-8 h-8 text-ocean-600" />
                  <div>
                    <h1 className="text-xl font-display font-bold text-gray-900">Oceano Con Vista</h1>
                    <p className="text-xs text-gray-500">Dashboard</p>
                  </div>
                </Link>
              </div>

              {/* User Profile Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-ocean-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-ocean-100 text-ocean-700 text-xs rounded capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4">
                
                {/* Dashboard Navigation FIRST */}
                {dashboardMenuItems && dashboardMenuItems.length > 0 && (
                  <div className="mb-6">
                    <div className="space-y-1">
                      {dashboardMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-ocean-50 text-ocean-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Separator */}
                {dashboardMenuItems && dashboardMenuItems.length > 0 && publicMenuItems && (
                  <div className="border-t border-gray-200 my-4"></div>
                )}

                {/* Public Site Navigation SECOND */}
                {publicMenuItems && publicMenuItems.length > 0 && (
                  <div>
                    <div className="space-y-1">
                      {publicMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-ocean-50 text-ocean-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </nav>

              {/* Sign Out Button */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsSidebarOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72">
        {/* Top Right Notification */}
        <div className="fixed top-6 right-6 z-30">
          <button className="relative p-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 text-gray-700" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-semibold">
              3
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;