import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {  Star, ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Moments from '../components/Moments';
import AccordionFAQ from '../components/AccordionFAQ.jsx';
import { ZoomParallax } from '../components/ZoomParallax';


/* ─── Animated Star Rating ─── */
const StarRating = ({ rating = 5, label = 'Award-Winning Resort' }) => {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="text-center">
      <div className="flex justify-center gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            onHoverStart={() => setHovered(i)}
            onHoverEnd={() => setHovered(null)}
            animate={{
              scale: hovered !== null && i <= hovered ? 1.35 : 1,
              rotate: hovered !== null && i <= hovered ? [0, -12, 12, 0] : 0,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <motion.div
              animate={hovered === null ? { y: [0, -4, 0], transition: { delay: i * 0.12, duration: 1.6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' } } : { y: 0 }}
            >
              <Star className="w-9 h-9 drop-shadow-lg" fill={i < rating ? '#f59e0b' : 'none'} stroke={i < rating ? '#d97706' : '#d1d5db'} strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        ))}
      </div>
      <div className="text-gray-500 text-xs font-medium tracking-widest uppercase mt-1">{label}</div>
    </div>
  );
};

/* ─── Gallery Zoom Parallax ─── */
const parallaxImages = [
  { src: '/images/IMG_4553.jpg',  alt: 'Private Pool' },
  { src: '/images/IMG_4569.jpg',  alt: 'Oceanus Room' },
  { src: '/images/IMG_4564.jpg',  alt: 'Athena Room' },
  { src: '/images/IMG_4568.jpg',    alt: 'Premium Dining' },
  { src: '/images/IMG_4554.jpeg',  alt: 'Nature & Wellness' },
  { src: '/images/IMG_4566.jpg',  alt: 'Resort View' },
  { src: '/images/IMG_4560.jpg',  alt: 'Oceanus' },
];


/* ─── Amenities Auto-Scroll Carousel ─── */
const AmenitiesCarousel = ({ amenities }) => {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const CARD_WIDTH = 450;
  const GAP = 14;
  const SPEED = 0.8;

  const items = [...amenities, ...amenities, ...amenities];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const totalWidth = amenities.length * (CARD_WIDTH + GAP);

    cancelAnimationFrame(animRef.current);

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED;
        if (posRef.current >= totalWidth) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [amenities.length]);

  return (
    <section style={{ background: '#fff', paddingTop: 80, paddingBottom: 80, overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');

        .amenity-card-wrap {
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1),
                      filter 0.6s cubic-bezier(0.22,1,0.36,1),
                      opacity 0.6s cubic-bezier(0.22,1,0.36,1);
          cursor: pointer;
        }
        .amenity-card-wrap.blurred {
          filter: blur(4px) brightness(0.65);
          opacity: 0.5;
          transform: scale(0.95);
        }
        .amenity-card-wrap.highlighted {
          transform: scale(1.05);
          filter: brightness(1.04);
          z-index: 10;
        }

        .card-normal {
          position: absolute; inset: 0;
          transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1),
                      transform 0.55s cubic-bezier(0.22,1,0.36,1);
          transform: scale(1);
        }
        .amenity-card-wrap.highlighted .card-normal {
          opacity: 0;
          transform: scale(1.03);
        }

        .card-editorial {
          position: absolute; inset: 0;
          opacity: 0;
          transform: translateY(10px) scale(0.98);
          transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1),
                      transform 0.55s cubic-bezier(0.22,1,0.36,1);
          background: #f0ebe0;
          display: flex;
          flex-direction: column;
          padding: 28px 24px 24px 24px;
          box-sizing: border-box;
        }
        .amenity-card-wrap.highlighted .card-editorial {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .editorial-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem;
          font-weight: 900;
          color: #1e3624;
          line-height: 1.1;
          margin: 0 0 20px 0;
          letter-spacing: -0.02em;
        }
        .editorial-img-wrap {
          flex: 1;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 18px;
        }
        .editorial-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .amenity-card-wrap.highlighted .editorial-img-wrap img {
          transform: scale(1.04);
        }
        .editorial-desc {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 0.88rem;
          line-height: 1.65;
          color: #1e3624;
          margin: 0;
        }
      `}</style>

      {/* Heading */}
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  style={{ paddingLeft: 52, paddingRight: 52, marginBottom: 52 }}
>
  {["Your stay includes", "all amenities"].map((line, lineIndex) => (
    <div key={lineIndex} style={{ overflow: 'hidden', display: 'block' }}>
      {line.split(" ").map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          variants={{
            hidden: { y: "110%", opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 1.25,
                ease: [0.22, 1, 0.36, 1],
                delay: (lineIndex * line.split(" ").length + wordIndex) * 0.1,
              },
            },
          }}
          style={{
            display: 'inline-block',
            marginRight: '0.28em',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2rem, 6.5vw, 6rem)',
            fontWeight: 100,
            lineHeight: 1.0,
            color: '#1e3624',
            letterSpacing: '-0.025em',
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  ))}
</motion.div>

      {/* Track */}
      <div
        style={{ overflow: 'hidden', width: '100%' }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; setHoveredIndex(null); }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: GAP,
            willChange: 'transform',
            paddingLeft: 52,
          }}
        >
          {items.map((item, i) => {
            const isHovered = hoveredIndex === i;
            const isBlurred = hoveredIndex !== null && !isHovered;
            return (
              <div
                key={i}
                className={`amenity-card-wrap ${isHovered ? 'highlighted' : ''} ${isBlurred ? 'blurred' : ''}`}
                style={{
                  flexShrink: 0,
                  width: CARD_WIDTH,
                  height: 520,
                  borderRadius: 10,
                  overflow: 'hidden',
                  position: 'relative',
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Normal state */}
                <div className="card-normal">
                  <img
                    src={item.image}
                    alt={item.title}
                    draggable="false"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.0) 45%)' }} />
                  <div style={{
                    position: 'absolute', top: 20, left: 22,
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.35rem', fontWeight: 700,
                    color: '#fff',
                    textShadow: '0 1px 8px rgba(0,0,0,0.5)',
                  }}>
                    {item.title}
                  </div>
                </div>

                {/* Editorial hover state */}
                <div className="card-editorial">
                  <h3 className="editorial-title">{item.title}</h3>
                  <div className="editorial-img-wrap">
                    <img src={item.image} alt={item.title} draggable="false" />
                  </div>
                  <p className="editorial-desc">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ─── Main Page ─── */
const Home = () => {
  const amenities = [
    { title: 'Free WiFi',           image: '/images/wifi.jpg',       description: 'Stay seamlessly connected throughout your stay with high-speed internet access available in every corner of the resort.' },
    { title: 'Instagrammable Take', image: '/images/insta.jpg',      description: 'Every angle is a masterpiece. Discover breathtaking backdrops designed to make your memories — and your feed — unforgettable.' },
    { title: 'Premium Dining',      image: '/images/dining.jpg',     description: 'Savor expertly crafted dishes using the freshest local ingredients, served in an atmosphere as stunning as the flavors.' },
    { title: 'Room Service',        image: '/images/service.jpg',    description: 'Whatever you need, whenever you need it. Our dedicated team is at your service around the clock, every single day.' },
    { title: 'Private Pool',        image: '/images/IMG_4543.jpg',   description: 'Dive into your own slice of paradise. Our exclusive private pools offer the perfect retreat for relaxation and romance.' },
    { title: 'Pet Friendly',        image: '/images/pet.jpg',        description: 'Your furry companions are family too. Bring them along and enjoy a worry-free stay designed with your pets in mind.' },
    { title: 'Nature & Wellness',   image: '/images/IMG_4536.jpg',   description: 'Reconnect with yourself amid lush surroundings. Breathe in the fresh air and let the natural beauty restore your spirit.' },
  ];

  return (
    <div>
      <Hero />

      {/* ── Who We Are Section ── */}
<section className="section-padding bg-white relative overflow-hidden">
  <div className="max-w-6xl mx-auto relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

      {/* ── Left: stacked images ── */}
      <motion.div
        className="relative h-[620px]"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute overflow-hidden rounded-2xl shadow-2xl"
          style={{ width: '75%', height: '75%', top: 0, left: 0, zIndex: 1, border: '4px solid rgba(255,255,255,0.95)' }}
          initial={{ opacity: 0, rotate: -3, y: 20 }}
          whileInView={{ opacity: 1, rotate: -3, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          whileHover={{ scale: 1.03, rotate: -1, zIndex: 3 }}
        >
          <img src="/images/IMG_4563.jpg" alt="Oceanus Room" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div
          className="absolute overflow-hidden rounded-2xl shadow-2xl"
          style={{ width: '75%', height: '75%', bottom: 0, right: 0, zIndex: 2, border: '4px solid rgba(255,255,255,0.95)' }}
          initial={{ opacity: 0, rotate: 3, y: -20 }}
          whileInView={{ opacity: 1, rotate: 3, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          whileHover={{ scale: 1.03, rotate: 1, zIndex: 3 }}
        >
          <img src="/images/IMG_4535.jpg" alt="Athena Room" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div
          className="absolute z-10 px-5 py-3 rounded-2xl text-center"
          style={{ bottom: '20%', left: '-5%', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="text-2xl font-bold text-gray-900">5</div>
          <div className="text-xs text-gray-500 font-medium tracking-wide">Scenic Rooms</div>
        </motion.div>
      </motion.div>

      {/* ── Right: text ── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="flex flex-col gap-6"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {["Who", "We Are"].map((line, lineIndex) => (
            <div key={lineIndex} style={{ overflow: 'hidden', display: 'block' }}>
              {line.split(" ").map((word, wordIndex) => (
                <motion.span
                  key={wordIndex}
                  variants={{
                    hidden: { y: "110%", opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: {
                        duration: 1.25,
                        ease: [0.22, 1, 0.36, 1],
                        delay: (lineIndex * line.split(" ").length + wordIndex) * 0.1,
                      },
                    },
                  }}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.28em',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(2rem, 8vw, 8rem)',
                    fontWeight: 100,
                    lineHeight: 1.0,
                    color: '#1e3624',
                    letterSpacing: '-0.025em',
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          ))}
        </motion.div>

        <p className="text-gray-500 leading-relaxed">
          Oceano Con Vista is a mountain resort in Davao City, Philippines, built for those who want to slow relax and unwind. We have 5 rooms, each with its own view of the sea.
        </p>
        <p className="text-gray-500 leading-relaxed">
          We're not a big hotel chain — just a quiet place run by people who care about good hospitality, clean spaces, and making sure you actually rest.
        </p>

        <div className="mt-2 flex gap-4">
          <motion.div
            className="p-6 rounded-2xl text-center flex-1 flex flex-col items-center justify-center"
            style={{ background: 'rgba(30,54,36,0.04)', border: '1px solid rgba(30,54,36,0.1)' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-4xl font-bold mb-1" style={{ color: '#1e3624', fontFamily: "'Playfair Display', Georgia," }}>24/7</div>
            <div className="text-gray-400 text-xs tracking-widest uppercase">Concierge Service</div>
          </motion.div>
          <motion.div
            className="p-6 rounded-2xl flex-1 flex flex-col items-center justify-center"
            style={{ background: 'rgba(30,54,36,0.04)', border: '1px solid rgba(30,54,36,0.1)' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <StarRating rating={5} label="Award-Winning Resort" />
          </motion.div>
        </div>

        {/* View About Us */}
        <Link to="/about" className="flex items-center gap-2 group mt-2 w-fit">
          <span className="text-sm tracking-widest uppercase text-gray-900">View About Us</span>
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-gray-600 transition-colors duration-300">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </Link>

      </motion.div>
    </div>
  </div>
</section>

      {/* ══════════════════════════════════════
          AMENITIES — auto-scrolling carousel
      ══════════════════════════════════════ */}
      <AmenitiesCarousel amenities={amenities} />
        <Moments />
        <ZoomParallax
  images={parallaxImages}
  heading={{ line1: 'Featured', line2: 'Gallery' }}
  nav={{ label: 'View Gallery', href: '/gallery' }}
/>
        <AccordionFAQ />

      {/* Featured Rooms Section */}
<section className="section-padding bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto relative min-h-[750px] flex items-center justify-center">

    {/* Top Left — small */}
    <motion.div
      initial={{ opacity: 0, x: -40, y: -20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="absolute overflow-hidden shadow-lg"
      style={{ top: '2%', left: '14%', width: 180, height: 210 }}
    >
      <img src="/images/oceanus3.jpeg" alt="Oceanus Room" className="w-full h-full object-cover" />
    </motion.div>

    {/* Top Right — large tall */}
    <motion.div
      initial={{ opacity: 0, x: 40, y: -20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute overflow-hidden shadow-lg"
      style={{ top: '0%', right: '1%', width: 300, height: 400 }}
    >
      <img src="/images/athena.jpeg" alt="Athena Room" className="w-full h-full object-cover" />
    </motion.div>

    {/* Bottom Left — large tall */}
    <motion.div
      initial={{ opacity: 0, x: -40, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="absolute overflow-hidden shadow-lg"
      style={{ bottom: '0%', left: '2%', width: 300, height: 400 }}
    >
      <img src="/images/oceanus.jpeg" alt="Oceanus Room" className="w-full h-full object-cover" />
    </motion.div>

    {/* Bottom Right — small */}
    <motion.div
      initial={{ opacity: 0, x: 40, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="absolute overflow-hidden shadow-lg"
      style={{ bottom: '6%', right: '14%', width: 170, height: 200 }}
    >
      <img src="/images/athena2.jpeg" alt="Athena Room" className="w-full h-full object-cover" />
    </motion.div>

    {/* Center Text */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative z-10 text-center max-w-sm px-4"
    >
      <p className="text-gray-300 text-xl mb-6 tracking-widest">✦</p>

      <h2
  className="text-5xl md:text-8xl mb-6 leading-tight"
  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, color: '#1e3624' }}
>
  Hard to find,<br />hard to leave
</h2>

      <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
        Nestled along the coast, our rooms are crafted for those who seek beauty, stillness, and the sound of the sea.
      </p>

      <Link to="/rooms">
        <Button variant="primary">Explore Our Rooms</Button>
      </Link>
    </motion.div>

  </div>
</section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(images/IMG_4556.jpg)' }} />
        <div className="absolute inset-0 bg-ocean-900/80" />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Ready for Your Dream Vacation?</h2>
            <p className="text-xl mb-10 text-white/90">Book your stay today and discover why Oceano Con Vista is the ultimate destination for those seeking luxury, relaxation, and unforgettable memories.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rooms"><Button variant="primary">Book Now</Button></Link>
              <Link to="/contact"><Button variant="outline">Contact Us</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;