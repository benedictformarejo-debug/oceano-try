import { motion } from 'framer-motion';

const Moments = () => {
  const images = [
    '/images/moment3.jpg',
    '/images/moment4.jpg',
    '/images/moment2.jpg',
    '/images/moment.jpg',
  ];

  const headingStyle = {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 'clamp(3rem, 6vw, 7rem)',
    fontWeight: 100,
    lineHeight: 1.0,
    color: '#1e3624',
    letterSpacing: '-0.025em',
    display: 'inline-block',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <style>{`
        .moments-wrapper {
          display: flex;
          gap: 32px;
          padding-right: 10px;
          align-items: flex-start;
          width: 100%;
        }
        .moments-left {
          flex: 0 0 28%;
          position: sticky;
          top: 20vh;
          align-self: flex-start;
          padding-left: 28px;
        }
        .moments-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .moments-img-wrap {
          overflow: hidden;
          height: 520px;
        }

        @media (max-width: 768px) {
          .moments-wrapper {
            flex-direction: column;
            gap: 24px;
            padding-right: 0;
            padding-left: 0;   /* ← add this */

          }
          .moments-left {
            flex: none;
            width: 100%;
            position: static;
            padding-left: 0;
          }
          .moments-left span {
            white-space: normal !important;
            font-size: clamp(3rem, 12vw, 5rem) !important;
          }
          .moments-grid {
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            width: 100%;       /* ← add this */
          }
          .moments-img-wrap {
            height: 220px;
          }
        }
      `}</style>

      <section style={{ background: '#fff', padding: '60px 24px' }}>
        <div className="moments-wrapper">

          {/* ── Left: sticky text ── */}
          <div className="moments-left">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>

              <div style={{ overflow: 'hidden' }}>
                <motion.span
                  variants={{
                    hidden: { y: '110%', opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 1.25, ease: [0.22, 1, 0.36, 1], delay: 0 } },
                  }}
                  style={headingStyle}
                >
                  Moments to
                </motion.span>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <motion.span
                  variants={{
                    hidden: { y: '110%', opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 1.25, ease: [0.22, 1, 0.36, 1], delay: 0.15 } },
                  }}
                  style={headingStyle}
                >
                  Share
                </motion.span>
              </div>

            </motion.div>
          </div>

          {/* ── Right: 2×2 image grid ── */}
          <div className="moments-grid">
            {images.map((src, i) => (
              <motion.div
                key={i}
                className="moments-img-wrap"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              >
                <img
                  src={src}
                  alt=""
                  draggable="false"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </motion.div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
};

export default Moments;