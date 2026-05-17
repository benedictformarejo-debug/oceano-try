import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Users, Wifi, Utensils, Beef, Tv, Wind,
  ChevronLeft, ChevronRight, X, Music, Star, Clock
} from 'lucide-react';
import { bookingsAPI, reviewsAPI } from '../services/api';


const ARRIVAL_TIMES = [
  '14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00',
];
const formatTime = (t) => {
  const [h] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
};


const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate   = useNavigate();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal]         = useState(false);
  const [selectedMonth, setSelectedMonth]           = useState(new Date());
  const [selectedDates, setSelectedDates]           = useState({ checkIn: null, checkOut: null });
  const [guests, setGuests]                         = useState(1);
  const [arrivalTime, setArrivalTime] = useState('14:00');
  const [bookingError, setBookingError]             = useState('');
  const [bookedDates, setBookedDates]               = useState([]);
  const [loadingDates, setLoadingDates]             = useState(true);
  const [reviews,        setReviews]                = useState([]);
  const [loadingReviews, setLoadingReviews]         = useState(true);

  const allRooms = [
    {
      id: 'd49a696f-9eb7-4053-84c5-160a7b0200cf', name: 'Oceanus Room',
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
      id: '9eb09791-cc36-4c30-9d00-374a0693d70a', name: 'Athena Room',
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
      id: 'f1073d3b-f2d3-4742-ba4a-6ee892efbde2', name: 'Ouranus Room',
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
      id: 'fafb7d3c-5092-4be8-8fd9-d6e616383b67', name: 'Apollo Room',
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
      id: '0da54734-e47c-409f-a694-4940245dd216', name: 'Cronus Room',
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
  }, [roomId]);

  useEffect(() => {
    if (!room) return;
    reviewsAPI.getByRoom(roomId)
      .then(data => setReviews(data.reviews || []))
      .catch(() => {})
      .finally(() => setLoadingReviews(false));
  }, [roomId]);

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

  const toLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

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
          checkIn:  toLocalDate(selectedDates.checkIn),
          checkOut: toLocalDate(selectedDates.checkOut),
          arrivalTime,
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
    <div className="min-h-screen pt-20 pb-16" style={{ background: '#f5f2ec' }}>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate('/rooms')}
          className="flex items-center space-x-2 transition-colors mb-6"
          style={{ color: 'rgba(30,54,36,0.6)' }}
        >
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
              <h1
                className="text-4xl md:text-5xl font-display font-bold mb-4"
                style={{ color: '#1e3624' }}
              >
                {room.name}
              </h1>
              <div className="flex items-center space-x-4" style={{ color: 'rgba(30,54,36,0.6)' }}>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Up to {room.capacity} Guests</span>
                </div>
                <span>•</span>
                <span className="text-3xl font-display font-bold" style={{ color: '#1e3624' }}>
                  ₱{room.price.toLocaleString()}
                </span>
                <span>/ night</span>
              </div>
            </div>

            <p className="leading-relaxed text-lg" style={{ color: 'rgba(30,54,36,0.7)' }}>
              {room.longDescription}
            </p>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-display font-bold mb-6" style={{ color: '#1e3624' }}>
                Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {room.features.map((feature, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className="mb-3">
                      <feature.icon className="w-8 h-8" style={{ color: '#1e3624' }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'rgba(30,54,36,0.75)' }}>
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-display font-bold mb-6" style={{ color: '#1e3624' }}>
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#1e3624' }} />
                    <span style={{ color: 'rgba(30,54,36,0.75)' }}>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-display font-bold" style={{ color: '#1e3624' }}>
                  Guest Reviews
                </h2>
                {avgRating && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ background: 'rgba(30,54,36,0.08)' }}
                  >
                    <Star className="w-4 h-4" style={{ fill: '#1e3624', color: '#1e3624' }} />
                    <span className="text-sm font-bold" style={{ color: '#1e3624' }}>{avgRating}</span>
                    <span className="text-xs" style={{ color: 'rgba(30,54,36,0.4)' }}>({reviews.length})</span>
                  </div>
                )}
              </div>

              {loadingReviews ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-5 animate-pulse space-y-2"
                      style={{ background: '#fff', border: '1px solid rgba(30,54,36,0.08)' }}
                    >
                      <div className="h-4 bg-gray-100 rounded w-1/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-8 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div
                  className="rounded-xl p-8 text-center"
                  style={{ background: 'rgba(30,54,36,0.04)' }}
                >
                  <Star className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(30,54,36,0.2)' }} />
                  <p className="text-sm" style={{ color: 'rgba(30,54,36,0.4)' }}>
                    No reviews yet. Be the first to stay!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl p-5 shadow-sm"
                      style={{ background: '#fff', border: '1px solid rgba(30,54,36,0.1)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-sm" style={{ color: '#1e3624' }}>
                          {r.guest_name || 'Guest'}
                        </p>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star
                              key={s}
                              className="w-3.5 h-3.5"
                              style={s <= r.rating
                                ? { fill: '#1e3624', color: '#1e3624' }
                                : { fill: 'none', color: 'rgba(30,54,36,0.2)' }
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs mb-2" style={{ color: 'rgba(30,54,36,0.4)' }}>
                        {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      {r.comment && (
                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(30,54,36,0.7)' }}>
                          {r.comment}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-24">
              <h3 className="text-2xl font-display font-bold mb-6" style={{ color: '#1e3624' }}>
                Reserve Your Stay
              </h3>

              {/* Calendar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h4 className="font-semibold" style={{ color: '#1e3624' }}>
                    {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                  </h4>
                  <button
                    onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
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
                    <div
                      className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: '#1e3624', borderTopColor: 'transparent' }}
                    />
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
                        <button
                          key={idx}
                          onClick={() => handleDateClick(date)}
                          disabled={isDisabled}
                          style={{
                            background: isStart || isEnd
                              ? '#1e3624'
                              : isInRange && !isStart && !isEnd
                              ? 'rgba(30,54,36,0.1)'
                              : undefined,
                          }}
                          className={[
                            'aspect-square rounded-lg text-sm font-medium transition-all duration-150',
                            !date ? 'invisible' : '',
                            isPast ? 'text-gray-300 cursor-not-allowed' : '',
                            !isPast && isBooked ? 'bg-red-100 text-red-400 line-through cursor-not-allowed' : '',
                            isStart || isEnd ? 'text-white scale-105 shadow-md' : '',
                            isInRange && !isStart && !isEnd ? 'text-green-900 rounded-none' : '',
                            !isDisabled && !isInRange ? 'hover:bg-gray-100 text-gray-700 hover:scale-105' : '',
                          ].join(' ')}
                        >
                          {date?.getDate()}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 space-y-1.5 text-xs">
                  {[
                    { style: { background: '#1e3624' },   label: 'Selected / Range ends' },
                    { style: { background: '#fee2e2' },   label: 'Unavailable / Booked'  },
                    { style: { background: '#f3f4f6' },   label: 'Past date'             },
                  ].map(({ style, label }) => (
                    <div key={label} className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded" style={style} />
                      <span style={{ color: 'rgba(30,54,36,0.6)' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrival Time */}
              <div className="mb-5">
                <label
                  className="flex items-center gap-1.5 text-sm font-medium mb-2"
                  style={{ color: 'rgba(30,54,36,0.8)' }}
                >
                  <Clock className="w-4 h-4" style={{ color: 'rgba(30,54,36,0.4)' }} />
                  Estimated Arrival Time
                </label>
                <div className="relative">
                  <select
                    value={arrivalTime}
                    onChange={e => setArrivalTime(e.target.value)}
                    className="w-full appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-xl text-sm bg-white cursor-pointer hover:border-gray-400 transition-colors"
                    style={{ color: '#1e3624' }}
                  >
                    {ARRIVAL_TIMES.map(t => (
                      <option key={t} value={t}>{formatTime(t)}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                </div>
                <p className="text-xs mt-1.5" style={{ color: 'rgba(30,54,36,0.4)' }}>
                  Standard check-in starts at 2:00 PM
                </p>
              </div>

              {/* Guests */}
              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'rgba(30,54,36,0.8)' }}
                >
                  Number of Guests
                </label>
                <select
                  value={guests}
                  onChange={e => setGuests(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  style={{ color: '#1e3624' }}
                >
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              {/* Summary */}
              {selectedDates.checkIn && selectedDates.checkOut && (
                <div
                  className="rounded-2xl p-4 mb-6"
                  style={{ background: 'rgba(30,54,36,0.06)' }}
                >
                  <div className="space-y-2 text-sm">
                    {[
                      ['Check-in',  selectedDates.checkIn.toLocaleDateString()],
                      ['Check-out', selectedDates.checkOut.toLocaleDateString()],
                      ['Arrival',   formatTime(arrivalTime)],
                      ['Nights',    calculateNights()],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span style={{ color: 'rgba(30,54,36,0.6)' }}>{label}:</span>
                        <span className="font-medium" style={{ color: '#1e3624' }}>{value}</span>
                      </div>
                    ))}
                    <div
                      className="pt-2 mt-2 flex justify-between items-center"
                      style={{ borderTop: '1px solid rgba(30,54,36,0.15)' }}
                    >
                      <span className="font-semibold" style={{ color: '#1e3624' }}>Total:</span>
                      <span className="text-2xl font-display font-bold" style={{ color: '#1e3624' }}>
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

              <button
                onClick={handleBooking}
                disabled={!selectedDates.checkIn || !selectedDates.checkOut}
                className="w-full disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-colors shadow-lg disabled:shadow-none"
                style={{ background: !selectedDates.checkIn || !selectedDates.checkOut ? undefined : '#1e3624' }}
              >
                Confirm Booking
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); setSelectedImageIndex(p => p === 0 ? room.images.length - 1 : p - 1); }}
              className="absolute left-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); setSelectedImageIndex(p => p === room.images.length - 1 ? 0 : p + 1); }}
              className="absolute right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <motion.img
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={room.images[selectedImageIndex]}
              alt={room.name}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomDetail;