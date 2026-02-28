import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useNavbarScroll } from '../hooks/useNavbarScroll';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

/* ─── Inject fonts & styles once ────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Josefin+Sans:wght@200;300;400&display=swap');

  .ocv-nav-link {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    position: relative;
    transition: color 0.3s ease;
  }

  .ocv-nav-link::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 1px;
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
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(180,155,100,0.5) 30%, rgba(180,155,100,0.5) 70%, transparent 100%);
    transform-origin: center;
    transition: opacity 0.4s ease;
  }

  .ocv-dot {
    display: inline-block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(180,155,100,0.8);
    margin: 0 14px;
    vertical-align: middle;
    flex-shrink: 0;
  }

  .mobile-link {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 300;
    font-style: italic;
    letter-spacing: 0.04em;
    transition: color 0.3s ease, letter-spacing 0.3s ease;
  }
  .mobile-link:hover { letter-spacing: 0.09em; }

  .mobile-small-link {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .ocv-book-btn {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    padding: 9px 22px;
    border: 1px solid;
    position: relative;
    overflow: hidden;
    transition: color 0.4s ease;
    background: transparent;
    cursor: pointer;
  }

  .ocv-book-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-101%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ocv-book-btn:hover::before { transform: translateX(0); }
  .ocv-book-btn:hover span { position: relative; }
  .ocv-book-btn:hover { color: inherit; }

  .ocv-book-transparent {
    border-color: rgba(255,255,255,0.6);
    color: white;
  }
  .ocv-book-transparent::before { background: white; }
  .ocv-book-transparent:hover { color: #0a1a2e; }

  .ocv-book-solid {
    border-color: #b49b64;
    color: #b49b64;
  }
  .ocv-book-solid::before { background: #b49b64; }
  .ocv-book-solid:hover { color: white; }

  /* Text shadow for transparent state to pop over any hero image */
  .ocv-shadow-text {
    text-shadow: 0 1px 12px rgba(0,0,0,0.5), 0 0px 3px rgba(0,0,0,0.4);
  }
`;
if (!document.querySelector('#ocv-nav-styles')) {
  style.id = 'ocv-nav-styles';
  document.head.appendChild(style);
}

/* ─── Component ─────────────────────────────────────────────────────── */
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useNavbarScroll(50);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const transparentPages = ['/', '/about'];
  const isTransparentPage = transparentPages.includes(location.pathname);
  const isTransparent = isTransparentPage && !isScrolled;

  const leftLinks  = [
    { name: 'Home',    path: '/' },
    { name: 'About',   path: '/about' },
    { name: 'Rooms',   path: '/rooms' },
  ];
  const rightLinks = [
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const allLinks = [...leftLinks, ...rightLinks];

  const handleLogout  = () => { logout(); navigate('/'); };
  const handleBookNow = () => navigate('/rooms');
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
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ height: 80 }}>

        {/* Background layer */}
        <motion.div
          initial={false}
          animate={{
            backgroundColor: isTransparent ? 'rgba(10,26,46,0)' : 'rgba(250,248,244,0.97)',
            backdropFilter: isTransparent ? 'blur(0px)' : 'blur(12px)',
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Dark gradient scrim — ensures text legibility over any hero image */}
        <motion.div
          initial={false}
          animate={{ opacity: isTransparent ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 75%, transparent 100%)',
          }}
        />

        {/* Gold rule at bottom */}
        <motion.div
          className="ocv-rule"
          animate={{ opacity: isTransparent ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Inner layout */}
        <div className="relative h-full max-w-screen-xl mx-auto px-8 flex items-center justify-between">

          {/* ── LEFT LOGO ── */}
          <Link
            to="/"
            className="flex flex-col items-start group flex-shrink-0"
            style={{ textDecoration: 'none' }}
          >
            <div className="flex items-center gap-3">
              {/* Logo image */}
              <motion.img
                src="/images/logo3.png"
                alt="Oceano Con Vista"
                animate={{ filter: isTransparent ? 'brightness(0) invert(1)' : 'brightness(1)' }}
                transition={{ duration: 0.3 }}
                className="h-11 w-auto object-contain"
              />
              {/* Brand wordmark */}
              <span
                className={`ocv-brand transition-colors duration-300 select-none ${
                  isTransparent ? 'text-white ocv-shadow-text' : 'text-stone-900'
                }`}
                style={{ fontSize: 25, lineHeight: 1 }}
              >
                Oceano Con Vista
              </span>
            </div>
            {/* Thin gold accent under brand */}
            <motion.span
              style={{
                display: 'block',
                height: 1,
                marginTop: 5,
                background: 'linear-gradient(90deg, #b49b64, transparent)',
                width: '70%',
              }}
              animate={{ opacity: isTransparent ? 0.5 : 0.8 }}
            />
          </Link>

          {/* ── RIGHT SIDE — all links ── */}
          <div className="hidden lg:flex items-center space-x-8">
            {[...leftLinks, ...rightLinks].map(link => (
              <Link key={link.path} to={link.path} className={`ocv-nav-link ${linkColor}`}>
                {link.name}
              </Link>
            ))}

            {/* Dot separator */}
            {isAuthenticated && <span className="ocv-dot" />}

            {isAuthenticated ? (
              <div className="flex items-center space-x-5">
                <Link
                  to={getDashboardPath()}
                  className={`ocv-nav-link flex items-center gap-1.5 ${linkColor}`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`ocv-nav-link flex items-center gap-1.5 ${
                    isTransparent ? 'text-white hover:text-red-300 ocv-shadow-text' : 'text-stone-600 hover:text-red-500'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className={`ocv-nav-link ${linkColor}`}>
                Login
              </Link>
            )}

            {/* Dot separator */}
            <span className="ocv-dot" />

            {/* Book Now */}
            <button
              onClick={handleBookNow}
              className={`ocv-book-btn ${isTransparent ? 'ocv-book-transparent' : 'ocv-book-solid'}`}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>Book Now</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden ml-auto transition-colors duration-300 ${
              isTransparent ? 'text-white drop-shadow-md' : 'text-stone-900'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Fullscreen Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: 'linear-gradient(160deg, #0a1a2e 0%, #0f2744 60%, #1a3a5c 100%)' }}
          >
            {/* Decorative top rule */}
            <div style={{
              height: 1,
              marginTop: 80,
              background: 'linear-gradient(90deg, transparent, rgba(180,155,100,0.4), transparent)',
            }} />

            {/* Links */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-1 px-8">
              {allLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mobile-link text-white/80 hover:text-white block text-center"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Gold rule */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                  width: 60,
                  height: 1,
                  background: 'rgba(180,155,100,0.6)',
                  margin: '24px 0',
                }}
              />

              {/* Auth links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="flex items-center gap-8"
              >
                {isAuthenticated ? (
                  <>
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mobile-small-link text-white/60 hover:text-white flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="mobile-small-link text-white/60 hover:text-red-400 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mobile-small-link text-white/60 hover:text-white"
                  >
                    Login
                  </Link>
                )}
              </motion.div>

              {/* Book Now */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                onClick={() => { handleBookNow(); setIsMobileMenuOpen(false); }}
                className="ocv-book-btn ocv-book-transparent mt-6"
                style={{ minWidth: 160 }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>Reserve a Room</span>
              </motion.button>
            </div>

            {/* Bottom tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center pb-10"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 13,
                color: 'rgba(180,155,100,0.6)',
                letterSpacing: '0.08em',
              }}
            >
              Where the ocean meets the sky.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;