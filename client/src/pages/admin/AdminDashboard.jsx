import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';
import { bookingsAPI } from '../../services/api';
import {
  TrendingUp, DollarSign, Users, Calendar,
  BedDouble, CalendarDays, Home, Wallet,
  FileText, Settings, Star, ArrowRight
} from 'lucide-react';

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

const statusStyles = {
  confirmed:    'bg-green-100 text-green-700',
  pending:      'bg-yellow-100 text-yellow-700',
  cancelled:    'bg-red-100 text-red-700',
  'checked-in': 'bg-blue-100 text-blue-700',
  'checked-out':'bg-gray-100 text-gray-600',
};

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const buildRevenueData = (bookings) => {
  const now   = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth(), label: MONTH_NAMES[d.getMonth()] });
  }
  return months.map(({ year, month, label }) => {
    const revenue = bookings
      .filter(b => {
        if (b.status === 'cancelled') return false;
        const created = new Date(b.createdAt);
        return created.getFullYear() === year && created.getMonth() === month;
      })
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    return { month: label, revenue };
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-ocean-600">₱{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    bookingsAPI.getAllBookings()
      .then(data => setBookings(data.bookings || []))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
  }, []);

  const now        = new Date();
  const thisMonth  = now.getMonth();
  const thisYear   = now.getFullYear();
  const todayStr   = now.toISOString().split('T')[0];

  const totalRevenue = bookings
    .filter(b => {
      if (b.status === 'cancelled') return false;
      const d = new Date(b.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const totalBookings  = bookings.length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const occupancyRate  = totalBookings > 0 ? Math.round((confirmedCount / totalBookings) * 100) : 0;

  const activeGuests = bookings
    .filter(b => b.status === 'confirmed' && b.checkIn <= todayStr && b.checkOut >= todayStr)
    .reduce((sum, b) => sum + (b.guests || 0), 0);

  const revenueData    = buildRevenueData(bookings);
  const recentBookings = bookings.slice(0, 5);

  const statCards = [
    { label: 'Total Revenue (MTD)', value: `₱${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600',  bg: 'bg-green-50'  },
    { label: 'Total Bookings',      value: totalBookings,                        icon: Calendar,   color: 'text-blue-600',   bg: 'bg-blue-50'   },
    { label: 'Occupancy Rate',      value: `${occupancyRate}%`,                  icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Active Guests',       value: activeGuests,                         icon: Users,      color: 'text-ocean-600',  bg: 'bg-ocean-50'  },
  ];

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Resort performance at a glance</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          Failed to load data: {error}
        </div>
      )}

      {/* Stats Grid — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 sm:p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1 leading-tight">{stat.label}</p>
            {loading
              ? <div className="h-7 w-20 bg-gray-100 animate-pulse rounded-lg" />
              : <p className="text-xl sm:text-3xl font-display font-bold text-gray-900">{stat.value}</p>
            }
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">

        {/* Revenue Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-display font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
            </div>
            <Link to="/admin/finance" className="text-xs sm:text-sm text-ocean-600 hover:text-ocean-700 font-medium flex items-center gap-1">
              Full Report <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v / 1000).toFixed(0)}k`} width={45} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2.5}
                dot={{ fill: '#0ea5e9', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
        >
          <h2 className="text-base sm:text-lg font-display font-bold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { to: '/admin/reservations', title: 'Reservations',    desc: 'View & manage bookings',  icon: CalendarDays, color: 'text-blue-600',   bg: 'bg-blue-50'   },
              { to: '/admin/rooms',        title: 'Room Management', desc: 'Edit room details',        icon: BedDouble,    color: 'text-green-600',  bg: 'bg-green-50'  },
              { to: '/admin/users',        title: 'User Management', desc: 'Manage accounts & roles',  icon: Users,        color: 'text-purple-600', bg: 'bg-purple-50' },
              { to: '/admin/finance',      title: 'Finance',         desc: 'Revenue & payments',       icon: Wallet,       color: 'text-ocean-600',  bg: 'bg-ocean-50'  },
              { to: '/admin/reports',      title: 'Reports',         desc: 'Export data & analytics',  icon: FileText,     color: 'text-gray-600',   bg: 'bg-gray-50'   },
              { to: '/admin/settings',     title: 'Settings',        desc: 'Resort configuration',     icon: Settings,     color: 'text-gray-600',   bg: 'bg-gray-100'  },
            ].map(({ to, title, desc, icon: Icon, color, bg }) => (
              <Link key={to} to={to}
                className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">{title}</p>
                  <p className="text-xs text-gray-400 truncate hidden sm:block">{desc}</p>
                </div>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300 group-hover:text-ocean-600 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-display font-bold text-gray-900">Recent Bookings</h2>
          <Link to="/admin/reservations" className="text-xs sm:text-sm text-ocean-600 hover:text-ocean-700 font-medium flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>

        {/* Mobile: card list */}
        <div className="sm:hidden space-y-3">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="p-3 border border-gray-100 rounded-lg space-y-2">
                <div className="h-4 bg-gray-100 animate-pulse rounded w-32" />
                <div className="h-3 bg-gray-100 animate-pulse rounded w-24" />
              </div>
            ))
          ) : recentBookings.length === 0 ? (
            <p className="text-center py-8 text-gray-400 text-sm">No bookings yet.</p>
          ) : recentBookings.map(b => (
            <div key={b.id} className="p-3 border border-gray-100 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-900 text-sm">{b.fullName || '—'}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[b.status] || 'bg-gray-100 text-gray-600'}`}>
                  {b.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">{b.roomName || '—'} · {b.checkIn}</p>
              <p className="text-xs font-semibold text-gray-900 mt-1">₱{(b.totalPrice || 0).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                {['Booking ID', 'Guest', 'Room', 'Check-In', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="py-3 pr-4">
                        <div className="h-4 bg-gray-100 animate-pulse rounded w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">No bookings yet.</td>
                </tr>
              ) : recentBookings.map((b, i) => (
                <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 + i * 0.05 }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-gray-500">{b.id.slice(0, 8)}…</td>
                  <td className="py-3 pr-4 font-medium text-gray-900 whitespace-nowrap">{b.fullName || '—'}</td>
                  <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">{b.roomName || '—'}</td>
                  <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">{b.checkIn}</td>
                  <td className="py-3 pr-4 font-semibold text-gray-900">₱{(b.totalPrice || 0).toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </DashboardLayout>
  );
};

export default AdminDashboard;