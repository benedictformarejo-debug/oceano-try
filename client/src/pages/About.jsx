import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Testimonials from '../components/Testimonials';



const FAN = [
  { src: '/images/IMG_4567.jpg',  w: 148, h: 210, rotate: 0, left:  -10, z: 1, bottom: 100 },
  { src: '/images/IMG_4569.jpg',  w: 210, h: 310, rotate: 0, left:  160, z: 3, bottom: 60 },
  { src: '/images/IMG_4564.jpg',  w: 310, h: 450, rotate: 0, left:  395, z: 5, bottom: 0  },
  { src: '/images/IMG_4566.jpg',  w: 210, h: 310, rotate: 0, left:  725, z: 3, bottom: 60 },
  { src: '/images/IMG_4568.jpg',  w: 148, h: 210, rotate: 0, left:  962, z: 1, bottom: 100 },
];

/* ─── Fan Hero ─── */
const FanHero = () => (
  <section
    style={{
      background: '#f5f2ec',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 120,
      paddingBottom: 80,
      overflow: 'hidden',
    }}
  >
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
    `}</style>

    {/* ── Heading ── */}
    <motion.div
      style={{ textAlign: 'center', marginBottom: 40, padding: '0 24px', maxWidth: 860 }}
      initial="hidden"
      animate="visible"
    >
      {['Find peace in peaks'].map((line, li) => (
        <div key={li} style={{ overflow: 'hidden', display: 'block', lineHeight: 1.1 }}>
          {line.split(' ').map((word, wi) => (
            <motion.span
              key={wi}
              variants={{
                hidden: { y: '115%', opacity: 0 },
                visible: {
                  y: 0, opacity: 1,
                  transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: li * 0.28 + wi * 0.07 },
                },
              }}
              style={{
                display: 'inline-block',
                marginRight: '0.22em',
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(6rem, 5.5vw, 5rem)',
                fontWeight: 100,
                color: '#1e3624',
                letterSpacing: '-0.015em',
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      ))}
    </motion.div>

    {/* ── Fan images — absolute, all bottom: 0 ── */}
    <div style={{ position: 'relative', width: 1100, height: 460, flexShrink: 0 }}>
      {FAN.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.08 }}
          whileHover={{ y: -22, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
          style={{
            position: 'absolute',
            bottom: img.bottom,
            left: img.left,
            width: img.w,
            height: img.h,
            borderRadius: 14,
            overflow: 'hidden',
            rotate: img.rotate,
            transformOrigin: 'bottom center',
            zIndex: img.z,
            boxShadow: i === 2
              ? '0 24px 64px rgba(30,54,36,0.20)'
              : '0 10px 32px rgba(30,54,36,0.13)',
            cursor: 'pointer',
          }}
        >
          <img
            src={img.src}
            alt=""
            draggable="false"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </motion.div>
      ))}
    </div>
  </section>
);


/* ─── Who We Are + Map ─── */
const WhoWeAre = () => (
  <section style={{ background: '#f5f2ec' }}>

    {/* ── Text block ── */}
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{ padding: '100px 40px 72px', maxWidth: 740, margin: '0 auto' }}>

        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '1rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: 'rgba(30,54,36,0.95)',
          marginBottom: 20,
        }}>
          Who We Are
        </p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(2.8rem, 6vw, 5.2rem)',
            fontWeight: 300,
            color: '#1e3624',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0 0 28px',
          }}
        >
          An exquisite above<br /><em>Samal Island.</em>
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 48, height: 1,
            background: 'rgba(30,54,36,0.3)',
            margin: '0 auto 28px',
            transformOrigin: 'left',
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4 }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            fontWeight: 500,
            color: 'rgba(30,54,36,0.90)',
            lineHeight: 1.85,
            maxWidth: 560,
            margin: '0 auto 44px',
          }}
        >
          Oceano Con Vista sits on the hills of Island City Garden of Samal, Davao del Norte, Philippines — five rooms, each with an unobstructed view of the sea. More than a place to stay, it is a quiet retreat shaped by privacy, intimacy, and meaningful rest.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.55 }}
        >
          <Link to="/rooms"><Button variant="primary" size="lg">Explore Our Rooms</Button></Link>
        </motion.div>

      </div>
    </motion.div>

    {/* ── Full-width map ── */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: 0.2 }}
      style={{ width: '100%', height: '72vh', minHeight: 500 }}
    >

      
      <iframe
        title="Oceano Con Vista Location"
        src="https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d66314.38547938404!2d125.65359788085115!3d7.131189074874158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m3!3m2!1d7.1207479!2d125.6737143!4m5!1s0x32f97b3c1ebeb72b%3A0x50bffe03d705fc0f!2sOCEANO%20CON%20VISTA%20HIGHLANDS%2C%20PUROK%206%2C%20Brgy%2C%20Samal%2C%20Davao%20del%20Norte!3m2!1d7.028742299999999!2d125.76448479999999!5e0!3m2!1sen!2sph!4v1776487173250!5m2!1sen!2sph"
        width="100%"
        height="100%"
        style={{ border: 0, display: 'block', filter: 'grayscale(20%) contrast(1.02) brightness(0.97)' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </motion.div>
  </section>
);

/* ─── Our Values ─── */
const VALUES = [
  {
    label: 'Serenity',
    src: '/images/IMG_4536.jpg',
    text: 'High above the sea, stillness is not merely an amenity — it is the experience itself. Oceano Con Vista was built around the belief that true rest begins when the noise of the world falls away and only the horizon remains.',
  },
  {
    label: 'Nature',
    src: '/images/IMG_4550.jpg',
    text: 'Every detail of this retreat honours the landscape it inhabits. The rolling hills of Samal, the salt-touched breeze, the unfiltered light at dusk — nature here is not a backdrop. It is the host.',
  },
  {
    label: 'Intimacy',
    src: '/images/IMG_4537.jpg',
    text: 'Five rooms. No crowds. No performance. Only the quiet assurance that you are cared for — not as a guest among many, but as the reason every thoughtful detail exists.',
  },
];

const OurValues = () => (
  <section style={{ background: '#f5f2ec', padding: '120px 0 30px' }}>

    {/* ── Header ── */}
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{ textAlign: 'center', marginBottom: 100, padding: '0 40px' }}
    >
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: 'clamp(5rem, 5vw, 4.4rem)',
        fontWeight: 300,
        color: '#1e3624',
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        margin: 0,
      }}>
        Our Values
      </h2>
    </motion.div>

    {/* ── Zigzag rows ── */}
    {VALUES.map((val, i) => {
      const isEven = i % 2 === 0;
      return (
        <div
          key={val.label}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            maxWidth: 1080,
            margin: '0 auto 150px',
          }}
        >
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              order: isEven ? 1 : 2,
              overflow: 'hidden',
              aspectRatio: '3.5 / 4.5',
            }}
          >
            <motion.img
              src={val.src}
              alt={val.label}
              draggable="false"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              order: isEven ? 2 : 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 'clamp(40px, 6vw, 80px)',
            }}
          >
            <h3 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.4rem, 4vw, 3.6rem)',
              fontWeight: 300,
              color: '#1e3624',
              letterSpacing: '-0.015em',
              lineHeight: 1.1,
              margin: '0 0 28px',
            }}>
              {val.label}
            </h3>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(1.2rem, 1.6vw, 1.45rem)',
              fontWeight: 400,
              color: 'rgba(30,54,36,0.75)',
              lineHeight: 1.85,
              margin: 0,
            }}>
              {val.text}
            </p>
          </motion.div>

        </div>
      );
    })}

  </section>
);


/* ─── Page ─── */
const About = () => (
  <div style={{ minHeight: '100vh', overflow: 'hidden', background: '#f5f2ec' }}>
    <FanHero />
    <WhoWeAre />
    <OurValues />
    <Testimonials />
  </div>
);

export default About;