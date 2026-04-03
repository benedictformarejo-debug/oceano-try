import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { bookingsAPI } from '../../services/api';
import { Home, Calendar, UserCheck, BedDouble, CreditCard } from 'lucide-react';

const menuItems = [
  { path: '/staff',              label: 'Overview',       icon: Home          },
  { path: '/staff/reservations', label: 'Reservations',   icon: Calendar      },
  { path: '/staff/checkinout',   label: 'Check-In/Out',   icon: UserCheck     },
  { path: '/staff/room-status',  label: 'Room Status',    icon: BedDouble     },
  { path: '/staff/requests',     label: 'Guest Requests', icon: MessageSquare },
  { path: '/staff/payments',     label: 'Payments',       icon: CreditCard    },
];

const statusStyles = {
  confirmed:     'bg-green-100 text-green-700',
  pending:       'bg-yellow-100 text-yellow-700',
  cancelled:     'bg-red-100 text-red-700',
  'checked-in':  'bg-blue-100 text-blue-700',
  'checked-out': 'bg-gray-100 text-gray-600',
};

const StaffGuestRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    bookingsAPI.getAllBookings()
      .then(data => setBookings(data.bookings || []))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
  }, []);

  const withRequests = bookings.filter(b => b.specialRequest && b.specialRequest.trim() !== '');

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>

      {/* ── Heading ── */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900">Guest Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Special requests submitted during booking</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          Failed to load requests: {error}
        </div>
      )}

      {/* ── Summary banner ── */}
      <div className="mb-5 bg-ocean-50 border border-ocean-100 rounded-xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-ocean-100 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-5 h-5 text-ocean-600" />
        </div>
        <div className="min-w-0">
          {loading
            ? <div className="h-7 w-8 bg-ocean-100 animate-pulse rounded mb-0.5" />
            : <p className="text-2xl font-display font-bold text-gray-900 leading-tight">{withRequests.length}</p>
          }
          <p className="text-xs text-gray-500 leading-tight">Total Special Requests</p>
        </div>
      </div>

      {/* ── Request cards ── */}
      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 space-y-3 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-100 rounded w-32" />
                <div className="h-5 bg-gray-100 rounded-full w-20" />
              </div>
              <div className="h-3 bg-gray-100 rounded w-48" />
              <div className="h-12 bg-gray-100 rounded-lg" />
            </div>
          ))
        ) : withRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-14 text-center text-gray-400 text-sm">
            No special requests from guests yet.
          </div>
        ) : withRequests.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Card header */}
            <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-sm leading-tight truncate">
                    {b.fullName || '—'}
                  </p>
                  {/* Room + dates — wraps gracefully on small screens */}
                  <p className="text-xs text-gray-500 mt-1 leading-snug">
                    <span className="font-medium text-gray-700">{b.roomName}</span>
                    <span className="mx-1 text-gray-300">·</span>
                    <span className="whitespace-nowrap">Check-in: {b.checkIn}</span>
                    <span className="mx-1 text-gray-300">→</span>
                    <span className="whitespace-nowrap">Check-out: {b.checkOut}</span>
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${statusStyles[b.status] || 'bg-gray-100 text-gray-600'}`}>
                  {b.status}
                </span>
              </div>
            </div>

            {/* Special request body */}
            <div className="px-4 sm:px-5 py-3 sm:py-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
                Special Request
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">{b.specialRequest}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StaffGuestRequests;