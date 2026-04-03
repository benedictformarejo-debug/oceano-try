import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Shield, User, UserCheck, Users } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { usersAPI, bookingsAPI } from '../../services/api';
import { Home, CalendarDays, BedDouble, Wallet, FileText, Settings } from 'lucide-react';

const menuItems = [
  { path: '/admin',              label: 'Overview',        icon: Home        },
  { path: '/admin/reservations', label: 'Reservations',    icon: CalendarDays},
  { path: '/admin/rooms',        label: 'Room Management', icon: BedDouble   },
  { path: '/admin/users',        label: 'User Management', icon: Users       },
  { path: '/admin/finance',      label: 'Finance',         icon: Wallet      },
  { path: '/admin/reports',      label: 'Reports',         icon: FileText    },
  { path: '/admin/settings',     label: 'Settings',        icon: Settings    },
];

const roleStyles   = { guest: 'bg-blue-100 text-blue-700', staff: 'bg-purple-100 text-purple-700', admin: 'bg-red-100 text-red-700' };
const roleIcons    = { guest: User, staff: UserCheck, admin: Shield };
const statusStyles = { active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-500' };

const AdminUsers = () => {
  const [users,         setUsers]         = useState([]);
  const [bookings,      setBookings]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [search,        setSearch]        = useState('');
  const [filterRole,    setFilterRole]    = useState('all');
  const [selected,      setSelected]      = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      usersAPI.getAll(),
      bookingsAPI.getAllBookings(),
    ])
      .then(([usersData, bookingsData]) => {
        setUsers(usersData.users || []);
        setBookings(bookingsData.bookings || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const bookingCountByEmail = bookings.reduce((acc, b) => {
    if (b.email) acc[b.email] = (acc[b.email] || 0) + 1;
    return acc;
  }, {});

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
    const matchRole   = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const changeRole = async (id, role) => {
    try {
      setActionLoading(true);
      await usersAPI.updateRole(id, role);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      setSelected(prev => prev ? { ...prev, role } : null);
    } catch (err) {
      alert('Failed to update role: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      setActionLoading(true);
      await usersAPI.updateStatus(id, newStatus);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
      setSelected(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">Manage guest accounts, staff and roles</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          Failed to load users: {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          { role: 'guest', label: 'Guests', icon: User,      color: 'text-blue-600',   bg: 'bg-blue-50'   },
          { role: 'staff', label: 'Staff',  icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
          { role: 'admin', label: 'Admins', icon: Shield,    color: 'text-red-600',    bg: 'bg-red-50'    },
        ].map(({ role, label, icon: Icon, color, bg }) => (
          <div key={role} className={`${bg} rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color} flex-shrink-0`} />
            <div>
              {loading
                ? <div className="h-6 w-6 bg-white/60 animate-pulse rounded mb-1" />
                : <p className="text-xl sm:text-2xl font-display font-bold text-gray-900">{users.filter(u => u.role === role).length}</p>
              }
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['all', 'guest', 'staff', 'admin'].map(r => (
            <button key={r} onClick={() => setFilterRole(r)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap flex-shrink-0 ${
                filterRole === r ? 'bg-ocean-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}>{r}</button>
          ))}
        </div>
      </div>

      {/* Mobile: card list */}
      <div className="sm:hidden space-y-3 mb-4">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="h-4 bg-gray-100 animate-pulse rounded w-40" />
              <div className="h-3 bg-gray-100 animate-pulse rounded w-32" />
              <div className="h-3 bg-gray-100 animate-pulse rounded w-24" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-12 text-center text-gray-400 text-sm">
            {users.length === 0 ? 'No users found.' : 'No results match your search.'}
          </div>
        ) : filtered.map(u => {
          const RoleIcon = roleIcons[u.role] || User;
          return (
            <motion.div key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden">

              {/* Card Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-ocean-100 rounded-full flex items-center justify-center text-sm font-bold text-ocean-700 shrink-0">
                    {(u.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(u)}
                  className="text-xs text-ocean-600 font-medium border border-ocean-200 px-2.5 py-1 rounded-lg hover:bg-ocean-50 transition-colors flex-shrink-0">
                  Manage
                </button>
              </div>

              {/* Card Body */}
              <div className="px-4 py-3 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Role</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleStyles[u.role] || 'bg-gray-100 text-gray-600'}`}>
                    <RoleIcon className="w-3 h-3" /> {u.role}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[u.status] || 'bg-gray-100 text-gray-500'}`}>
                    {u.status || 'active'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Joined</span>
                  <span className="text-xs font-medium text-gray-900">{u.joined || '—'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Bookings</span>
                  <span className="text-xs font-medium text-gray-900">{bookingCountByEmail[u.email] || 0}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
        {!loading && filtered.length > 0 && (
          <p className="text-xs text-gray-400 text-center">
            Showing {filtered.length} of {users.length} users
          </p>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['User', 'Role', 'Joined', 'Bookings', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 animate-pulse rounded w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    {users.length === 0 ? 'No users found.' : 'No results match your search.'}
                  </td>
                </tr>
              ) : filtered.map((u, i) => {
                const RoleIcon = roleIcons[u.role] || User;
                return (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-ocean-100 rounded-full flex items-center justify-center text-sm font-bold text-ocean-700 shrink-0">
                          {(u.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleStyles[u.role] || 'bg-gray-100 text-gray-600'}`}>
                        <RoleIcon className="w-3 h-3" /> {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.joined || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{bookingCountByEmail[u.email] || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[u.status] || 'bg-gray-100 text-gray-500'}`}>
                        {u.status || 'active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(u)} className="text-xs text-ocean-600 font-medium hover:underline">Manage</button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {users.length} users
          </div>
        )}
      </div>

      {/* Manage Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm">

              {/* Sticky header */}
              <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-lg font-display font-bold text-gray-900">Manage User</h2>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-5 py-4">
                <div className="flex items-center gap-3 mb-5 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center text-lg font-bold text-ocean-700 shrink-0">
                    {(selected.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selected.name}</p>
                    <p className="text-sm text-gray-500">{selected.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{bookingCountByEmail[selected.email] || 0} booking(s)</p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Change Role</label>
                  <div className="flex gap-2">
                    {['guest', 'staff', 'admin'].map(r => (
                      <button key={r} onClick={() => changeRole(selected.id, r)} disabled={actionLoading}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize border transition-colors disabled:opacity-50 ${
                          selected.role === r ? 'bg-ocean-600 text-white border-ocean-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}>{r}</button>
                    ))}
                  </div>
                </div>

                <button onClick={() => toggleStatus(selected.id, selected.status)} disabled={actionLoading}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
                    selected.status === 'active'
                      ? 'bg-red-50 border border-red-300 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 border border-green-300 text-green-600 hover:bg-green-100'
                  }`}>
                  {selected.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
};

export default AdminUsers;