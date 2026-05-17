import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, Check, X, Trash2, ChevronDown } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { bookingsAPI } from '../../services/api';
import { Home, CalendarDays, BedDouble, Users, Wallet, Star, FileText, Settings } from 'lucide-react';

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

const formatTime = (t) => {
  if (!t) return '2:00 PM';
  const [h] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
};

const statusStyles = {
  confirmed:     'bg-green-100 text-green-700',
  pending:       'bg-yellow-100 text-yellow-700',
  cancelled:     'bg-red-100 text-red-700',
  'checked-in':  'bg-blue-100 text-blue-700',
  'checked-out': 'bg-gray-100 text-gray-600',
};

const paymentStyles = {
  full_payment:    'bg-green-100 text-green-700',
  partial_payment: 'bg-yellow-100 text-yellow-700',
  pay_at_resort:   'bg-gray-100 text-gray-500',
};

const paymentLabel = {
  full_payment:    'Full Payment',
  partial_payment: 'Partial',
  pay_at_resort:   'Pay at Resort',
};

const STATUS_FILTERS = ['all', 'confirmed', 'pending', 'cancelled', 'checked-in', 'checked-out'];

const AdminReservations = () => {
  const [reservations,  setReservations]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [search,        setSearch]        = useState('');
  const [filterStatus,  setFilterStatus]  = useState('all');
  const [selected,      setSelected]      = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFilters,   setShowFilters]   = useState(true); // ← default true

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsAPI.getAllBookings();
      setReservations(data.bookings || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = reservations.filter(r => {
    const q = search.toLowerCase();
    const matchSearch =
      (r.fullName || '').toLowerCase().includes(q) ||
      (r.id       || '').toLowerCase().includes(q) ||
      (r.roomName || '').toLowerCase().includes(q) ||
      (r.email    || '').toLowerCase().includes(q) ||
      (r.refCode  || '').toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(true);
      await bookingsAPI.updateStatus(id, status);
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      setSelected(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;
    try {
      setActionLoading(true);
      await bookingsAPI.deleteBooking(id);
      setReservations(prev => prev.filter(r => r.id !== id));
      setSelected(null);
    } catch (err) {
      alert('Failed to delete reservation: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const ActionButtons = ({ r }) => (
    <>
      {r.status === 'pending' && (
        <div className="flex gap-2">
          <button onClick={() => updateStatus(r.id, 'confirmed')} disabled={actionLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors">
            <Check className="w-3.5 h-3.5" /> Confirm
          </button>
          <button onClick={() => updateStatus(r.id, 'cancelled')} disabled={actionLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      )}
      {r.status === 'confirmed' && (
        <div className="flex gap-2">
          <button onClick={() => updateStatus(r.id, 'checked-in')} disabled={actionLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors">
            <Check className="w-3.5 h-3.5" /> Check In
          </button>
          <button onClick={() => updateStatus(r.id, 'cancelled')} disabled={actionLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      )}
      {r.status === 'checked-in' && (
        <button onClick={() => updateStatus(r.id, 'checked-out')} disabled={actionLoading}
          className="w-full flex items-center justify-center gap-1.5 py-2 bg-gray-700 hover:bg-gray-800 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors">
          <Check className="w-3.5 h-3.5" /> Check Out
        </button>
      )}
    </>
  );

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>

      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900">Reservations</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all guest bookings</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center justify-between gap-3">
          <span className="flex-1 min-w-0 truncate">Failed to load: {error}</span>
          <button onClick={fetchBookings} className="text-red-700 underline text-xs whitespace-nowrap">Retry</button>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3 mb-5">

        {/* Search row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search guest, room, email, ref..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            />
          </div>

          {/* Filter toggle button — always visible on all screen sizes */}
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              filterStatus !== 'all'
                ? 'bg-ocean-600 text-white border-ocean-600'
                : 'bg-white border-gray-300 text-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter chips — animated, open by default, chips don't close panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-1">
                {STATUS_FILTERS.map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                      filterStatus === s
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
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Ref Code', 'Guest', 'Room', 'Check-In', 'Check-Out', 'Arrival', 'Total', 'Payment', 'Status', ''].map(h => (
<th key={h} className="text-left px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>{[...Array(9)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 animate-pulse rounded w-16" />
                    </td>
                  ))}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    {reservations.length === 0 ? 'No reservations yet.' : 'No results match your search.'}
                  </td>
                </tr>
              ) : filtered.map((r, i) => (
                <motion.tr key={r.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-ocean-600">{r.refCode || '—'}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{r.fullName || '—'}</p>
                    <p className="text-xs text-gray-400">{r.email || ''}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.roomName || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.checkIn}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.checkOut}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {r.arrivalTime ? formatTime(r.arrivalTime) : '2:00 PM'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">₱{(r.totalPrice || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${paymentStyles[r.paymentType] || 'bg-gray-100 text-gray-500'}`}>
                      {paymentLabel[r.paymentType] || r.paymentType || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${statusStyles[r.status] || 'bg-gray-100 text-gray-600'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(r)}
                      className="p-1.5 hover:bg-ocean-50 rounded-lg transition-colors text-ocean-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {reservations.length} reservations
          </div>
        )}
      </div>

      {/* ── Mobile Cards (<md) ── */}
      <div className="md:hidden space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 animate-pulse">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-100 rounded w-24" />
                <div className="h-5 bg-gray-100 rounded-full w-20" />
              </div>
              <div className="h-4 bg-gray-100 rounded w-40" />
              <div className="h-4 bg-gray-100 rounded w-32" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-12 text-center text-gray-400 text-sm">
            {reservations.length === 0 ? 'No reservations yet.' : 'No results match your search.'}
          </div>
        ) : filtered.map((r, i) => (
          <motion.div key={r.id}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

            <div className="flex items-start justify-between px-4 pt-4 pb-3 border-b border-gray-100">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 text-sm truncate">{r.fullName || '—'}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{r.email || ''}</p>
                <p className="font-mono text-xs font-bold text-ocean-600 mt-1">{r.refCode || '—'}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${statusStyles[r.status] || 'bg-gray-100 text-gray-600'}`}>
                  {r.status}
                </span>
              </div>
            </div>

            <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Room</p>
                <p className="text-sm font-medium text-gray-800 truncate">{r.roomName || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Check-In</p>
                <p className="text-sm text-gray-700">{r.checkIn}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Payment</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${paymentStyles[r.paymentType] || 'bg-gray-100 text-gray-500'}`}>
                  {paymentLabel[r.paymentType] || r.paymentType || '—'}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Check-Out</p>
                <p className="text-sm text-gray-700">{r.checkOut}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Total</p>
                <p className="text-sm font-semibold text-green-700">₱{(r.totalPrice || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Arrival</p>
                <p className="text-sm text-gray-700">{r.arrivalTime ? formatTime(r.arrivalTime) : '2:00 PM'}</p>
              </div>
            </div>

            <div className="px-4 pb-4 pt-2 space-y-2">
              <ActionButtons r={r} />
              <button
                onClick={() => setSelected(r)}
                className="w-full flex items-center justify-center gap-1.5 py-2 border border-ocean-200 text-ocean-600 hover:bg-ocean-50 rounded-lg text-xs font-medium transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> View Full Details
              </button>
            </div>
          </motion.div>
        ))}

        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 pt-1 pb-2">
            Showing {filtered.length} of {reservations.length} reservations
          </p>
        )}
      </div>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col"
              style={{ maxHeight: '92dvh' }}
            >
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 flex-shrink-0">
                <div>
                  <h2 className="text-lg font-display font-bold text-gray-900">Booking Details</h2>
                  {selected.refCode && (
                    <p className="font-mono text-xs font-bold text-ocean-600 mt-0.5 tracking-wider">{selected.refCode}</p>
                  )}
                </div>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-5 sm:px-6 py-4">
                <div className="space-y-0">
                  {[
                    ['Booking ID',   selected.id],
                    ['Guest',        selected.fullName],
                    ['Email',        selected.email],
                    ['Phone',        selected.phone || '—'],
                    ['Room',         selected.roomName],
                    ['Check-In',     selected.checkIn],
                    ['Check-Out',    selected.checkOut],
                    ['Arrival Time', selected.arrivalTime ? formatTime(selected.arrivalTime) : '2:00 PM'],
                    ['Guests',       selected.guests],
                    ['Total',        `₱${(selected.totalPrice || 0).toLocaleString()}`],
                    ['Payment Type', paymentLabel[selected.paymentType] || selected.paymentType || '—'],
                    ['Special Req.', selected.specialRequest || 'None'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between items-start py-2.5 border-b border-gray-100 last:border-0 gap-4">
                      <span className="text-gray-400 text-sm flex-shrink-0">{label}</span>
                      <span className="font-medium text-gray-900 text-sm text-right break-all">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2.5 border-b border-gray-100">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[selected.status] || 'bg-gray-100 text-gray-600'}`}>
                      {selected.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex-shrink-0 space-y-2.5">
                {selected.status === 'pending' && (
                  <div className="flex gap-3">
                    <button onClick={() => updateStatus(selected.id, 'confirmed')} disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
                      <Check className="w-4 h-4" /> Confirm
                    </button>
                    <button onClick={() => updateStatus(selected.id, 'cancelled')} disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                )}
                {selected.status === 'confirmed' && (
                  <div className="flex gap-3">
                    <button onClick={() => updateStatus(selected.id, 'checked-in')} disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
                      <Check className="w-4 h-4" /> Check In
                    </button>
                    <button onClick={() => updateStatus(selected.id, 'cancelled')} disabled={actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                )}
                {selected.status === 'checked-in' && (
                  <button onClick={() => updateStatus(selected.id, 'checked-out')} disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-700 hover:bg-gray-800 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors">
                    <Check className="w-4 h-4" /> Check Out
                  </button>
                )}
                <button onClick={() => deleteReservation(selected.id)} disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-xl text-sm font-medium transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete Reservation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default AdminReservations;