import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function ZoomParallax({ images = [], heading, nav }) {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  const positionClasses = [
    '',
    '[&>div]:-top-[30vh] [&>div]:left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]',
    '[&>div]:-top-[10vh] [&>div]:-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]',
    '[&>div]:left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]',
    '[&>div]:top-[27.5vh] [&>div]:left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]',
    '[&>div]:top-[27.5vh] [&>div]:-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]',
    '[&>div]:top-[22.5vh] [&>div]:left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]',
  ];

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Images ── */}
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];
          const posClass = positionClasses[index] || '';

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${posClass}`}
            >
              <div className="relative h-[25vh] w-[25vw]">
                <img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Parallax image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          );
        })}

        {/* ── Heading above image index 3 (left-[27.5vw]) ── */}
        {heading && (
          <motion.div
            style={{ scale: scale5 }}
            className="absolute top-0 flex h-full w-full items-center justify-center pointer-events-none"
          >
            <div
              style={{
                position: 'absolute',
                top: 'calc(50% - 32vh)',
                left: '75vw',
                width: '25vw',
                textAlign: 'left',
                lineHeight: 1.0,
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(1.4rem, 3.5vw, 3.5rem)',
                  fontWeight: 100,
                  color: '#1e3624',
                  letterSpacing: '-0.025em',
                }}
              >
                {heading.line1}
              </span>
              <span
                style={{
                  display: 'block',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(1.4rem, 3.5vw, 3.5rem)',
                  fontWeight: 100,
                  color: '#1e3624',
                  letterSpacing: '-0.025em',
                }}
              >
                {heading.line2}
              </span>
            </div>
          </motion.div>
        )}

        {/* ── Nav below image index 6 (top-[22.5vh] + h-[15vh] = ~37.5vh, left-[25vw]) ── */}
        {nav && (
          <motion.div
            style={{ scale: scale9 }}
            className="absolute top-0 flex h-full w-full items-center justify-center"
          >
            <div
              style={{
                position: 'absolute',
                top: 'calc(50% + 35vh)',
                left: '68vw',
                width: '15vw',
              }}
            >
              <Link
                to={nav.href || '/gallery'}
                className="flex items-center gap-2 group"
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(0.65rem, 1vw, 1rem)',
                    fontWeight: 400,
                    color: '#1e3624',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {nav.label}
                </span>
                <div className="w-6 h-6 rounded-full bg-[#1e3624] flex items-center justify-center group-hover:bg-[#2d5038] transition-colors duration-300 flex-shrink-0">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
              </Link>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}