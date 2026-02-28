import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('All');

  const images = [
    {
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
      title: 'Ocean View Suite',
      category: 'Rooms',
      size: 'large' // spans 2 columns, 2 rows
    },
    {
      url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80',
      title: 'Private Beach',
      category: 'Facilities',
      size: 'tall' // spans 1 column, 2 rows
    },
    {
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
      title: 'Luxury Pool Villa',
      category: 'Rooms',
      size: 'medium'
    },
    {
      url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
      title: 'Infinity Pool',
      category: 'Facilities',
      size: 'wide' // spans 2 columns, 1 row
    },
    {
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
      title: 'Beachfront Bungalow',
      category: 'Rooms',
      size: 'medium'
    },
    {
      url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
      title: 'Gourmet Dining',
      category: 'Dining',
      size: 'tall'
    },
    {
      url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80',
      title: 'Presidential Suite',
      category: 'Rooms',
      size: 'medium'
    },
    {
      url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
      title: 'Resort Grounds',
      category: 'Facilities',
      size: 'wide'
    },
    {
      url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80',
      title: 'Deluxe Garden Room',
      category: 'Rooms',
      size: 'medium'
    },
    {
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80',
      title: 'Sunset Views',
      category: 'Experience',
      size: 'large'
    },
    {
      url: 'https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=1200&q=80',
      title: 'Spa & Wellness',
      category: 'Facilities',
      size: 'medium'
    },
    {
      url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
      title: 'Beach Cabanas',
      category: 'Experience',
      size: 'tall'
    }
  ];

  const categories = ['All', 'Rooms', 'Facilities', 'Dining', 'Experience'];

  const filteredImages = filter === 'All' 
    ? images 
    : images.filter(img => img.category === filter);

  const getSizeClass = (size) => {
    switch(size) {
      case 'large': return 'md:col-span-2 md:row-span-2';
      case 'wide': return 'md:col-span-2';
      case 'tall': return 'md:row-span-2';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      {/* Header */}
      <section className="section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Gallery
          </h1>
          <p className="text-lg text-gray-600">
            Immerse yourself in the beauty of Oceano Convista
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                filter === category
                  ? 'bg-ocean-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-ocean-50 hover:text-ocean-600 shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Masonry Gallery Grid */}
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.url}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  onClick={() => setSelectedImage(image)}
                  className={`relative group cursor-pointer overflow-hidden rounded-2xl ${getSizeClass(image.size)}`}
                >
                  {/* Image */}
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Zoom Icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-ocean-600/90 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                    {image.category}
                  </div>
                  
                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <h3 className="text-xl font-display font-bold drop-shadow-lg">
                      {image.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-lg">No images found in this category</p>
          </motion.div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            {/* Close Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:rotate-90 backdrop-blur-md"
            >
              <X className="w-7 h-7" />
            </motion.button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-6xl w-full"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
              </div>
              
              {/* Image Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-center text-white"
              >
                <span className="inline-block px-4 py-1.5 bg-ocean-600/80 backdrop-blur-sm rounded-full text-sm font-semibold mb-3">
                  {selectedImage.category}
                </span>
                <h3 className="text-3xl font-display font-bold">
                  {selectedImage.title}
                </h3>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;