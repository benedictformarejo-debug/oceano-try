import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CheckCircle, Calendar, Users, CreditCard, BedDouble } from 'lucide-react';
import { bookingsAPI } from '../services/api';

const statusStyles = {
  confirmed:    { color: 'bg-green-100 text-green-700',  label: 'Confirmed'    },
  pending:      { color: 'bg-yellow-100 text-yellow-700',label: 'Pending'      },
  cancelled:    { color: 'bg-red-100 text-red-700',      label: 'Cancelled'    },
  'checked-in': { color: 'bg-blue-100 text-blue-700',    label: 'Checked In'   },
  'checked-out':{ color: 'bg-gray-100 text-gray-600',    label: 'Checked Out'  },
};

const paymentLabel = {
  full_payment:    'Full Payment',
  partial_payment: 'Partial Payment',
  pay_at_resort:   'Pay at Resort',
};

const ManageBooking = () => {
  const [refCode,    setRefCode]    = useState('');
  const [email,      setEmail]      = useState('');
  const [booking,    setBooking]    = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error,      setError]      = useState(null);
  const [cancelled,  setCancelled]  = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!refCode.trim() || !email.trim()) return;
    try {
      setLoading(true);
      setError(null);
      setBooking(null);
      setCancelled(false);
      const data = await bookingsAPI.getBookingByRef(refCode.trim(), email.trim());
      setBooking(data.booking);
    } catch (err) {
      setError(err.message || 'Booking not found. Please check your reference code and email.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      setCancelling(true);
      await bookingsAPI.cancelBookingByRef(refCode.trim(), email.trim());
      setBooking(prev => ({ ...prev, status: 'cancelled' }));
      setCancelled(true);
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = booking && !['cancelled', 'checked-in', 'checked-out'].includes(booking.status);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <img src="/images/logo3.png" alt="Oceano Con Vista" className="h-12 w-auto" />
        </div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Manage Your Booking</h1>
        <p className="text-gray-500 mt-2">Enter your reference code and email to view or cancel your booking</p>
      </div>

      {/* Search Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Booking Reference Code</label>
            <input
              type="text"
              value={refCode}
              onChange={e => setRefCode(e.target.value.toUpperCase())}
              placeholder="e.g. OCV-8X3K2F"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent font-mono tracking-wider uppercase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="The email you used when booking"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            />
          </div>
          <button type="submit" disabled={loading || !refCode || !email}
            className="w-full flex items-center justify-center gap-2 py-3 bg-ocean-600 hover:bg-ocean-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors">
            <Search className="w-4 h-4" />
            {loading ? 'Searching...' : 'Find My Booking'}
          </button>
        </form>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Booking Result */}
      <AnimatePresence>
        {booking && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">

            {/* Status Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-400 mb-1">Reference Code</p>
                <p className="text-xl font-mono font-bold text-ocean-600 tracking-wider">{booking.refCode}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusStyles[booking.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                {statusStyles[booking.status]?.label || booking.status}
              </span>
            </div>

            {cancelled && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center">
                ✅ Your booking has been successfully cancelled.
              </div>
            )}

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <BedDouble className="w-5 h-5 text-ocean-600 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Room</p>
                  <p className="font-semibold text-gray-900 text-sm">{booking.roomName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-ocean-600 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Check-In</p>
                    <p className="font-semibold text-gray-900 text-sm">{booking.checkIn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Check-Out</p>
                    <p className="font-semibold text-gray-900 text-sm">{booking.checkOut}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Users className="w-5 h-5 text-ocean-600 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Guests</p>
                    <p className="font-semibold text-gray-900 text-sm">{booking.guests}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <CreditCard className="w-5 h-5 text-ocean-600 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="font-semibold text-ocean-600 text-sm">₱{(booking.totalPrice || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              {booking.specialRequest && (
                <div className="p-3 bg-yellow-50 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">Special Request</p>
                  <p className="text-sm text-gray-700">{booking.specialRequest}</p>
                </div>
              )}
            </div>

            {/* Cancel Button */}
            {canCancel && (
              <button onClick={handleCancel} disabled={cancelling}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-xl font-medium transition-colors text-sm">
                <X className="w-4 h-4" />
                {cancelling ? 'Cancelling...' : 'Cancel This Booking'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-xs text-gray-400 text-center">
        Need help? Contact us at <span className="text-ocean-600">oceanoconvista@gmail.com</span>
      </p>
    </div>
  );
};

export default ManageBooking;