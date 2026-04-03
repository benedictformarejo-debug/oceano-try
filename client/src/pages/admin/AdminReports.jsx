import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, TrendingUp, Users, DollarSign, BedDouble } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { bookingsAPI } from '../../services/api';
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

// ── CSV helpers ────────────────────────────────────────────────────────────
const downloadCSV = (filename, headers, rows) => {
  const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.map(escape).join(','), ...rows.map(r => r.map(escape).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

// ── PDF helpers (opens print dialog with styled table) ─────────────────────
const downloadPDF = (title, headers, rows) => {
  const tableRows = rows.map(r =>
    `<tr>${r.map(c => `<td>${c ?? ''}</td>`).join('')}</tr>`
  ).join('');

  const html = `
    <html><head><title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
      h1   { font-size: 20px; margin-bottom: 4px; }
      p    { font-size: 12px; color: #666; margin-bottom: 16px; }
      table{ width: 100%; border-collapse: collapse; font-size: 12px; }
      th   { background: #f0f9ff; text-align: left; padding: 8px 10px; border-bottom: 2px solid #0ea5e9; }
      td   { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; }
      tr:nth-child(even) td { background: #f9fafb; }
    </style></head>
    <body>
      <h1>${title}</h1>
      <p>Generated on ${new Date().toLocaleDateString('en-PH', { dateStyle: 'long' })}</p>
      <table>
        <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body></html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
};

// ── Report data builders ───────────────────────────────────────────────────
const buildBookingsReport = (bookings) => ({
  headers: ['Booking ID', 'Guest', 'Email', 'Room', 'Check-In', 'Check-Out', 'Guests', 'Total (₱)', 'Payment Type', 'Status', 'Booked On'],
  rows: bookings.map(b => [
    b.id, b.fullName, b.email, b.roomName,
    b.checkIn, b.checkOut, b.guests,
    b.totalPrice, b.paymentType, b.status,
    b.createdAt?.split('T')[0],
  ]),
});

const buildRevenueReport = (bookings) => {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const map = {};
  bookings.filter(b => b.status !== 'cancelled').forEach(b => {
    const d = new Date(b.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const label = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    if (!map[key]) map[key] = { label, revenue: 0, count: 0 };
    map[key].revenue += b.totalPrice || 0;
    map[key].count   += 1;
  });
  return {
    headers: ['Month', 'Bookings', 'Revenue (₱)'],
    rows: Object.keys(map).sort().map(k => [map[k].label, map[k].count, map[k].revenue]),
  };
};

const buildGuestsReport = (bookings) => ({
  headers: ['Guest Name', 'Email', 'Phone', 'Room', 'Check-In', 'Check-Out', 'Guests', 'Status'],
  rows: bookings.map(b => [b.fullName, b.email, b.phone, b.roomName, b.checkIn, b.checkOut, b.guests, b.status]),
});

const buildOccupancyReport = (bookings) => {
  const map = {};
  bookings.filter(b => b.status !== 'cancelled').forEach(b => {
    const name = b.roomName || 'Unknown';
    if (!map[name]) map[name] = { total: 0, confirmed: 0 };
    map[name].total++;
    if (b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'checked-out') {
      map[name].confirmed++;
    }
  });
  return {
    headers: ['Room', 'Total Bookings', 'Confirmed', 'Occupancy Rate'],
    rows: Object.entries(map).map(([room, d]) => [
      room, d.total, d.confirmed,
      d.total > 0 ? `${Math.round((d.confirmed / d.total) * 100)}%` : '0%',
    ]),
  };
};

const AdminReports = () => {
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [exporting, setExporting] = useState(null);

  useEffect(() => {
    bookingsAPI.getAllBookings()
      .then(data => setBookings(data.bookings || []))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
  }, []);

  // ── Computed summary stats ─────────────────────────────────────────────
  const totalRevenue   = bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + (b.totalPrice || 0), 0);
  const totalGuests    = bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + (b.guests || 0), 0);
  const confirmedCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in' || b.status === 'checked-out').length;
  const occupancyRate  = bookings.length > 0 ? Math.round((confirmedCount / bookings.length) * 100) : 0;

  const summaryStats = [
    { label: 'Total Bookings (All Time)', value: bookings.length,                    icon: CalendarDays, color: 'text-blue-600',   bg: 'bg-blue-50'   },
    { label: 'Total Revenue (All Time)',  value: `₱${totalRevenue.toLocaleString()}`, icon: DollarSign,   color: 'text-green-600',  bg: 'bg-green-50'  },
    { label: 'Total Guests Served',       value: totalGuests,                         icon: Users,        color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg. Occupancy Rate',       value: `${occupancyRate}%`,                 icon: TrendingUp,   color: 'text-ocean-600',  bg: 'bg-ocean-50'  },
  ];

  const reportTypes = [
    { id: 'bookings',  label: 'Bookings Report',  desc: 'All reservations with status and payment info', icon: CalendarDays, build: buildBookingsReport  },
    { id: 'revenue',   label: 'Revenue Report',   desc: 'Monthly revenue breakdown by room',             icon: DollarSign,   build: buildRevenueReport   },
    { id: 'guests',    label: 'Guest Report',     desc: 'Guest list with stay history',                  icon: Users,        build: buildGuestsReport    },
    { id: 'occupancy', label: 'Occupancy Report', desc: 'Room occupancy rates over time',                icon: BedDouble,    build: buildOccupancyReport },
  ];

  const handleExport = (reportId, format, buildFn) => {
    const key = `${reportId}-${format}`;
    setExporting(key);

    try {
      const { headers, rows } = buildFn(bookings);
      const title = reportTypes.find(r => r.id === reportId)?.label || reportId;
      const filename = `${reportId}-report-${new Date().toISOString().split('T')[0]}`;

      if (format === 'CSV') downloadCSV(`${filename}.csv`, headers, rows);
      else                  downloadPDF(title, headers, rows);
    } catch (err) {
      alert('Export failed: ' + err.message);
    } finally {
      setTimeout(() => setExporting(null), 1000);
    }
  };

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Export and review resort performance data</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          Failed to load data: {error}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryStats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            {loading
              ? <div className="h-8 w-20 bg-gray-100 animate-pulse rounded-lg mb-1" />
              : <p className="text-2xl font-display font-bold text-gray-900">{value}</p>
            }
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportTypes.map(({ id, label, desc, icon: Icon, build }, i) => (
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
              {['CSV', 'PDF'].map(fmt => {
                const key = `${id}-${fmt}`;
                const busy = exporting === key;
                return (
                  <button key={fmt} onClick={() => handleExport(id, fmt, build)}
                    disabled={busy || loading}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                      busy || loading
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'border-ocean-600 text-ocean-600 hover:bg-ocean-50'
                    }`}>
                    <Download className="w-4 h-4" />
                    {busy ? 'Exporting…' : `Export ${fmt}`}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {!loading && bookings.length === 0 && (
        <p className="text-center text-xs text-gray-400 mt-6">
          📋 No booking data available yet — exports will populate once guests start booking.
        </p>
      )}
    </DashboardLayout>
  );
};

export default AdminReports;