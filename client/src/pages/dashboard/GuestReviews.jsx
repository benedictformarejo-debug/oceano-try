import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI, reviewsAPI } from '../../services/api';
import { Home as HomeIcon, Info, Bed, Image, Mail, BookOpen, CreditCard } from 'lucide-react';

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

const StarDisplay = ({ value }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s} className={`w-4 h-4 ${s <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
    ))}
  </div>
);

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(star => (
      <button key={star} onClick={() => onChange(star)} type="button" className="transition-transform hover:scale-110">
        <Star className={`w-7 h-7 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
      </button>
    ))}
  </div>
);

const GuestReviews = () => {
  const { user } = useAuth();
  const [reviews,      setReviews]      = useState([]);
  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showModal,    setShowModal]    = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating,       setRating]       = useState(0);
  const [comment,      setComment]      = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState('');

  useEffect(() => {
    Promise.all([
      reviewsAPI.getUserReviews(),
      bookingsAPI.getUserBookings(),
    ]).then(([rData, bData]) => {
      setReviews(rData.reviews || []);
      setBookings(bData.bookings || []);
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const reviewedBookingIds = reviews.map(r => r.booking_id);
  const pendingReviews = bookings.filter(b => b.status === 'checked-out' && !reviewedBookingIds.includes(b.id));

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setRating(0);
    setComment('');
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a rating.'); return; }
    try {
      setSubmitting(true);
      const data = await reviewsAPI.create({
        bookingId:  selectedBooking.id,
        roomId:     selectedBooking.roomId,
        roomName:   selectedBooking.roomName,
        guestName:  user?.name,
        rating,
        comment,
      });
      setReviews(prev => [data.review, ...prev]);
      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout publicMenuItems={publicMenuItems} dashboardMenuItems={dashboardMenuItems}>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mb-1">My Reviews</h1>
        <p className="text-gray-500 text-sm">Your feedback helps us improve</p>
      </div>

      {/* Pending Reviews */}
      {!loading && pendingReviews.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Awaiting Your Review</h2>
          <div className="space-y-3">
            {pendingReviews.map(b => (
              <div key={b.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{b.roomName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{b.checkIn} → {b.checkOut}</p>
                </div>
                <button onClick={() => openModal(b)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap">
                  <Star className="w-3.5 h-3.5" /> Leave Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Reviews */}
      <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Submitted Reviews</h2>
      {loading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse space-y-2">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
              <div className="h-8 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
          <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No reviews yet</p>
          <p className="text-gray-400 text-sm">Complete a stay to leave a review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{r.room_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <StarDisplay value={r.rating} />
              </div>
              {r.comment && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.comment}</p>}
            </motion.div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {showModal && selectedBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-display font-bold text-gray-900">Leave a Review</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{selectedBooking.roomName}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Your Rating</p>
                <StarRating value={rating} onChange={setRating} />
                {rating > 0 && <p className="text-xs text-gray-400 mt-1">{['','Terrible','Poor','Average','Good','Excellent'][rating]}</p>}
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Your Review <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ocean-500" />
              </div>
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 py-2.5 bg-ocean-600 hover:bg-ocean-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default GuestReviews;