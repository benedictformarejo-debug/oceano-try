import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, X, ChevronLeft, ChevronRight, Edit2, Check, AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { bookingsAPI } from '../../services/api';
import { Home as HomeIcon, Info, Bed, Image, Mail, Star, BookOpen, CreditCard } from 'lucide-react';


const formatTime = (t) => {
  if (!t) return '2:00 PM';
  const [h] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
};

const publicMenuItems = [
  { path: '/',        label: 'Home',    icon: HomeIcon },
  { path: '/about',   label: 'About',   icon: Info     },
  { path: '/rooms',   label: 'Rooms',   icon: Bed      },
  { path: '/gallery', label: 'Gallery', icon: Image    },
  { path: '/contact', label: 'Contact', icon: Mail     },
];

const dashboardMenuItems = [
  { path: '/dashboard',          label: 'Overview',    icon: HomeIcon  },
  { path: '/dashboard/bookings', label: 'My Bookings', icon: BookOpen  },
  { path: '/dashboard/payments', label: 'Payments',    icon: CreditCard},
  { path: '/dashboard/reviews', label: 'My Reviews',   icon: Star      },
];

const statusStyles = {
  confirmed:     'bg-green-100 text-green-700',
  pending:       'bg-yellow-100 text-yellow-700',
  cancelled:     'bg-red-100 text-red-700',
  'checked-in':  'bg-blue-100 text-blue-700',
  'checked-out': 'bg-gray-100 text-gray-600',
};

const paymentLabel = {
  full_payment:    'Full Payment',
  partial_payment: 'Partial Payment',
  pay_at_resort:   'Pay at Resort',
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const toLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// ── Mini Calendar for Modify Modal ───────────────────────────────────────────
const MiniCalendar = ({ bookedDates, selectedDates, onDateClick, excludeBookingId }) => {
  const [month, setMonth] = useState(new Date());

  const getDays = (date) => {
    const year = date.getFullYear(), m = date.getMonth();
    const startDOW = new Date(year, m, 1).getDay();
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < startDOW; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, m, i));
    return days;
  };

  const isBooked = (date) => {
    if (!date) return false;
    return bookedDates.some(b =>
      b.getDate() === date.getDate() &&
      b.getMonth() === date.getMonth() &&
      b.getFullYear() === date.getFullYear()
    );
  };

  const isPast = (date) => {
    if (!date) return false;
    const today = new Date(); today.setHours(0,0,0,0);
    return date < today;
  };

  const isInRange = (date) => {
    if (!date || !selectedDates.checkIn) return false;
    if (selectedDates.checkOut) return date >= selectedDates.checkIn && date <= selectedDates.checkOut;
    return date.getTime() === selectedDates.checkIn.getTime();
  };

  const isStart = (date) => date && selectedDates.checkIn && date.getTime() === selectedDates.checkIn.getTime();
  const isEnd   = (date) => date && selectedDates.checkOut && date.getTime() === selectedDates.checkOut.getTime();

  const days = getDays(month);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {MONTH_NAMES[month.getMonth()]} {month.getFullYear()}
        </span>
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          const booked   = isBooked(date);
          const past     = isPast(date);
          const inRange  = isInRange(date);
          const start    = isStart(date);
          const end      = isEnd(date);
          const disabled = !date || booked || past;
          return (
            <button key={idx} onClick={() => !disabled && onDateClick(date)} disabled={disabled}
              className={[
                'aspect-square rounded-lg text-xs font-medium transition-all',
                !date ? 'invisible' : '',
                booked ? 'bg-red-100 text-red-400 line-through cursor-not-allowed' : '',
                !booked && past ? 'text-gray-300 cursor-not-allowed' : '',
                start || end ? 'bg-ocean-600 text-white shadow-sm' : '',
                inRange && !start && !end ? 'bg-ocean-100 text-ocean-800 rounded-none' : '',
                !disabled && !inRange ? 'hover:bg-ocean-50 text-gray-700' : '',
              ].join(' ')}>
              {date?.getDate()}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-ocean-600 rounded" /><span>Selected</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 rounded" /><span>Booked</span></div>
      </div>
    </div>
  );
};

// ── Modify Modal ─────────────────────────────────────────────────────────────
const ModifyModal = ({ booking, onClose, onSuccess }) => {
  const [selectedDates, setSelectedDates] = useState({
    checkIn:  new Date(booking.checkIn  + 'T00:00:00'),
    checkOut: new Date(booking.checkOut + 'T00:00:00'),
  });
  const [guests,         setGuests]         = useState(booking.guests);
  const [specialRequest, setSpecialRequest] = useState(booking.specialRequest || '');
  const [bookedDates,    setBookedDates]    = useState([]);
  const [saving,         setSaving]         = useState(false);
  const [error,          setError]          = useState('');
  const [success,        setSuccess]        = useState(false);

  useEffect(() => {
    bookingsAPI.getBookedDates(booking.roomId)
      .then(data => {
        const parsed = (data.bookedDates || []).map(d => {
          const [y, m, day] = d.split('-');
          return new Date(Number(y), Number(m) - 1, Number(day));
        });
        setBookedDates(parsed);
      })
      .catch(() => {});
  }, [booking.roomId]);

  const handleDateClick = (date) => {
    if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
      setSelectedDates({ checkIn: date, checkOut: null });
    } else if (date <= selectedDates.checkIn) {
      setSelectedDates({ checkIn: date, checkOut: null });
    } else {
      setSelectedDates({ ...selectedDates, checkOut: date });
    }
  };

  const nights = selectedDates.checkIn && selectedDates.checkOut
    ? Math.ceil((selectedDates.checkOut - selectedDates.checkIn) / (1000 * 60 * 60 * 24))
    : 0;

  const handleSave = async () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      setError('Please select both check-in and check-out dates.'); return;
    }
    try {
      setSaving(true);
      setError('');
      await bookingsAPI.modifyBooking(booking.id, {
        checkIn:        toLocalDate(selectedDates.checkIn),
        checkOut:       toLocalDate(selectedDates.checkOut),
        guests,
        specialRequest,
      });
      setSuccess(true);
      setTimeout(() => { onSuccess({ checkIn: toLocalDate(selectedDates.checkIn), checkOut: toLocalDate(selectedDates.checkOut), guests, specialRequest }); onClose(); }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to modify booking.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-display font-bold text-gray-900">Modify Booking</h2>
            <p className="text-xs text-gray-500 mt-0.5">{booking.roomName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Calendar */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Select New Dates</p>
            <MiniCalendar
              bookedDates={bookedDates}
              selectedDates={selectedDates}
              onDateClick={handleDateClick}
            />
            {selectedDates.checkIn && selectedDates.checkOut && (
              <div className="mt-3 p-3 bg-ocean-50 rounded-xl text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Check-in</span>
                  <span className="font-medium text-gray-900">{toLocalDate(selectedDates.checkIn)}</span>
                </div>
                <div className="flex justify-between text-gray-600 mt-1">
                  <span>Check-out</span>
                  <span className="font-medium text-gray-900">{toLocalDate(selectedDates.checkOut)}</span>
                </div>
                <div className="flex justify-between text-gray-600 mt-1 pt-2 border-t border-ocean-100">
                  <span>Nights</span>
                  <span className="font-bold text-ocean-600">{nights}</span>
                </div>
              </div>
            )}
          </div>

          {/* Guests */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Number of Guests</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setGuests(g => Math.max(1, g - 1))}
                className="w-9 h-9 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-gray-600">
                −
              </button>
              <span className="text-lg font-bold text-gray-900 w-8 text-center">{guests}</span>
              <button onClick={() => setGuests(g => g + 1)}
                className="w-9 h-9 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors font-bold text-gray-600">
                +
              </button>
              <span className="text-sm text-gray-500 ml-1">{guests === 1 ? 'guest' : 'guests'}</span>
            </div>
          </div>

          {/* Special Request */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Special Requests <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea rows={3} value={specialRequest} onChange={e => setSpecialRequest(e.target.value)}
              placeholder="Any special requests for the resort..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
              <Check className="w-4 h-4" /> Booking updated successfully!
            </div>
          )}

          {/* Save Button */}
          <button onClick={handleSave} disabled={saving || !selectedDates.checkIn || !selectedDates.checkOut}
            className="w-full py-3 bg-ocean-600 hover:bg-ocean-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const MyBookings = () => {
  const [bookings,    setBookings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [cancelling,  setCancelling]  = useState(null);
  const [modifying,   setModifying]   = useState(null); // booking being modified

  useEffect(() => {
    bookingsAPI.getUserBookings()
      .then(data => setBookings(data.bookings || []))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
  }, []);

  const handleCancel = async (booking) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      setCancelling(booking.id);
      await bookingsAPI.cancelBookingByRef(booking.refCode, booking.email || '');
      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'cancelled' } : b));
    } catch {
      try {
        await bookingsAPI.updateStatus(booking.id, 'cancelled');
        setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'cancelled' } : b));
      } catch {
        alert('Failed to cancel booking.');
      }
    } finally {
      setCancelling(null);
    }
  };

  const handleModifySuccess = (bookingId, updates) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, ...updates } : b));
  };

  return (
    <DashboardLayout publicMenuItems={publicMenuItems} dashboardMenuItems={dashboardMenuItems}>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 mb-1 sm:mb-2">My Bookings</h1>
        <p className="text-gray-500 text-sm sm:text-base">View and manage all your reservations</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
      )}

      <div className="space-y-4 sm:space-y-6">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 space-y-3 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="h-6 bg-gray-100 rounded w-1/3" />
                <div className="h-5 bg-gray-100 rounded-full w-20" />
              </div>
              <div className="h-4 bg-gray-100 rounded w-1/4" />
              <div className="h-16 bg-gray-100 rounded" />
            </div>
          ))
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 sm:p-12 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium mb-1">No bookings yet</p>
            <p className="text-gray-400 text-sm mb-4">Start by browsing our available rooms</p>
            <Link to="/rooms" className="inline-flex px-6 py-2.5 bg-ocean-600 text-white rounded-xl hover:bg-ocean-700 transition-colors font-medium text-sm">
              Browse Rooms
            </Link>
          </div>
        ) : bookings.map((booking, i) => (
          <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">

            {/* Header */}
            <div className="flex items-start justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b border-gray-100">
              <div className="min-w-0 flex-1 pr-3">
                <h3 className="text-base sm:text-xl font-display font-bold text-gray-900 leading-tight truncate">
                  {booking.roomName || '—'}
                </h3>
                {booking.refCode && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Ref</span>
                    <span className="font-mono text-xs font-bold text-ocean-600 bg-ocean-50 px-1.5 py-0.5 rounded">
                      {booking.refCode}
                    </span>
                  </div>
                )}
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${statusStyles[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                {booking.status}
              </span>
            </div>

            {/* Details */}
            <div className="px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-gray-50/50">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 leading-tight">Check-In</p>
                  <p className="text-sm font-medium text-gray-900 leading-tight mt-0.5">
                    {new Date(booking.checkIn + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 leading-tight">Check-Out</p>
                  <p className="text-sm font-medium text-gray-900 leading-tight mt-0.5">
                    {new Date(booking.checkOut + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

<div className="flex items-start gap-2">
  <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
  <div className="min-w-0">
    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 leading-tight">Arrival</p>
    <p className="text-sm font-medium text-gray-900 leading-tight mt-0.5">
      {booking.arrivalTime ? formatTime(booking.arrivalTime) : '2:00 PM'}
    </p>
  </div>
</div>

              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 leading-tight">Guests</p>
                  <p className="text-sm font-medium text-gray-900 leading-tight mt-0.5">{booking.guests}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 leading-tight">Total</p>
                <p className="text-sm font-bold text-green-700 leading-tight mt-0.5">
                  ₱{(booking.totalPrice || 0).toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                  {paymentLabel[booking.paymentType] || booking.paymentType || ''}
                </p>
              </div>
            </div>

            {/* Actions */}
            {['pending', 'confirmed'].includes(booking.status) && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-3 flex flex-col sm:flex-row gap-2">
                <button onClick={() => setModifying(booking)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 border border-ocean-300 text-ocean-600 hover:bg-ocean-50 rounded-xl text-sm font-medium transition-colors">
                  <Edit2 className="w-4 h-4" /> Modify Booking
                </button>
                <button onClick={() => handleCancel(booking)} disabled={cancelling === booking.id}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-xl text-sm font-medium transition-colors">
                  <X className="w-4 h-4" />
                  {cancelling === booking.id ? 'Cancelling…' : 'Cancel Booking'}
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modify Modal */}
      <AnimatePresence>
        {modifying && (
          <ModifyModal
            booking={modifying}
            onClose={() => setModifying(null)}
            onSuccess={(updates) => handleModifySuccess(modifying.id, updates)}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default MyBookings;