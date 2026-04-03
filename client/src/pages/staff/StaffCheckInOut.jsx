import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, LogOut, Check, Clock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { bookingsAPI } from '../../services/api';
import { Home, Calendar, BedDouble, MessageSquare, CreditCard, UserCheck } from 'lucide-react';

const menuItems = [
  { path: '/staff',              label: 'Overview',       icon: Home          },
  { path: '/staff/reservations', label: 'Reservations',   icon: Calendar      },
  { path: '/staff/checkinout',   label: 'Check-In/Out',   icon: UserCheck     },
  { path: '/staff/room-status',  label: 'Room Status',    icon: BedDouble     },
  { path: '/staff/requests',     label: 'Guest Requests', icon: MessageSquare },
  { path: '/staff/payments',     label: 'Payments',       icon: CreditCard    },
];

const StaffCheckInOut = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    bookingsAPI.getAllBookings()
      .then(data => setBookings(data.bookings || []))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const checkIns  = bookings.filter(b => b.checkIn  === todayStr && (b.status === 'confirmed'  || b.status === 'checked-in'));
  const checkOuts = bookings.filter(b => b.checkOut === todayStr && (b.status === 'checked-in' || b.status === 'checked-out'));

  const pendingIns  = checkIns.filter(b  => b.status === 'confirmed').length;
  const pendingOuts = checkOuts.filter(b => b.status === 'checked-in').length;

  const handleCheckIn = async (id) => {
    try {
      setUpdating(id);
      await bookingsAPI.updateStatus(id, 'checked-in');
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'checked-in' } : b));
    } catch (err) {
      alert('Failed to check in: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleCheckOut = async (id) => {
    try {
      setUpdating(id);
      await bookingsAPI.updateStatus(id, 'checked-out');
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'checked-out' } : b));
    } catch (err) {
      alert('Failed to check out: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const Card = ({ item, type }) => {
    const isDone = type === 'in' ? item.status === 'checked-in' : item.status === 'checked-out';
    const isBusy = updating === item.id;

    const accentBg  = type === 'in' ? 'bg-blue-100   text-blue-700'   : 'bg-orange-100 text-orange-700';
    const btnClass  = type === 'in' ? 'bg-blue-600   hover:bg-blue-700'  : 'bg-orange-500 hover:bg-orange-600';
    const dateLabel = type === 'in' ? `Check-in: ${item.checkIn}` : `Check-out: ${item.checkOut}`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
      >
        {/* Guest info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${accentBg}`}>
            {(item.fullName || '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{item.fullName || '—'}</p>
            <p className="text-sm text-gray-500 truncate">{item.roomName || '—'}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-400 truncate">{dateLabel}</span>
            </div>
          </div>
        </div>

        {/* Action — full width on mobile, auto on sm+ */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          {isDone ? (
            <span className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold w-full sm:w-auto">
              <Check className="w-3.5 h-3.5" /> Done
            </span>
          ) : (
            <button
              onClick={() => type === 'in' ? handleCheckIn(item.id) : handleCheckOut(item.id)}
              disabled={isBusy}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 sm:py-1.5 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 w-full sm:w-auto ${btnClass}`}
            >
              {isBusy
                ? <span className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing…</span>
                : type === 'in' ? <><LogIn  className="w-3.5 h-3.5" /> Check In</>
                                : <><LogOut className="w-3.5 h-3.5" /> Check Out</>
              }
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  const SkeletonCard = () => (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-pulse">
      <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gray-200 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-8 bg-gray-200 rounded-lg w-20 hidden sm:block" />
    </div>
  );

  const SectionPanel = ({ type, items, pending, panelLoading }) => {
    const isIn       = type === 'in';
    const Icon       = isIn ? LogIn : LogOut;
    const iconColor  = isIn ? 'text-blue-600'   : 'text-orange-600';
    const badgeCls   = isIn ? 'bg-blue-100   text-blue-700'   : 'bg-orange-100 text-orange-700';
    const emptyMsg   = isIn ? 'No check-ins scheduled for today.' : 'No check-outs scheduled for today.';
    const title      = isIn ? "Today's Check-Ins" : "Today's Check-Outs";

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Panel header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${iconColor}`} />
            <h2 className="text-base sm:text-lg font-display font-bold text-gray-900">{title}</h2>
          </div>
          {pending > 0 && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeCls}`}>
              {pending} pending
            </span>
          )}
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {panelLoading ? (
            [...Array(2)].map((_, i) => <SkeletonCard key={i} />)
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">{emptyMsg}</p>
          ) : items.map(item => (
            <Card key={item.id} item={item} type={type} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>

      {/* Heading */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900">Check-In / Check-Out</h1>
        <p className="text-gray-500 text-sm mt-1">Process today's arrivals and departures</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          Failed to load bookings: {error}
        </div>
      )}

      {/* Summary bar — visible on mobile for a quick at-a-glance count */}
      {!loading && (pendingIns > 0 || pendingOuts > 0) && (
        <div className="flex gap-3 mb-4 sm:hidden">
          {pendingIns > 0 && (
            <div className="flex-1 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <LogIn className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-blue-500 leading-tight">Check-Ins</p>
                <p className="text-lg font-bold text-blue-700 leading-tight">{pendingIns}</p>
              </div>
            </div>
          )}
          {pendingOuts > 0 && (
            <div className="flex-1 flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
              <LogOut className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-orange-500 leading-tight">Check-Outs</p>
                <p className="text-lg font-bold text-orange-700 leading-tight">{pendingOuts}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Two-column on lg, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SectionPanel type="in"  items={checkIns}  pending={pendingIns}  panelLoading={loading} />
        <SectionPanel type="out" items={checkOuts} pending={pendingOuts} panelLoading={loading} />
      </div>
    </DashboardLayout>
  );
};

export default StaffCheckInOut;