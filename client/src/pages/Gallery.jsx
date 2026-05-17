import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

    .gallery-img-wrap {
      overflow: hidden;
      cursor: pointer;
      position: relative;
      background: #1e3624;
      break-inside: avoid;
      display: block;
    }
    .gallery-img-wrap img {
      width: 100%; height: 100%; object-fit: cover; display: block;
      transition: transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease;
      filter: brightness(0.88) saturate(0.9); opacity: 1;
    }
    .gallery-img-wrap:hover img { filter: brightness(1.12) saturate(1.05); transform: scale(1.04); }
    .gallery-img-wrap .overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(30,54,36,0.72) 0%, transparent 55%);
      opacity: 0; transition: opacity 0.45s ease;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 24px 20px; pointer-events: none;
    }
    .gallery-img-wrap:hover .overlay { opacity: 1; }

    .filter-pill {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 0.85rem; font-weight: 400; letter-spacing: 0.18em;
      text-transform: uppercase; background: transparent;
      border: 1px solid rgba(30,54,36,0.3); color: rgba(30,54,36,0.65);
      padding: 8px 22px; border-radius: 100px; cursor: pointer; transition: all 0.3s ease;
    }
    .filter-pill:hover { border-color: #1e3624; color: #1e3624; }
    .filter-pill.active { background: #1e3624; border-color: #1e3624; color: #f5f2ec; }

    .masonry-grid { columns: 3; column-gap: 0; line-height: 0; }
    .masonry-item { break-inside: avoid; line-height: 0; display: block; }

    @media (max-width: 900px) { .masonry-grid { columns: 2; } }
    @media (max-width: 560px) { .masonry-grid { columns: 1; } }
  `}</style>
);

const GALLERY_ITEMS = [
  { id: 1,  src: '/images/IMG_4536.jpg', label: 'The Sea View Suite',  category: 'Rooms',     aspect: 1.3  },
  { id: 2,  src: '/images/IMG_4567.jpg', label: 'Morning Light',       category: 'Views',     aspect: 0.75 },
  { id: 3,  src: '/images/IMG_4536.jpg', label: 'Hillside Serenity',   category: 'Views',     aspect: 1.0  },
  { id: 4,  src: '/images/IMG_4569.jpg', label: 'The Garden Room',     category: 'Rooms',     aspect: 0.8  },
  { id: 5,  src: '/images/IMG_4550.jpg', label: "Nature's Edge",       category: 'Amenities', aspect: 1.25 },
  { id: 6,  src: '/images/IMG_4564.jpg', label: 'Island Panorama',     category: 'Views',     aspect: 0.65 },
  { id: 7,  src: '/images/IMG_4537.jpg', label: 'The Private Terrace', category: 'Rooms',     aspect: 1.1  },
  { id: 8,  src: '/images/IMG_4568.jpg', label: 'Dusk Over Samal',     category: 'Views',     aspect: 0.9  },
  { id: 9,  src: '/images/IMG_4564.jpg', label: 'Ocean Horizon',       category: 'Views',     aspect: 0.7  },
  { id: 10, src: '/images/IMG_4536.jpg', label: 'The Retreat',         category: 'Amenities', aspect: 1.15 },
  { id: 11, src: '/images/IMG_4569.jpg', label: 'Waking to the Sea',   category: 'Rooms',     aspect: 0.85 },
  { id: 12, src: '/images/IMG_4550.jpg', label: 'Into the Green',      category: 'Amenities', aspect: 1.4  },
  { id: 13, src: '/images/IMG_4569.jpg', label: 'Clifftop Stillness',  category: 'Views',     aspect: 1.0  },
  { id: 14, src: '/images/IMG_4537.jpg', label: 'The Lanai Suite',     category: 'Rooms',     aspect: 0.78 },
  { id: 15, src: '/images/IMG_4550.jpg', label: 'Poolside at Dusk',    category: 'Amenities', aspect: 1.3  },
  { id: 16, src: '/images/IMG_4568.jpg', label: 'Above the Clouds',    category: 'Views',     aspect: 1.55 },
];

const CATEGORIES = ['All', 'Rooms', 'Views', 'Amenities'];

const Modal = ({ items, index, onClose, onNavigate }) => {
  const item = items[index];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  onNavigate(-1);
      if (e.key === 'ArrowRight') onNavigate(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onNavigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,28,18,0.92)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'fixed', top: 24, right: 28,
          background: 'transparent', border: '1px solid rgba(245,242,236,0.25)',
          color: 'rgba(245,242,236,0.75)', width: 40, height: 40, borderRadius: '50%',
          fontSize: '1.1rem', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1001,
          transition: 'all 0.25s ease', fontFamily: 'sans-serif',
        }}
      >✕</button>

      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}
        style={{
          position: 'fixed', left: 20, top: '50%', transform: 'translateY(-50%)',
          background: 'transparent', border: '1px solid rgba(245,242,236,0.2)',
          color: 'rgba(245,242,236,0.7)', width: 44, height: 44, borderRadius: '50%',
          fontSize: '1.1rem', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1001,
          transition: 'all 0.25s ease', fontFamily: 'sans-serif',
        }}
      >←</button>

      <button
        onClick={(e) => { e.stopPropagation(); onNavigate(1); }}
        style={{
          position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)',
          background: 'transparent', border: '1px solid rgba(245,242,236,0.2)',
          color: 'rgba(245,242,236,0.7)', width: 44, height: 44, borderRadius: '50%',
          fontSize: '1.1rem', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1001,
          transition: 'all 0.25s ease', fontFamily: 'sans-serif',
        }}
      >→</button>

      <motion.div
        key={item.id}
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 900, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <img
          src={item.src} alt={item.label}
          style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 2, display: 'block' }}
        />
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.1rem,2.5vw,1.6rem)', fontWeight: 300,
            color: '#f5f2ec', letterSpacing: '-0.01em', lineHeight: 1.2, margin: 0,
          }}>
            {item.label}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const GalleryCard = ({ item, index, onOpen }) => (
  <motion.div
    className="masonry-item"
    layout
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.97 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (index % 6) * 0.06 }}
  >
    <div
      className="gallery-img-wrap"
      style={{ paddingBottom: `${(1 / item.aspect) * 100}%`, position: 'relative' }}
      onClick={() => onOpen(index)}
    >
      <img src={item.src} alt={item.label} draggable="false"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div className="overlay">
        <h3 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(1rem,1.4vw,1.25rem)', fontWeight: 300,
          color: '#f5f2ec', letterSpacing: '-0.01em', margin: 0, lineHeight: 1.2,
        }}>
          {item.label}
        </h3>
      </div>
    </div>
  </motion.div>
);

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [modalIndex, setModalIndex] = useState(null);

  const filtered = GALLERY_ITEMS.filter(
    item => activeCategory === 'All' || item.category === activeCategory
  );

  const handleNavigate = useCallback((dir) => {
    setModalIndex(i => (i + dir + filtered.length) % filtered.length);
  }, [filtered.length]);

  const handleClose = useCallback(() => setModalIndex(null), []);

  useEffect(() => {
    document.body.style.overflow = modalIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalIndex]);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f2ec', overflow: 'hidden' }}>
      <FontStyle />

      <div style={{ paddingTop: 140, paddingBottom: 60, paddingLeft: 48, paddingRight: 48 }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(3.5rem,8vw,7rem)', fontWeight: 300,
            color: '#1e3624', letterSpacing: '-0.025em', lineHeight: 1, margin: 0,
          }}
        >
          Gallery
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        style={{
          display: 'flex', alignItems: 'center',
          paddingLeft: 48, paddingRight: 48, paddingBottom: 40,
          flexWrap: 'wrap', gap: 16,
        }}
      >
        <span style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(30,54,36,0.4)', marginRight: 6,
        }}>Show</span>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-pill${activeCategory === cat ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      <div style={{ height: 1, background: 'rgba(30,54,36,0.1)', marginBottom: 0 }} />

      <AnimatePresence mode="popLayout">
        <motion.div key={activeCategory} className="masonry-grid" style={{ width: '100%' }}>
          {filtered.map((item, i) => (
            <GalleryCard key={item.id} item={item} index={i} onOpen={setModalIndex} />
          ))}
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 }}
        style={{ textAlign: 'center', padding: '80px 48px 100px' }}
      >
        <div style={{ width: 40, height: 1, background: 'rgba(30,54,36,0.25)', margin: '0 auto 24px' }} />
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '0.8rem', letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'rgba(30,54,36,0.35)', margin: 0,
        }}>
          Oceano Con Vista · Samal Island, Philippines
        </p>
      </motion.div>

      <AnimatePresence>
        {modalIndex !== null && (
          <Modal
            items={filtered}
            index={modalIndex}
            onClose={handleClose}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;