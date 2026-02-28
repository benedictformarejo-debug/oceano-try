import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/DashboardLayout';
import {
  TrendingUp, DollarSign, Users, Calendar,
  BedDouble, CalendarDays, Home, Wallet,
  FileText, Settings, ArrowRight
} from 'lucide-react';

const menuItems = [
  { path: '/admin',               label: 'Overview',        icon: Home        },
  { path: '/admin/reservations',  label: 'Reservations',    icon: CalendarDays},
  { path: '/admin/rooms',         label: 'Room Management', icon: BedDouble   },
  { path: '/admin/users',         label: 'User Management', icon: Users       },
  { path: '/admin/finance',       label: 'Finance',         icon: Wallet      },
  { path: '/admin/reports',       label: 'Reports',         icon: FileText    },
  { path: '/admin/settings',      label: 'Settings',        icon: Settings    },
];

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
// TODO: Replace with API calls when backend is ready
// e.g. useEffect(() => { statsAPI.getOverview().then(setStats) }, [])
// ─────────────────────────────────────────────────────────────────────────────

const mockStats = {
  totalRevenue:  52500,
  totalBookings: 6,
  occupancyRate: 60,
  activeGuests:  5,
};

const mockRevenueData = [
  { month: 'Sep', revenue: 18000 },
  { month: 'Oct', revenue: 24000 },
  { month: 'Nov', revenue: 19500 },
  { month: 'Dec', revenue: 31000 },
  { month: 'Jan', revenue: 27500 },
  { month: 'Feb', revenue: 52500 },
];

const mockRecentBookings = [
  { id: 'R001', guest: 'John Smith',    room: 'Oceanus Room',        checkIn: '2026-03-01', amount: 6000,  status: 'confirmed' },
  { id: 'R002', guest: 'Maria Garcia',  room: 'Athena Room',         checkIn: '2026-03-02', amount: 13500, status: 'pending'   },
  { id: 'R003', guest: 'David Lee',     room: 'Ouranus Room',        checkIn: '2026-03-05', amount: 27000, status: 'confirmed' },
  { id: 'R004', guest: 'Sarah Johnson', room: 'Oceanus Room',        checkIn: '2026-03-10', amount: 6000,  status: 'cancelled' },
  { id: 'R005', guest: 'Robert Chen',   room: 'Apollo Room', checkIn: '2026-03-15', amount: 1100,  status: 'pending'   },
];

const statusStyles = {
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
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
  // ── When backend is ready, replace mockStats with real API data ──
  const [stats] = useState(mockStats);
  const [revenueData] = useState(mockRevenueData);
  const [recentBookings] = useState(mockRecentBookings);

  const statCards = [
    { label: 'Total Revenue (MTD)', value: `₱${stats.totalRevenue.toLocaleString()}`, icon: DollarSign,  color: 'text-green-600',  bg: 'bg-green-50'  },
    { label: 'Total Bookings',      value: stats.totalBookings,                        icon: Calendar,    color: 'text-blue-600',   bg: 'bg-blue-50'   },
    { label: 'Occupancy Rate',      value: `${stats.occupancyRate}%`,                  icon: TrendingUp,  color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Active Guests',       value: stats.activeGuests,                         icon: Users,       color: 'text-ocean-600',  bg: 'bg-ocean-50'  },
  ];

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Resort performance at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-display font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-display font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
            </div>
            <Link
              to="/admin/finance"
              className="text-sm text-ocean-600 hover:text-ocean-700 font-medium flex items-center gap-1"
            >
              Full Report <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `₱${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                dot={{ fill: '#0ea5e9', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-display font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { to: '/admin/reservations', title: 'Reservations',    desc: 'View & manage bookings',    icon: CalendarDays, color: 'text-blue-600',   bg: 'bg-blue-50'   },
              { to: '/admin/rooms',        title: 'Room Management', desc: 'Edit room details',         icon: BedDouble,    color: 'text-green-600',  bg: 'bg-green-50'  },
              { to: '/admin/users',        title: 'User Management', desc: 'Manage accounts & roles',   icon: Users,        color: 'text-purple-600', bg: 'bg-purple-50' },
              { to: '/admin/finance',      title: 'Finance',         desc: 'Revenue & payments',        icon: Wallet,       color: 'text-ocean-600',  bg: 'bg-ocean-50'  },
              { to: '/admin/reports',      title: 'Reports',         desc: 'Export data & analytics',   icon: FileText,     color: 'text-gray-600',   bg: 'bg-gray-50'   },
              { to: '/admin/settings',     title: 'Settings',        desc: 'Resort configuration',      icon: Settings,     color: 'text-gray-600',   bg: 'bg-gray-100'  },
            ].map(({ to, title, desc, icon: Icon, color, bg }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100"
              >
                <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  <p className="text-xs text-gray-400 truncate">{desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-ocean-600 transition-colors shrink-0" />
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
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold text-gray-900">Recent Bookings</h2>
          <Link
            to="/admin/reservations"
            className="text-sm text-ocean-600 hover:text-ocean-700 font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                {['Booking ID', 'Guest', 'Room', 'Check-In', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide pb-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.map((b, i) => (
                <motion.tr
                  key={b.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 + i * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 pr-4 font-mono text-xs text-gray-500">{b.id}</td>
                  <td className="py-3 pr-4 font-medium text-gray-900 whitespace-nowrap">{b.guest}</td>
                  <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">{b.room}</td>
                  <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">{b.checkIn}</td>
                  <td className="py-3 pr-4 font-semibold text-gray-900">₱{b.amount.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[b.status]}`}>
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