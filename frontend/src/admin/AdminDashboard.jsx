import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { LoadingSpinner } from '../components/UI';
import { Link } from 'react-router-dom';

function StatCard({ icon, label, value, color, to }) {
  return (
    <Link to={to} className={`card p-6 border-l-4 ${color} hover:-translate-y-1 transition-all duration-200 group block`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className="font-display font-black text-4xl text-white">{value ?? '—'}</p>
        </div>
        <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform">{icon}</span>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = () => {
    setLoading(true);
    getDashboardStats()
      .then(r => setStats(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Festival Hub overview &amp; recent activity</p>
        </div>
        <button onClick={load} className="btn-secondary btn-sm text-sm">
          🔄 Refresh
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error   && <p className="text-red-400">⚠️ {error}</p>}

      {!loading && !error && stats && (
        <>
          {/* ── Stat cards ─────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard icon="🎭" label="Total Events"        value={stats.total_events}        color="border-primary-500" to="/admin/events" />
            <StatCard icon="🎟️" label="Total Bookings"     value={stats.total_bookings}      color="border-green-500"   to="/admin/tickets" />
            <StatCard icon="🍔" label="Vendors"            value={stats.total_vendors}       color="border-yellow-500"  to="/admin/vendors" />
            <StatCard icon="✉️" label="Messages"           value={stats.total_messages}      color="border-blue-500"    to="/admin/messages" />
            <StatCard icon="📢" label="Announcements"      value={stats.total_announcements} color="border-pink-500"    to="/admin/announcements" />
          </div>

          {/* ── Ticket summary ──────────────────────────── */}
          {stats.ticket_summary?.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {stats.ticket_summary.map(t => (
                <div key={t.ticket_type} className="card p-5 flex items-center gap-4">
                  <span className="text-3xl">{t.ticket_type === 'VIP' ? '⭐' : '🎟️'}</span>
                  <div>
                    <p className="text-gray-400 text-sm">{t.ticket_type} Tickets Sold</p>
                    <p className="font-display font-bold text-2xl text-white">{t.total_tickets}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Recent bookings ─────────────────────────── */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="p-5 border-b border-festival-border flex items-center justify-between">
                <h2 className="font-display font-bold text-white">Recent Bookings</h2>
                <Link to="/admin/tickets" className="text-primary-400 hover:text-primary-300 text-sm">View all →</Link>
              </div>
              <div className="divide-y divide-festival-border">
                {stats.recent_bookings?.length === 0 && (
                  <p className="p-5 text-gray-500 text-sm text-center">No bookings yet.</p>
                )}
                {stats.recent_bookings?.map((b, i) => (
                  <div key={i} className="p-4 flex items-center gap-3 hover:bg-festival-darker/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary-900/50 border border-primary-800/50 flex items-center justify-center text-primary-300 text-xs font-bold shrink-0">
                      {b.visitor_name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{b.visitor_name}</p>
                      <p className="text-gray-500 text-xs truncate">{b.event_title}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-primary-400 text-xs font-mono">{b.booking_ref}</p>
                      <p className="text-gray-600 text-xs">{b.ticket_type} × {b.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Upcoming events ──────────────────────── */}
            <div className="card">
              <div className="p-5 border-b border-festival-border flex items-center justify-between">
                <h2 className="font-display font-bold text-white">Upcoming Events</h2>
                <Link to="/admin/events" className="text-primary-400 hover:text-primary-300 text-sm">Manage →</Link>
              </div>
              <div className="divide-y divide-festival-border">
                {stats.upcoming_events?.length === 0 && (
                  <p className="p-5 text-gray-500 text-sm text-center">No upcoming events.</p>
                )}
                {stats.upcoming_events?.map(ev => (
                  <div key={ev.id} className="p-4 flex items-center gap-3 hover:bg-festival-darker/50 transition-colors">
                    <span className="text-2xl shrink-0">🎵</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{ev.title}</p>
                      <p className="text-gray-500 text-xs">{ev.stage} · {ev.start_time?.slice(0,5)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-300">{new Date(ev.event_date).toLocaleDateString('en-AU', { day:'numeric', month:'short' })}</p>
                      <p className={`text-xs ${ev.tickets_available < 30 ? 'text-red-400' : 'text-green-400'}`}>
                        {ev.tickets_available} left
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
