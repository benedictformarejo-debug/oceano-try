import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, TrendingUp, Users, DollarSign, BedDouble } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, CalendarDays, Wallet, Settings } from 'lucide-react';

const menuItems = [
  { path: '/admin',              label: 'Overview',        icon: Home        },
  { path: '/admin/reservations', label: 'Reservations',    icon: CalendarDays},
  { path: '/admin/rooms',        label: 'Room Management', icon: BedDouble   },
  { path: '/admin/users',        label: 'User Management', icon: Users       },
  { path: '/admin/finance',      label: 'Finance',         icon: Wallet      },
  { path: '/admin/reports',      label: 'Reports',         icon: FileText    },
  { path: '/admin/settings',     label: 'Settings',        icon: Settings    },
];

// ── MOCK SUMMARY DATA — replace with API calls when backend is ready ──
const summaryStats = [
  { label: 'Total Bookings (All Time)', value: 6,        icon: CalendarDays, color: 'text-blue-600',   bg: 'bg-blue-50'   },
  { label: 'Total Revenue (All Time)',  value: '₱52,500',icon: DollarSign,   color: 'text-green-600',  bg: 'bg-green-50'  },
  { label: 'Total Guests Served',       value: 6,        icon: Users,        color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Avg. Occupancy Rate',       value: '60%',    icon: TrendingUp,   color: 'text-ocean-600',  bg: 'bg-ocean-50'  },
];

const reportTypes = [
  { id: 'bookings',  label: 'Bookings Report',  desc: 'All reservations with status and payment info', icon: CalendarDays },
  { id: 'revenue',   label: 'Revenue Report',   desc: 'Monthly revenue breakdown by room',             icon: DollarSign   },
  { id: 'guests',    label: 'Guest Report',     desc: 'Guest list with stay history',                  icon: Users        },
  { id: 'occupancy', label: 'Occupancy Report', desc: 'Room occupancy rates over time',                icon: BedDouble    },
];

const AdminReports = () => {
  const [exporting, setExporting] = useState(null);

  // ── When backend ready: call reportsAPI.export(type, format) ──
  const handleExport = (id, format) => {
    setExporting(`${id}-${format}`);
    setTimeout(() => setExporting(null), 1500); // simulate export
  };

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Export and review resort performance data</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryStats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-display font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportTypes.map(({ id, label, desc, icon: Icon }, i) => (
          <motion.div key={id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 bg-ocean-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-ocean-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-gray-900">{label}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {['CSV', 'PDF'].map(fmt => (
                <button key={fmt} onClick={() => handleExport(id, fmt)}
                  disabled={exporting === `${id}-${fmt}`}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    exporting === `${id}-${fmt}`
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'border-ocean-600 text-ocean-600 hover:bg-ocean-50'
                  }`}>
                  <Download className="w-4 h-4" />
                  {exporting === `${id}-${fmt}` ? 'Exporting...' : `Export ${fmt}`}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        📋 Export functionality will generate real data once connected to the backend
      </p>
    </DashboardLayout>
  );
};

export default AdminReports;