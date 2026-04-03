import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Hotel, Clock, Phone, Mail, MapPin } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { settingsAPI } from '../../services/api';
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

const defaultSettings = {
  resortName:   "O'ceano Con Vista Mountain Resort",
  email:        'oceanoconvista@gmail.com',
  phone:        '0926 113 4714',
  address:      'Purok 6, Barangay Aumbay, Island Garden City of Samal, Philippines, 8119',
  checkInTime:  '14:00',
  checkOutTime: '11:00',
  currency:     'PHP',
  taxRate:      '12',
};

const AdminSettings = () => {
  const [form,        setForm]        = useState(defaultSettings);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [error,       setError]       = useState(null);
  const [saveError,   setSaveError]   = useState(null);

  useEffect(() => {
    settingsAPI.get()
      .then(data => setForm(data.settings || defaultSettings))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
  }, []);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      await settingsAPI.update(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, fieldKey, type = 'text', icon: Icon }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        {loading
          ? <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
          : <input type={type} value={form[fieldKey] || ''} onChange={e => handleChange(fieldKey, e.target.value)}
              className={`w-full ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent`} />
        }
      </div>
    </div>
  );

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Resort configuration and preferences</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          Failed to load settings: {error}
        </div>
      )}

      <div className="max-w-2xl space-y-6">
        {/* Resort Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Hotel className="w-5 h-5 text-ocean-600" />
            <h2 className="text-base font-display font-bold text-gray-900">Resort Information</h2>
          </div>
          <div className="space-y-4">
            <Field label="Resort Name"    fieldKey="resortName" icon={Hotel} />
            <Field label="Email Address"  fieldKey="email"      type="email" icon={Mail}  />
            <Field label="Phone Number"   fieldKey="phone"      icon={Phone} />
            <Field label="Address"        fieldKey="address"    icon={MapPin} />
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
              {loading
                ? <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
                : <input type="time" value={form.checkInTime || ''} onChange={e => handleChange('checkInTime', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-Out Time</label>
              {loading
                ? <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
                : <input type="time" value={form.checkOutTime || ''} onChange={e => handleChange('checkOutTime', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
              {loading
                ? <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
                : <select value={form.currency || 'PHP'} onChange={e => handleChange('currency', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent">
                    <option value="PHP">PHP — Philippine Peso</option>
                    <option value="USD">USD — US Dollar</option>
                  </select>
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax Rate (%)</label>
              {loading
                ? <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
                : <input type="number" value={form.taxRate || ''} onChange={e => handleChange('taxRate', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
              }
            </div>
          </div>
        </motion.div>

        {saveError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            Failed to save: {saveError}
          </div>
        )}

        {/* Save Button */}
        <button onClick={handleSave} disabled={saving || loading}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all disabled:opacity-50 ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-ocean-600 hover:bg-ocean-700 text-white'
          }`}>
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Settings Saved! ✓' : 'Save Settings'}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;