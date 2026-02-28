import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Search, Filter } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, Calendar, UserCheck, BedDouble, MessageSquare } from 'lucide-react';

const menuItems = [
  { path: '/staff', label: 'Overview', icon: Home },
  { path: '/staff/reservations', label: 'Reservations', icon: Calendar },
  { path: '/staff/checkinout', label: 'Check-In/Out', icon: UserCheck },
  { path: '/staff/room-status', label: 'Room Status', icon: BedDouble },
  { path: '/staff/requests', label: 'Guest Requests', icon: MessageSquare },
  { path: '/staff/payments', label: 'Payments', icon: CreditCard },
];

const mockPayments = [
  { id: 'P001', bookingId: 'R001', guest: 'John Smith',    room: 'Oceanus Room',        amount: 6000,  method: 'GCash',       status: 'paid',    date: '2026-03-01' },
  { id: 'P002', bookingId: 'R002', guest: 'Maria Garcia',  room: 'Athena Room',         amount: 13500, method: 'Cash',        status: 'pending', date: '2026-03-02' },
  { id: 'P003', bookingId: 'R003', guest: 'David Lee',     room: 'Ouranus Room',        amount: 27000, method: 'Bank Transfer',status: 'paid',    date: '2026-03-05' },
  { id: 'P004', bookingId: 'R004', guest: 'Sarah Johnson', room: 'Oceanus Room',        amount: 6000,  method: 'GCash',       status: 'refunded',date: '2026-03-10' },
  { id: 'P005', bookingId: 'R005', guest: 'Robert Chen',   room: 'Apollo Room', amount: 1100,  method: 'Cash',        status: 'pending', date: '2026-03-15' },
  { id: 'P006', bookingId: 'R006', guest: 'Emily Davis',   room: 'Cronos Room',  amount: 4800,  method: 'Bank Transfer',status: 'paid',    date: '2026-03-20' },
];

const statusStyles = {
  paid:     'bg-green-100 text-green-700',
  pending:  'bg-yellow-100 text-yellow-700',
  refunded: 'bg-gray-100 text-gray-600',
};

const methodIcons = {
  'GCash':        '📱',
  'Cash':         '💵',
  'Bank Transfer':'🏦',
};

const StaffPayments = () => {
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');

  const filtered = mockPayments.filter(p => {
    const matchSearch =
      p.guest.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.room.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'all' || p.status === filter;
    return matchSearch && matchStatus;
  });

  const totalPaid    = mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 text-sm mt-1">View payment status for all bookings</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Total Collected</p>
          <p className="text-2xl font-display font-bold text-green-700">₱{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Pending</p>
          <p className="text-2xl font-display font-bold text-yellow-700">₱{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
          <p className="text-2xl font-display font-bold text-gray-900">{mockPayments.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest, room, or payment ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          {['all', 'paid', 'pending', 'refunded'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === s
                  ? 'bg-ocean-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Payment ID', 'Booking', 'Guest', 'Room', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">No payments found.</td>
                </tr>
              ) : filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.id}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.bookingId}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{p.guest}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.room}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">₱{p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    <span className="mr-1">{methodIcons[p.method]}</span>{p.method}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{p.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View only notice */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-400 text-center">
          📋 View only — payment management is handled by admin
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffPayments;