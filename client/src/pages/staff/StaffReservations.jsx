import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, X, Calendar, Users } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, UserCheck, BedDouble, MessageSquare, CreditCard } from 'lucide-react';

const menuItems = [
  { path: '/staff', label: 'Overview', icon: Home },
  { path: '/staff/reservations', label: 'Reservations', icon: Calendar },
  { path: '/staff/checkinout', label: 'Check-In/Out', icon: UserCheck },
  { path: '/staff/room-status', label: 'Room Status', icon: BedDouble },
  { path: '/staff/requests', label: 'Guest Requests', icon: MessageSquare },
  { path: '/staff/payments', label: 'Payments', icon: CreditCard },
];

const mockReservations = [
  { id: 'R001', guestName: 'John Smith',    room: 'Oceanus Room',       checkIn: '2026-03-01', checkOut: '2026-03-03', guests: 2,  status: 'confirmed', total: 6000  },
  { id: 'R002', guestName: 'Maria Garcia',  room: 'Athena Room',        checkIn: '2026-03-02', checkOut: '2026-03-05', guests: 3,  status: 'pending',   total: 13500 },
  { id: 'R003', guestName: 'David Lee',     room: 'Ouranus Room',       checkIn: '2026-03-05', checkOut: '2026-03-08', guests: 8,  status: 'confirmed', total: 27000 },
  { id: 'R004', guestName: 'Sarah Johnson', room: 'Oceanus Room',       checkIn: '2026-03-10', checkOut: '2026-03-12', guests: 2,  status: 'cancelled', total: 6000  },
  { id: 'R005', guestName: 'Robert Chen',   room: 'Apollo Room',checkIn: '2026-03-15', checkOut: '2026-03-17', guests: 3,  status: 'pending',   total: 1100  },
  { id: 'R006', guestName: 'Emily Davis',   room: 'Cronos Room', checkIn: '2026-03-20', checkOut: '2026-03-24', guests: 5,  status: 'confirmed', total: 4800  },
];

const statusStyles = {
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const StaffReservations = () => {
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected]       = useState(null);

  const filtered = mockReservations.filter(r => {
    const matchSearch =
      r.guestName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.room.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Reservations</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage all guest reservations</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest, room, or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          {['all', 'confirmed', 'pending', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filterStatus === s
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
                {['Booking ID', 'Guest', 'Room', 'Check-In', 'Check-Out', 'Guests', 'Total', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">No reservations found.</td>
                </tr>
              ) : filtered.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-gray-500">{r.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.guestName}</td>
                  <td className="px-4 py-3 text-gray-600">{r.room}</td>
                  <td className="px-4 py-3 text-gray-600">{r.checkIn}</td>
                  <td className="px-4 py-3 text-gray-600">{r.checkOut}</td>
                  <td className="px-4 py-3 text-gray-600">{r.guests}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">₱{r.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(r)}
                      className="p-1.5 hover:bg-ocean-50 rounded-lg transition-colors text-ocean-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">Reservation {selected.id}</h2>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  ['Guest',     selected.guestName],
                  ['Room',      selected.room],
                  ['Check-In',  selected.checkIn],
                  ['Check-Out', selected.checkOut],
                  ['Guests',    selected.guests],
                  ['Total',     `₱${selected.total.toLocaleString()}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className="font-medium text-gray-900 text-sm">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2">
                  <span className="text-gray-500 text-sm">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default StaffReservations;