import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, LogOut, Check, Clock } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, Calendar, BedDouble, MessageSquare, CreditCard, UserCheck } from 'lucide-react';

const menuItems = [
  { path: '/staff', label: 'Overview', icon: Home },
  { path: '/staff/reservations', label: 'Reservations', icon: Calendar },
  { path: '/staff/checkinout', label: 'Check-In/Out', icon: UserCheck },
  { path: '/staff/room-status', label: 'Room Status', icon: BedDouble },
  { path: '/staff/requests', label: 'Guest Requests', icon: MessageSquare },
  { path: '/staff/payments', label: 'Payments', icon: CreditCard },
];

const initialCheckIns = [
  { id: 1, guestName: 'John Smith',   room: 'Oceanus Room',        time: '2:00 PM', status: 'pending' },
  { id: 2, guestName: 'Maria Garcia', room: 'Athena Room',         time: '3:30 PM', status: 'pending' },
  { id: 3, guestName: 'David Lee',    room: 'Ouranus Room',        time: '4:00 PM', status: 'done'    },
];

const initialCheckOuts = [
  { id: 1, guestName: 'Sarah Johnson', room: 'Cronus Room', time: '11:00 AM', status: 'pending' },
  { id: 2, guestName: 'Robert Chen',   room: 'Apollo Room',  time: '11:30 AM', status: 'done'    },
];

const StaffCheckInOut = () => {
  const [checkIns, setCheckIns]   = useState(initialCheckIns);
  const [checkOuts, setCheckOuts] = useState(initialCheckOuts);

  const markDone = (list, setList, id) => {
    setList(list.map(item => item.id === id ? { ...item, status: 'done' } : item));
  };

  const Card = ({ item, type, onMark }) => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
    >
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ${
          type === 'in' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {item.guestName.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{item.guestName}</p>
          <p className="text-sm text-gray-500">{item.room}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-400">{item.time}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {item.status === 'done' ? (
          <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
            <Check className="w-3 h-3" /> Done
          </span>
        ) : (
          <button
            onClick={() => onMark(item.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-colors ${
              type === 'in'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {type === 'in' ? 'Check In' : 'Check Out'}
          </button>
        )}
      </div>
    </motion.div>
  );

  const pendingIns  = checkIns.filter(c => c.status === 'pending').length;
  const pendingOuts = checkOuts.filter(c => c.status === 'pending').length;

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Check-In / Check-Out</h1>
        <p className="text-gray-500 text-sm mt-1">Process today's arrivals and departures</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check-Ins */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-display font-bold text-gray-900">Today's Check-Ins</h2>
            </div>
            {pendingIns > 0 && (
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {pendingIns} pending
              </span>
            )}
          </div>
          <div className="space-y-3">
            {checkIns.map(item => (
              <Card
                key={item.id}
                item={item}
                type="in"
                onMark={id => markDone(checkIns, setCheckIns, id)}
              />
            ))}
          </div>
        </div>

        {/* Check-Outs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-display font-bold text-gray-900">Today's Check-Outs</h2>
            </div>
            {pendingOuts > 0 && (
              <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                {pendingOuts} pending
              </span>
            )}
          </div>
          <div className="space-y-3">
            {checkOuts.map(item => (
              <Card
                key={item.id}
                item={item}
                type="out"
                onMark={id => markDone(checkOuts, setCheckOuts, id)}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffCheckInOut;