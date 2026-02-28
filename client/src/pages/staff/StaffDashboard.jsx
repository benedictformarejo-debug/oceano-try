import { motion } from 'framer-motion';
import { LogIn, LogOut, Bed, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, Calendar, UserCheck, BedDouble, MessageSquare, CreditCard } from 'lucide-react';

const menuItems = [
  { path: '/staff', label: 'Overview', icon: Home },
  { path: '/staff/reservations', label: 'Reservations', icon: Calendar },
  { path: '/staff/checkinout', label: 'Check-In/Out', icon: UserCheck },
  { path: '/staff/room-status', label: 'Room Status', icon: BedDouble },
  { path: '/staff/requests', label: 'Guest Requests', icon: MessageSquare },
  { path: '/staff/payments', label: 'Payments', icon: CreditCard },
];

// Accurate stats for a 5-room resort
const todayStats = {
  checkIns:    3,
  checkOuts:   2,
  occupied:    3,
  available:   1,
  maintenance: 1,
};

const upcomingCheckIns = [
  { id: 1, guestName: 'John Smith',   room: 'Oceanus Room',  time: '2:00 PM',  status: 'pending'   },
  { id: 2, guestName: 'Maria Garcia', room: 'Athena Room',   time: '3:30 PM',  status: 'pending'   },
  { id: 3, guestName: 'David Lee',    room: 'Ouranus Room',  time: '4:00 PM',  status: 'confirmed' },
];

const upcomingCheckOuts = [
  { id: 1, guestName: 'Sarah Johnson', room: 'Beachfront Bungalow', time: '11:00 AM', status: 'pending'   },
  { id: 2, guestName: 'Robert Chen',   room: 'Presidential Suite',  time: '11:30 AM', status: 'completed' },
];

const pendingRequests = [
  { id: 1, guest: 'John Smith',    room: 'Oceanus Room',        type: 'Housekeeping', priority: 'normal' },
  { id: 2, guest: 'Sarah Johnson', room: 'Beachfront Bungalow', type: 'Maintenance',  priority: 'urgent' },
  { id: 3, guest: 'Robert Chen',   room: 'Presidential Suite',  type: 'Housekeeping', priority: 'urgent' },
];

const StaffDashboard = () => {
  return (
    <DashboardLayout dashboardMenuItems={menuItems}>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Staff Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening at the resort today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Check-Ins Today',  value: todayStats.checkIns,    icon: LogIn,       color: 'text-blue-600'   },
          { label: 'Check-Outs Today', value: todayStats.checkOuts,   icon: LogOut,      color: 'text-orange-600' },
          { label: 'Occupied',         value: todayStats.occupied,    icon: CheckCircle, color: 'text-green-600'  },
          { label: 'Available',        value: todayStats.available,   icon: Bed,         color: 'text-ocean-600'  },
          { label: 'Maintenance',      value: todayStats.maintenance, icon: AlertCircle, color: 'text-red-600'    },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">{label}</p>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-3xl font-display font-bold text-gray-900">{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Today's Check-Ins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-bold text-gray-900">Today's Check-Ins</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {upcomingCheckIns.length}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            {upcomingCheckIns.map((checkIn) => (
              <div key={checkIn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-700">
                      {checkIn.guestName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{checkIn.guestName}</p>
                    <p className="text-xs text-gray-500">{checkIn.room} · {checkIn.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  checkIn.status === 'confirmed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {checkIn.status}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/staff/checkinout"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-ocean-600 text-ocean-600 rounded-lg hover:bg-ocean-50 transition-colors text-sm font-medium"
          >
            Manage Check-Ins <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Today's Check-Outs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-bold text-gray-900">Today's Check-Outs</h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {upcomingCheckOuts.length}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            {upcomingCheckOuts.map((checkOut) => (
              <div key={checkOut.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-700">
                      {checkOut.guestName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{checkOut.guestName}</p>
                    <p className="text-xs text-gray-500">{checkOut.room} · {checkOut.time}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  checkOut.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {checkOut.status}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/staff/checkinout"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-ocean-600 text-ocean-600 rounded-lg hover:bg-ocean-50 transition-colors text-sm font-medium"
          >
            Manage Check-Outs <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Guest Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.49 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-bold text-gray-900">Pending Requests</h2>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              {pendingRequests.length}
            </span>
          </div>
          <div className="space-y-3 mb-4">
            {pendingRequests.map(req => (
              <div key={req.id} className={`flex items-center justify-between p-3 rounded-lg ${
                req.priority === 'urgent' ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm">{req.guest}</p>
                    {req.priority === 'urgent' && (
                      <span className="text-xs text-red-600 font-semibold">🚨 Urgent</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{req.room} · {req.type}</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                  Pending
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/staff/requests"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-ocean-600 text-ocean-600 rounded-lg hover:bg-ocean-50 transition-colors text-sm font-medium"
          >
            View All Requests <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-display font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="space-y-2">
            {[
              { to: '/staff/reservations', label: 'View All Reservations', icon: Calendar,      color: 'text-blue-600',   bg: 'bg-blue-50'   },
              { to: '/staff/room-status',  label: 'Room Status Board',     icon: BedDouble,     color: 'text-green-600',  bg: 'bg-green-50'  },
              { to: '/staff/requests',     label: 'Guest Requests',        icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
              { to: '/staff/payments',     label: 'Payment Records',       icon: CreditCard,    color: 'text-gray-600',   bg: 'bg-gray-50'   },
            ].map(({ to, label, icon: Icon, color, bg }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-ocean-600 transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

    </DashboardLayout>
  );
};

export default StaffDashboard;