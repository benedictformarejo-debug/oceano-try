import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Users, Wifi, Utensils, Beef, Tv, Wind,
  ChevronLeft, ChevronRight, X, Music
} from 'lucide-react';
import { bookingsAPI } from '../services/api';

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate   = useNavigate();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal]         = useState(false);
  const [selectedMonth, setSelectedMonth]           = useState(new Date());
  const [selectedDates, setSelectedDates]           = useState({ checkIn: null, checkOut: null });
  const [guests, setGuests]                         = useState(1);
  const [bookingError, setBookingError]             = useState('');
  const [bookedDates, setBookedDates]               = useState([]);
  const [loadingDates, setLoadingDates]             = useState(true);

  const allRooms = [
    {
      id: '1', name: 'Oceanus Room',
      description: 'Wake up to breathtaking panoramic views of the ocean.',
      longDescription: 'Immerse yourself in luxury with our Ocean View Suite. This meticulously designed space offers floor-to-ceiling windows that frame stunning ocean vistas, creating a seamless connection between indoor comfort and outdoor beauty. The private balcony is your personal sanctuary for morning coffee or sunset cocktails.',
      price: 3000, capacity: 2,
      images: ['/images/oceanus.jpeg', '/images/oceanus2.jpeg', '/images/oceanus3.jpeg'],
      amenities: ['Ocean View', 'Queen Size Bed', 'Private Balcony', 'Bathroom', 'Smart TV', 'Hot Shower', 'Filipino Breakfast'],
      features: [
        { icon: Wifi,     label: 'Free WiFi'          },
        { icon: Utensils, label: 'Filipino Breakfast'  },
        { icon: Tv,       label: 'Smart TV'            },
        { icon: Wind,     label: 'Air Conditioning'    },
      ],
    },
    {
      id: '2', name: 'Athena Room',
      description: 'Experience ultimate luxury in your own private pool villa.',
      longDescription: 'Your private oasis awaits. This exclusive villa features an infinity pool surrounded by lush tropical gardens. Perfect for families or groups seeking privacy and luxury.',
      price: 4500, capacity: 4,
      images: ['/images/athena.jpeg', '/images/athena2.jpeg', '/images/athena3.jpeg'],
      amenities: ['Private Pool', '2 Queen Size Beds', 'Garden View', 'Living Area', 'Dining Area'],
      features: [
        { icon: Wifi,     label: 'Free WiFi'        },
        { icon: Utensils, label: 'Breakfast'         },
        { icon: Tv,       label: 'Smart TV'          },
        { icon: Wind,     label: 'Air Conditioning'  },
      ],
    },
    {
      id: '3', name: 'Ouranus Room',
      description: 'Surrounded by lush tropical gardens, this serene retreat offers tranquility and comfort.',
      longDescription: 'Find peace in our garden-facing sanctuary. Wake up to the sounds of tropical birds and enjoy your morning coffee surrounded by nature. Perfect for groups seeking a peaceful getaway with exclusive pool access.',
      price: 9000, capacity: 10,
      images: ['/images/ouranus.jpeg', '/images/ouranus3.jpeg', '/images/ouranus4.jpeg'],
      amenities: ['Air Conditioned', 'Free Coffee', 'Free Karaoke', 'Exclusive Pool', 'TV', 'Wifi', 'Roofdeck Access', 'Refrigerator', 'Water Dispenser', 'Basic Utensils'],
      features: [
        { icon: Wifi,  label: 'Free WiFi'        },
        { icon: Beef,  label: 'Grilling Station'  },
        { icon: Tv,    label: 'Smart TV'          },
        { icon: Wind,  label: 'Air Conditioning'  },
      ],
    },
    {
      id: '4', name: 'Apollo Room',
      description: 'Step directly onto the pristine white sand from your private bungalow.',
      longDescription: 'Experience the ultimate beach lifestyle. Your bungalow opens directly onto our private beach, offering unparalleled access to the ocean and stunning sunrise views.',
      price: 4500, capacity: 4,
      images: ['/images/apollo2.jpeg', '/images/apollo.jpeg', '/images/apollo3.jpeg'],
      amenities: ['Pool Access', '2 Queen Size Beds', 'WiFi', 'Private Bathroom', 'Sink', 'TV', 'Sunset View'],
      features: [
        { icon: Wifi,     label: 'Free WiFi'        },
        { icon: Utensils, label: 'Breakfast'         },
        { icon: Tv,       label: 'Smart TV'          },
        { icon: Wind,     label: 'Air Conditioning'  },
      ],
    },
    {
      id: '5', name: 'Cronus Room',
      description: 'The epitome of luxury for large groups with kitchen, roofdeck, and entertainment.',
      longDescription: 'Experience the pinnacle of luxury in our Cronus Room. Multiple bedrooms, full kitchen facilities, roofdeck access, free karaoke and a grilling station — everything your group needs.',
      price: 7500, capacity: 10,
      images: ['/images/cronus.jpeg', '/images/cronus2.jpeg', '/images/cronus3.jpg'],
      amenities: ['3 Double Deck Beds', '3 Beds', 'Air Conditioned', 'Water Dispenser', 'Basic Utensils', 'Kitchen Facilities', 'Roofdeck Access', 'Free Karaoke', 'Grilling Station', 'Wifi'],
      features: [
        { icon: Wifi,  label: 'Free WiFi'        },
        { icon: Beef,  label: 'Grilling Station'  },
        { icon: Music, label: 'Free Karaoke'      },
        { icon: Wind,  label: 'Air Conditioning'  },
      ],
    },
  ];

  const room = allRooms.find(r => r.id === roomId);

  // ── Fetch real booked dates from API ─────────────────────────────────────
  useEffect(() => {
    if (!room) { navigate('/rooms'); return; }
    const fetchDates = async () => {
      try {
        setLoadingDates(true);
        const data = await bookingsAPI.getBookedDates(roomId);
        const parsed = (data.bookedDates || []).map(d => {
          const [y, m, day] = d.split('-');
          return new Date(Number(y), Number(m) - 1, Number(day));
        });
        setBookedDates(parsed);
      } catch {
        setBookedDates([]);
      } finally {
        setLoadingDates(false);
      }
    };
    fetchDates();
  }, [room, roomId, navigate]);

  // ── Calendar helpers ──────────────────────────────────────────────────────
  const getDaysInMonth = (date) => {
    const year = date.getFullYear(), month = date.getMonth();
    const startDOW    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < startDOW; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const isDateBooked = (date) => {
    if (!date) return false;
    return bookedDates.some(b =>
      b.getDate() === date.getDate() &&
      b.getMonth() === date.getMonth() &&
      b.getFullYear() === date.getFullYear()
    );
  };

  const isDateInPast = (date) => {
    if (!date) return false;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDates.checkIn) return false;
    if (selectedDates.checkOut) return date >= selectedDates.checkIn && date <= selectedDates.checkOut;
    return date.getTime() === selectedDates.checkIn.getTime();
  };

  const isCheckIn  = (date) => date && selectedDates.checkIn  && date.getTime() === selectedDates.checkIn.getTime();
  const isCheckOut = (date) => date && selectedDates.checkOut && date.getTime() === selectedDates.checkOut.getTime();

  const hasBookedDateInRange = (start, end) => bookedDates.some(b => b > start && b < end);

  const handleDateClick = (date) => {
    if (!date || isDateBooked(date) || isDateInPast(date)) return;

    if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
      setSelectedDates({ checkIn: date, checkOut: null }); return;
    }
    if (date <= selectedDates.checkIn) {
      setSelectedDates({ checkIn: date, checkOut: null });
    } else if (hasBookedDateInRange(selectedDates.checkIn, date)) {
      setBookingError('Your range includes unavailable dates. Please choose again.');
      setSelectedDates({ checkIn: date, checkOut: null });
    } else {
      setBookingError('');
      setSelectedDates({ ...selectedDates, checkOut: date });
    }
  };

  const calculateNights = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return 0;
    return Math.ceil((selectedDates.checkOut - selectedDates.checkIn) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => calculateNights() * room.price;

  // ── Booking — no login required, go straight to confirmation ─────────────
  const handleBooking = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      setBookingError('Please select check-in and check-out dates'); return;
    }
    setBookingError('');
    navigate('/booking/confirm', {
      state: {
        booking: {
          roomId:        room.id,
          roomName:      room.name,
          roomImage:     room.images[0],
          checkIn:       selectedDates.checkIn.toISOString().split('T')[0],
          checkOut:      selectedDates.checkOut.toISOString().split('T')[0],
          guests,
          nights:        calculateNights(),
          pricePerNight: room.price,
          total:         calculateTotal(),
        },
      },
    });
  };

  if (!room) return null;

  const days = getDaysInMonth(selectedMonth);
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <button onClick={() => navigate('/rooms')}
          className="flex items-center space-x-2 text-gray-600 hover:text-ocean-600 transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Rooms</span>
        </button>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="col-span-4 md:col-span-3 row-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => { setSelectedImageIndex(0); setShowImageModal(true); }}>
            <img src={room.images[0]} alt={room.name}
              className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </motion.div>

          {room.images.slice(1, 3).map((image, idx) => (
            <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 }}
              className="col-span-2 md:col-span-1 relative rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => { setSelectedImageIndex(idx + 1); setShowImageModal(true); }}>
              <img src={image} alt={`${room.name} ${idx + 2}`}
                className="w-full h-[242px] object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">{room.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Up to {room.capacity} Guests</span>
                </div>
                <span>•</span>
                <span className="text-3xl font-display font-bold text-ocean-600">₱{room.price.toLocaleString()}</span>
                <span>/ night</span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">{room.longDescription}</p>

            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {room.features.map((feature, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-ocean-50 rounded-2xl flex items-center justify-center mb-3">
                      <feature.icon className="w-8 h-8 text-ocean-600" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-ocean-600 rounded-full" />
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-24">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-6">Reserve Your Stay</h3>

              {/* Calendar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h4 className="font-semibold text-gray-900">
                    {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                  </h4>
                  <button onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
                  ))}
                </div>

                {loadingDates ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="w-6 h-6 border-2 border-ocean-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-2">
                    {days.map((date, idx) => {
                      const isBooked   = isDateBooked(date);
                      const isPast     = isDateInPast(date);
                      const isInRange  = isDateSelected(date);
                      const isStart    = isCheckIn(date);
                      const isEnd      = isCheckOut(date);
                      const isDisabled = !date || isBooked || isPast;

                      return (
                        <button key={idx} onClick={() => handleDateClick(date)} disabled={isDisabled}
                          className={[
                            'aspect-square rounded-lg text-sm font-medium transition-all duration-150',
                            !date ? 'invisible' : '',
                            isBooked ? 'bg-red-100 text-red-400 line-through cursor-not-allowed' : '',
                            !isBooked && isPast ? 'text-gray-300 cursor-not-allowed' : '',
                            isStart || isEnd ? 'bg-ocean-600 text-white scale-105 shadow-md' : '',
                            isInRange && !isStart && !isEnd ? 'bg-ocean-100 text-ocean-800 rounded-none' : '',
                            !isDisabled && !isInRange ? 'hover:bg-ocean-50 text-gray-700 hover:scale-105' : '',
                          ].join(' ')}>
                          {date?.getDate()}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 space-y-1.5 text-xs">
                  {[
                    { bg: 'bg-ocean-600', label: 'Selected / Range ends'  },
                    { bg: 'bg-ocean-100', label: 'In range'               },
                    { bg: 'bg-red-100',   label: 'Unavailable / Booked'   },
                    { bg: 'bg-gray-100',  label: 'Past date'              },
                  ].map(({ bg, label }) => (
                    <div key={label} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 ${bg} rounded`} />
                      <span className="text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guests */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                <select value={guests} onChange={e => setGuests(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ocean-500 focus:border-transparent">
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              {/* Summary */}
              {selectedDates.checkIn && selectedDates.checkOut && (
                <div className="bg-ocean-50 rounded-2xl p-4 mb-6">
                  <div className="space-y-2 text-sm">
                    {[
                      ['Check-in',  selectedDates.checkIn.toLocaleDateString()],
                      ['Check-out', selectedDates.checkOut.toLocaleDateString()],
                      ['Nights',    calculateNights()],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-gray-600">{label}:</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                    <div className="border-t border-ocean-200 pt-2 mt-2 flex justify-between items-center">
                      <span className="text-gray-900 font-semibold">Total:</span>
                      <span className="text-2xl font-display font-bold text-ocean-600">
                        ₱{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {bookingError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
                  {bookingError}
                </div>
              )}

              <button onClick={handleBooking}
                disabled={!selectedDates.checkIn || !selectedDates.checkOut}
                className="w-full bg-ocean-600 hover:bg-ocean-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-colors shadow-lg disabled:shadow-none">
                Confirm Booking
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <button onClick={() => setShowImageModal(false)}
              className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <button onClick={e => { e.stopPropagation(); setSelectedImageIndex(p => p === 0 ? room.images.length - 1 : p - 1); }}
              className="absolute left-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={e => { e.stopPropagation(); setSelectedImageIndex(p => p === room.images.length - 1 ? 0 : p + 1); }}
              className="absolute right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
            <motion.img key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              src={room.images[selectedImageIndex]} alt={room.name}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
              onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomDetail;