import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, LogOut, Bed, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { bookingsAPI, roomsAPI } from '../../services/api';
import { Home, Calendar, UserCheck, BedDouble, MessageSquare, CreditCard } from 'lucide-react';

const menuItems = [
  { path: '/staff',              label: 'Overview',       icon: Home          },
  { path: '/staff/reservations', label: 'Reservations',   icon: Calendar      },
  { path: '/staff/checkinout',   label: 'Check-In/Out',   icon: UserCheck     },
  { path: '/staff/room-status',  label: 'Room Status',    icon: BedDouble     },
  { path: '/staff/requests',     label: 'Guest Requests', icon: MessageSquare },
  { path: '/staff/payments',     label: 'Payments',       icon: CreditCard    },
];

const StaffDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms,    setRooms]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    Promise.all([bookingsAPI.getAllBookings(), roomsAPI.getAll()])
      .then(([bData, rData]) => {
        setBookings(bData.bookings || []);
        setRooms(rData.rooms || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const checkInsToday  = bookings.filter(b => b.checkIn === todayStr && b.status !== 'cancelled');
  const checkOutsToday = bookings.filter(b => b.checkOut === todayStr && b.status === 'checked-in');
  const occupiedCount  = bookings.filter(b => b.status === 'checked-in').length;
  const available      = rooms.filter(r => r.status === 'available').length;
  const maintenance    = rooms.filter(r => r.status === 'maintenance').length;

  const todayStats = {
    checkIns:   checkInsToday.length,
    checkOuts:  checkOutsToday.length,
    occupied:   occupiedCount,
    available,
    maintenance,
  };

  const StatCard = ({ label, value, icon: Icon, color }, i) => (
    <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500 leading-tight">{label}</p>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color} flex-shrink-0`} />
      </div>
      {loading
        ? <div className="h-7 sm:h-9 w-8 sm:w-10 bg-gray-100 animate-pulse rounded-lg" />
        : <p className="text-2xl sm:text-3xl font-display font-bold text-gray-900">{value}</p>
      }
    </motion.div>
  );

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900">Staff Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening at the resort today</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          Failed to load data: {error}
        </div>
      )}

      {/* Stats Grid — 2 cols mobile, 3 tablet, 5 desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Check-Ins Today',  value: todayStats.checkIns,    icon: LogIn,       color: 'text-blue-600'   },
          { label: 'Check-Outs Today', value: todayStats.checkOuts,   icon: LogOut,      color: 'text-orange-600' },
          { label: 'Occupied',         value: todayStats.occupied,    icon: CheckCircle, color: 'text-green-600'  },
          { label: 'Available',        value: todayStats.available,   icon: Bed,         color: 'text-ocean-600'  },
          { label: 'Maintenance',      value: todayStats.maintenance, icon: AlertCircle, color: 'text-red-600'    },
        ].map((stat, i) => StatCard(stat, i))}
      </div>

      {/* Check-Ins & Check-Outs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">

        {/* Today's Check-Ins */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-display font-bold text-gray-900">Today's Check-Ins</h2>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
              {checkInsToday.length}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            {loading ? (
              [...Array(2)].map((_, i) => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg" />)
            ) : checkInsToday.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No check-ins scheduled today.</p>
            ) : checkInsToday.slice(0, 3).map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-700">{(b.fullName || '?').charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{b.fullName || '—'}</p>
                    <p className="text-xs text-gray-500 truncate">{b.roomName} · {b.checkIn}</p>
                  </div>
                </div>
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium capitalize flex-shrink-0 ${
                  b.status === 'checked-in' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{b.status}</span>
              </div>
            ))}
          </div>
          <Link to="/staff/checkinout"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-ocean-600 text-ocean-600 rounded-lg hover:bg-ocean-50 transition-colors text-sm font-medium">
            Manage Check-Ins <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Today's Check-Outs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-display font-bold text-gray-900">Today's Check-Outs</h2>
            <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs sm:text-sm font-medium">
              {checkOutsToday.length}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            {loading ? (
              [...Array(2)].map((_, i) => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg" />)
            ) : checkOutsToday.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No check-outs scheduled today.</p>
            ) : checkOutsToday.slice(0, 3).map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-orange-700">{(b.fullName || '?').charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{b.fullName || '—'}</p>
                    <p className="text-xs text-gray-500 truncate">{b.roomName} · {b.checkOut}</p>
                  </div>
                </div>
                <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700 capitalize flex-shrink-0">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
          <Link to="/staff/checkinout"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-ocean-600 text-ocean-600 rounded-lg hover:bg-ocean-50 transition-colors text-sm font-medium">
            Manage Check-Outs <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Pending Bookings & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* Pending Bookings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.49 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-display font-bold text-gray-900">Pending Bookings</h2>
            <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm font-medium">
              {bookings.filter(b => b.status === 'pending').length}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            {loading ? (
              [...Array(2)].map((_, i) => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg" />)
            ) : bookings.filter(b => b.status === 'pending').length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No pending bookings.</p>
            ) : bookings.filter(b => b.status === 'pending').slice(0, 3).map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{b.fullName || '—'}</p>
                  <p className="text-xs text-gray-500 truncate">{b.roomName} · Check-in: {b.checkIn}</p>
                </div>
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium flex-shrink-0">Pending</span>
              </div>
            ))}
          </div>
          <Link to="/staff/reservations"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-ocean-600 text-ocean-600 rounded-lg hover:bg-ocean-50 transition-colors text-sm font-medium">
            View All Reservations <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.56 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-display font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="space-y-2">
            {[
              { to: '/staff/reservations', label: 'View All Reservations', icon: Calendar,      color: 'text-blue-600',   bg: 'bg-blue-50'   },
              { to: '/staff/room-status',  label: 'Room Status Board',     icon: BedDouble,     color: 'text-green-600',  bg: 'bg-green-50'  },
              { to: '/staff/requests',     label: 'Guest Requests',        icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
              { to: '/staff/payments',     label: 'Payment Records',       icon: CreditCard,    color: 'text-gray-600',   bg: 'bg-gray-50'   },
            ].map(({ to, label, icon: Icon, color, bg }) => (
              <Link key={to} to={to}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-ocean-600 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

    </DashboardLayout>
  );
};

export default StaffDashboard;