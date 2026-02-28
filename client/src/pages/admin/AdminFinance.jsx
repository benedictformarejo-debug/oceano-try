import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Search, Filter, TrendingUp, DollarSign, CreditCard, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, CalendarDays, BedDouble, Users, FileText, Settings, Wallet } from 'lucide-react';

const menuItems = [
  { path: '/admin',              label: 'Overview',        icon: Home        },
  { path: '/admin/reservations', label: 'Reservations',    icon: CalendarDays},
  { path: '/admin/rooms',        label: 'Room Management', icon: BedDouble   },
  { path: '/admin/users',        label: 'User Management', icon: Users       },
  { path: '/admin/finance',      label: 'Finance',         icon: Wallet      },
  { path: '/admin/reports',      label: 'Reports',         icon: FileText    },
  { path: '/admin/settings',     label: 'Settings',        icon: Settings    },
];

// ── MOCK DATA — replace with API calls when backend is ready ──
const monthlyRevenue = [
  { month: 'Sep', revenue: 18000 },
  { month: 'Oct', revenue: 24000 },
  { month: 'Nov', revenue: 19500 },
  { month: 'Dec', revenue: 31000 },
  { month: 'Jan', revenue: 27500 },
  { month: 'Feb', revenue: 52500 },
];

const revenueByRoom = [
  { room: 'Oceanus',    revenue: 12000 },
  { room: 'Athena',     revenue: 18000 },
  { room: 'Ouranus',    revenue: 9000  },
  { room: 'Bungalow',   revenue: 1100  },
  { room: 'Presidential',revenue: 4800 },
];

const payments = [
  { id: 'P001', booking: 'R001', guest: 'John Smith',    room: 'Oceanus Room',        amount: 6000,  method: 'GCash',        status: 'paid',    date: '2026-03-01' },
  { id: 'P002', booking: 'R002', guest: 'Maria Garcia',  room: 'Athena Room',         amount: 13500, method: 'Cash',         status: 'pending', date: '2026-03-02' },
  { id: 'P003', booking: 'R003', guest: 'David Lee',     room: 'Ouranus Room',        amount: 27000, method: 'Bank Transfer', status: 'paid',   date: '2026-03-05' },
  { id: 'P004', booking: 'R004', guest: 'Sarah Johnson', room: 'Oceanus Room',        amount: 6000,  method: 'GCash',        status: 'refunded',date: '2026-03-10' },
  { id: 'P005', booking: 'R005', guest: 'Robert Chen',   room: 'Beachfront Bungalow', amount: 1100,  method: 'Cash',         status: 'pending', date: '2026-03-15' },
  { id: 'P006', booking: 'R006', guest: 'Emily Davis',   room: 'Presidential Suite',  amount: 4800,  method: 'Bank Transfer', status: 'paid',   date: '2026-03-20' },
];

const statusStyles  = { paid: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', refunded: 'bg-gray-100 text-gray-500' };
const methodIcons   = { 'GCash': '📱', 'Cash': '💵', 'Bank Transfer': '🏦' };

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

const AdminFinance = () => {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');

  const totalPaid    = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === 'refunded').reduce((s, p) => s + p.amount, 0);

  const filtered = payments.filter(p => {
    const matchSearch = p.guest.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Finance</h1>
        <p className="text-gray-500 text-sm mt-1">Revenue tracking and payment records</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Collected',  value: totalPaid,     icon: DollarSign,  color: 'text-green-600',  bg: 'bg-green-50'  },
          { label: 'Pending Payments', value: totalPending,  icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Total Refunded',   value: totalRefunded, icon: CreditCard,  color: 'text-gray-500',   bg: 'bg-gray-50'   },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className={`${bg} rounded-xl p-5 flex items-center gap-4`}>
            <Icon className={`w-8 h-8 ${color}`} />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">{label}</p>
              <p className="text-2xl font-display font-bold text-gray-900">₱{value.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-display font-bold text-gray-900 mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2.5}
                dot={{ fill: '#0ea5e9', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-display font-bold text-gray-900 mb-4">Revenue by Room</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByRoom}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="room" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
            <div className="flex gap-2">
              {['all', 'paid', 'pending', 'refunded'].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filter === s ? 'bg-ocean-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}>{s}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Payment ID', 'Booking', 'Guest', 'Room', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.booking}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{p.guest}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.room}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">₱{p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{methodIcons[p.method]} {p.method}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[p.status]}`}>{p.status}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminFinance;