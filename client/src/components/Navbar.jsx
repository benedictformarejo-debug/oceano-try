import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, LogOut, Home, Users, BedDouble, Image, Mail, CalendarCheck } from 'lucide-react';
import { useNavbarScroll } from '../hooks/useNavbarScroll';
import { useAuth } from '../context/AuthContext';

const NAV_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Josefin+Sans:wght@200;300;400;700&display=swap');

  .ocv-nav-link {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    position: relative;
    transition: color 0.2s ease;
    white-space: nowrap;
  }
  .ocv-nav-link::after {
    content: '';
    position: absolute;
    bottom: -3px; left: 0;
    width: 0; height: 1px;
    background: currentColor;
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .ocv-nav-link:hover::after { width: 100%; }

  .ocv-brand {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 500;
    font-style: italic;
    letter-spacing: 0.05em;
  }

  .ocv-rule {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(180,155,100,0.5) 30%, rgba(180,155,100,0.5) 70%, transparent 100%);
    transition: opacity 0.3s ease;
  }

  .ocv-book-btn {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    padding: 9px 22px;
    border: 1px solid;
    position: relative;
    overflow: hidden;
    transition: color 0.3s ease;
    background: transparent;
    cursor: pointer;
    white-space: nowrap;
  }
  .ocv-book-btn::before {
    content: '';
    position: absolute; inset: 0;
    transform: translateX(-101%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .ocv-book-btn:hover::before { transform: translateX(0); }
  .ocv-book-btn span { position: relative; z-index: 1; }
  .ocv-book-transparent { border-color: rgba(255,255,255,0.6); color: white; }
  .ocv-book-transparent::before { background: white; }
  .ocv-book-transparent:hover { color: #0a1a2e; }
  .ocv-book-solid { border-color: #b49b64; color: #b49b64; }
  .ocv-book-solid::before { background: #b49b64; }
  .ocv-book-solid:hover { color: white; }

  .ocv-shadow-text {
    text-shadow: 0 1px 12px rgba(0,0,0,0.5), 0 0px 3px rgba(0,0,0,0.4);
  }

  /* ── Mobile Drawer — matches DashboardLayout sidebar exactly ── */
  .ocv-mobile-drawer {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    width: 288px;
    z-index: 60;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-right: 1px solid #e5e7eb;
    overflow-y: auto;
  }

  .ocv-mobile-backdrop {
    position: fixed;
    inset: 0;
    z-index: 59;
    background: rgba(0,0,0,0.5);
  }

  /* Sidebar nav item — exact match to DashboardLayout */
  .ocv-sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 12px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 400;
    color: #374151;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
    cursor: pointer;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
  }
  .ocv-sidebar-item:hover { background: #f9fafb; color: #111827; }
  .ocv-sidebar-item.active { background: var(--ocean-50, #ecfeff); color: var(--ocean-700, #0e7490); font-weight: 500; }
`;

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useNavbarScroll(50);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!document.querySelector('#ocv-nav-styles')) {
      const el = document.createElement('style');
      el.id = 'ocv-nav-styles';
      el.textContent = NAV_CSS;
      document.head.appendChild(el);
    }
  }, []);

  // Close drawer on route change
  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

  const hiddenRoutes = ['/dashboard', '/admin', '/staff'];
  if (hiddenRoutes.some(r => location.pathname.startsWith(r))) return null;

  const transparentPages = ['/', '/about', '/rooms'];
  const isTransparent = transparentPages.includes(location.pathname) && !isScrolled;

  const navLinks = [
    { name: 'Home',    path: '/',        icon: Home },
    { name: 'About',   path: '/about',   icon: Users },
    { name: 'Rooms',   path: '/rooms',   icon: BedDouble },
    { name: 'Gallery', path: '/gallery', icon: Image },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const handleLogout  = () => { logout(); navigate('/'); setIsMobileMenuOpen(false); };
  const handleBookNow = () => { navigate('/rooms'); setIsMobileMenuOpen(false); };
  const getDashboardPath = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'staff') return '/staff';
    return '/dashboard';
  };

  const linkColor = isTransparent
    ? 'text-white hover:text-white ocv-shadow-text'
    : 'text-stone-800 hover:text-stone-950';

  return (
    <>
      {/* ── Main Bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ height: 70 }}>

        <div className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            backgroundColor: isTransparent ? 'rgba(10,26,46,0)' : 'rgba(250,248,244,0.98)',
            backdropFilter: isTransparent ? 'none' : 'blur(12px)',
          }} />
        <motion.div initial={false} animate={{ opacity: isTransparent ? 1 : 0 }} transition={{ duration: 0.4 }}
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 75%, transparent 100%)' }} />
        <motion.div className="ocv-rule" animate={{ opacity: isTransparent ? 0 : 1 }} transition={{ duration: 0.4 }} />

        {/* Desktop */}
        <div className="relative h-full max-w-screen-xl mx-auto px-6 hidden lg:grid"
          style={{ gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>

          <Link to="/" className="flex flex-col items-start flex-shrink-0" style={{ textDecoration: 'none' }}>
            <div className="flex items-center gap-2">
              <motion.img src="/images/logo3.png" alt="Oceano Con Vista"
                animate={{ filter: isTransparent ? 'brightness(0) invert(1)' : 'brightness(1)' }}
                transition={{ duration: 0.3 }} className="h-10 w-auto object-contain" />
              <span className={`ocv-brand transition-colors duration-300 select-none ${isTransparent ? 'text-white ocv-shadow-text' : 'text-stone-900'}`}
                style={{ fontSize: 22, lineHeight: 1 }}>Oceano Con Vista</span>
            </div>
            <motion.span style={{ display: 'block', height: 2, marginTop: 5, background: 'linear-gradient(90deg, #b49b64, transparent)', width: '50%' }}
              animate={{ opacity: isTransparent ? 0.5 : 0.8 }} />
          </Link>

          <div className="flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className={`ocv-nav-link ${linkColor}`}>{link.name}</Link>
            ))}
          </div>

          <div className="flex items-center gap-5 justify-end">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardPath()} className={`ocv-nav-link flex items-center gap-1.5 ${linkColor}`}>
                  <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                </Link>
                <button onClick={handleLogout}
                  className={`ocv-nav-link flex items-center gap-1.5 ${isTransparent ? 'text-white hover:text-red-300 ocv-shadow-text' : 'text-stone-600 hover:text-red-500'}`}>
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className={`ocv-nav-link ${linkColor}`}>Login</Link>
            )}
            <button onClick={handleBookNow} className={`ocv-book-btn ${isTransparent ? 'ocv-book-transparent' : 'ocv-book-solid'}`}>
              <span>Book Now</span>
            </button>
          </div>
        </div>

        {/* Mobile Bar */}
        <div className="relative h-full px-4 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMobileMenuOpen(v => !v)}
              className={`p-1.5 rounded-md flex-shrink-0 transition-colors duration-200 ${isTransparent ? 'text-white drop-shadow-md hover:bg-white/10' : 'text-stone-800 hover:bg-stone-100'}`}
              aria-label="Toggle menu">
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-1.5" style={{ textDecoration: 'none' }}>
              <motion.img src="/images/logo3.png" alt="Oceano Con Vista"
                animate={{ filter: isTransparent ? 'brightness(0) invert(1)' : 'brightness(1)' }}
                transition={{ duration: 0.3 }} className="h-8 w-auto object-contain" />
              <span className={`ocv-brand transition-colors duration-300 select-none ${isTransparent ? 'text-white ocv-shadow-text' : 'text-stone-900'}`}
                style={{ fontSize: 17, lineHeight: 1 }}>Oceano Con Vista</span>
            </Link>
          </div>
          <button onClick={handleBookNow}
            className={`ocv-book-btn flex-shrink-0 ${isTransparent ? 'ocv-book-transparent' : 'ocv-book-solid'}`}
            style={{ padding: '7px 14px', fontSize: '10px' }}>
            <span>Book Now</span>
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div className="ocv-mobile-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)} />

            <motion.div className="ocv-mobile-drawer"
              initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}>

              {/* Logo Section — mirrors DashboardLayout LogoSection */}
              <div className="px-6 pt-5 pb-5 relative" style={{ borderBottom: '1px solid #e5e7eb' }}>
                {/* X — pinned to very top-right corner of the drawer */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-3 right-3 p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>

                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
                  <img src="/images/logo3.png" alt="Oceano Con Vista" className="h-10 w-auto" />
                  <div>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: 18, color: '#111827', lineHeight: 1.2 }}>
                      Oceano Con Vista
                    </h1>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: '#6b7280', letterSpacing: '0.05em', marginTop: 2 }}>
                      Mountain Resort
                    </p>
                  </div>
                </Link>
              </div>

              {/* User Profile — mirrors DashboardLayout UserProfile */}
              {isAuthenticated && user && (
                <div className="p-6" style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-ocean-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-ocean-100 text-ocean-700 text-xs rounded capitalize">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav Links — mirrors DashboardLayout SidebarNav */}
              <nav className="flex-1 overflow-y-auto p-4">
                <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">Menu</p>
                <div className="space-y-1">
                  {navLinks.map((link, i) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                      <motion.div key={link.path}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 + i * 0.04, duration: 0.2 }}>
                        <Link to={link.path} onClick={() => setIsMobileMenuOpen(false)}
                          className={`ocv-sidebar-item ${isActive ? 'bg-ocean-50 text-ocean-700 font-medium' : ''}`}>
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <span>{link.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {isAuthenticated && (
                  <>
                    <div style={{ borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />
                    <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">Account</p>
                    <div className="space-y-1">
                      <Link to={getDashboardPath()} onClick={() => setIsMobileMenuOpen(false)}
                        className="ocv-sidebar-item">
                        <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                        <span>Dashboard</span>
                      </Link>
                      <Link to="/dashboard/bookings" onClick={() => setIsMobileMenuOpen(false)}
                        className="ocv-sidebar-item">
                        <CalendarCheck className="w-5 h-5 flex-shrink-0" />
                        <span>My Bookings</span>
                      </Link>
                    </div>
                  </>
                )}
              </nav>

              {/* Bottom — mirrors DashboardLayout sign out */}
              <div className="p-4" style={{ borderTop: '1px solid #e5e7eb' }}>
                {isAuthenticated ? (
                  <button onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors text-red-600 bg-red-50 hover:bg-red-100">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Sign Out</span>
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors text-gray-700 hover:bg-gray-50"
                    style={{ textDecoration: 'none' }}>
                    <LayoutDashboard className="w-5 h-5 text-ocean-600" />
                    <span className="font-medium text-sm">Sign In</span>
                  </Link>
                )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;