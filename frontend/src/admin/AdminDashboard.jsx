import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { LoadingSpinner } from '../components/UI';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Ticket,
  Store,
  MessageSquare,
  Megaphone,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  RefreshCw,
  Plus,
  Star,
  Users,
  DollarSign
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function StatCard({ icon: Icon, label, value, trend, bgClass, textClass, iconBgClass, to }) {
  return (
    <motion.div variants={itemVariants}>
      <Link to={to} className={`card ${bgClass} border border-white/60 p-6 relative overflow-hidden group block hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full`}>
        {/* Background glow/blob */}
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/40 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBgClass} ${textClass} shadow-inner backdrop-blur-sm border border-white/50`}>
            <Icon size={28} strokeWidth={2.5} />
          </div>
          {trend && (
            <span className="flex items-center gap-1 text-xs font-bold text-mint-700 bg-mint-50/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-mint-200 shadow-sm">
              <TrendingUp size={14} /> {trend}
            </span>
          )}
        </div>
        
        <div className="relative z-10">
          <p className="font-display font-black text-4xl text-ink-primary mb-1">{value ?? '—'}</p>
          <p className={`text-sm font-bold tracking-wide uppercase ${textClass}`}>{label}</p>
        </div>
      </Link>
    </motion.div>
  );
}

function generatePieChartGradient(sources) {
  if (!sources || sources.length === 0) return 'conic-gradient(#e5e7eb 0% 100%)';
  const total = sources.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return 'conic-gradient(#e5e7eb 0% 100%)';
  
  let cumulativePercent = 0;
  const gradientParts = sources.map(source => {
    const percent = (source.value / total) * 100;
    const start = cumulativePercent;
    const end = cumulativePercent + percent;
    cumulativePercent += percent;
    return `${source.color} ${start}% ${end}%`;
  });
  return `conic-gradient(${gradientParts.join(', ')})`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    getDashboardStats()
      .then(r => setStats(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Compute total tickets for the visualizer
  const totalTicketsSold = stats?.ticket_summary?.reduce((sum, t) => sum + Number(t.total_tickets), 0) || 0;

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="pb-10">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <p className="eyebrow mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mint-500 animate-pulse"></span>
            Live Overview
          </p>
          <h1 className="font-display font-black text-4xl text-ink-primary">Welcome Back, Admin</h1>
          <p className="text-ink-secondary mt-1 font-medium">Here's what's happening at FestivalHub today.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/admin/events" className="btn-primary btn-sm shadow-sm group">
            <Plus size={16} className="group-hover:rotate-90 transition-transform" /> New Event
          </Link>
          <button onClick={load} className="btn-secondary btn-sm shadow-sm group">
            <RefreshCw size={16} className={`text-ink-tertiary group-hover:text-ink-primary ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {loading && <div className="py-32 flex justify-center"><LoadingSpinner /></div>}
      
      {error && (
        <div className="bg-red-50 text-red-600 font-bold p-6 rounded-2xl border border-red-200 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">⚠️</div>
          <div>
            <p className="text-lg">Failed to load dashboard</p>
            <p className="text-sm font-medium mt-1 opacity-80">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && stats && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          
          {/* ── At a Glance Metrics ─────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 xl:gap-6 mb-8">
            <StatCard icon={DollarSign}   label="Revenue"    value={formatCurrency(stats.revenue?.total || 0)} bgClass="bg-gradient-to-br from-brand-50 to-brand-100" textClass="text-brand-700" iconBgClass="bg-white/60" trend="+8%" to="/admin/tickets" />
            <StatCard icon={CalendarDays} label="Events"     value={stats.total_events}        bgClass="bg-gradient-to-br from-coral-50 to-orange-50" textClass="text-coral-700" iconBgClass="bg-white/60" trend="+2" to="/admin/events" />
            <StatCard icon={Ticket}       label="Bookings"   value={stats.total_bookings}      bgClass="bg-gradient-to-br from-mint-50 to-emerald-50" textClass="text-mint-700" iconBgClass="bg-white/60" trend="+12%" to="/admin/tickets" />
            <StatCard icon={Store}        label="Vendors"    value={stats.total_vendors}       bgClass="bg-gradient-to-br from-gold-50 to-yellow-50"  textClass="text-gold-700" iconBgClass="bg-white/60" to="/admin/vendors" />
            <StatCard icon={MessageSquare}label="Messages"   value={stats.total_messages}      bgClass="bg-gradient-to-br from-sky-50 to-blue-50"     textClass="text-sky-700" iconBgClass="bg-white/60" trend="New" to="/admin/messages" />
            <StatCard icon={Megaphone}    label="Broadcasts" value={stats.total_announcements} bgClass="bg-gradient-to-br from-lavender-50 to-purple-50" textClass="text-lavender-700" iconBgClass="bg-white/60" to="/admin/announcements" />
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8 mb-8">
            
            {/* ── Analytics: Sales & Revenue (Combined) ────────────── */}
            <motion.div variants={itemVariants} className="card border border-surface-border lg:col-span-2 flex flex-col bg-gradient-to-b from-surface-0 to-surface-1 overflow-hidden">
              <div className="p-6 lg:px-8 border-b border-surface-border flex items-center justify-between bg-surface-0">
                <div>
                  <h2 className="font-display font-bold text-xl text-ink-primary">Sales & Revenue</h2>
                  <p className="text-sm font-medium text-ink-secondary mt-1">Ticket distribution and financial breakdown</p>
                </div>
                <Link to="/admin/tickets" className="btn-secondary btn-sm group shrink-0 hidden sm:flex">
                  View Transactions <ArrowRight size={16} className="text-ink-tertiary group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="flex flex-col md:flex-row flex-1">
                
                {/* Left Side: Revenue Pie Chart */}
                <div className="p-6 lg:p-8 flex-1 border-b md:border-b-0 md:border-r border-surface-border flex flex-col items-center justify-center">
                  {(!stats.revenue?.sources || stats.revenue.sources.length === 0) ? (
                      <div className="py-10 text-center text-ink-tertiary font-medium">No revenue data.</div>
                  ) : (
                    <div className="flex flex-col items-center w-full max-w-xs">
                      {/* CSS Pie Chart */}
                      <div 
                        className="w-48 h-48 rounded-full mb-8 shadow-inner relative flex items-center justify-center transform transition-transform hover:scale-105 duration-300"
                        style={{ background: generatePieChartGradient(stats.revenue.sources) }}
                      >
                        <div className="w-32 h-32 bg-surface-0 rounded-full shadow-soft flex flex-col items-center justify-center z-10">
                            <span className="text-ink-tertiary text-xs font-bold uppercase tracking-wider mb-0.5">Total Revenue</span>
                            <span className="font-display font-black text-xl text-ink-primary">{formatCurrency(stats.revenue.total)}</span>
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="w-full space-y-3 px-2">
                        {stats.revenue.sources.map((source, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm font-bold">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: source.color }}></span>
                              <span className="text-ink-secondary">{source.name}</span>
                            </div>
                            <span className="text-ink-primary">{formatCurrency(source.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Ticket Sales Progress Bars */}
                <div className="p-6 lg:p-8 flex-1 flex flex-col justify-center bg-surface-0/50">
                  {stats.ticket_summary?.length === 0 ? (
                      <div className="py-10 text-center text-ink-tertiary font-medium">No tickets sold yet.</div>
                  ) : (
                    <div className="space-y-8 w-full max-w-sm mx-auto">
                      {/* Total prominent display */}
                      <div className="flex items-end gap-3 pb-6 border-b border-surface-border">
                        <span className="font-display font-black text-6xl text-ink-primary leading-none tracking-tight">{totalTicketsSold}</span>
                        <span className="text-ink-secondary font-bold uppercase text-sm mb-1.5">Total Sold</span>
                      </div>

                      {/* Progress Bars */}
                      <div className="space-y-6">
                        {stats.ticket_summary.map(t => {
                          const percentage = totalTicketsSold > 0 ? Math.round((t.total_tickets / totalTicketsSold) * 100) : 0;
                          const isVIP = t.ticket_type === 'VIP';
                          return (
                            <div key={t.ticket_type}>
                              <div className="flex justify-between text-sm font-bold mb-2.5">
                                <span className="flex items-center gap-2">
                                  {isVIP ? <Star size={16} className="text-gold-500 fill-gold-500" /> : <Ticket size={16} className="text-brand-500" />}
                                  <span className="text-ink-primary">{t.ticket_type} Tickets</span>
                                </span>
                                <span>{t.total_tickets} <span className="text-ink-tertiary font-normal">({percentage}%)</span></span>
                              </div>
                              <div className="h-3.5 w-full bg-surface-2 rounded-full overflow-hidden shadow-inner">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                  className={`h-full rounded-full shadow-sm ${isVIP ? 'bg-gradient-to-r from-gold-400 to-gold-500' : 'bg-gradient-to-r from-brand-400 to-brand-500'}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ── Operations: Upcoming Events ───────────────────── */}
            <motion.div variants={itemVariants} className="card border border-surface-border flex flex-col lg:col-span-2 xl:col-span-2">
              <div className="p-6 lg:px-8 border-b border-surface-border flex items-center justify-between bg-surface-0">
                <div>
                  <h2 className="font-display font-bold text-xl text-ink-primary">Upcoming Events</h2>
                  <p className="text-sm text-ink-secondary mt-1 font-medium">Next 7 days schedule</p>
                </div>
                <Link to="/admin/events" className="text-brand-500 font-bold hover:text-brand-600 text-sm flex items-center gap-1">Manage <ArrowRight size={16}/></Link>
              </div>
              
              <div className="divide-y divide-surface-border flex-1 bg-surface-0">
                {stats.upcoming_events?.length === 0 && (
                  <div className="p-16 text-center text-ink-tertiary font-medium flex flex-col items-center">
                    <CalendarDays size={48} className="opacity-20 mb-4" />
                    No upcoming events scheduled.
                  </div>
                )}
                
                {stats.upcoming_events?.map(ev => {
                  const isLowCapacity = ev.tickets_available < 30;
                  const date = new Date(ev.event_date);
                  return (
                    <div key={ev.id} className="p-6 lg:px-8 flex flex-col sm:flex-row sm:items-center gap-5 hover:bg-surface-1/50 transition-colors group">
                      
                      {/* Date Badge */}
                      <div className="w-16 h-16 rounded-2xl bg-coral-50 border border-coral-100 flex flex-col items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <span className="text-xs font-bold text-coral-500 uppercase tracking-widest">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-2xl font-black text-coral-700 leading-none mt-0.5">{date.getDate()}</span>
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-ink-primary text-lg font-bold truncate mb-1">{ev.title}</p>
                        <div className="flex flex-wrap items-center gap-3 text-ink-secondary text-sm font-medium">
                          <span className="flex items-center gap-1"><MapPin size={14} /> {ev.stage}</span>
                          <span className="text-ink-tertiary">•</span>
                          <span className="flex items-center gap-1"><Clock size={14} /> {ev.start_time?.slice(0,5)}</span>
                        </div>
                      </div>
                      
                      {/* Capacity */}
                      <div className="sm:text-right shrink-0 mt-2 sm:mt-0">
                        <div className="mb-1.5 text-xs font-bold text-ink-tertiary uppercase tracking-wider">Tickets Left</div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border shadow-sm ${
                          isLowCapacity ? 'bg-red-50 text-red-600 border-red-100' : 'bg-mint-50 text-mint-700 border-mint-100'
                        }`}>
                          {isLowCapacity ? 'Hurry!' : 'Available'} 
                          <span className={isLowCapacity ? 'text-red-700' : 'text-mint-800'}>{ev.tickets_available}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* ── Activity: Recent Bookings ───────────────────────── */}
          <motion.div variants={itemVariants} className="card border border-surface-border flex flex-col">
            <div className="p-6 lg:px-8 border-b border-surface-border flex items-center justify-between bg-surface-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Users size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-ink-primary">Recent Bookings</h2>
                  <p className="text-sm text-ink-secondary mt-1 font-medium">Latest ticket transactions</p>
                </div>
              </div>
              <Link to="/admin/tickets" className="btn-secondary btn-sm">View all</Link>
            </div>
            
            <div className="flex-1 overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface-1 border-b border-surface-border text-ink-tertiary font-bold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 lg:px-8 py-4 rounded-tl-3xl">Visitor</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Ref Code</th>
                    <th className="px-6 py-4 text-right rounded-tr-3xl">Ticket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {stats.recent_bookings?.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-ink-tertiary font-medium">No bookings yet.</td>
                    </tr>
                  )}
                  {stats.recent_bookings?.map((b, i) => (
                    <tr key={i} className="hover:bg-surface-0 transition-colors">
                      <td className="px-6 lg:px-8 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-surface-2 to-surface-border border border-surface-border flex items-center justify-center text-ink-primary font-display font-bold text-sm shrink-0">
                            {b.visitor_name?.charAt(0)}
                          </div>
                          <span className="font-bold text-ink-primary">{b.visitor_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-ink-secondary">{b.event_title}</td>
                      <td className="px-6 py-4"><span className="ref-code">{b.booking_ref}</span></td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className={`badge ${b.ticket_type === 'VIP' ? 'badge-gold' : 'badge-mint'}`}>
                          {b.ticket_type} <span className="opacity-50 mx-1">×</span> {b.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </motion.div>
      )}
    </div>
  );
}
