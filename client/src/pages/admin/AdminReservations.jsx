import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, Check, X, Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, CalendarDays, BedDouble, Users, Wallet, FileText, Settings } from 'lucide-react';

const menuItems = [
  { path: '/admin',              label: 'Overview',        icon: Home        },
  { path: '/admin/reservations', label: 'Reservations',    icon: CalendarDays},
  { path: '/admin/rooms',        label: 'Room Management', icon: BedDouble   },
  { path: '/admin/users',        label: 'User Management', icon: Users       },
  { path: '/admin/finance',      label: 'Finance',         icon: Wallet      },
  { path: '/admin/reports',      label: 'Reports',         icon: FileText    },
  { path: '/admin/settings',     label: 'Settings',        icon: Settings    },
];

// ── MOCK DATA — replace with API call when backend is ready ──
// e.g. useEffect(() => { reservationsAPI.getAll().then(setReservations) }, [])
const initialReservations = [
  { id: 'R001', guest: 'John Smith',    email: 'john@email.com',   room: 'Oceanus Room',        checkIn: '2026-03-01', checkOut: '2026-03-03', guests: 2,  total: 6000,  status: 'confirmed', payment: 'paid'    },
  { id: 'R002', guest: 'Maria Garcia',  email: 'maria@email.com',  room: 'Athena Room',         checkIn: '2026-03-02', checkOut: '2026-03-05', guests: 3,  total: 13500, status: 'pending',   payment: 'pending' },
  { id: 'R003', guest: 'David Lee',     email: 'david@email.com',  room: 'Ouranus Room',        checkIn: '2026-03-05', checkOut: '2026-03-08', guests: 8,  total: 27000, status: 'confirmed', payment: 'paid'    },
  { id: 'R004', guest: 'Sarah Johnson', email: 'sarah@email.com',  room: 'Oceanus Room',        checkIn: '2026-03-10', checkOut: '2026-03-12', guests: 2,  total: 6000,  status: 'cancelled', payment: 'refunded'},
  { id: 'R005', guest: 'Robert Chen',   email: 'robert@email.com', room: 'Beachfront Bungalow', checkIn: '2026-03-15', checkOut: '2026-03-17', guests: 3,  total: 1100,  status: 'pending',   payment: 'pending' },
  { id: 'R006', guest: 'Emily Davis',   email: 'emily@email.com',  room: 'Presidential Suite',  checkIn: '2026-03-20', checkOut: '2026-03-24', guests: 5,  total: 4800,  status: 'confirmed', payment: 'paid'    },
];

const statusStyles   = { confirmed: 'bg-green-100 text-green-700',  pending: 'bg-yellow-100 text-yellow-700', cancelled: 'bg-red-100 text-red-700'   };
const paymentStyles  = { paid: 'bg-green-100 text-green-700',       pending: 'bg-yellow-100 text-yellow-700', refunded: 'bg-gray-100 text-gray-500'  };

const AdminReservations = () => {
  const [reservations, setReservations] = useState(initialReservations);
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected]         = useState(null);

  const filtered = reservations.filter(r => {
    const matchSearch  = r.guest.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()) || r.room.toLowerCase().includes(search.toLowerCase());
    const matchStatus  = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── When backend ready: call reservationsAPI.updateStatus(id, status) ──
  const updateStatus = (id, status) => {
    setReservations(reservations.map(r => r.id === id ? { ...r, status } : r));
    setSelected(null);
  };

  // ── When backend ready: call reservationsAPI.delete(id) ──
  const deleteReservation = (id) => {
    setReservations(reservations.filter(r => r.id !== id));
    setSelected(null);
  };

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Reservations</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all guest bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search guest, room, or booking ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          {['all', 'confirmed', 'pending', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filterStatus === s ? 'bg-ocean-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['ID', 'Guest', 'Room', 'Check-In', 'Check-Out', 'Total', 'Payment', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400">No reservations found.</td></tr>
              ) : filtered.map((r, i) => (
                <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{r.guest}</p>
                    <p className="text-xs text-gray-400">{r.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.room}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.checkIn}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.checkOut}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">₱{r.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${paymentStyles[r.payment]}`}>{r.payment}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(r)} className="p-1.5 hover:bg-ocean-50 rounded-lg transition-colors text-ocean-600">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">Booking {selected.id}</h2>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  ['Guest',     selected.guest],
                  ['Email',     selected.email],
                  ['Room',      selected.room],
                  ['Check-In',  selected.checkIn],
                  ['Check-Out', selected.checkOut],
                  ['Guests',    selected.guests],
                  ['Total',     `₱${selected.total.toLocaleString()}`],
                  ['Payment',   selected.payment],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className="font-medium text-gray-900 text-sm capitalize">{value}</span>
                  </div>
                ))}
              </div>

              {/* Admin Actions */}
              {selected.status === 'pending' && (
                <div className="flex gap-3 mb-3">
                  <button onClick={() => updateStatus(selected.id, 'confirmed')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors">
                    <Check className="w-4 h-4" /> Confirm
                  </button>
                  <button onClick={() => updateStatus(selected.id, 'cancelled')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              )}
              <button onClick={() => deleteReservation(selected.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors">
                <Trash2 className="w-4 h-4" /> Delete Reservation
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default AdminReservations;