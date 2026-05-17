import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, X, Save, Users, DollarSign } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { roomsAPI } from '../../services/api';
import { Home, CalendarDays, BedDouble, Wallet, Star, FileText, Settings } from 'lucide-react';

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
  occupied:    'bg-blue-100 text-blue-700',
  available:   'bg-green-100 text-green-700',
  maintenance: 'bg-red-100 text-red-700',
};

const AdminRooms = () => {
  const [rooms,         setRooms]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [editing,       setEditing]       = useState(null);
  const [editForm,      setEditForm]      = useState({});
  const [saveLoading,   setSaveLoading]   = useState(false);
  const [saveError,     setSaveError]     = useState(null);

  useEffect(() => {
    roomsAPI.getAll()
      .then(data => setRooms(data.rooms || []))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
  }, []);

  const openEdit = (room) => {
    setEditing(room.id);
    setEditForm({ ...room });
    setSaveError(null);
  };

  const saveEdit = async () => {
    try {
      setSaveLoading(true);
      setSaveError(null);
      const updated = await roomsAPI.update(editForm.id, {
        name:        editForm.name,
        capacity:    Number(editForm.capacity),
        price:       Number(editForm.price),
        status:      editForm.status,
        description: editForm.description,
      });
      setRooms(prev => prev.map(r => r.id === editForm.id ? updated.room : r));
      setEditing(null);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Room Management</h1>
        <p className="text-gray-500 text-sm mt-1">View and edit resort rooms</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          Failed to load rooms: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
              <div className="h-5 bg-gray-100 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-2/3" />
              <div className="h-9 bg-gray-100 animate-pulse rounded-lg mt-4" />
            </div>
          ))
        ) : rooms.map((room, i) => (
          <motion.div key={room.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-display font-bold text-gray-900 text-lg">{room.name}</h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[room.status] || 'bg-gray-100 text-gray-600'}`}>
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
                <span>₱{(room.price || 0).toLocaleString()} / night</span>
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

              {saveError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {saveError}
                </div>
              )}

              <div className="space-y-4">
                {[
                  { label: 'Room Name',     key: 'name',     type: 'text'   },
                  { label: 'Capacity',      key: 'capacity', type: 'number' },
                  { label: 'Price / Night', key: 'price',    type: 'number' },
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

              <button onClick={saveEdit} disabled={saveLoading}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-ocean-600 hover:bg-ocean-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors">
                <Save className="w-4 h-4" />
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default AdminRooms;