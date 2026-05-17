import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const slides = [
  'images/hero3.jpeg',
  'images/hero.png',
  'images/IMG_4563.jpg',
  'images/hero4.jpeg',
];

const SLIDE_MS = 8000;
const ZOOM_MS  = 6000;
const FADE_MS  = 1500;

const Hero = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const imgOffset  = scrollY * 0.4;
  const textOffset = scrollY * 0.6;
  const textOpacity = Math.max(0, 1 - scrollY / 400);

  return (
    <>
      <style>{`
        @keyframes zoom-out {
          0%   { transform: scale(1.40); }
          100% { transform: scale(1.0);  }
        }
        .kb-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          will-change: transform, opacity;
          transition: opacity ${FADE_MS}ms ease-in-out;
        }
        .kb-slide.active {
          animation: zoom-out ${ZOOM_MS}ms ease-out forwards;
        }
      `}</style>

      <div className="relative h-screen w-full overflow-hidden bg-black">

        {/* Slides */}
        <div
          style={{ position: 'absolute', inset: 0, willChange: 'transform', transform: `translateY(${imgOffset}px)` }}
        >
          {slides.map((src, i) => (
            <div
              key={i}
              className={`kb-slide ${i === active ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${src})`,
                zIndex: i === active ? 2 : 1,
                opacity: i === active ? 1 : 0,
              }}
            />
          ))}
        </div>

        {/* Vignette — radial dark edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 3,
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.72) 100%)',
          }}
        />

        {/* Subtle bottom fade so text sits clean */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 3,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 40%)',
          }}
        />

        {/* Content — centered */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
          style={{ zIndex: 4, transform: `translateY(${textOffset}px)`, opacity: textOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: textOpacity === 0 ? 0 : 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          {/* Thin decorative line above */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="w-12 h-px bg-white/50 mb-6"
          />

          {/* Resort name */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-white font-display font-light tracking-[0.25em] uppercase text-3xl md:text-5xl mb-2"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.4)' }}
          >
            Oceano Con Vista
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-white/60 tracking-[0.35em] uppercase text-xs md:text-sm font-light mb-10"
          >
            Highlands
          </motion.p>

          {/* Thin decorative line below */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="w-12 h-px bg-white/50 mb-10"
          />

          {/* Button */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            onClick={() => navigate('/rooms')}
            className="pointer-events-auto px-10 py-3 border border-white/70 text-white/90 rounded-full text-xs tracking-[0.2em] uppercase font-light transition-all duration-300 hover:bg-white hover:text-black hover:border-white"
            style={{ backdropFilter: 'blur(4px)', background: 'rgba(255,255,255,0.05)' }}
          >
            View Rooms
          </motion.button>
        </motion.div>

      </div>
    </>
  );
};

export default Hero;