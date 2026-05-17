import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CreditCard, BookOpen, Home as HomeIcon, Info, Bed, Image, Mail, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI, reviewsAPI } from '../../services/api';

const publicMenuItems = [
  { path: '/',        label: 'Home',    icon: HomeIcon },
  { path: '/about',   label: 'About',   icon: Info     },
  { path: '/rooms',   label: 'Rooms',   icon: Bed      },
  { path: '/gallery', label: 'Gallery', icon: Image    },
  { path: '/contact', label: 'Contact', icon: Mail     },
];

const dashboardMenuItems = [
  { path: '/dashboard',         label: 'Overview',    icon: HomeIcon  },
  { path: '/dashboard/bookings',label: 'My Bookings', icon: BookOpen  },
  { path: '/dashboard/payments',label: 'Payments',    icon: CreditCard},
  { path: '/dashboard/reviews', label: 'My Reviews',  icon: Star      },
];

const statusStyles = {
  confirmed:    'bg-green-100 text-green-700',
  pending:      'bg-yellow-100 text-yellow-700',
  cancelled:    'bg-red-100 text-red-700',
  'checked-in': 'bg-blue-100 text-blue-700',
  'checked-out':'bg-gray-100 text-gray-600',
};

// ── Star Rating Component ─────────────────────────────────────────────────────
const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(star => (
      <button key={star} onClick={() => onChange(star)} type="button"
        className="transition-transform hover:scale-110">
        <Star className={`w-8 h-8 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      </button>
    ))}
  </div>
);

// ── Review Modal ──────────────────────────────────────────────────────────────
const ReviewModal = ({ booking, onClose, onSubmit }) => {
  const [rating,  setRating]  = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a rating.'); return; }
    try {
      setLoading(true);
      await onSubmit({ bookingId: booking.id, roomId: booking.roomId, roomName: booking.roomName, rating, comment });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-display font-bold text-gray-900">How was your stay?</h2>
            <p className="text-sm text-gray-500 mt-0.5">{booking.roomName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Your Rating</p>
          <StarRating value={rating} onChange={setRating} />
          {rating > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {['','Terrible','Poor','Average','Good','Excellent'][rating]}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Your Review <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Share your experience at Oceano Con Vista..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ocean-500" />
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Skip for now
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 bg-ocean-600 hover:bg-ocean-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const GuestDashboard = () => {
  const { user } = useAuth();
  const [bookings,       setBookings]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [reviewedIds,    setReviewedIds]     = useState([]);
  const [reviewBooking,  setReviewBooking]   = useState(null);

  useEffect(() => {
    bookingsAPI.getUserBookings()
      .then(data => setBookings(data.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));

    reviewsAPI.getUserReviews()
      .then(data => setReviewedIds((data.reviews || []).map(r => r.booking_id)))
      .catch(() => {});
  }, []);

  // Auto-show review popup for most recent checked-out booking not yet reviewed
  useEffect(() => {
    if (loading) return;
    const checkedOut = bookings.filter(b => b.status === 'checked-out' && !reviewedIds.includes(b.id));
    if (checkedOut.length > 0) {
      const shown = sessionStorage.getItem('reviewShown');
      if (!shown) {
        setReviewBooking(checkedOut[0]);
        sessionStorage.setItem('reviewShown', 'true');
      }
    }
  }, [bookings, reviewedIds, loading]);

  const handleReviewSubmit = async ({ bookingId, roomId, roomName, rating, comment }) => {
    await reviewsAPI.create({ bookingId, roomId, roomName, guestName: user?.name, rating, comment });
    setReviewedIds(prev => [...prev, bookingId]);
  };

  const todayStr   = new Date().toISOString().split('T')[0];
  const upcoming   = bookings.filter(b => b.checkIn >= todayStr && !['cancelled','checked-out'].includes(b.status));
  const completed  = bookings.filter(b => b.status === 'checked-out');
  const totalSpent = bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const nextBooking = upcoming.sort((a, b) => a.checkIn.localeCompare(b.checkIn))[0];

  const stats = [
    { label: 'Upcoming',    value: loading ? '—' : upcoming.length,                   subtitle: 'Scheduled bookings', icon: Calendar,   color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    { label: 'Completed',   value: loading ? '—' : completed.length,                  subtitle: 'Total visits',       icon: BookOpen,   color: 'text-green-600',  bgColor: 'bg-green-50',  borderColor: 'border-green-200'  },
    { label: 'Total Spent', value: loading ? '—' : `₱${totalSpent.toLocaleString()}`, subtitle: 'All bookings',       icon: CreditCard, color: 'text-blue-600',   bgColor: 'bg-blue-50',   borderColor: 'border-blue-200'   },
  ];

  return (
    <DashboardLayout publicMenuItems={publicMenuItems} dashboardMenuItems={dashboardMenuItems}>

      {/* Review Popup */}
      <AnimatePresence>
        {reviewBooking && (
          <ReviewModal
            booking={reviewBooking}
            onClose={() => setReviewBooking(null)}
            onSubmit={handleReviewSubmit}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">Manage your bookings and discover more at Oceano Con Vista</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-2xl border-2 ${stat.borderColor} p-3 sm:p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between mb-2 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
            {loading
              ? <div className="h-7 sm:h-10 w-12 sm:w-16 bg-gray-100 animate-pulse rounded-lg mb-1" />
              : <p className="text-2xl sm:text-4xl font-display font-bold text-gray-900 mb-1">{stat.value}</p>
            }
            <p className="text-xs text-gray-500 hidden sm:block">{stat.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 sm:p-6 border border-blue-100">
          <div className="inline-flex p-2 sm:p-3 rounded-xl bg-blue-100 mb-3 sm:mb-4">
            <Bed className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-display font-bold text-gray-900 mb-1 sm:mb-2">Browse Rooms</h3>
          <p className="text-gray-600 text-sm mb-4 sm:mb-6">Discover our luxury rooms and find your perfect stay</p>
          <Link to="/rooms" className="inline-flex items-center justify-center w-full px-4 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm sm:text-base">
            View All Rooms →
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-4 sm:p-6 border border-teal-100">
          <div className="inline-flex p-2 sm:p-3 rounded-xl bg-teal-100 mb-3 sm:mb-4">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-display font-bold text-gray-900 mb-1 sm:mb-2">My Bookings</h3>
          <p className="text-gray-600 text-sm mb-4 sm:mb-6">View and manage your bookings and history</p>
          <Link to="/dashboard/bookings" className="inline-flex items-center justify-center w-full px-4 py-2.5 sm:px-6 sm:py-3 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold rounded-xl transition-colors text-sm sm:text-base">
            View Bookings →
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 sm:p-6 border border-amber-100 sm:col-span-2 lg:col-span-1">
          <div className="inline-flex p-2 sm:p-3 rounded-xl bg-amber-100 mb-3 sm:mb-4">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-display font-bold text-gray-900 mb-1 sm:mb-2">Make a Booking</h3>
          <p className="text-gray-600 text-sm mb-4 sm:mb-6">Skip the queue with online room booking</p>
          <Link to="/rooms" className="inline-flex items-center justify-center w-full px-4 py-2.5 sm:px-6 sm:py-3 border-2 border-amber-600 text-amber-600 hover:bg-amber-50 font-semibold rounded-xl transition-colors text-sm sm:text-base">
            Book Now →
          </Link>
        </motion.div>
      </div>

      {/* Next Upcoming Booking */}
      {!loading && nextBooking && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-display font-bold text-gray-900">Upcoming Reservation</h2>
            <span className={`px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium capitalize ${statusStyles[nextBooking.status] || 'bg-gray-100 text-gray-600'}`}>
              {nextBooking.status}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{nextBooking.roomName}</h3>
              {nextBooking.refCode && (
                <p className="text-xs font-mono text-ocean-600 font-semibold mb-3">Ref: {nextBooking.refCode}</p>
              )}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>Check-in: {new Date(nextBooking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>Check-out: {new Date(nextBooking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <span>{nextBooking.guests} Guests</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                <p className="text-2xl sm:text-3xl font-display font-bold text-gray-900">₱{(nextBooking.totalPrice || 0).toLocaleString()}</p>
              </div>
              <Link to="/dashboard/bookings"
                className="mt-4 text-center px-4 py-2.5 border-2 border-ocean-600 text-ocean-600 rounded-xl hover:bg-ocean-50 transition-colors font-medium text-sm sm:text-base">
                View Details
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pending reviews banner */}
      {!loading && bookings.filter(b => b.status === 'checked-out' && !reviewedIds.includes(b.id)).length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <p className="text-sm text-yellow-800 font-medium">You have stays waiting for a review!</p>
          </div>
          <Link to="/dashboard/reviews" className="text-xs font-semibold text-yellow-700 underline whitespace-nowrap">
            Leave a Review
          </Link>
        </motion.div>
      )}

      {!loading && bookings.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="mt-6 sm:mt-8 bg-white rounded-2xl border border-dashed border-gray-300 p-8 sm:p-10 text-center">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No bookings yet</p>
          <p className="text-gray-400 text-sm mb-4">Start by browsing our available rooms</p>
          <Link to="/rooms" className="inline-flex px-6 py-2.5 bg-ocean-600 text-white rounded-xl hover:bg-ocean-700 transition-colors font-medium text-sm">
            Browse Rooms
          </Link>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default GuestDashboard;