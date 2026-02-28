import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Shield, User, UserCheck } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, CalendarDays, BedDouble, Wallet, FileText, Settings } from 'lucide-react';

const menuItems = [
  { path: '/admin',              label: 'Overview',        icon: Home        },
  { path: '/admin/reservations', label: 'Reservations',    icon: CalendarDays},
  { path: '/admin/rooms',        label: 'Room Management', icon: BedDouble   },
  { path: '/admin/users',        label: 'User Management', icon: User        },
  { path: '/admin/finance',      label: 'Finance',         icon: Wallet      },
  { path: '/admin/reports',      label: 'Reports',         icon: FileText    },
  { path: '/admin/settings',     label: 'Settings',        icon: Settings    },
];

// ── MOCK DATA — replace with API call when backend is ready ──
// e.g. useEffect(() => { usersAPI.getAll().then(setUsers) }, [])
const initialUsers = [
  { id: 1, name: 'John Smith',    email: 'john@email.com',   role: 'guest', joined: '2026-01-10', bookings: 2, status: 'active'   },
  { id: 2, name: 'Maria Garcia',  email: 'maria@email.com',  role: 'guest', joined: '2026-01-18', bookings: 1, status: 'active'   },
  { id: 3, name: 'David Lee',     email: 'david@email.com',  role: 'guest', joined: '2026-02-01', bookings: 3, status: 'active'   },
  { id: 4, name: 'Sarah Johnson', email: 'sarah@email.com',  role: 'guest', joined: '2026-02-14', bookings: 1, status: 'inactive' },
  { id: 5, name: 'Robert Chen',   email: 'robert@email.com', role: 'guest', joined: '2026-02-20', bookings: 1, status: 'active'   },
  { id: 6, name: 'Ana Reyes',     email: 'ana@resort.com',   role: 'staff', joined: '2025-06-01', bookings: 0, status: 'active'   },
  { id: 7, name: 'Carlos Tan',    email: 'carlos@resort.com',role: 'staff', joined: '2025-06-01', bookings: 0, status: 'active'   },
  { id: 8, name: 'Admin User',    email: 'admin@resort.com', role: 'admin', joined: '2025-01-01', bookings: 0, status: 'active'   },
];

const roleStyles  = { guest: 'bg-blue-100 text-blue-700', staff: 'bg-purple-100 text-purple-700', admin: 'bg-red-100 text-red-700' };
const roleIcons   = { guest: User, staff: UserCheck, admin: Shield };
const statusStyles = { active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-500' };

const AdminUsers = () => {
  const [users, setUsers]         = useState(initialUsers);
  const [search, setSearch]       = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selected, setSelected]   = useState(null);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  // ── When backend ready: call usersAPI.updateRole(id, role) ──
  const changeRole = (id, role) => {
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  // ── When backend ready: call usersAPI.toggleStatus(id) ──
  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">Manage guest accounts, staff and roles</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { role: 'guest', label: 'Guests', icon: User,      color: 'text-blue-600',   bg: 'bg-blue-50'   },
          { role: 'staff', label: 'Staff',  icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
          { role: 'admin', label: 'Admins', icon: Shield,    color: 'text-red-600',    bg: 'bg-red-50'    },
        ].map(({ role, label, icon: Icon, color, bg }) => (
          <div key={role} className={`${bg} rounded-xl p-4 flex items-center gap-3`}>
            <Icon className={`w-6 h-6 ${color}`} />
            <div>
              <p className="text-2xl font-display font-bold text-gray-900">{users.filter(u => u.role === role).length}</p>
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
        <div className="flex gap-2">
          {['all', 'guest', 'staff', 'admin'].map(r => (
            <button key={r} onClick={() => setFilterRole(r)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filterRole === r ? 'bg-ocean-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}>{r}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
              {filtered.map((u, i) => {
                const RoleIcon = roleIcons[u.role];
                return (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-ocean-100 rounded-full flex items-center justify-center text-sm font-bold text-ocean-700">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleStyles[u.role]}`}>
                        <RoleIcon className="w-3 h-3" /> {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{u.joined}</td>
                    <td className="px-4 py-3 text-gray-600">{u.bookings}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[u.status]}`}>{u.status}</span>
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
      </div>

      {/* Manage Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">Manage User</h2>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center text-lg font-bold text-ocean-700">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selected.name}</p>
                  <p className="text-sm text-gray-500">{selected.email}</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Change Role</label>
                <div className="flex gap-2">
                  {['guest', 'staff', 'admin'].map(r => (
                    <button key={r} onClick={() => { changeRole(selected.id, r); setSelected({ ...selected, role: r }); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize border transition-colors ${
                        selected.role === r ? 'bg-ocean-600 text-white border-ocean-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}>{r}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => { toggleStatus(selected.id); setSelected({ ...selected, status: selected.status === 'active' ? 'inactive' : 'active' }); }}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  selected.status === 'active'
                    ? 'bg-red-50 border border-red-300 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 border border-green-300 text-green-600 hover:bg-green-100'
                }`}>
                {selected.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default AdminUsers;