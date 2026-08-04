import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { LoadingSpinner } from '../components/UI';
import { Link } from 'react-router-dom';

function StatCard({ icon, label, value, bgClass, textClass, to }) {
  return (
    <Link to={to} className={`card ${bgClass} border border-surface-border p-6 hover:-translate-y-1 transition-all duration-300 group block relative overflow-hidden`}>
      <div className="absolute right-0 top-0 p-6 opacity-10 text-6xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
        {icon}
      </div>
      <div className="relative z-10">
        <p className={`text-sm font-bold tracking-wider uppercase mb-2 ${textClass} opacity-80`}>{label}</p>
        <p className={`font-display font-black text-5xl ${textClass}`}>{value ?? '—'}</p>
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <p className="eyebrow mb-2">Welcome Back, Admin</p>
          <h1 className="font-display font-black text-4xl text-ink-primary">Dashboard Overview</h1>
        </div>
        <button onClick={load} className="btn-secondary btn-sm shrink-0 shadow-sm">
          🔄 Refresh Data
        </button>
      </div>

      {loading && <div className="py-20 flex justify-center"><LoadingSpinner /></div>}
      {error   && (
        <div className="bg-red-50 text-red-600 font-bold p-6 rounded-2xl border border-red-200">
          ⚠️ Failed to load dashboard: {error}
        </div>
      )}

      {!loading && !error && stats && (
        <>
          {/* ── Stat cards ─────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 xl:gap-6 mb-10">
            <StatCard icon="🎭" label="Events"        value={stats.total_events}        bgClass="bg-coral-50"   textClass="text-coral-700"  to="/admin/events" />
            <StatCard icon="🎟️" label="Bookings"      value={stats.total_bookings}      bgClass="bg-mint-50"    textClass="text-mint-700"   to="/admin/tickets" />
            <StatCard icon="🍔" label="Vendors"       value={stats.total_vendors}       bgClass="bg-gold-50"    textClass="text-gold-700"   to="/admin/vendors" />
            <StatCard icon="✉️" label="Messages"      value={stats.total_messages}      bgClass="bg-sky-50"     textClass="text-sky-700"    to="/admin/messages" />
            <StatCard icon="📢" label="Broadcasts"    value={stats.total_announcements} bgClass="bg-lavender-50" textClass="text-lavender-700" to="/admin/announcements" />
          </div>

          {/* ── Ticket summary ──────────────────────────── */}
          {stats.ticket_summary?.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 xl:gap-6 mb-10">
              {stats.ticket_summary.map(t => (
                <div key={t.ticket_type} className="card p-6 flex items-center gap-5 border border-surface-border">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner ${t.ticket_type === 'VIP' ? 'bg-gold-100 text-gold-600' : 'bg-surface-2 text-ink-secondary'}`}>
                    {t.ticket_type === 'VIP' ? '⭐' : '🎟️'}
                  </div>
                  <div>
                    <p className="text-ink-tertiary text-sm font-bold uppercase tracking-wider mb-1">{t.ticket_type} Tickets Sold</p>
                    <p className="font-display font-black text-3xl text-ink-primary">{t.total_tickets}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Recent Activity ─────────────────────────── */}
          <div className="grid lg:grid-cols-2 gap-6 xl:gap-10">
            {/* Recent Bookings */}
            <div className="card border border-surface-border flex flex-col">
              <div className="p-6 border-b border-surface-border flex items-center justify-between bg-surface-0">
                <h2 className="font-display font-bold text-xl text-ink-primary">Recent Bookings</h2>
                <Link to="/admin/tickets" className="text-coral-500 font-bold hover:text-coral-600 text-sm">View all →</Link>
              </div>
              <div className="divide-y divide-surface-border flex-1">
                {stats.recent_bookings?.length === 0 && (
                  <div className="p-10 text-center text-ink-tertiary font-medium">No bookings yet.</div>
                )}
                {stats.recent_bookings?.map((b, i) => (
                  <div key={i} className="p-5 flex items-center gap-4 hover:bg-surface-0 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-surface-2 border border-surface-border flex items-center justify-center text-ink-primary font-display font-bold text-lg shrink-0">
                      {b.visitor_name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-ink-primary text-sm font-bold truncate">{b.visitor_name}</p>
                      <p className="text-ink-secondary text-xs font-medium truncate mt-0.5">{b.event_title}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="ref-code mb-1">{b.booking_ref}</p>
                      <span className={`badge ${b.ticket_type === 'VIP' ? 'badge-gold' : 'badge-default'}`}>
                        {b.ticket_type} × {b.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="card border border-surface-border flex flex-col">
              <div className="p-6 border-b border-surface-border flex items-center justify-between bg-surface-0">
                <h2 className="font-display font-bold text-xl text-ink-primary">Upcoming Events</h2>
                <Link to="/admin/events" className="text-coral-500 font-bold hover:text-coral-600 text-sm">Manage →</Link>
              </div>
              <div className="divide-y divide-surface-border flex-1">
                {stats.upcoming_events?.length === 0 && (
                  <div className="p-10 text-center text-ink-tertiary font-medium">No upcoming events.</div>
                )}
                {stats.upcoming_events?.map(ev => (
                  <div key={ev.id} className="p-5 flex items-center gap-4 hover:bg-surface-0 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-coral-50 border border-coral-100 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-coral-500 uppercase">{new Date(ev.event_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-lg font-black text-coral-700 leading-none">{new Date(ev.event_date).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-ink-primary text-sm font-bold truncate">{ev.title}</p>
                      <p className="text-ink-secondary text-xs font-medium mt-1">📍 {ev.stage} · 🕒 {ev.start_time?.slice(0,5)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="mb-1 text-xs font-bold text-ink-tertiary uppercase">Available</div>
                      <span className={`chip ${ev.tickets_available < 30 ? 'chip-warning' : 'chip-success'}`}>
                        {ev.tickets_available}
                      </span>
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
