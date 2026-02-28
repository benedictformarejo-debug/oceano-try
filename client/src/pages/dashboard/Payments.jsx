import { motion } from 'framer-motion';
import { DollarSign, Download, CreditCard, Calendar, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home as HomeIcon, Info, Bed, Image, Mail, BookOpen } from 'lucide-react';

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

const Payments = () => {
  // Mock data
  const transactions = [
    {
      id: 'PAY-1001',
      bookingId: 'BK-1001',
      roomName: 'Ocean View Suite',
      date: '2024-02-18',
      amount: 1750,
      status: 'completed',
      method: 'Credit Card'
    },
    {
      id: 'PAY-1002',
      bookingId: 'BK-1002',
      roomName: 'Deluxe Garden Room',
      date: '2024-02-10',
      amount: 1250,
      status: 'completed',
      method: 'PayPal'
    },
  ];

  const stats = [
    {
      label: 'Total Paid',
      value: '$3,000',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Outstanding',
      value: '$0',
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Transactions',
      value: '2',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  return (
    <DashboardLayout publicMenuItems={publicMenuItems} dashboardMenuItems={dashboardMenuItems}>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
          Payments
        </h1>
        <p className="text-gray-500">
          Track your payment history and manage outstanding balances
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
            className="bg-white rounded-2xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-display font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-display font-bold text-gray-900">Payment History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Transaction ID
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Booking
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Date
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Amount
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Method
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction, i) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{transaction.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.roomName}</p>
                      <p className="text-xs text-gray-500">{transaction.bookingId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ${transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{transaction.method}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="inline-flex items-center space-x-1 text-sm text-ocean-600 hover:text-ocean-700 font-medium">
                      <Download className="w-4 h-4" />
                      <span>Receipt</span>
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-display font-bold text-gray-900 mb-4">Payment Methods</h2>
        <p className="text-gray-600 text-sm mb-4">
          Add a payment method for faster checkout
        </p>
        <button className="px-6 py-3 bg-ocean-600 text-white rounded-xl hover:bg-ocean-700 transition-colors font-medium">
          + Add Payment Method
        </button>
      </motion.div>
    </DashboardLayout>
  );
};

export default Payments;
