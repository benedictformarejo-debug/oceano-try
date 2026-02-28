import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Wifi, Coffee, Dumbbell, Utensils, Waves } from 'lucide-react';
import Hero from '../components/Hero';
import Button from '../components/Button';
import Footer from '../components/Footer';


const Home = () => {
  const amenities = [
    { icon: Wifi, title: 'Free WiFi', description: 'High-speed internet throughout the resort' },
    { icon: Coffee, title: 'Premium Dining', description: 'World-class restaurants and bars' },
    { icon: Dumbbell, title: 'Fitness Center', description: 'State-of-the-art gym facilities' },
    { icon: Utensils, title: 'Room Service', description: '24/7 in-room dining available' },
    { icon: Waves, title: 'Private Beach', description: 'Exclusive access to pristine shores' },
    { icon: Sparkles, title: 'Spa & Wellness', description: 'Rejuvenating treatments and therapies' },
  ];

  return (
    <div>
      <Hero />

      {/* Welcome Section */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Experience Unparalleled Luxury
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nestled along the pristine coastline, Oceano Con Vista offers an escape where
              modern luxury meets natural beauty. Every detail is crafted to provide you with
              an unforgettable experience, from our oceanfront suites to our world-class amenities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="text-5xl font-display font-bold text-ocean-600 mb-2">150+</div>
              <div className="text-gray-600">Luxury Rooms & Suites</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-display font-bold text-ocean-600 mb-2">5★</div>
              <div className="text-gray-600">Award-Winning Resort</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-display font-bold text-ocean-600 mb-2">24/7</div>
              <div className="text-gray-600">Concierge Service</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="section-padding bg-sand-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              World-Class Amenities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for the perfect getaway, all in one beautiful location
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-8 hover:scale-105 transition-transform duration-300"
              >
                <amenity.icon className="w-12 h-12 text-ocean-600 mb-4" />
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                  {amenity.title}
                </h3>
                <p className="text-gray-600">{amenity.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="section-padding bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Signature Accommodations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our collection of stunning rooms and suites, each designed for comfort and elegance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card group cursor-pointer"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src="/images/oceanus.jpeg"
                  alt="Ocean View Suite"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-display font-bold mb-2">Oceanus Room</h3>
                  <p className="text-white/90">From ₱3000 / night</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card group cursor-pointer"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src="/images/athena.jpeg"
                  alt="Premium Pool Villa"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-display font-bold mb-2">Athena Room</h3>
                  <p className="text-white/90">From ₱4500 / night</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Link to="/rooms">
              <Button variant="primary">View All Rooms</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(images/IMG_4556.jpg)',
          }}
        />
        <div className="absolute inset-0 bg-ocean-900/80" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Ready for Your Dream Vacation?
            </h2>
            <p className="text-xl mb-10 text-white/90">
              Book your stay today and discover why Oceano Con Vista is the ultimate destination
              for those seeking luxury, relaxation, and unforgettable memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rooms">
                <Button variant="primary">Book Now</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">Contact Us</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
