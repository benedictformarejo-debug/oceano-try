import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Award, Heart, Users, Star, Leaf, Shield, ChevronRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';


const About = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const values = [
    {
      icon: Heart,
      title: 'Passion for Excellence',
      description: 'We are committed to providing exceptional service and unforgettable experiences to every guest.',
      color: 'from-rose-400 to-pink-600',
      bg: 'bg-rose-50',
    },
    {
      icon: Users,
      title: 'Guest-Centric Approach',
      description: 'Your comfort and satisfaction are at the heart of everything we do.',
      color: 'from-ocean-400 to-ocean-600',
      bg: 'bg-ocean-50',
    },
    {
      icon: Award,
      title: 'Award-Winning Service',
      description: 'Recognized globally for our commitment to luxury hospitality and sustainable practices.',
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50',
    },
    {
      icon: Star,
      title: 'Attention to Detail',
      description: 'Every aspect of your stay is carefully curated to exceed your expectations.',
      color: 'from-violet-400 to-purple-600',
      bg: 'bg-violet-50',
    },
    {
      icon: Leaf,
      title: 'Sustainability First',
      description: 'We protect the natural beauty around us through responsible, eco-conscious practices.',
      color: 'from-emerald-400 to-teal-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: Shield,
      title: 'Trust & Privacy',
      description: 'Your safety, security, and privacy are our unwavering commitment to you.',
      color: 'from-sky-400 to-blue-600',
      bg: 'bg-sky-50',
    },
  ];

  const testimonials = [
    {
      name: 'Emily Watson',
      location: 'New York, USA',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
      text: 'Oceano Con Vista completely redefined luxury for me. The ocean view suite was breathtaking and the staff anticipated every need before I even had to ask.',
      stay: 'Ocean View Suite · 7 nights',
    },
    {
      name: 'James & Clara Hoffman',
      location: 'London, UK',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      text: 'We celebrated our 10th anniversary here and it was absolutely perfect. The private pool villa and candlelit dinner on the beach — every detail was thoughtfully arranged.',
      stay: 'Premium Pool Villa · 5 nights',
    },
    {
      name: 'Mei Lin',
      location: 'Tokyo, Japan',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
      text: 'I travel frequently and have stayed in resorts all over the world. Oceano Con Vista stands in a league of its own. The spa alone is worth the trip.',
      stay: 'Deluxe Garden Room · 4 nights',
    },
    {
      name: 'Carlos Mendez',
      location: 'Mexico City, Mexico',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      text: 'Brought the whole family for a week and every single person had the time of their lives. The beach villa was enormous and the staff treated the kids like royalty.',
      stay: 'Family Beach Villa · 6 nights',
    },
    {
      name: 'Sophie Archambault',
      location: 'Paris, France',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      text: 'The food here rivals anything I have had in Paris — and that is saying something. The tasting menu under the stars was one of the most memorable meals of my life.',
      stay: 'Presidential Suite · 3 nights',
    },
    {
      name: 'Daniel & Priya Nair',
      location: 'Sydney, Australia',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
      text: 'We have been coming here every year for our anniversary for four years now. The team remembers our names, our preferences, our favorite table. Irreplaceable.',
      stay: 'Ocean View Suite · 5 nights',
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: 'url(images/IMG_4553.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/55" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center text-white px-6 max-w-2xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-6xl md:text-8xl font-display font-bold mb-5 leading-tight"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="text-lg text-white/70"
          >
            Three decades of ocean-front luxury and heartfelt hospitality.
          </motion.p>
        </motion.div>
      </section>

      {/* ── SPLIT STORY ── */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[560px]"
          >
            <div
              className="absolute top-0 left-0 w-4/5 h-4/5 rounded-3xl bg-cover bg-center shadow-2xl"
              style={{ backgroundImage: 'url(images/IMG_4555.jpg)' }}
            />
            <div
              className="absolute bottom-0 right-0 w-3/5 h-3/5 rounded-3xl bg-cover bg-center shadow-2xl border-4 border-white"
              style={{ backgroundImage: 'url(images/IMG_4554.jpeg)' }}
            />
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.4 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-ocean-700 rounded-full flex flex-col items-center justify-center text-white shadow-xl z-10"
            >
              <span className="text-3xl font-display font-bold">29</span>
              <span className="text-xs text-center leading-tight px-2">Years of Excellence</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <p className="text-ocean-600 font-medium tracking-widest uppercase text-sm mb-4">Who We Are</p>
              <h2 className="text-5xl font-display font-bold text-gray-900 leading-tight mb-6">
                Oceano Con Vista <span className="text-ocean-600">Highlands</span>
              </h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Since opening our doors in 1995, Oceano Con Vista has been a beacon of luxury
              and tranquility on the pristine coastline. What began as a vision to create
              the perfect seaside retreat has blossomed into one of the world's most
              celebrated luxury resorts.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our commitment to excellence is reflected in every aspect — from our
              meticulously designed accommodations to our world-class dining and
              personalized service. We believe true luxury lives in the details.
            </p>
            <Link
              to="/rooms"
              className="inline-flex items-center space-x-2 text-ocean-600 font-semibold hover:text-ocean-800 transition-colors group"
            >
              <span>Explore Our Rooms</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-ocean-900/85 backdrop-blur-sm" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center text-white">
          {[
            { value: '29+', label: 'Years of Excellence' },
            { value: '50K+', label: 'Happy Guests' },
            { value: '25+', label: 'Global Awards' },
            { value: '150+', label: 'Team Members' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-6xl font-display font-bold text-ocean-300">{stat.value}</div>
              <div className="text-white/70 text-sm tracking-wide uppercase mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-ocean-600 font-medium tracking-widest uppercase text-sm mb-4">What Drives Us</p>
            <h2 className="text-5xl font-display font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              The principles that guide every decision, every interaction, and every experience we create.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-2xl ${value.bg} flex items-center justify-center mb-6`}>
                  <div className={`w-7 h-7 bg-gradient-to-br ${value.color} rounded-lg flex items-center justify-center`}>
                    <value.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3 group-hover:text-ocean-600 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-sand-50 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-ocean-600 font-medium tracking-widest uppercase text-sm mb-4">Guest Stories</p>
            <h2 className="text-5xl font-display font-bold text-gray-900 mb-4">What Our Guests Say</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Real words from real guests who made Oceano Con Vista part of their most treasured memories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <Quote className="w-8 h-8 text-ocean-200" />
                    <div className="flex space-x-1">
                      {[...Array(t.rating)].map((_, s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6 italic">"{t.text}"</p>
                </div>

                <div>
                  <div className="border-t border-gray-100 pt-5 flex items-center space-x-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-ocean-100"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-gray-400 text-xs">{t.location}</p>
                    </div>
                  </div>
                  <p className="text-xs text-ocean-500 font-medium mt-3 bg-ocean-50 rounded-full px-3 py-1 inline-block">
                    {t.stay}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/95 to-ocean-700/80" />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Ready to Be Part of Our Story?
            </h2>
            <p className="text-xl text-white/75 mb-10 max-w-2xl mx-auto">
              Every great stay becomes a memory. Let Oceano Con Vista be the backdrop to yours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/rooms"
                className="px-10 py-4 bg-white text-ocean-700 font-semibold rounded-xl hover:bg-ocean-50 transition-colors shadow-lg"
              >
                Book Your Stay
              </Link>
              <Link
                to="/contact"
                className="px-10 py-4 border-2 border-white/50 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;