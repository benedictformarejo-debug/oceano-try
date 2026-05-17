import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Search, DollarSign, CreditCard, AlertCircle, Filter, ChevronDown } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { bookingsAPI } from '../../services/api';
import { Home, CalendarDays, BedDouble, Users, Star, FileText, Settings, Wallet } from 'lucide-react';

const menuItems = [
  { path: '/admin',              label: 'Overview',        icon: Home        },
  { path: '/admin/reservations', label: 'Reservations',    icon: CalendarDays},
  { path: '/admin/rooms',        label: 'Room Management', icon: BedDouble   },
  { path: '/admin/users',        label: 'User Management', icon: Users       },
  { path: '/admin/reviews',      label: 'Reviews',         icon: Star        },
  { path: '/admin/finance',      label: 'Finance',         icon: Wallet      },
  { path: '/admin/reports',      label: 'Reports',         icon: FileText    },
  { path: '/admin/settings',     label: 'Settings',        icon: Settings    },
];

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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

const STATUS_FILTERS = ['all', 'confirmed', 'pending', 'cancelled', 'checked-in', 'checked-out'];

const buildMonthlyRevenue = (bookings) => {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const revenue = bookings
      .filter(b => {
        if (b.status === 'cancelled') return false;
        const created = new Date(b.createdAt);
        return created.getFullYear() === d.getFullYear() && created.getMonth() === d.getMonth();
      })
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    return { month: MONTH_NAMES[d.getMonth()], revenue };
  });
};

const buildRevenueByRoom = (bookings) => {
  const map = {};
  bookings
    .filter(b => b.status !== 'cancelled')
    .forEach(b => {
      const name = (b.roomName || 'Unknown').split(' ')[0];
      map[name] = (map[name] || 0) + (b.totalPrice || 0);
    });
  return Object.entries(map).map(([room, revenue]) => ({ room, revenue }));
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-ocean-600">₱{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const AdminFinance = () => {
  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState('');
  const [filter,       setFilter]       = useState('all');
  const [showFilters,  setShowFilters]  = useState(false);

  useEffect(() => {
    bookingsAPI.getAllBookings()
      .then(data => setBookings(data.bookings || []))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
  }, []);

  const totalCollected = bookings
    .filter(b => ['confirmed', 'checked-in', 'checked-out'].includes(b.status))
    .reduce((s, b) => s + (b.totalPrice || 0), 0);

  const totalPending = bookings
    .filter(b => b.status === 'pending')
    .reduce((s, b) => s + (b.totalPrice || 0), 0);

  const totalRefunded = bookings
    .filter(b => b.status === 'cancelled')
    .reduce((s, b) => s + (b.totalPrice || 0), 0);

  const monthlyRevenue = buildMonthlyRevenue(bookings);
  const revenueByRoom  = buildRevenueByRoom(bookings);

  const filteredPayments = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch =
      (b.fullName  || '').toLowerCase().includes(q) ||
      (b.id        || '').toLowerCase().includes(q) ||
      (b.roomName  || '').toLowerCase().includes(q);
    const matchFilter = filter === 'all' || b.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>

      {/* ── Heading ── */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900">Finance</h1>
        <p className="text-gray-500 text-sm mt-1">Revenue tracking and payment records</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          Failed to load data: {error}
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Total Collected',  value: totalCollected, icon: DollarSign,  color: 'text-green-600',  bg: 'bg-green-50'  },
          { label: 'Pending Payments', value: totalPending,   icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Cancelled Value',  value: totalRefunded,  icon: CreditCard,  color: 'text-gray-500',   bg: 'bg-gray-50'   },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className={`${bg} rounded-xl p-4 sm:p-5 flex items-center gap-4`}
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${bg} flex-shrink-0`}>
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 mb-0.5 leading-tight">{label}</p>
              {loading
                ? <div className="h-6 w-24 bg-white/60 animate-pulse rounded-lg mt-1" />
                : <p className="text-xl sm:text-2xl font-display font-bold text-gray-900 truncate">
                    ₱{value.toLocaleString()}
                  </p>
              }
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">

        {/* Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
        >
          <h2 className="text-sm sm:text-base font-display font-bold text-gray-900 mb-4">Monthly Revenue</h2>
          {loading
            ? <div className="h-[180px] sm:h-[200px] bg-gray-50 animate-pulse rounded-xl" />
            : (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                    tickFormatter={v => `₱${(v / 1000).toFixed(0)}k`} width={42} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2.5}
                    dot={{ fill: '#0ea5e9', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            )
          }
        </motion.div>

        {/* Revenue by Room */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
        >
          <h2 className="text-sm sm:text-base font-display font-bold text-gray-900 mb-4">Revenue by Room</h2>
          {loading
            ? <div className="h-[180px] sm:h-[200px] bg-gray-50 animate-pulse rounded-xl" />
            : revenueByRoom.length === 0
              ? <div className="h-[180px] flex items-center justify-center text-gray-400 text-sm">No revenue data yet</div>
              : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={revenueByRoom} margin={{ left: 0, right: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="room" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                      tickFormatter={v => `₱${(v / 1000).toFixed(0)}k`} width={42} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="revenue" fill="#0ea5e9" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )
          }
        </motion.div>
      </div>

      {/* ── Payment Records ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Search + filter header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search guest, room, or booking ID..."
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

          {/* Desktop filter chips */}
          <div className="hidden sm:flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                  filter === s
                    ? 'bg-ocean-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}>{s}</button>
            ))}
          </div>

          {/* Mobile collapsible filter chips */}
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
                        filter === s
                          ? 'bg-ocean-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}>{s}</button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Desktop Table (md+) ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Booking ID', 'Guest', 'Room', 'Amount', 'Payment Type', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 animate-pulse rounded w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    {bookings.length === 0 ? 'No payment records yet.' : 'No results match your search.'}
                  </td>
                </tr>
              ) : filteredPayments.map((b, i) => (
                <motion.tr key={b.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{b.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 whitespace-nowrap">{b.fullName || '—'}</p>
                    <p className="text-xs text-gray-400">{b.email || ''}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.roomName || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">₱{(b.totalPrice || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {paymentIcon[b.paymentType] || '💳'} {paymentLabel[b.paymentType] || b.paymentType || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{b.createdAt?.split('T')[0] || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${statusStyles[b.status] || 'bg-gray-100 text-gray-600'}`}>
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
            [...Array(4)].map((_, i) => (
              <div key={i} className="p-4 space-y-3 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-100 rounded w-28" />
                  <div className="h-5 bg-gray-100 rounded-full w-20" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-36" />
                <div className="h-4 bg-gray-100 rounded w-24" />
              </div>
            ))
          ) : filteredPayments.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              {bookings.length === 0 ? 'No payment records yet.' : 'No results match your search.'}
            </div>
          ) : filteredPayments.map((b, i) => (
            <motion.div key={b.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="p-4 hover:bg-gray-50/60 transition-colors"
            >
              {/* ── Card header: guest info + status badge ── */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-sm leading-tight truncate">
                    {b.fullName || '—'}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{b.email || ''}</p>

                  {/* Booking ID — clearly labelled, visually distinct */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Booking ID
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-ocean-600 bg-ocean-50 px-1.5 py-0.5 rounded">
                      {b.id.slice(0, 8)}…
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 ${statusStyles[b.status] || 'bg-gray-100 text-gray-600'}`}>
                  {b.status}
                </span>
              </div>

              {/* ── Card body: 2-col detail grid ── */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Room</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{b.roomName || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Amount</p>
                  <p className="text-sm font-bold text-green-700">₱{(b.totalPrice || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Payment</p>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {paymentIcon[b.paymentType] || '💳'} {paymentLabel[b.paymentType] || b.paymentType || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Date</p>
                  <p className="text-sm font-medium text-gray-800">{b.createdAt?.split('T')[0] || '—'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer count */}
        {!loading && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filteredPayments.length} of {bookings.length} records
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminFinance;