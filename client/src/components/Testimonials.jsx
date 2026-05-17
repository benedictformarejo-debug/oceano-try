import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: 'Benedict',
    title: 'Travelled from Davao',
    quote: 'Waking up to that view every morning was something I will never forget. The stillness, the sea, the absolute privacy — Oceano Con Vista is unlike anywhere I have ever stayed in the Philippines.',
    initials: 'BF',
  },
  {
    name: 'Angelo',
    title: 'Travelled from Cebu',
    quote: 'We came for a long weekend and extended our stay by three days. The hospitality is warm but never intrusive, and the views from our room genuinely took our breath away every single time.',
    initials: 'AA',
  },
  {
    name: 'Edward',
    title: 'Travelled from Manila',
    quote: 'I have been to many retreats across the Philippines and nothing compares to the intimacy here. Five rooms means five families truly cared for. You feel it from the moment you arrive.',
    initials: 'ED',
  },
  {
    name: 'Mel Jay',
    title: 'Visited from Singapore',
    quote: 'The hills, the sea, the quiet — it is the kind of place that resets you. We did absolutely nothing for two days and it was the best decision we have ever made on a holiday.',
    initials: 'MJ',
  },
];

const VISIBLE = 2;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const prev = () => {
    if (index === 0) return;
    setDirection(-1);
    setIndex(i => i - 1);
  };

  const next = () => {
    if (index + VISIBLE >= TESTIMONIALS.length) return;
    setDirection(1);
    setIndex(i => i + 1);
  };

  const visible = TESTIMONIALS.slice(index, index + VISIBLE);

  return (
    <section style={{
      background: '#f5f2ec',
      padding: '60px 60px 140px',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Top: label + heading + arrows ── */}
        <div style={{ marginBottom: 72 }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '0.75rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(30,54,36,0.90)',
            marginBottom: 20,
          }}>
            Testimonials
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 40 }}>
            <div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                fontWeight: 300,
                color: '#1e3624',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                margin: '0 0 4px',
              }}>
                Quiet places leave
              </h2>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'rgba(30,54,36,0.50)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                margin: 0,
              }}>
                the loudest impressions.
              </h2>
            </div>

            {/* Arrows */}
            <div style={{ display: 'flex', gap: 12, paddingTop: 100, flexShrink: 0 }}>
              {[{ fn: prev, symbol: '←', disabled: index === 0 }, { fn: next, symbol: '→', disabled: index + VISIBLE >= TESTIMONIALS.length }].map(({ fn, symbol, disabled }) => (
                <button
                  key={symbol}
                  onClick={fn}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    border: '1px solid rgba(30,54,36,0.25)',
                    background: 'transparent',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '1.1rem',
                    color: disabled ? 'rgba(30,54,36,0.2)' : '#1e3624',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    if (!disabled) {
                      e.currentTarget.style.background = '#1e3624';
                      e.currentTarget.style.color = '#f5f2ec';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = disabled ? 'rgba(30,54,36,0.2)' : '#1e3624';
                  }}
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom: stat card + testimonial cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 0 }}>

          {/* Stat card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: '#1e3624',
              padding: '52px 44px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(4rem, 6vw, 6.5rem)',
              fontWeight: 300,
              color: '#f5f2ec',
              lineHeight: 1,
              margin: '0 0 12px',
            }}>
              5
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1rem',
              fontWeight: 400,
              color: 'rgba(245,242,236,0.6)',
              margin: 0,
              lineHeight: 1.5,
            }}>
              Rooms. Every guest<br />remembered by name.
            </p>
          </motion.div>

         {/* Testimonial cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden', borderRadius: '0 12px 12px 0', position: 'relative' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'contents' }}
              >
                {visible.map((t, i) => (
                  <div
                    key={t.name}
                    style={{
                      background: i % 2 === 0 ? '#edeae3' : '#e6e2da',
                      padding: '52px 44px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 480,
                    }}
                  >
                    <div>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '2.5rem',
                        color: 'rgba(30,54,36,0.2)',
                        lineHeight: 1,
                        margin: '0 0 24px',
                      }}>
                        "
                      </p>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '1.1rem',
                        fontWeight: 400,
                        color: 'rgba(30,54,36,0.8)',
                        lineHeight: 1.8,
                        margin: 0,
                      }}>
                        {t.quote}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 40 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: '#1e3624',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: '0.85rem',
                          color: '#f5f2ec',
                          letterSpacing: '0.05em',
                        }}>
                          {t.initials}
                        </span>
                      </div>
                      <div>
                        <p style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: '#1e3624',
                          margin: '0 0 2px',
                        }}>
                          {t.name}
                        </p>
                        <p style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: '0.85rem',
                          color: 'rgba(30,54,36,0.5)',
                          margin: 0,
                        }}>
                          {t.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}