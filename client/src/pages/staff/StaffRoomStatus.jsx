import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BedDouble, Users, CheckCircle, Wrench } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { roomsAPI, bookingsAPI } from '../../services/api';
import { Home, Calendar, UserCheck, MessageSquare, CreditCard } from 'lucide-react';

const menuItems = [
  { path: '/staff',              label: 'Overview',      icon: Home          },
  { path: '/staff/reservations', label: 'Reservations',  icon: Calendar      },
  { path: '/staff/checkinout',   label: 'Check-In/Out',  icon: UserCheck     },
  { path: '/staff/room-status',  label: 'Room Status',   icon: BedDouble     },
  { path: '/staff/requests',     label: 'Guest Requests',icon: MessageSquare },
  { path: '/staff/payments',     label: 'Payments',      icon: CreditCard    },
];

const statusConfig = {
  occupied:    { label: 'Occupied',    color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500',   icon: BedDouble   },
  available:   { label: 'Available',   color: 'bg-green-100 text-green-700', dot: 'bg-green-500',  icon: CheckCircle },
  maintenance: { label: 'Maintenance', color: 'bg-red-100 text-red-700',     dot: 'bg-red-500',    icon: Wrench      },
};

const NoteEditor = ({ initial, onSave, onCancel }) => {
  const [val, setVal] = useState(initial);
  return (
    <div>
      <input autoFocus value={val} onChange={e => setVal(e.target.value)}
        placeholder="Add a note..."
        className="w-full text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-ocean-500 focus:border-transparent" />
      <div className="flex gap-2 mt-1.5">
        <button onClick={() => onSave(val)} className="text-xs text-ocean-600 font-medium hover:underline">Save</button>
        <button onClick={onCancel}          className="text-xs text-gray-400 hover:underline">Cancel</button>
      </div>
    </div>
  );
};

const StaffRoomStatus = () => {
  const [rooms,      setRooms]      = useState([]);
  const [bookings,   setBookings]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [editNotes,  setEditNotes]  = useState(null);
  const [updating,   setUpdating]   = useState(null);

  useEffect(() => {
    Promise.all([roomsAPI.getAll(), bookingsAPI.getAllBookings()])
      .then(([rData, bData]) => {
        setRooms(rData.rooms   || []);
        setBookings(bData.bookings || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // Find active guest for a room (checked-in booking today or ongoing)
  const getActiveGuest = (roomId) => {
    return bookings.find(b =>
      b.roomId === roomId &&
      b.status === 'checked-in' &&
      b.checkIn <= todayStr &&
      b.checkOut >= todayStr
    );
  };

  const changeStatus = async (id, newStatus) => {
    try {
      setUpdating(id);
      await roomsAPI.update(id, { status: newStatus });
      setRooms(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const saveNotes = async (id, notes) => {
    try {
      await roomsAPI.update(id, { notes });
      setRooms(prev => prev.map(r => r.id === id ? { ...r, notes } : r));
      setEditNotes(null);
    } catch (err) {
      alert('Failed to save notes: ' + err.message);
    }
  };

  const counts = {
    occupied:    rooms.filter(r => r.status === 'occupied').length,
    available:   rooms.filter(r => r.status === 'available').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
  };

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-display font-bold text-gray-900">Room Status</h1>
        <p className="text-gray-500 text-sm mt-1">Live overview of all resort rooms</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          Failed to load rooms: {error}
        </div>
      )}

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { key: 'occupied',    label: 'Occupied',    icon: BedDouble,   color: 'text-blue-600',  bg: 'bg-blue-50'  },
          { key: 'available',   label: 'Available',   icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { key: 'maintenance', label: 'Maintenance', icon: Wrench,      color: 'text-red-600',   bg: 'bg-red-50'   },
        ].map(({ key, label, icon: Icon, color, bg }) => (
          <div key={key} className={`${bg} rounded-xl p-4 flex items-center gap-3`}>
            <Icon className={`w-6 h-6 ${color}`} />
            <div>
              {loading
                ? <div className="h-7 w-6 bg-white/60 animate-pulse rounded mb-1" />
                : <p className="text-2xl font-display font-bold text-gray-900">{counts[key]}</p>
              }
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-3">
              <div className="h-5 bg-gray-100 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
              <div className="h-9 bg-gray-100 animate-pulse rounded-lg mt-4" />
            </div>
          ))
        ) : rooms.map((room, i) => {
          const cfg         = statusConfig[room.status] || statusConfig.available;
          const Icon        = cfg.icon;
          const activeGuest = getActiveGuest(room.id);
          const isBusy      = updating === room.id;

          return (
            <motion.div key={room.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-gray-900">{room.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-400">Up to {room.capacity} guests</span>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>

              {/* Active Guest from real bookings */}
              {activeGuest ? (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="text-blue-800 font-medium">{activeGuest.fullName || '—'}</p>
                  <p className="text-blue-500 text-xs mt-0.5">Check-out: {activeGuest.checkOut}</p>
                </div>
              ) : room.status === 'occupied' ? (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="text-blue-500 text-xs">Guest info unavailable</p>
                </div>
              ) : null}

              {/* Notes */}
              <div className="mb-4">
                {editNotes === room.id ? (
                  <NoteEditor
                    initial={room.notes || ''}
                    onSave={notes => saveNotes(room.id, notes)}
                    onCancel={() => setEditNotes(null)}
                  />
                ) : (
                  <button onClick={() => setEditNotes(room.id)}
                    className="w-full text-left text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    {room.notes ? `📝 ${room.notes}` : '+ Add notes'}
                  </button>
                )}
              </div>

              {/* Status Buttons */}
              <div className="flex gap-2">
                {['available', 'occupied', 'maintenance']
                  .filter(s => s !== room.status)
                  .map(s => (
                    <button key={s} onClick={() => changeStatus(room.id, s)} disabled={isBusy}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors disabled:opacity-50 ${
                        s === 'available'   ? 'border-green-300 text-green-700 hover:bg-green-50' :
                        s === 'occupied'    ? 'border-blue-300 text-blue-700 hover:bg-blue-50'    :
                                              'border-red-300 text-red-700 hover:bg-red-50'
                      }`}>
                      {isBusy ? '...' : `Mark ${s}`}
                    </button>
                  ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default StaffRoomStatus;