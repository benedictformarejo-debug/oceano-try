import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const links = [
    { label: 'Home',    path: '/' },
    { label: 'About',   path: '/about' },
    { label: 'Rooms',   path: '/rooms' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <footer style={{ background: '#fff', fontFamily: "'DM Sans', sans-serif", padding: '56px 24px 40px', textAlign: 'center' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');
        .f-link { color: #1a2332; text-decoration: none; font-size: 1rem; font-weight: 500; display: inline-block; transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s; }
        .f-link:hover { transform: translateY(-3px); opacity: 0.5; }
        .f-social { color: #1a2332; transition: opacity 0.2s; display: flex; align-items: center; }
        .f-social:hover { opacity: 0.45; }
      `}</style>

      {/* Brand */}
     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 40 }}>
  <img src="/images/logo3.png" alt="Logo" style={{ height: 50, width: 'auto' }} />
  <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.15em', color: '#1a2332', textTransform: 'uppercase' }}>
    Oceano Con Vista
  </span>
</div>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap', marginBottom: 32 }}>
        {links.map((l, i) => (
          <Link key={i} to={l.path} className="f-link">{l.label}</Link>
        ))}
      </nav>

      {/* Slash divider */}
      <div style={{ color: '#c0c8d0', fontSize: '1.1rem', letterSpacing: '0.18em', marginBottom: 32, userSelect: 'none' }}>
        //////////////////
      </div>

      {/* Socials */}
<div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 32 }}>
  <a href="#" target="_blank" rel="noopener noreferrer" className="f-social"><Twitter size={22} /></a>
  <a href="https://www.facebook.com/OceanoConVista" target="_blank" rel="noopener noreferrer" className="f-social"><Facebook size={22} /></a>
  <a href="#" target="_blank" rel="noopener noreferrer" className="f-social"><Instagram size={22} /></a>
</div>

      {/* Copyright */}
      <p style={{ fontSize: '0.85rem', color: '#9DAFC0', margin: 0 }}>
        © {new Date().getFullYear()} Oceano Con Vista. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;