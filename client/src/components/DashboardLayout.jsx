import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';

// ── Staff/Admin notifications ──────────────────────────────────────────────
const buildStaffNotifications = (bookings) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const notes = [];
  bookings.forEach(b => {
    const name = b.fullName || 'A guest';
    const room = b.roomName || 'a room';
    if (b.status === 'pending') {
      notes.push({ id: `pending-${b.id}`, icon: '📋', title: 'New Booking Request', body: `${name} requested ${room}`, time: b.createdAt, link: '/admin/reservations' });
    }
    if (b.checkIn === todayStr && b.status === 'confirmed') {
      notes.push({ id: `checkin-${b.id}`, icon: '🏨', title: 'Check-In Today', body: `${name} arriving at ${room}`, time: b.checkIn, link: '/staff/checkinout' });
    }
    if (b.checkOut === todayStr && b.status === 'checked-in') {
      notes.push({ id: `checkout-${b.id}`, icon: '👋', title: 'Check-Out Today', body: `${name} departing from ${room}`, time: b.checkOut, link: '/staff/checkinout' });
    }
  });
  return notes.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
};

// ── Guest notifications ────────────────────────────────────────────────────
const buildGuestNotifications = (bookings) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const notes = [];
  bookings.forEach(b => {
    const room = b.roomName || 'your room';
    if (b.status === 'confirmed') {
      notes.push({ id: `confirmed-${b.id}`, icon: '✅', title: 'Booking Confirmed!', body: `Your booking for ${room} has been confirmed`, time: b.createdAt, link: '/dashboard/bookings' });
    }
    if (b.status === 'cancelled') {
      notes.push({ id: `cancelled-${b.id}`, icon: '❌', title: 'Booking Cancelled', body: `Your booking for ${room} was cancelled`, time: b.createdAt, link: '/dashboard/bookings' });
    }
    if (b.status === 'confirmed' && b.checkIn === todayStr) {
      notes.push({ id: `today-${b.id}`, icon: '🏨', title: 'Check-In Today!', body: `Welcome! Your stay at ${room} begins today`, time: b.checkIn, link: '/dashboard/bookings' });
    }
    if (b.status === 'checked-in' && b.checkOut === todayStr) {
      notes.push({ id: `checkout-${b.id}`, icon: '👋', title: 'Check-Out Today', body: `Your stay at ${room} ends today`, time: b.checkOut, link: '/dashboard/bookings' });
    }
    if (b.status === 'pending') {
      notes.push({ id: `pending-${b.id}`, icon: '⏳', title: 'Booking Pending', body: `Your booking for ${room} is awaiting confirmation`, time: b.createdAt, link: '/dashboard/bookings' });
    }
  });
  return notes.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// ── Sidebar constants ──────────────────────────────────────────────────────
const SIDEBAR_EXPANDED  = 288;
const SIDEBAR_COLLAPSED = 72;
const TRANSITION = { duration: 0.35, ease: [0.4, 0, 0.2, 1] };

// ── Sub-components outside DashboardLayout so React never remounts them ────

const SidebarLabel = ({ collapsed, children }) => (
  <AnimatePresence initial={false}>
    {!collapsed && (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="whitespace-nowrap ml-3"
      >
        {children}
      </motion.span>
    )}
  </AnimatePresence>
);

const SidebarNav = ({ dashboardMenuItems, publicMenuItems, collapsed, currentPath, onLinkClick, onMouseEnter, onMouseLeave }) => (
  <nav className="flex-1 overflow-y-auto p-4">
    {dashboardMenuItems?.length > 0 && (
      <div className="mb-6">
        <div className="space-y-1">
          {dashboardMenuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onLinkClick}
                onMouseEnter={e => onMouseEnter(e, item.label)}
                onMouseLeave={onMouseLeave}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? 'bg-ocean-50 text-ocean-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
                style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <SidebarLabel collapsed={collapsed}>{item.label}</SidebarLabel>
              </Link>
            );
          })}
        </div>
      </div>
    )}
    {dashboardMenuItems?.length > 0 && publicMenuItems?.length > 0 && (
      <div className="border-t border-gray-200 my-4" />
    )}
    {publicMenuItems?.length > 0 && (
      <div className="space-y-1">
        {publicMenuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              onMouseEnter={e => onMouseEnter(e, item.label)}
              onMouseLeave={onMouseLeave}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                isActive ? 'bg-ocean-50 text-ocean-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
              style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <SidebarLabel collapsed={collapsed}>{item.label}</SidebarLabel>
            </Link>
          );
        })}
      </div>
    )}
  </nav>
);

const UserProfile = ({ user, collapsed }) => (
  <div className={`border-b border-gray-200 transition-all duration-300 ${collapsed ? 'p-3 flex justify-center' : 'p-6'}`}>
    <div className="flex items-center" style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
      <div className="w-12 h-12 bg-ocean-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
        {user?.name?.charAt(0).toUpperCase()}
      </div>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="min-w-0 ml-3"
          >
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-ocean-100 text-ocean-700 text-xs rounded capitalize">{user?.role}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

const LogoSection = ({ collapsed }) => (
  <div className={`border-b border-gray-200 h-[88px] flex items-center ${collapsed ? 'justify-center px-3' : 'px-6'}`}>
    <Link to="/" className="flex items-center" style={{ textDecoration: 'none' }}>
      <img src="/images/logo3.png" alt="Oceano Con Vista" className="h-10 w-auto flex-shrink-0" />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-3"
          >
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              fontStyle: 'italic',
              fontSize: 20,
              letterSpacing: '0.05em',
              color: '#111827',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}>
              Oceano Con Vista
            </h1>
            <p className="text-xs text-gray-500 whitespace-nowrap" style={{ letterSpacing: '0.04em' }}>Dashboard</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  </div>
);

// ── NotificationDropdown — outside so React never remounts it ─────────────
const NotificationDropdown = ({ showNotifs, notifications, readIds, markRead, markAllRead, unreadCount, user, setShowNotifs }) => (
  <AnimatePresence>
    {showNotifs && (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-display font-bold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-ocean-600 hover:underline">
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
          {notifications.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">No notifications yet.</div>
          ) : notifications.map(n => {
            const isUnread = !readIds.includes(n.id);
            return (
              <Link key={n.id} to={n.link} onClick={() => { markRead(n.id); setShowNotifs(false); }}
                className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${isUnread ? 'bg-ocean-50/40' : ''}`}>
                <span className="text-xl mt-0.5">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</p>
                    {isUnread && <span className="w-2 h-2 rounded-full bg-ocean-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{n.body}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.time)}</p>
                </div>
              </Link>
            );
          })}
        </div>
        {notifications.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <Link
              to={user?.role === 'admin' ? '/admin/reservations' : user?.role === 'staff' ? '/staff/reservations' : '/dashboard/bookings'}
              onClick={() => setShowNotifs(false)}
              className="text-xs text-ocean-600 hover:underline font-medium">
              {user?.role === 'guest' ? 'View my bookings →' : 'View all reservations →'}
            </Link>
          </div>
        )}
      </motion.div>
    )}
  </AnimatePresence>
);

// ── DashboardLayout ────────────────────────────────────────────────────────
const DashboardLayout = ({ children, dashboardMenuItems, publicMenuItems }) => {
  const [isSidebarOpen,      setIsSidebarOpen]      = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sidebarCollapsed') || 'false'); } catch { return false; }
  });
  const [showNotifs,    setShowNotifs]    = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds,       setReadIds]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('readNotifIds') || '[]'); } catch { return []; }
  });
  const [tooltip, setTooltip] = useState({ label: '', y: 0, visible: false });

  const notifRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const sidebarW = isSidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  useEffect(() => {
    if (!user) return;
    if (user.role === 'guest') {
      bookingsAPI.getUserBookings()
        .then(data => setNotifications(buildGuestNotifications(data.bookings || [])))
        .catch(() => {});
    } else {
      bookingsAPI.getAllBookings()
        .then(data => setNotifications(buildStaffNotifications(data.bookings || [])))
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setTooltip(t => ({ ...t, visible: false })); }, [location.pathname]);

  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

  const markAllRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
    localStorage.setItem('readNotifIds', JSON.stringify(allIds));
  };

  const markRead = (id) => {
    const updated = [...new Set([...readIds, id])];
    setReadIds(updated);
    localStorage.setItem('readNotifIds', JSON.stringify(updated));
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const toggleSidebar = () => {
    const next = !isSidebarCollapsed;
    setIsSidebarCollapsed(next);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(next));
  };

  const showTooltip = (e, label) => {
    if (!isSidebarCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ label, y: rect.top + rect.height / 2, visible: true });
  };
  const hideTooltip = () => setTooltip(t => ({ ...t, visible: false }));

  const roleDashboardLabel =
    user?.role === 'admin' ? 'Admin Dashboard'
    : user?.role === 'staff' ? 'Staff Dashboard'
    : 'Guest Dashboard';

  const notifProps = { showNotifs, notifications, readIds, markRead, markAllRead, unreadCount, user, setShowNotifs };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Desktop Sidebar — collapsible ── */}
      <aside
        style={{ width: sidebarW, transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)' }}
        onMouseLeave={hideTooltip}
        className="hidden lg:flex fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 flex-col z-30 overflow-hidden"
      >
        <LogoSection collapsed={isSidebarCollapsed} />
        <UserProfile user={user} collapsed={isSidebarCollapsed} />
        <SidebarNav
          dashboardMenuItems={dashboardMenuItems}
          publicMenuItems={publicMenuItems}
          collapsed={isSidebarCollapsed}
          currentPath={location.pathname}
          onLinkClick={hideTooltip}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        />
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            onMouseEnter={e => showTooltip(e, 'Sign Out')}
            onMouseLeave={hideTooltip}
            className="flex items-center px-3 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors w-full"
            style={{ justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <SidebarLabel collapsed={isSidebarCollapsed}>
              <span className="font-medium">Sign Out</span>
            </SidebarLabel>
          </button>
        </div>

        {/* Tooltip — fixed so it's never clipped */}
        {isSidebarCollapsed && tooltip.visible && (
          <div
            className="fixed z-[9999] pointer-events-none"
            style={{ top: tooltip.y, left: SIDEBAR_COLLAPSED + 8, transform: 'translateY(-50%)' }}
          >
            <div className="bg-white border border-gray-200 shadow-md rounded-lg px-3 py-1.5 whitespace-nowrap text-sm font-medium text-gray-800">
              {tooltip.label}
            </div>
          </div>
        )}
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-base font-semibold text-gray-800">{roleDashboardLabel}</span>
        </div>
        {/* Mobile bell — original styles */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifs(v => !v)}
            className="relative p-3 hover:bg-white/20 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-semibold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown {...notifProps} />
        </div>
      </div>

      {/* ── Mobile Sidebar ── */}
      {isSidebarOpen && (
        <>
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40" />

          <aside
            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 z-50 flex flex-col"
          >

              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 border-b border-gray-200">
                <Link to="/" className="flex items-center space-x-3" style={{ textDecoration: 'none' }}>
                  <img src="/images/logo3.png" alt="Oceano Con Vista" className="h-10 w-auto" />
                  <div>
                    <h1 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 500,
                      fontStyle: 'italic',
                      fontSize: 20,
                      letterSpacing: '0.05em',
                      color: '#111827',
                      lineHeight: 1.2,
                    }}>
                      Oceano Con Vista
                    </h1>
                    <p className="text-xs text-gray-500" style={{ letterSpacing: '0.04em' }}>Dashboard</p>
                  </div>
                </Link>
              </div>

              <UserProfile user={user} collapsed={false} />
              <SidebarNav
                dashboardMenuItems={dashboardMenuItems}
                publicMenuItems={publicMenuItems}
                collapsed={false}
                currentPath={location.pathname}
                onLinkClick={() => setIsSidebarOpen(false)}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
              />
              <div className="p-4 border-t border-gray-200">
                <button onClick={() => { handleLogout(); setIsSidebarOpen(false); }}
                  className="flex items-center space-x-3 px-3 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors w-full">
                  <LogOut className="w-5 h-5" /><span className="font-medium">Sign Out</span>
                </button>
              </div>
            </aside>
        </>
      )}

      {/* ── Desktop Main ── */}
      <main
        style={{ marginLeft: sidebarW, transition: 'margin-left 0.35s cubic-bezier(0.4,0,0.2,1)' }}
        className="flex-1 hidden lg:block"
      >
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-lg font-semibold text-gray-800">{roleDashboardLabel}</span>
          </div>
          {/* Desktop bell — original styles */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setShowNotifs(v => !v)}
              className="relative p-3 hover:bg-white/20 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationDropdown {...notifProps} />
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>

      {/* ── Mobile Main ── */}
      <main className="flex-1 lg:hidden pt-14">
        <div className="p-4">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;