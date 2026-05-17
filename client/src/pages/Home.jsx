import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Moments from '../components/Moments';
import AccordionFAQ from '../components/AccordionFAQ.jsx';
import { ZoomParallax } from '../components/ZoomParallax';

/* ─── Font import ─── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');`;

const BG = '#f5f2ec';

/* ─── Gallery images ─── */
const parallaxImages = [
  { src: '/images/IMG_4553.jpg',  alt: 'Private Pool' },
  { src: '/images/IMG_4569.jpg',  alt: 'Oceanus Room' },
  { src: '/images/IMG_4564.jpg',  alt: 'Athena Room' },
  { src: '/images/IMG_4568.jpg',  alt: 'Premium Dining' },
  { src: '/images/IMG_4554.jpeg', alt: 'Nature & Wellness' },
  { src: '/images/IMG_4566.jpg',  alt: 'Resort View' },
  { src: '/images/IMG_4560.jpg',  alt: 'Oceanus' },
];

/* ─── Amenities Auto-Scroll Carousel ─── */
const AmenitiesCarousel = ({ amenities }) => {
  const trackRef   = useRef(null);
  const animRef    = useRef(null);
  const posRef     = useRef(0);
  const pausedRef  = useRef(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const CARD_WIDTH = 450;
  const GAP        = 14;
  const SPEED      = 0.8;
  const items      = [...amenities, ...amenities, ...amenities];

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
    <section style={{ background: BG, paddingTop: 80, paddingBottom: 80, overflow: 'hidden' }}>
      <style>{`
        .amenity-card-wrap {
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1),
                      filter 0.6s cubic-bezier(0.22,1,0.36,1),
                      opacity 0.6s cubic-bezier(0.22,1,0.36,1);
          cursor: pointer;
        }
        .amenity-card-wrap.blurred   { filter: blur(4px) brightness(0.65); opacity: 0.5; transform: scale(0.95); }
        .amenity-card-wrap.highlighted { transform: scale(1.05); filter: brightness(1.04); z-index: 10; }
        .card-normal {
          position: absolute; inset: 0;
          transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1);
        }
        .amenity-card-wrap.highlighted .card-normal { opacity: 0; transform: scale(1.03); }
        .card-editorial {
          position: absolute; inset: 0; opacity: 0;
          transform: translateY(10px) scale(0.98);
          transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1);
          background: #f0ebe0; display: flex; flex-direction: column;
          padding: 28px 24px 24px; box-sizing: border-box;
        }
        .amenity-card-wrap.highlighted .card-editorial { opacity: 1; transform: translateY(0) scale(1); }
        .editorial-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2rem; font-weight: 900; color: #1e3624;
          line-height: 1.1; margin: 0 0 20px; letter-spacing: -0.02em;
        }
        .editorial-img-wrap { flex: 1; border-radius: 8px; overflow: hidden; margin-bottom: 18px; }
        .editorial-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .amenity-card-wrap.highlighted .editorial-img-wrap img { transform: scale(1.04); }
        .editorial-desc { font-family: Georgia, serif; font-size: 0.88rem; line-height: 1.65; color: #1e3624; margin: 0; }
      `}</style>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
        style={{ paddingLeft: 52, paddingRight: 52, marginBottom: 52 }}>
        {["Your stay includes", "all amenities"].map((line, li) => (
          <div key={li} style={{ overflow: 'hidden', display: 'block' }}>
            {line.split(' ').map((word, wi) => (
              <motion.span key={wi}
                variants={{
                  hidden: { y: '110%', opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 1.25, ease: [0.22,1,0.36,1], delay: (li * line.split(' ').length + wi) * 0.1 } },
                }}
                style={{ display: 'inline-block', marginRight: '0.28em', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 6.5vw, 6rem)', fontWeight: 100, lineHeight: 1.0, color: '#1e3624', letterSpacing: '-0.025em' }}
              >{word}</motion.span>
            ))}
          </div>
        ))}
      </motion.div>

      <div style={{ overflow: 'hidden', width: '100%' }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; setHoveredIndex(null); }}>
        <div ref={trackRef} style={{ display: 'flex', gap: GAP, willChange: 'transform', paddingLeft: 52 }}>
          {items.map((item, i) => {
            const isHovered = hoveredIndex === i;
            const isBlurred = hoveredIndex !== null && !isHovered;
            return (
              <div key={i}
                className={`amenity-card-wrap ${isHovered ? 'highlighted' : ''} ${isBlurred ? 'blurred' : ''}`}
                style={{ flexShrink: 0, width: CARD_WIDTH, height: 520, borderRadius: 10, overflow: 'hidden', position: 'relative' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}>
                <div className="card-normal">
                  <img src={item.image} alt={item.title} draggable="false" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.0) 45%)' }} />
                  <div style={{ position: 'absolute', top: 20, left: 22, fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.35rem', fontWeight: 700, color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
                    {item.title}
                  </div>
                </div>
                <div className="card-editorial">
                  <h3 className="editorial-title">{item.title}</h3>
                  <div className="editorial-img-wrap"><img src={item.image} alt={item.title} draggable="false" /></div>
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


/* ─── About Section ─── */
const rooms = [
  { name: 'Oceanus Room',  href: '/rooms' },
  { name: 'Athena Room',   href: '/rooms' },
  { name: 'Ouranus Room',  href: '/rooms' },
  { name: 'Apollo Room',   href: '/rooms' },
  { name: 'Cronus Room',   href: '/rooms' },
];

const AboutSection = () => {
  const imgRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.0, 1.08]);

  return (
    <section className="about-section" style={{ background: BG, padding: '100px 0' }}>
      <style>{FONTS}{`
        .about-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .about-section { padding: 60px 0 !important; }
          .about-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 0 24px;
          }
          .about-image { aspect-ratio: 4/3 !important; }
        }
      `}</style>
      <div className="about-grid">

        <motion.div
          ref={imgRef}
          className="about-image"
          style={{ position: 'relative', overflow: 'hidden', borderRadius: 4, aspectRatio: '3/4' }}
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src="/images/IMG_4535.jpg"
            alt="Oceano Con Vista"
            style={{ width: '100%', height: '110%', objectFit: 'cover', display: 'block', y, scale, transformOrigin: 'center center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.18))' }} />
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ marginBottom: 36 }}>
            {['Stay', 'with us'].map((line, li) => (
              <div key={li} style={{ overflow: 'hidden', display: 'block', lineHeight: 1.0 }}>
                {line.split(' ').map((word, wi) => (
                  <motion.span
                    key={wi}
                    variants={{
                      hidden: { y: '110%', opacity: 0 },
                      visible: { y: 0, opacity: 1, transition: { duration: 1.25, ease: [0.22, 1, 0.36, 1], delay: (li * 2 + wi) * 0.12 } },
                    }}
                    style={{
                      display: 'inline-block',
                      marginRight: '0.28em',
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 'clamp(2.8rem, 6vw, 6rem)',
                      fontWeight: 100,
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

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.1rem', fontWeight: 400, color: '#1e3624', opacity: 0.6, lineHeight: 1.75, marginBottom: 44, marginTop: 0 }}
          >
            Nestled on a mountain in Samal Island, Oceano Con Vista is a resort built for quiet. Five rooms, each with their own view of the sea — no crowds, no rush, just the kind of rest you actually remember.
          </motion.p>

          <div style={{ borderTop: '1px solid #1e362418', marginBottom: 44 }}>
            {rooms.map((room, i) => (
              <motion.div
                key={room.name}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45 + i * 0.07 }}
              >
                <Link
                  to={room.href}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #1e362418', textDecoration: 'none', color: '#1e3624' }}
                >
                  <span
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.4rem', fontWeight: 400, letterSpacing: '0.01em', color: '#1e3624', transition: 'letter-spacing 0.4s ease' }}
                    onMouseEnter={e => e.target.style.letterSpacing = '0.06em'}
                    onMouseLeave={e => e.target.style.letterSpacing = '0.01em'}>
                    {room.name}
                  </span>
                  <span
                    style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#1e362480', fontFamily: 'Georgia, serif', transition: 'color 0.3s' }}
                    onMouseEnter={e => e.target.style.color = '#1e3624'}
                    onMouseLeave={e => e.target.style.color = '#1e362480'}>
                    View
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.85 }}
            style={{ display: 'flex', alignItems: 'flex-start' }}
          >
            <Link to="/rooms">
              <Button variant="primary" size="lg">View All Rooms</Button>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};


/* ─── Brand Statement ─── */
const BrandStatement = () => (
  <section style={{ background: BG, padding: '120px 40px' }}>
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 24, marginBottom: 72 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #1e362440)' }} />
        <motion.img
          src="/images/logo3.png"
          alt="Oceano Con Vista"
          style={{ width: 90, height: 90, objectFit: 'contain', opacity: 0.75 }}
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          whileInView={{ opacity: 0.75, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #1e362440)' }} />
      </motion.div>

      <motion.div style={{ textAlign: 'center', marginBottom: 0 }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {[
          { text: 'Not a hotel.', italic: false },
          { text: 'A feeling.',   italic: true  },
        ].map((line, li) => (
          <div key={li} style={{ overflow: 'hidden', display: 'block', lineHeight: 1.05 }}>
            {line.text.split(' ').map((word, wi) => (
              <motion.span key={wi}
                variants={{
                  hidden: { y: '110%', opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22,1,0.36,1], delay: li * 0.3 + wi * 0.08 } },
                }}
                style={{ display: 'inline-block', marginRight: '0.22em', fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(3.5rem, 9vw, 8.5rem)', fontWeight: 300, fontStyle: line.italic ? 'italic' : 'normal', color: '#1e3624', letterSpacing: line.italic ? '-0.02em' : '-0.03em' }}
              >{word}</motion.span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);


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
    <div style={{ background: BG }}>
      <Hero />

      <BrandStatement />

      <AboutSection />

      <AmenitiesCarousel amenities={amenities} />

      <Moments />

      <ZoomParallax
        images={parallaxImages}
        heading={{ line1: 'Featured', line2: 'Gallery' }}
        nav={{ label: 'View Gallery', href: '/gallery' }}
      />

      <AccordionFAQ />

      {/* ── Featured Rooms Section ── */}
      <section className="section-padding overflow-hidden" style={{ background: BG }}>
        <div className="max-w-7xl mx-auto relative min-h-[750px] flex items-center justify-center">

          <motion.div initial={{ opacity: 0, x: -40, y: -20 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}
            className="absolute overflow-hidden shadow-lg" style={{ top: '2%', left: '14%', width: 180, height: 210 }}>
            <img src="/images/oceanus3.jpeg" alt="Oceanus Room" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40, y: -20 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute overflow-hidden shadow-lg" style={{ top: '0%', right: '1%', width: 300, height: 400 }}>
            <img src="/images/athena.jpeg" alt="Athena Room" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -40, y: 20 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute overflow-hidden shadow-lg" style={{ bottom: '0%', left: '2%', width: 300, height: 400 }}>
            <img src="/images/oceanus.jpeg" alt="Oceanus Room" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40, y: 20 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute overflow-hidden shadow-lg" style={{ bottom: '6%', right: '14%', width: 170, height: 200 }}>
            <img src="/images/athena2.jpeg" alt="Athena Room" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 text-center max-w-sm px-4">
            <p className="text-gray-300 text-xl mb-6 tracking-widest">✦</p>
            <h2 className="text-5xl md:text-8xl mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, color: '#1e3624' }}>
              Hard to find,<br />hard to leave
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
              Nestled along the coast, our rooms are crafted for those who seek beauty, stillness, and the sound of the sea.
            </p>
            <Link to="/rooms"><Button variant="primary" size="lg">Explore Our Rooms</Button></Link>
          </motion.div>

        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(images/IMG_4556.jpg)' }} />
        <div className="absolute inset-0 bg-ocean-900/80" />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Ready for Your Dream Vacation?</h2>
            <p className="text-xl mb-10 text-white/90">Book your stay today and discover why Oceano Con Vista is the ultimate destination for those seeking luxury, relaxation, and unforgettable memories.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rooms"><Button variant="secondary" size="lg">Book Now</Button></Link>
              <Link to="/contact"><Button variant="secondary" size="lg">Contact Us</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;