import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(images/IMG_4549.jpg)',
          }}
        />
        {/* Gradient overlay adjusted for better text readability on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      </motion.div>

      {/* Text & Content — Aligned Left */}
      <div className="absolute inset-0 flex flex-col items-start justify-center px-6 md:px-12 lg:px-24 pointer-events-none z-10">
        
        {/* Decorative Line */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: 80 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-1 bg-white/30 mb-6 rounded-full"
        />

        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-4xl md:text-6xl font-display font-bold text-white text-left text-shadow-lg mb-4 max-w-2xl leading-tight"
        >
          Where Ocean Meets Luxury
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="text-white/80 text-xl md:text-2xl tracking-wide font-light text-left mb-8"
        >
          Paradise Bay
        </motion.p>

        {/* New Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          onClick={() => navigate('/rooms')}
          className="pointer-events-auto group relative px-8 py-3 border border-white text-white rounded-full overflow-hidden transition-all duration-300 hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          <span className="relative z-10 font-medium tracking-wider uppercase text-sm">View Suites</span>
        </motion.button>
      </div>

      {/* "Something to my liking" - Subtle Heritage Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-6 md:left-12 lg:left-24 text-white/40 text-xs tracking-[0.2em] uppercase pointer-events-none"
      >
        Est. 1995
      </motion.div>

    </div>
  );
};

export default Hero;