import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const BG = '#f5f2ec';

const faqs = [
  {
    q: 'How do I make a reservation?',
    a: 'You can book directly through our website via the Rooms page, or reach us through WhatsApp, email, or our Contact page. We recommend booking at least two weeks in advance, especially during peak season. Our team will confirm your reservation within 24 hours.',
  },
  {
    q: 'What is your check-in and check-out time?',
    a: 'Standard check-in is at 2:00 PM and check-out is at 12:00 PM noon. Early check-in or late check-out can be arranged depending on availability — just let us know in advance.',
  },
  {
    q: 'Are pets allowed at the resort?',
    a: "Yes — we're a pet-friendly resort and we genuinely love having furry guests. We ask that pets are kept on a leash in common areas and that you inform us during booking so we can prepare accordingly.",
  },
  {
    q: "What's included in my stay?",
    a: "Every stay includes complimentary high-speed WiFi, access to the private pool, 24/7 room service, and our full amenities. Breakfast can be added on request. If there's something specific you need, just ask.",
  },
];

const AccordionItem = ({ item, isOpen, onToggle }) => (
  <div style={{ borderBottom: '1px solid rgba(30,54,36,0.12)' }}>
    <button
      onClick={onToggle}
      style={{
        width: '100%', background: 'none', border: 'none',
        padding: '28px 0', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 24, cursor: 'pointer', textAlign: 'left',
      }}
    >
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '1.25rem', fontWeight: 400, color: '#1e3624', lineHeight: 1.3,
      }}>
        {item.q}
      </span>

      <motion.div
        animate={{ rotate: isOpen ? 45 : 0, background: isOpen ? '#1e3624' : 'transparent' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 36, height: 36, flexShrink: 0, borderRadius: '50%',
          border: '1.5px solid rgba(30,54,36,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <motion.rect
            x="0" y="6.25" width="14" height="1.5" rx="1"
            animate={{ fill: isOpen ? '#fff' : '#1e3624' }}
            transition={{ duration: 0.3 }}
          />
          <motion.rect
            x="6.25" y="0" width="1.5" height="14" rx="1"
            animate={{ fill: isOpen ? '#fff' : '#1e3624' }}
            transition={{ duration: 0.3 }}
          />
        </svg>
      </motion.div>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="body"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.92rem', lineHeight: 1.75,
            color: '#6b7280', padding: '0 60px 28px 0', margin: 0,
          }}>
            {item.a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const AccordionFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section style={{ background: BG, padding: '80px 52px' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ marginBottom: 60 }}
        >
          <p style={{
            fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#9ca3af', margin: '0 0 12px', fontWeight: 500,
          }}>
            Frequently asked questions
          </p>
          {['Everything you', 'need to know'].map((line, li) => (
            <div key={li} style={{ overflow: 'hidden', display: 'block' }}>
              {line.split(' ').map((word, wi) => (
                <motion.span
                  key={wi}
                  variants={{
                    hidden: { y: '110%', opacity: 0 },
                    visible: {
                      y: 0, opacity: 1,
                      transition: { duration: 1.25, ease: [0.22, 1, 0.36, 1], delay: (li * 3 + wi) * 0.1 },
                    },
                  }}
                  style={{
                    display: 'inline-block', marginRight: '0.28em',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 1.05, color: '#1e3624', letterSpacing: '-0.025em',
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          ))}
        </motion.div>

        <div style={{ maxWidth: '80%', borderTop: '1px solid rgba(30,54,36,0.12)' }}>
          {faqs.map((item, i) => (
            <AccordionItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <Link to="/contact" className="flex items-center gap-2 group mt-12 w-fit">
          <span className="text-sm tracking-widest uppercase text-gray-900">Still have questions? Contact us</span>
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-gray-600 transition-colors duration-300">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </Link>

      </div>
    </section>
  );
};

export default AccordionFAQ;