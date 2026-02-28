import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Wifi, Coffee, Tv, Wind, ArrowRight, Beef, Music, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Rooms = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 5 Beautiful rooms
  const rooms = [
    {
      id: '1',
      name: 'Oceanus Room',
      description: 'Wake up to breathtaking panoramic views of the ocean. This spacious suite features floor-to-ceiling windows, a private balcony, and luxurious amenities for the ultimate seaside escape.',
      price: 3000,
      capacity: 2,
      image: 'images/oceanus.jpeg',
      images: [
        'images/oceanus.jpeg',
        'images/oceanus2.jpeg',
        'images/oceanus3.jpeg',
      ],
      amenities: ['Ocean View', 'Queen Size Bed', 'Private Balcony', 'Bathroom', 'Smart TV', 'Hot Shower', 'Filipino Breakfast'],
      features: [
        { icon: Wifi, label: 'Free WiFi' },
        { icon: Utensils, label: 'Filipino Breakfast' },
        { icon: Tv, label: 'Smart TV' },
        { icon: Wind, label: 'Air Conditioning' },
      ]
    },
    {
      id: '2',
      name: 'Athena Room',
      description: 'Experience ultimate luxury in your own private pool villa. Complete with an infinity pool, outdoor shower, and stunning tropical garden views.',
      price: 4500,
      capacity: 4,
      image: 'images/athena.jpeg',
      images: [
        'images/athena.jpeg',
        'images/athena2.jpeg',
        'images/athena3.jpeg',
      ],
      amenities: ['2 Queen Size Beds', 'Sea View', 'Smart TV', 'Sink', 'Pool Access', 'Garden View', 'Living Area', 'Breakfast'],
      features: [
        { icon: Wifi, label: 'Free WiFi' },
        { icon: Utensils, label: 'Breakfast' },
        { icon: Tv, label: 'Smart TV' },
        { icon: Wind, label: 'Air Conditioning' },
      ]
    },
    {
      id: '3',
      name: 'Ouranus Room',
      description: 'Surrounded by lush tropical gardens, this serene retreat offers tranquility and comfort. Perfect for couples seeking a peaceful getaway.',
      price: 9000,
      capacity: 10,
      image: 'images/ouranus.jpeg',
      images: [
        'images/ouranus.jpeg',
        'images/ouranus2.jpeg',
        'images/ouranus3.jpeg',
      ],
      amenities: ['2 Double Deck Beds', 'Air Conditioned', 'Grilling Station', 'Free Karaoke', 'Exclusive Pool', 'TV', 'Basic Utensils', 'Wifi', 'Roofdeck Access', 'Refrigerator'],
      features: [
        { icon: Wifi, label: 'Free WiFi' },
        { icon: Beef, label: 'Grilling Station' },
        { icon: Tv, label: 'Smart TV' },
        { icon: Wind, label: 'Air Conditioning' },
      ]
    },
    {
      id: '4',
      name: 'Apollo Room',
      description: 'Step directly onto the pristine white sand from your private bungalow. Enjoy uninterrupted beach access and stunning sunrise views.',
      price: 4500,
      capacity: 4,
      image: 'images/apollo.jpeg',
      images: [
        'images/apollo.jpeg',
        'images/apollo2.jpeg',
        'images/apollo3.jpeg',
      ],
      amenities: ['Pool Access', '2 Queen Size Beds', 'Free WiFi', 'Breakfast', 'TV', 'Sink', 'Sunset View', 'Private Bathroom'],
      features: [
        { icon: Wifi, label: 'Free WiFi' },
        { icon: Utensils, label: 'Breakfast' },
        { icon: Tv, label: 'Smart TV' },
        { icon: Wind, label: 'Air Conditioning' },
      ]
    },
    {
      id: '5',
      name: 'Cronus Room',
      description: 'The epitome of luxury. This expansive two-bedroom suite features a private dining area, jacuzzi, and unparalleled ocean vistas from every room.',
      price: 7500,
      capacity: 10,
      image: 'images/cronus.jpeg',
      images: [
        'images/cronus.jpeg',
        'images/cronus2.jpeg',
        'images/cronus3.jpeg',
      ],
      amenities: ['3 Double Deck Beds', '3 Beds', 'Air Conditioned', 'Water Dispenser', 'Basic Utensils', 'Kitchen Facilities', 'Roofdeck Access', 'Free Karaoke', 'Grilling Station', 'Wifi'],
      features: [
        { icon: Wifi, label: 'Free WiFi' },
        { icon: Beef, label: 'Grilling Station' },
        { icon: Music, label: 'Free Karaoke' },
        { icon: Wind, label: 'Air Conditioning' },
      ]
    }
  ];

  const handleViewDetails = (roomId) => {
    navigate(`/rooms/${roomId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocean-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Rooms & Suites
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each room is a masterpiece of design and comfort, offering you the perfect sanctuary by the sea
          </p>
        </motion.div>

        {/* Rooms Grid */}
        <div className="space-y-12">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className={`bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-500 ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } flex flex-col lg:flex`}
            >
              {/* Image Section */}
              <div className="lg:w-1/2 relative group overflow-hidden">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                {/* Price Badge */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
                  <div className="text-center">
                    <span className="text-3xl font-display font-bold text-ocean-600">₱{room.price}</span>
                    <span className="text-gray-600 text-sm block">per night</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                    {room.name}
                  </h2>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {room.description}
                  </p>

                  {/* Capacity */}
                  <div className="flex items-center space-x-2 mb-6">
                    <Users className="w-5 h-5 text-ocean-600" />
                    <span className="text-gray-700 font-medium">Up to {room.capacity} Guests</span>
                  </div>

                  {/* Features Icons */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {room.features.map((feature, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-ocean-50 rounded-xl flex items-center justify-center mb-2">
                          <feature.icon className="w-6 h-6 text-ocean-600" />
                        </div>
                        <span className="text-xs text-gray-600">{feature.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {room.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-ocean-50 text-ocean-700 rounded-full text-sm font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => handleViewDetails(room.id)}
                  className="group w-full bg-ocean-600 hover:bg-ocean-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>View Details & Book</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;