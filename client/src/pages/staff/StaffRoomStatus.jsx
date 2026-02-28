import { useState } from 'react';
import { motion } from 'framer-motion';
import { BedDouble, Users, CheckCircle, AlertCircle, Wrench } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, Calendar, UserCheck, MessageSquare, CreditCard } from 'lucide-react';

const menuItems = [
  { path: '/staff', label: 'Overview', icon: Home },
  { path: '/staff/reservations', label: 'Reservations', icon: Calendar },
  { path: '/staff/checkinout', label: 'Check-In/Out', icon: UserCheck },
  { path: '/staff/room-status', label: 'Room Status', icon: BedDouble },
  { path: '/staff/requests', label: 'Guest Requests', icon: MessageSquare },
  { path: '/staff/payments', label: 'Payments', icon: CreditCard },
];

const initialRooms = [
  { id: '1', name: 'Oceanus Room',        capacity: 2,  status: 'occupied',    guest: 'John Smith',    checkOut: '2026-03-03', notes: '' },
  { id: '2', name: 'Athena Room',         capacity: 4,  status: 'available',   guest: null,             checkOut: null,         notes: '' },
  { id: '3', name: 'Ouranus Room',        capacity: 10, status: 'occupied',    guest: 'David Lee',     checkOut: '2026-03-08', notes: '' },
  { id: '4', name: 'Apollo Room',         capacity: 4,  status: 'maintenance', guest: null,             checkOut: null,         notes: 'AC unit repair' },
  { id: '5', name: 'Cronos Room',         capacity: 10,  status: 'available',   guest: null,             checkOut: null,         notes: '' },
];

const statusConfig = {
  occupied:    { label: 'Occupied',    color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500',   icon: BedDouble  },
  available:   { label: 'Available',   color: 'bg-green-100 text-green-700', dot: 'bg-green-500',  icon: CheckCircle },
  maintenance: { label: 'Maintenance', color: 'bg-red-100 text-red-700',     dot: 'bg-red-500',    icon: Wrench     },
};

const StaffRoomStatus = () => {
  const [rooms, setRooms] = useState(initialRooms);
  const [editNotes, setEditNotes] = useState(null); // room id being edited

  const changeStatus = (id, newStatus) => {
    setRooms(rooms.map(r =>
      r.id === id ? { ...r, status: newStatus, guest: newStatus !== 'occupied' ? null : r.guest } : r
    ));
  };

  const saveNotes = (id, notes) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, notes } : r));
    setEditNotes(null);
  };

  const counts = {
    occupied:    rooms.filter(r => r.status === 'occupied').length,
    available:   rooms.filter(r => r.status === 'available').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
  };

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Room Status</h1>
        <p className="text-gray-500 text-sm mt-1">Live overview of all 5 rooms</p>
      </div>

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
              <p className="text-2xl font-display font-bold text-gray-900">{counts[key]}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {rooms.map((room, i) => {
          const cfg = statusConfig[room.status];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
            >
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

              {/* Guest Info */}
              {room.guest && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="text-blue-800 font-medium">{room.guest}</p>
                  {room.checkOut && (
                    <p className="text-blue-500 text-xs mt-0.5">Check-out: {room.checkOut}</p>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="mb-4">
                {editNotes === room.id ? (
                  <NoteEditor
                    initial={room.notes}
                    onSave={notes => saveNotes(room.id, notes)}
                    onCancel={() => setEditNotes(null)}
                  />
                ) : (
                  <button
                    onClick={() => setEditNotes(room.id)}
                    className="w-full text-left text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {room.notes ? `📝 ${room.notes}` : '+ Add notes'}
                  </button>
                )}
              </div>

              {/* Status Buttons */}
              <div className="flex gap-2">
                {['available', 'occupied', 'maintenance']
                  .filter(s => s !== room.status)
                  .map(s => (
                    <button
                      key={s}
                      onClick={() => changeStatus(room.id, s)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors ${
                        s === 'available'   ? 'border-green-300 text-green-700 hover:bg-green-50' :
                        s === 'occupied'    ? 'border-blue-300 text-blue-700 hover:bg-blue-50'    :
                                              'border-red-300 text-red-700 hover:bg-red-50'
                      }`}
                    >
                      Mark {s}
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

const NoteEditor = ({ initial, onSave, onCancel }) => {
  const [val, setVal] = useState(initial);
  return (
    <div>
      <input
        autoFocus
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="Add a note..."
        className="w-full text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-ocean-500 focus:border-transparent"
      />
      <div className="flex gap-2 mt-1.5">
        <button onClick={() => onSave(val)} className="text-xs text-ocean-600 font-medium hover:underline">Save</button>
        <button onClick={onCancel} className="text-xs text-gray-400 hover:underline">Cancel</button>
      </div>
    </div>
  );
};

export default StaffRoomStatus;