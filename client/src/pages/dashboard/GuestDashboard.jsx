import { motion } from 'framer-motion';
import { Calendar, CreditCard, BookOpen, Home as HomeIcon, Info, Bed, Image, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

// Public site navigation
const publicMenuItems = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/about', label: 'About', icon: Info },
  { path: '/rooms', label: 'Rooms', icon: Bed },
  { path: '/gallery', label: 'Gallery', icon: Image },
  { path: '/contact', label: 'Contact', icon: Mail },
];

// Dashboard-specific navigation
const dashboardMenuItems = [
  { path: '/dashboard', label: 'Overview', icon: HomeIcon },
  { path: '/dashboard/bookings', label: 'My Bookings', icon: BookOpen },
  { path: '/dashboard/payments', label: 'Payments', icon: CreditCard },
];

const GuestDashboard = () => {
  const { user } = useAuth();
  // Mock data - replace with real API calls
  const upcomingBooking = {
    id: '1',
    roomName: 'Ocean View Suite',
    checkIn: '2024-03-15',
    checkOut: '2024-03-20',
    guests: 2,
    status: 'confirmed',
    totalPrice: 1750
  };

  const stats = [
    { 
      label: 'Upcoming', 
      value: '0', 
      subtitle: 'Scheduled bookings',
      icon: Calendar, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    { 
      label: 'Completed', 
      value: '0', 
      subtitle: 'Total visits',
      icon: BookOpen, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    { 
      label: 'Total Spent', 
      value: '$1,750', 
      subtitle: 'All bookings',
      icon: CreditCard, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
  ];

  return (
    <DashboardLayout 
      publicMenuItems={publicMenuItems}
      dashboardMenuItems={dashboardMenuItems}
    >
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-500">
          Manage your bookings and discover more at Oceano Con Vista
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-2xl border-2 ${stat.borderColor} p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
            <p className="text-4xl font-display font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Browse Rooms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100"
        >
          <div className={`inline-flex p-3 rounded-xl bg-blue-100 mb-4`}>
            <Bed className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
            Browse Rooms
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Discover our luxury rooms and find your perfect stay
          </p>
          <Link
            to="/rooms"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            View All Rooms →
          </Link>
        </motion.div>

        {/* My Appointments/Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-100"
        >
          <div className={`inline-flex p-3 rounded-xl bg-teal-100 mb-4`}>
            <Calendar className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
            My Bookings
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            View and manage your bookings and history
          </p>
          <Link
            to="/dashboard/bookings"
            className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 font-semibold rounded-xl transition-colors"
          >
            View Bookings →
          </Link>
        </motion.div>

        {/* Quick Book */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100"
        >
          <div className={`inline-flex p-3 rounded-xl bg-amber-100 mb-4`}>
            <BookOpen className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
            Make a Booking
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Skip the queue with online room booking
          </p>
          <Link
            to="/rooms"
            className="inline-flex items-center justify-center w-full px-6 py-3 border-2 border-amber-600 text-amber-600 hover:bg-amber-50 font-semibold rounded-xl transition-colors"
          >
            Book Now →
          </Link>
        </motion.div>
      </div>

      {/* Upcoming Booking Card - Optional, show if exists */}
      {upcomingBooking && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-gray-900">Upcoming Reservation</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Confirmed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{upcomingBooking.roomName}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Check-in: {new Date(upcomingBooking.checkIn).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Check-out: {new Date(upcomingBooking.checkOut).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{upcomingBooking.guests} Guests</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                <p className="text-3xl font-display font-bold text-gray-900">${upcomingBooking.totalPrice}</p>
              </div>
              <div className="flex space-x-3 mt-4">
                <Link
                  to="/dashboard/bookings"
                  className="flex-1 text-center px-4 py-2.5 border-2 border-ocean-600 text-ocean-600 rounded-xl hover:bg-ocean-50 transition-colors font-medium"
                >
                  View Details
                </Link>
                <Link
                  to="/dashboard/payments"
                  className="flex-1 text-center px-4 py-2.5 bg-ocean-600 text-white rounded-xl hover:bg-ocean-700 transition-colors font-medium"
                >
                  Pay Now
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default GuestDashboard;
