import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Wifi, Tv, Wind, Beef, Music, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const ROOM_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Josefin+Sans:wght@200;300;400;700&display=swap');

  .room-book-btn {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    padding: 11px 32px;
    border: 1px solid rgba(255,255,255,0.75);
    color: white;
    position: relative;
    overflow: hidden;
    transition: color 0.3s ease;
    background: transparent;
    cursor: pointer;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .room-book-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: white;
    transform: translateX(-101%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .room-book-btn:hover::before { transform: translateX(0); }
  .room-book-btn:hover { color: #0a1a2e; }
  .room-book-btn span { position: relative; z-index: 1; }

  .room-book-btn-solid {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    padding: 11px 28px;
    border: 1px solid #b49b64;
    color: #b49b64;
    position: relative;
    overflow: hidden;
    transition: color 0.3s ease;
    background: transparent;
    cursor: pointer;
    white-space: nowrap;
  }
  .room-book-btn-solid::before {
    content: '';
    position: absolute; inset: 0;
    background: #b49b64;
    transform: translateX(-101%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .room-book-btn-solid:hover::before { transform: translateX(0); }
  .room-book-btn-solid:hover { color: white; }
  .room-book-btn-solid span { position: relative; z-index: 1; }

  .room-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    font-style: italic;
    letter-spacing: 0.04em;
    text-shadow: 0 2px 32px rgba(0,0,0,0.55);
  }

  .room-eyebrow {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.65);
  }

  .room-price-label {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .facilities-heading {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 400;
    font-style: italic;
  }

  .section-label {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 10px;
    font-weight: 300;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #9ca3af;
  }
`;

const rooms = [
  {
    id: 'd49a696f-9eb7-4053-84c5-160a7b0200cf',
    name: 'Oceanus Room',
    description: 'Wake up to breathtaking panoramic views of the ocean. This spacious suite features floor-to-ceiling windows, a private balcony, and luxurious amenities for the ultimate seaside escape. Perfect for couples seeking a romantic retreat with the sound of the waves as their lullaby.',
    price: 3000,
    capacity: 2,
    image: 'images/oceanus.jpeg',
    images: ['images/oceanus.jpeg', 'images/oceanus2.jpeg', 'images/oceanus3.jpeg'],
    amenities: ['Ocean View', 'Queen Size Bed', 'Private Balcony', 'Bathroom', 'Smart TV', 'Hot Shower', 'Filipino Breakfast'],
    features: [
      { icon: Wifi,     label: 'Free WiFi' },
      { icon: Utensils, label: 'Filipino Breakfast' },
      { icon: Tv,       label: 'Smart TV' },
      { icon: Wind,     label: 'Air Conditioning' },
    ]
  },
  {
    id: '9eb09791-cc36-4c30-9d00-374a0693d70a',
    name: 'Athena Room',
    description: 'Experience ultimate luxury in your own private pool villa. Complete with an infinity pool, outdoor shower, and stunning tropical garden views. Designed for families or groups who desire privacy with premium comfort.',
    price: 4500,
    capacity: 4,
    image: 'images/athena3.jpeg',
    images: ['images/athena.jpeg', 'images/athena2.jpeg', 'images/athena3.jpeg'],
    amenities: ['2 Queen Size Beds', 'Sea View', 'Smart TV', 'Sink', 'Pool Access', 'Garden View', 'Living Area', 'Breakfast'],
    features: [
      { icon: Wifi,     label: 'Free WiFi' },
      { icon: Utensils, label: 'Breakfast' },
      { icon: Tv,       label: 'Smart TV' },
      { icon: Wind,     label: 'Air Conditioning' },
    ]
  },
  {
    id: 'f1073d3b-f2d3-4742-ba4a-6ee892efbde2',
    name: 'Ouranus Room',
    description: 'Surrounded by lush tropical gardens, this serene retreat offers tranquility and comfort. Featuring an exclusive pool, grilling station, and karaoke — perfect for groups seeking a vibrant and memorable getaway.',
    price: 9000,
    capacity: 10,
    image: 'images/ouranus.jpeg',
    images: ['images/ouranus.jpeg', 'images/ouranus2.jpeg', 'images/ouranus3.jpeg'],
    amenities: ['2 Double Deck Beds', 'Air Conditioned', 'Grilling Station', 'Free Karaoke', 'Exclusive Pool', 'TV', 'Basic Utensils', 'Wifi', 'Roofdeck Access', 'Refrigerator'],
    features: [
      { icon: Wifi,  label: 'Free WiFi' },
      { icon: Beef,  label: 'Grilling Station' },
      { icon: Tv,    label: 'Smart TV' },
      { icon: Wind,  label: 'Air Conditioning' },
    ]
  },
  {
    id: 'fafb7d3c-5092-4be8-8fd9-d6e616383b67',
    name: 'Apollo Room',
    description: 'Step directly onto pristine white sand from your private bungalow. Enjoy uninterrupted beach access and stunning sunset views. This suite blends modern amenities with the natural beauty of the surrounding seascape.',
    price: 4500,
    capacity: 4,
    image: 'images/apollo2.jpeg',
    images: ['images/apollo.jpeg', 'images/apollo2.jpeg', 'images/apollo3.jpeg'],
    amenities: ['Pool Access', '2 Queen Size Beds', 'Free WiFi', 'Breakfast', 'TV', 'Sink', 'Sunset View', 'Private Bathroom'],
    features: [
      { icon: Wifi,     label: 'Free WiFi' },
      { icon: Utensils, label: 'Breakfast' },
      { icon: Tv,       label: 'Smart TV' },
      { icon: Wind,     label: 'Air Conditioning' },
    ]
  },
  {
    id: '0da54734-e47c-409f-a694-4940245dd216',
    name: 'Cronus Room',
    description: 'The epitome of luxury for large groups. This expansive suite features multiple beds, kitchen facilities, and roofdeck access. With free karaoke and a grilling station, every night becomes an unforgettable celebration.',
    price: 7500,
    capacity: 10,
    image: 'images/cronus.jpeg',
    images: ['images/cronus.jpeg', 'images/cronus2.jpeg', 'images/cronus3.jpg'],
    amenities: ['3 Double Deck Beds', '3 Beds', 'Air Conditioned', 'Water Dispenser', 'Basic Utensils', 'Kitchen Facilities', 'Roofdeck Access', 'Free Karaoke', 'Grilling Station', 'Wifi'],
    features: [
      { icon: Wifi,  label: 'Free WiFi' },
      { icon: Beef,  label: 'Grilling Station' },
      { icon: Music, label: 'Free Karaoke' },
      { icon: Wind,  label: 'Air Conditioning' },
    ]
  }
];

// Inject styles once
if (typeof document !== 'undefined' && !document.querySelector('#room-page-styles')) {
  const el = document.createElement('style');
  el.id = 'room-page-styles';
  el.textContent = ROOM_CSS;
  document.head.appendChild(el);
}

const Rooms = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const room = rooms[activeIndex];

  const goTo = (index) => setActiveIndex(index);

  return (
    <div className="min-h-screen" style={{ background: '#f5f2ec' }}>

      {/* ══════════════════════════════════════
          HERO — 100vh so navbar overlays transparently
      ══════════════════════════════════════ */}
      <div className="relative w-full" style={{ height: '88vh' }}>

        {/* Background image — simple CSS transition, no framer for perf */}
        {rooms.map((r, i) => (
          <img
            key={r.id}
            src={r.image}
            alt={r.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              zIndex: 0,
              opacity: i === activeIndex ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          />
        ))}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.75) 100%)',
            zIndex: 1,
          }}
        />

        {/* ── Centred room name + CTA ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={room.id + '-title'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.35 } }}
            exit={{   opacity: 0,  transition: { duration: 0.2 } }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
            style={{ zIndex: 2 }}
          >
            <h1
              className="room-title text-white mb-8"
              style={{ fontSize: 'clamp(4rem, 10vw, 9rem)', lineHeight: 0.95 }}
            >
              {room.name}
            </h1>

            <p className="room-price-label text-white/70 mb-8">
              From&nbsp;&nbsp;
              <span className="text-white" style={{ fontWeight: 600, fontSize: 15 }}>
                ₱{room.price.toLocaleString()}
              </span>
              &nbsp;&nbsp;/ night
            </p>

            <Button onClick={() => navigate(`/rooms/${room.id}`)} variant="secondary" size="lg">
            Book Now →
            </Button>
          </motion.div>
        </AnimatePresence>

        {/* ── Dot nav — bottom of hero ── */}
        <div
          className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-3"
          style={{ zIndex: 3 }}
        >
          {rooms.map((r, i) => (
            <button
              key={r.id}
              onClick={() => goTo(i)}
              aria-label={r.name}
              style={{
                width:        10,
                height:       10,
                borderRadius: '50%',
                background:   i === activeIndex ? 'rgba(255,255,255,1)' : 'transparent',
                border:       '1.5px solid rgba(255,255,255,0.75)',
                padding:      0,
                cursor:       'pointer',
                transition:   'all 0.3s ease',
                outline:      'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          GALLERY STRIP
      ══════════════════════════════════════ */}
        <div className="py-3" style={{ background: '#f5f2ec' }}>
          <div className="grid grid-cols-3" style={{ gap: 6, gridTemplateColumns: '1fr 1.4fr 1fr' }}>
            {room.images.map((img, i) => (
              <div key={i} className="overflow-hidden" style={{ height: 320 }}>
                <img
                  src={img}
                  alt={`${room.name} view ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

      {/* ══════════════════════════════════════
          DESCRIPTION + FACILITIES
      ══════════════════════════════════════ */}
        <div
          className="max-w-7xl mx-auto px-8 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          {/* Left – Description */}
          <div>
            <p className="section-label mb-5">About this room</p>
            <p className="text-gray-600 leading-relaxed mb-5" style={{ fontSize: 16 }}>
              {room.description}
            </p>
            <p className="text-gray-400 leading-relaxed" style={{ fontSize: 15 }}>
              All our rooms are thoughtfully designed to deliver an exceptional level of comfort and personalised service — ensuring every stay becomes a treasured memory from the moment you arrive.
            </p>
          </div>

          {/* Right – Facilities */}
          <div>
            <h2 className="facilities-heading text-gray-900 mb-8" style={{ fontSize: 44 }}>
              Amenities
            </h2>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-emerald-900" />
                </div>
                <span className="text-gray-700">Up to {room.capacity} guests</span>
              </div>
              {room.features.map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-4 text-gray-600">
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-emerald-900" />
                  </div>
                  <span className="text-gray-700">{label}</span>
                </div>
              ))}
            </div>

            {/* Amenity tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {room.amenities.map((a, i) => (
                <span
                  key={i}
                  className="px-4 py-2 text-emerald-900 text-sm font-medium"
                >
                  {a}
                </span>
              ))}
            </div>

            {/* Price + CTA */}
            <div className="pt-8 flex items-center justify-between" style={{ borderTop: '1px solid #e5e7eb' }}>
              <div>
                <p className="section-label mb-1">Starting from</p>
                <span className="text-3xl font-bold text-gray-900">
                  ₱{room.price.toLocaleString()}
                </span>
                <span className="text-gray-500 ml-2 text-sm">/ night</span>
              </div>
             <Button onClick={() => navigate(`/rooms/${room.id}`)} variant="primary" size="lg">
              View Details & Book
              </Button>
            </div>
          </div>
        </div>

      {/* ── Bottom dot nav ── */}
      <div className="flex justify-center items-center gap-3 pb-16">
        {rooms.map((r, i) => (
          <button
            key={r.id}
            onClick={() => goTo(i)}
            aria-label={r.name}
            title={r.name}
            style={{
              width:      i === activeIndex ? 28 : 8,
              height:     8,
              borderRadius: 999,
              background: i === activeIndex ? '#064e3b' : '#d9d0c4',
              border:     'none',
              padding:    0,
              cursor:     'pointer',
              transition: 'all 0.38s cubic-bezier(0.4,0,0.2,1)',
              outline:    'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Rooms;