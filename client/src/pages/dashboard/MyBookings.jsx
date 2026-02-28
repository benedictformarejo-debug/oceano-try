import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home as HomeIcon, Info, Bed, Image, Mail, BookOpen, CreditCard } from 'lucide-react';

const publicMenuItems = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/about', label: 'About', icon: Info },
  { path: '/rooms', label: 'Rooms', icon: Bed },
  { path: '/gallery', label: 'Gallery', icon: Image },
  { path: '/contact', label: 'Contact', icon: Mail },
];

const dashboardMenuItems = [
  { path: '/dashboard', label: 'Overview', icon: HomeIcon },
  { path: '/dashboard/bookings', label: 'My Bookings', icon: BookOpen },
  { path: '/dashboard/payments', label: 'Payments', icon: CreditCard },
];

const MyBookings = () => {
  // Mock data
  const bookings = [
    {
      id: 'BK-1001',
      roomName: 'Ocean View Suite',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
      checkIn: '2024-03-15',
      checkOut: '2024-03-20',
      guests: 2,
      totalPrice: 1750,
      status: 'confirmed'
    },
    {
      id: 'BK-1002',
      roomName: 'Deluxe Garden Room',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80',
      checkIn: '2024-02-10',
      checkOut: '2024-02-15',
      guests: 2,
      totalPrice: 1250,
      status: 'completed'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout publicMenuItems={publicMenuItems} dashboardMenuItems={dashboardMenuItems}>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
          My Bookings
        </h1>
        <p className="text-gray-500">
          View and manage all your reservations
        </p>
      </div>

      <div className="space-y-6">
        {bookings.map((booking, i) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
              {/* Image */}
              <div className="md:col-span-1">
                <img
                  src={booking.image}
                  alt={booking.roomName}
                  className="w-full h-48 md:h-full object-cover rounded-xl"
                />
              </div>

              {/* Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-display font-bold text-gray-900">
                      {booking.roomName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Check-in</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(booking.checkIn).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Check-out</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(booking.checkOut).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Guests</p>
                      <p className="text-sm font-medium text-gray-900">{booking.guests} Guests</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-sm font-medium text-gray-900">${booking.totalPrice}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="md:col-span-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <button className="w-full px-4 py-2.5 bg-ocean-600 text-white rounded-xl hover:bg-ocean-700 transition-colors font-medium text-sm">
                    View Details
                  </button>
                  {booking.status === 'confirmed' && (
                    <button className="w-full px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm">
                      Modify Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default MyBookings;
