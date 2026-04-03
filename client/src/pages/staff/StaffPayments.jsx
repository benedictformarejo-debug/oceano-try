import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Search, Filter, ChevronDown } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { bookingsAPI } from '../../services/api';
import { Home, Calendar, UserCheck, BedDouble, MessageSquare } from 'lucide-react';

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

const paymentLabel = {
  full_payment:    'Full Payment',
  partial_payment: 'Partial',
  pay_at_resort:   'Pay at Resort',
};

const paymentIcon = {
  full_payment:    '💳',
  partial_payment: '💵',
  pay_at_resort:   '🏨',
};

const STATUS_FILTERS = ['all', 'confirmed', 'pending', 'checked-in', 'checked-out', 'cancelled'];

const StaffPayments = () => {
  const [bookings,    setBookings]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState('');
  const [filter,      setFilter]      = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    bookingsAPI.getAllBookings()
      .then(data => setBookings(data.bookings || []))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
  }, []);

  const totalCollected = bookings
    .filter(b => ['confirmed', 'checked-in', 'checked-out'].includes(b.status))
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const totalPending = bookings
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const filtered = bookings.filter(p => {
    const q = search.toLowerCase();
    const matchSearch =
      (p.fullName || '').toLowerCase().includes(q) ||
      (p.id       || '').toLowerCase().includes(q) ||
      (p.roomName || '').toLowerCase().includes(q) ||
      (p.refCode  || '').toLowerCase().includes(q);
    const matchStatus = filter === 'all' || p.status === filter;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>

      {/* ── Heading ── */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 text-sm mt-1">View payment status for all bookings</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          Failed to load payments: {error}
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-green-50 rounded-xl p-4 sm:p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💰</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Total Collected</p>
            {loading
              ? <div className="h-7 w-28 bg-green-100 animate-pulse rounded mt-1" />
              : <p className="text-xl sm:text-2xl font-display font-bold text-green-700 truncate">₱{totalCollected.toLocaleString()}</p>
            }
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 sm:p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">⏳</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Pending</p>
            {loading
              ? <div className="h-7 w-28 bg-yellow-100 animate-pulse rounded mt-1" />
              : <p className="text-xl sm:text-2xl font-display font-bold text-yellow-700 truncate">₱{totalPending.toLocaleString()}</p>
            }
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 sm:p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📋</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Total Transactions</p>
            {loading
              ? <div className="h-7 w-10 bg-gray-200 animate-pulse rounded mt-1" />
              : <p className="text-xl sm:text-2xl font-display font-bold text-gray-900">{bookings.length}</p>
            }
          </div>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex flex-col gap-3 mb-5">

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by guest, room, or ref code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            />
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`sm:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors flex-shrink-0 ${
              filter !== 'all'
                ? 'bg-ocean-600 text-white border-ocean-600'
                : 'bg-white border-gray-300 text-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Desktop chips */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                filter === s ? 'bg-ocean-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}>{s}</button>
          ))}
        </div>

        {/* Mobile collapsible chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-1">
                {STATUS_FILTERS.map(s => (
                  <button key={s}
                    onClick={() => { setFilter(s); setShowFilters(false); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                      filter === s ? 'bg-ocean-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}>{s}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Desktop Table (md+) ── */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Ref Code', 'Guest', 'Room', 'Amount', 'Payment Type', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>{[...Array(7)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 animate-pulse rounded w-16" />
                    </td>
                  ))}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    {bookings.length === 0 ? 'No payments yet.' : 'No results match your search.'}
                  </td>
                </tr>
              ) : filtered.map((p, i) => (
                <motion.tr key={p.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-ocean-600">{p.refCode || '—'}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{p.fullName || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.roomName || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">₱{(p.totalPrice || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {paymentIcon[p.paymentType] || '💳'} {paymentLabel[p.paymentType] || p.paymentType || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.createdAt?.split('T')[0] || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${statusStyles[p.status] || 'bg-gray-100 text-gray-600'}`}>
                      {p.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-400 text-center">
            📋 View only — payment management is handled by admin
          </div>
        )}
      </div>

      {/* ── Mobile Cards (<md) ── */}
      <div className="md:hidden space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 animate-pulse">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-100 rounded w-28" />
                <div className="h-5 bg-gray-100 rounded-full w-20" />
              </div>
              <div className="h-4 bg-gray-100 rounded w-40" />
              <div className="h-10 bg-gray-100 rounded-xl w-full" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-12 text-center text-gray-400 text-sm">
            {bookings.length === 0 ? 'No payments yet.' : 'No results match your search.'}
          </div>
        ) : filtered.map((p, i) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Card header */}
            <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-gray-100">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 text-sm truncate">{p.fullName || '—'}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{p.email || ''}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Ref</span>
                  <span className="font-mono text-[11px] font-bold text-ocean-600 bg-ocean-50 px-1.5 py-0.5 rounded">
                    {p.refCode || '—'}
                  </span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ml-3 ${statusStyles[p.status] || 'bg-gray-100 text-gray-600'}`}>
                {p.status}
              </span>
            </div>

            {/* Card body grid */}
            <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2.5 bg-gray-50/60">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Room</p>
                <p className="text-sm font-medium text-gray-800 truncate">{p.roomName || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Amount</p>
                <p className="text-sm font-bold text-green-700">₱{(p.totalPrice || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Payment</p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {paymentIcon[p.paymentType] || '💳'} {paymentLabel[p.paymentType] || p.paymentType || '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">Date</p>
                <p className="text-sm font-medium text-gray-800">{p.createdAt?.split('T')[0] || '—'}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 pt-1 pb-1">
            📋 View only — payment management is handled by admin
          </p>
        )}
      </div>

    </DashboardLayout>
  );
};

export default StaffPayments;