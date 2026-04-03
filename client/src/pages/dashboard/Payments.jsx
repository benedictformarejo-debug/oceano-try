import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { bookingsAPI } from '../../services/api';
import { Home as HomeIcon, Info, Bed, Image, Mail, BookOpen } from 'lucide-react';

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

const Payments = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    bookingsAPI.getUserBookings()
      .then(data => setBookings(data.bookings || []))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
  }, []);

  const totalPaid = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const outstanding = bookings
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const stats = [
    { label: 'Total Paid',   value: `₱${totalPaid.toLocaleString()}`,   icon: CreditCard,  color: 'text-green-600',  bg: 'bg-green-50'  },
    { label: 'Outstanding',  value: `₱${outstanding.toLocaleString()}`, icon: CreditCard,  color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Transactions', value: bookings.length,                     icon: CheckCircle, color: 'text-blue-600',   bg: 'bg-blue-50'   },
  ];

  return (
    <DashboardLayout publicMenuItems={publicMenuItems} dashboardMenuItems={dashboardMenuItems}>

      {/* ── Heading ── */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 mb-1 sm:mb-2">
          Payments
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Track your payment history and manage outstanding balances
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
      )}

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 flex sm:block items-center gap-4"
          >
            {/* Icon */}
            <div className={`p-3 rounded-xl ${stat.bg} flex-shrink-0`}>
              <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
            </div>
            {/* Value */}
            <div className="min-w-0 sm:mt-3">
              <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1 leading-tight">{stat.label}</p>
              {loading
                ? <div className="h-7 sm:h-9 w-24 bg-gray-100 animate-pulse rounded" />
                : <p className="text-xl sm:text-3xl font-display font-bold text-gray-900 truncate">{stat.value}</p>
              }
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Payment History ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-display font-bold text-gray-900">Payment History</h2>
        </div>

        {/* ── Desktop Table (md+) ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Ref Code', 'Room', 'Date', 'Amount', 'Payment Type', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-4 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>{[...Array(6)].map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 animate-pulse rounded w-16" />
                    </td>
                  ))}</tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">No payment history yet.</td>
                </tr>
              ) : bookings.map((b, i) => (
                <motion.tr key={b.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.05 }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-ocean-600 whitespace-nowrap">{b.refCode || '—'}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 whitespace-nowrap">{b.roomName || '—'}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                    ₱{(b.totalPrice || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                    {paymentLabel[b.paymentType] || b.paymentType || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full capitalize whitespace-nowrap ${statusStyles[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards (<md) ── */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-4 space-y-3 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-100 rounded w-28" />
                  <div className="h-5 bg-gray-100 rounded-full w-20" />
                </div>
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            ))
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No payment history yet.</div>
          ) : bookings.map((b, i) => (
            <motion.div key={b.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
              className="p-4 hover:bg-gray-50/60 transition-colors"
            >
              {/* Top row: room + status */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-sm leading-tight truncate">{b.roomName || '—'}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Ref</span>
                    <span className="font-mono text-[11px] font-bold text-ocean-600 bg-ocean-50 px-1.5 py-0.5 rounded">
                      {b.refCode || '—'}
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${statusStyles[b.status] || 'bg-gray-100 text-gray-600'}`}>
                  {b.status}
                </span>
              </div>

              {/* Detail grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Amount</p>
                  <p className="text-sm font-bold text-green-700">₱{(b.totalPrice || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Payment Type</p>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {paymentLabel[b.paymentType] || b.paymentType || '—'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Date</p>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Payments;