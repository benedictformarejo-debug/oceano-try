import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Hotel, Clock, Phone, Mail, MapPin } from 'lucide-react';
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

// ── MOCK SETTINGS — replace with API call when backend is ready ──
// e.g. useEffect(() => { settingsAPI.get().then(setForm) }, [])
const initialSettings = {
  resortName:   'Oceano Convista',
  email:        'info@oceanoconvista.com',
  phone:        '+63 912 345 6789',
  address:      'Brgy. Somewhere, Davao del Norte, Philippines',
  checkInTime:  '14:00',
  checkOutTime: '11:00',
  currency:     'PHP',
  taxRate:      '12',
};

const AdminSettings = () => {
  const [form, setForm]       = useState(initialSettings);
  const [saved, setSaved]     = useState(false);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  // ── When backend ready: call settingsAPI.update(form) ──
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Field = ({ label, fieldKey, type = 'text', icon: Icon }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        <input type={type} value={form[fieldKey]} onChange={e => handleChange(fieldKey, e.target.value)}
          className={`w-full ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent`} />
      </div>
    </div>
  );

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Resort configuration and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Resort Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Hotel className="w-5 h-5 text-ocean-600" />
            <h2 className="text-base font-display font-bold text-gray-900">Resort Information</h2>
          </div>
          <div className="space-y-4">
            <Field label="Resort Name" fieldKey="resortName" icon={Hotel} />
            <Field label="Email Address" fieldKey="email" type="email" icon={Mail} />
            <Field label="Phone Number" fieldKey="phone" icon={Phone} />
            <Field label="Address" fieldKey="address" icon={MapPin} />
          </div>
        </motion.div>

        {/* Booking Settings */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5 text-ocean-600" />
            <h2 className="text-base font-display font-bold text-gray-900">Booking Settings</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-In Time</label>
              <input type="time" value={form.checkInTime} onChange={e => handleChange('checkInTime', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-Out Time</label>
              <input type="time" value={form.checkOutTime} onChange={e => handleChange('checkOutTime', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
              <select value={form.currency} onChange={e => handleChange('currency', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent">
                <option value="PHP">PHP — Philippine Peso</option>
                <option value="USD">USD — US Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax Rate (%)</label>
              <input type="number" value={form.taxRate} onChange={e => handleChange('taxRate', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <button onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-ocean-600 hover:bg-ocean-700 text-white'
          }`}>
          <Save className="w-4 h-4" />
          {saved ? 'Settings Saved!' : 'Save Settings'}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;