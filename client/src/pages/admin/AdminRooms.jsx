import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, X, Save, Users, DollarSign } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
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

// ── MOCK DATA — replace with API call when backend is ready ──
// e.g. useEffect(() => { roomsAPI.getAll().then(setRooms) }, [])
const initialRooms = [
  { id: '1', name: 'Oceanus Room',        capacity: 2,  price: 3000, status: 'occupied',    description: 'Panoramic ocean views, queen bed, private balcony.' },
  { id: '2', name: 'Athena Room',         capacity: 4,  price: 4500, status: 'available',   description: 'Private pool, 2 queen beds, garden and living area.'  },
  { id: '3', name: 'Ouranus Room',        capacity: 10, price: 9000, status: 'occupied',    description: 'Exclusive pool, karaoke, roofdeck, up to 10 guests.' },
  { id: '4', name: 'Beachfront Bungalow', capacity: 3,  price: 550,  status: 'maintenance', description: 'Direct beach access, king bed, outdoor deck.'         },
  { id: '5', name: 'Presidential Suite',  capacity: 6,  price: 1200, status: 'available',   description: 'Jacuzzi, 2 king beds, butler service, premium bar.'   },
];

const statusStyles = {
  occupied:    'bg-blue-100 text-blue-700',
  available:   'bg-green-100 text-green-700',
  maintenance: 'bg-red-100 text-red-700',
};

const AdminRooms = () => {
  const [rooms, setRooms]       = useState(initialRooms);
  const [editing, setEditing]   = useState(null); // holds a copy of room being edited
  const [editForm, setEditForm] = useState({});

  const openEdit = (room) => {
    setEditing(room.id);
    setEditForm({ ...room });
  };

  // ── When backend ready: call roomsAPI.update(editForm.id, editForm) ──
  const saveEdit = () => {
    setRooms(rooms.map(r => r.id === editForm.id ? { ...editForm, price: Number(editForm.price), capacity: Number(editForm.capacity) } : r));
    setEditing(null);
  };

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Room Management</h1>
        <p className="text-gray-500 text-sm mt-1">View and edit the 5 resort rooms</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {rooms.map((room, i) => (
          <motion.div key={room.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-display font-bold text-gray-900 text-lg">{room.name}</h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[room.status]}`}>
                {room.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">{room.description}</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400" />
                <span>Up to {room.capacity} guests</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-ocean-600">
                <DollarSign className="w-4 h-4" />
                <span>₱{room.price.toLocaleString()} / night</span>
              </div>
            </div>
            <button onClick={() => openEdit(room)}
              className="w-full flex items-center justify-center gap-2 py-2 border border-ocean-600 text-ocean-600 rounded-lg hover:bg-ocean-50 transition-colors text-sm font-medium">
              <Edit2 className="w-4 h-4" /> Edit Room
            </button>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setEditing(null)} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">Edit Room</h2>
                <button onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Room Name',    key: 'name',     type: 'text'   },
                  { label: 'Capacity',     key: 'capacity', type: 'number' },
                  { label: 'Price / Night',key: 'price',    type: 'number' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} value={editForm[key] || ''}
                      onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={editForm.description || ''}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={editForm.status || ''} onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent">
                    {['available', 'occupied', 'maintenance'].map(s => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button onClick={saveEdit}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-ocean-600 hover:bg-ocean-700 text-white rounded-xl font-medium transition-colors">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default AdminRooms;