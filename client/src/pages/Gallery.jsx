import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { X, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [filter, setFilter] = useState('All');
  const headerRef = useRef(null);
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 200], [0, -40]);
  const headerOpacity = useTransform(scrollY, [0, 150], [1, 0]);

  const images = [
    { url: '/images/hero.png', title: 'Ocean View Suite', category: 'Rooms', size: 'large' },
    { url: '/images/IMG_4559.jpg', title: 'Private Beach', category: 'Facilities', size: 'tall' },
    { url: '/images/IMG_4556.jpg', title: 'Luxury Pool Villa', category: 'Rooms', size: 'medium' },
    { url: '/images/IMG_4540.jpg', title: 'Infinity Pool', category: 'Facilities', size: 'wide' },
    { url: '/images/IMG_4548.jpg', title: 'Beachfront Bungalow', category: 'Rooms', size: 'medium' },
    { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80', title: 'Gourmet Dining', category: 'Dining', size: 'tall' },
    { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80', title: 'Presidential Suite', category: 'Rooms', size: 'medium' },
    { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80', title: 'Resort Grounds', category: 'Facilities', size: 'wide' },
    { url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80', title: 'Deluxe Garden Room', category: 'Rooms', size: 'medium' },
    { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80', title: 'Sunset Views', category: 'Experience', size: 'large' },
    { url: '/images/IMG_4560.jpg', title: 'Spa & Wellness', category: 'Facilities', size: 'medium' },
    { url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80', title: 'Beach Cabanas', category: 'Experience', size: 'tall' }
  ];

  const categories = ['All', 'Rooms', 'Facilities', 'Dining', 'Experience'];
  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  const getSizeClass = (size) => {
    switch (size) {
      case 'large': return 'md:col-span-2 md:row-span-2';
      case 'wide': return 'md:col-span-2';
      case 'tall': return 'md:row-span-2';
      default: return '';
    }
  };

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const navigate = (dir) => {
    const next = (selectedIndex + dir + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[next]);
    setSelectedIndex(next);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">

      {/* Header */}
      <motion.div
        ref={headerRef}
        style={{ y: headerY, opacity: headerOpacity }}
        className="pt-24 pb-4 text-center px-6"
      >
        <motion.p
          className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Oceano Convista
        </motion.p>

        <motion.h1
          className="text-6xl md:text-6xl font-light text-gray-900 tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Gallery
        </motion.h1>

        <motion.p
          className="text-xs tracking-widest uppercase text-gray-400 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          Moments captured in paradise
        </motion.p>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex justify-center gap-2 mt-10 mb-10 px-6 flex-wrap"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
              filter === cat
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {filteredImages.length === 0 ? (
          <motion.p
            className="text-center text-gray-400 py-24 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No images in this category.
          </motion.p>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[200px]">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.url}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  onClick={() => openLightbox(image, index)}
                  className={`relative group cursor-pointer overflow-hidden rounded-xl bg-gray-200 ${getSizeClass(image.size)}`}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Arrow icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <ArrowUpRight size={14} className="text-white" />
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            {/* Close */}
            <motion.button
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-all duration-200 hover:rotate-90"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <X size={16} />
            </motion.button>

            {/* Prev */}
            {filteredImages.length > 1 && (
              <motion.button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-all duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              >
                <ChevronLeft size={18} />
              </motion.button>
            )}

            {/* Image */}
            <motion.div
              className="max-w-4xl w-full"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full max-h-[78vh] object-contain rounded-lg"
              />

              <motion.div
                className="mt-4 flex items-center gap-3 justify-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
                  {selectedImage.category}
                </span>
                <span className="w-4 h-px bg-gray-600 block" />
                <span className="text-white/80 text-sm font-light">
                  {selectedImage.title}
                </span>
                {filteredImages.length > 1 && (
                  <>
                    <span className="w-4 h-px bg-gray-600 block" />
                    <span className="text-[10px] tracking-widest text-gray-500">
                      {String(selectedIndex + 1).padStart(2, '0')} / {String(filteredImages.length).padStart(2, '0')}
                    </span>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Next */}
            {filteredImages.length > 1 && (
              <motion.button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/50 transition-all duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
              >
                <ChevronRight size={18} />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;