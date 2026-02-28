import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, CheckCheck, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, Calendar, UserCheck, BedDouble, CreditCard } from 'lucide-react';

const menuItems = [
  { path: '/staff', label: 'Overview', icon: Home },
  { path: '/staff/reservations', label: 'Reservations', icon: Calendar },
  { path: '/staff/checkinout', label: 'Check-In/Out', icon: UserCheck },
  { path: '/staff/room-status', label: 'Room Status', icon: BedDouble },
  { path: '/staff/requests', label: 'Guest Requests', icon: MessageSquare },
  { path: '/staff/payments', label: 'Payments', icon: CreditCard },
];

const initialRequests = [
  { id: 1, guest: 'John Smith',    room: 'Oceanus Room',        type: 'Housekeeping',   message: 'Please clean the room and replace towels.',   time: '9:15 AM',  priority: 'normal', status: 'pending'    },
  { id: 2, guest: 'David Lee',     room: 'Ouranus Room',        type: 'Room Service',   message: 'Can we get extra coffee and snacks please?',  time: '10:00 AM', priority: 'normal', status: 'in-progress'},
  { id: 3, guest: 'Sarah Johnson', room: 'Apollo Room',         type: 'Maintenance',    message: 'The shower faucet is leaking.',               time: '10:45 AM', priority: 'urgent', status: 'pending'    },
  { id: 4, guest: 'Maria Garcia',  room: 'Athena Room',         type: 'Extra Amenities',message: 'We need 2 extra pillows and a baby cot.',     time: '11:30 AM', priority: 'normal', status: 'resolved'   },
  { id: 5, guest: 'Robert Chen',   room: 'Cronos Room',         type: 'Housekeeping',   message: 'Room needs to be prepared for early check-in.',time: '12:00 PM', priority: 'urgent', status: 'pending'    },
];

const typeColors = {
  'Housekeeping':    'bg-purple-100 text-purple-700',
  'Room Service':    'bg-blue-100 text-blue-700',
  'Maintenance':     'bg-red-100 text-red-700',
  'Extra Amenities': 'bg-yellow-100 text-yellow-700',
};

const statusConfig = {
  pending:      { label: 'Pending',     color: 'bg-yellow-100 text-yellow-700', next: 'in-progress' },
  'in-progress':{ label: 'In Progress', color: 'bg-blue-100 text-blue-700',     next: 'resolved'    },
  resolved:     { label: 'Resolved',    color: 'bg-green-100 text-green-700',   next: null           },
};

const StaffGuestRequests = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter]     = useState('all');

  const advance = (id) => {
    setRequests(requests.map(r => {
      if (r.id !== id) return r;
      const next = statusConfig[r.status].next;
      return next ? { ...r, status: next } : r;
    }));
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const counts = {
    pending:      requests.filter(r => r.status === 'pending').length,
    'in-progress':requests.filter(r => r.status === 'in-progress').length,
    resolved:     requests.filter(r => r.status === 'resolved').length,
  };

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Guest Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and respond to guest needs</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { key: 'pending',      label: 'Pending',     icon: Clock,      color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { key: 'in-progress',  label: 'In Progress', icon: AlertCircle,color: 'text-blue-600',   bg: 'bg-blue-50'   },
          { key: 'resolved',     label: 'Resolved',    icon: CheckCheck, color: 'text-green-600',  bg: 'bg-green-50'  },
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

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['all', 'pending', 'in-progress', 'resolved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-ocean-600 text-white'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No requests found.</div>
        )}
        {filtered.map((req, i) => {
          const cfg = statusConfig[req.status];
          return (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-xl shadow-sm border p-5 ${
                req.priority === 'urgent' ? 'border-red-300' : 'border-gray-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[req.type] || 'bg-gray-100 text-gray-600'}`}>
                      {req.type}
                    </span>
                    {req.priority === 'urgent' && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        🚨 Urgent
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{req.time}</span>
                  </div>
                  <p className="font-semibold text-gray-900">{req.guest}</p>
                  <p className="text-xs text-gray-500 mb-2">{req.room}</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">{req.message}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  {cfg.next && (
                    <button
                      onClick={() => advance(req.id)}
                      className="px-3 py-1.5 bg-ocean-600 hover:bg-ocean-700 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      {req.status === 'pending' ? 'Start' : 'Resolve'}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default StaffGuestRequests;