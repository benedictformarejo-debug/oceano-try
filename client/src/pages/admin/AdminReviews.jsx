import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2, Search } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { reviewsAPI } from '../../services/api';
import { Home, CalendarDays, BedDouble, Users, Wallet, FileText, Settings } from 'lucide-react';

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

const StarDisplay = ({ value }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s} className={`w-4 h-4 ${s <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
    ))}
  </div>
);

const AdminReviews = () => {
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    reviewsAPI.getAll()
      .then(data => setReviews(data.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    try {
      setDeleting(id);
      await reviewsAPI.delete(id);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = reviews.filter(r => {
    const q = search.toLowerCase();
    const matchSearch =
      (r.guest_name || '').toLowerCase().includes(q) ||
      (r.room_name  || '').toLowerCase().includes(q) ||
      (r.comment    || '').toLowerCase().includes(q);
    const matchFilter = filter === 'all' || String(r.rating) === filter;
    return matchSearch && matchFilter;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <DashboardLayout dashboardMenuItems={menuItems}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Guest Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all guest reviews</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 rounded-xl p-4 flex items-center gap-3">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          <div>
            <p className="text-2xl font-display font-bold text-gray-900">{avgRating}</p>
            <p className="text-xs text-gray-500">Avg Rating</p>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
          <Star className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-2xl font-display font-bold text-gray-900">{loading ? '—' : reviews.length}</p>
            <p className="text-xs text-gray-500">Total Reviews</p>
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
          <Star className="w-6 h-6 text-green-500 fill-green-500" />
          <div>
            <p className="text-2xl font-display font-bold text-gray-900">
              {loading ? '—' : reviews.filter(r => r.rating >= 4).length}
            </p>
            <p className="text-xs text-gray-500">Positive (4-5★)</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by guest, room, or comment..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-ocean-500 focus:border-transparent" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all','5','4','3','2','1'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-ocean-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}>
              {f === 'all' ? 'All' : `${f}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse space-y-3">
              <div className="h-4 bg-gray-100 rounded w-1/4" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-10 bg-gray-100 rounded" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-400">
            {reviews.length === 0 ? 'No reviews yet.' : 'No results match your search.'}
          </div>
        ) : filtered.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <p className="font-semibold text-gray-900">{r.guest_name || 'Guest'}</p>
                  <StarDisplay value={r.rating} />
                  <span className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-ocean-600 font-medium mb-2">{r.room_name}</p>
                {r.comment
                  ? <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                  : <p className="text-xs text-gray-400 italic">No written review.</p>
                }
              </div>
              <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id}
                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-4">
          Showing {filtered.length} of {reviews.length} reviews
        </p>
      )}
    </DashboardLayout>
  );
};

export default AdminReviews;