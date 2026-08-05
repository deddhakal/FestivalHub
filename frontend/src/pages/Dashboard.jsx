import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getVendors, getAnnouncements } from '../services/api';
import { LoadingSpinner } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Coffee, ShoppingBag, Map, MapPin, Calendar, Clock, Ticket, TrendingUp, Activity, Award, ChevronRight, Zap, Bell, Users, Music } from 'lucide-react';

/* ── Helpers ──────────────────────────────────────────────────── */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatTime(t) {
  return t?.slice(0, 5) ?? '—';
}

function formatTimeSince(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const CATEGORY_BADGE = {
  Electronic: 'bg-lavender-500/10 text-lavender-500 border-lavender-200', Pop: 'bg-coral-500/10 text-coral-500 border-coral-200',
  Rock:       'bg-gold-500/10 text-gold-500 border-gold-200',     Jazz: 'bg-sky-500/10 text-sky-500 border-sky-200',
  Reggae:     'bg-mint-500/10 text-mint-500 border-mint-200',     Dance: 'bg-lavender-500/10 text-lavender-500 border-lavender-200',
  Acoustic:   'bg-gold-500/10 text-gold-500 border-gold-200',     Family: 'bg-sky-500/10 text-sky-500 border-sky-200',
  Ceremony:   'bg-coral-500/10 text-coral-500 border-coral-200',    Wellness: 'bg-mint-500/10 text-mint-500 border-mint-200',
};

const CATEGORY_IMAGES = {
  Electronic: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
  Pop:        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80',
  Rock:       'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80',
  Jazz:       'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80',
  Reggae:     'https://images.unsplash.com/photo-1440407876336-54a8b792bfe8?w=600&q=80',
  Dance:      'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80',
  Acoustic:   'https://images.unsplash.com/photo-1510915361894-faa8b2d15328?w=600&q=80',
  Family:     'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&q=80',
  Ceremony:   'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
  Wellness:   'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
};

const DEFAULT_EVENT_IMAGE = 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80';

const ANNOUNCEMENT_STYLES = {
  warning: { bar: 'bg-gold-500',  text: 'text-gold-500', icon: 'bg-gold-500/20 text-gold-500', label: 'Warning' },
  alert:   { bar: 'bg-coral-500',    text: 'text-coral-500',   icon: 'bg-coral-500/20 text-coral-500', label: 'Alert' },
  info:    { bar: 'bg-sky-500',   text: 'text-sky-500',  icon: 'bg-sky-500/20 text-sky-500', label: 'Info' },
  success: { bar: 'bg-mint-500',  text: 'text-mint-500', icon: 'bg-mint-500/20 text-mint-500', label: 'Update' },
};

/* ── Event card ──────────────────────────────────────────────── */
function EventCard({ event, index }) {
  const low  = event.tickets_available < 30;
  const sold = event.tickets_available === 0;
  const badgeClass = CATEGORY_BADGE[event.category] || 'bg-surface-200 text-ink-secondary border-surface-border';
  
  const imageUrl = event.image_url || CATEGORY_IMAGES[event.category] || DEFAULT_EVENT_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      className="group relative h-full flex"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-coral-500 to-brand-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
      <Link
        to={`/events/${event.id}`}
        className="relative flex flex-col w-full h-full bg-surface-1 rounded-3xl border border-surface-border overflow-hidden transition-all duration-500 hover:shadow-2xl"
      >
        <div className="h-56 w-full shrink-0 relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl p-2 text-center shadow-lg">
              <div className="text-xs font-medium uppercase tracking-wider opacity-80">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}</div>
              <div className="text-xl font-bold leading-none">{new Date(event.event_date).getDate()}</div>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${badgeClass}`}>
              {event.category}
            </span>
            {sold ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-coral-500 text-white shadow-sm backdrop-blur-md">Sold Out</span>
            ) : low ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-500 text-ink-primary shadow-sm backdrop-blur-md">Few Left</span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white border border-white/20 shadow-sm backdrop-blur-md flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5" />
                {event.tickets_available}
              </span>
            )}
          </div>
        </div>
        
        <div className="p-6 flex flex-col gap-4 flex-1 bg-surface-1 group-hover:bg-surface-2/50 transition-colors">
          <h3 className="font-display text-xl md:text-2xl text-ink-primary font-bold leading-tight group-hover:text-brand-600 transition-colors duration-300 line-clamp-2">
            {event.title}
          </h3>

          <div className="flex flex-col gap-3 mt-auto">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-ink-secondary">
              <div className="w-7 h-7 rounded-full bg-coral-100 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-coral-500" />
              </div>
              <span className="truncate">{event.stage}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-ink-tertiary">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-brand-500" />
                </div>
                <span className="font-medium">{formatTime(event.start_time)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Announcement strip ──────────────────────────────────────── */
function AnnouncementStrip({ ann, index }) {
  const style = ANNOUNCEMENT_STYLES[ann.type] || ANNOUNCEMENT_STYLES.info;
  const isMostRecent = index === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group flex items-start gap-4 p-4 rounded-2xl hover:bg-surface-2 border transition-all cursor-default relative overflow-hidden ${isMostRecent ? 'border-sky-200/50 bg-sky-50/30' : 'border-transparent hover:border-surface-border'}`}
    >
      {isMostRecent && (
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-transparent animate-pulse pointer-events-none" />
      )}
      <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center mt-0.5 relative ${style.icon}`}>
        {isMostRecent && (
          <span className={`absolute inset-0 rounded-full opacity-40 animate-ping ${style.bar}`} />
        )}
        <Bell className="w-5 h-5 relative z-10" />
      </div>
      <div className="min-w-0 flex-1 relative z-10">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-opacity-10 border ${style.text} ${style.bar.replace('bg-', 'border-').replace('500', '200')} ${style.bar.replace('bg-', 'bg-').replace('500', '100')}`}>
            {style.label}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-ink-tertiary font-medium">
            {isMostRecent && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />}
            {formatTimeSince(ann.created_at)}
          </span>
        </div>
        <p className="text-sm font-bold text-ink-primary mb-0.5 line-clamp-1 group-hover:text-brand-600 transition-colors">{ann.title}</p>
        <p className="text-sm text-ink-secondary line-clamp-2 leading-snug">{ann.content}</p>
      </div>
    </motion.div>
  );
}

/* ── Vendor pill ─────────────────────────────────────────────── */
const VENDOR_ICONS = {
  Food: Utensils, Drinks: Coffee, Merchandise: ShoppingBag, Attraction: Map,
};

const VENDOR_IMAGES = {
  Food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80',
  Drinks: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200&q=80',
  Merchandise: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=200&q=80',
  Attraction: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=80',
};

/* ── Dashboard Content ──────────────────────────────────────────── */
export default function Dashboard() {
  const [events,        setEvents]        = useState([]);
  const [vendors,       setVendors]       = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading,       setLoading]       = useState(true);

  // Compute dynamic stats from the fetched events
  const totalTickets = events.reduce((acc, ev) => acc + (ev.tickets_available || 0), 0);
  const uniqueStages = new Set(events.map(ev => ev.stage).filter(Boolean)).size;

  const categoryCounts = events.reduce((acc, ev) => {
    if (ev.category) acc[ev.category] = (acc[ev.category] || 0) + 1;
    return acc;
  }, {});
  
  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => {
      // Extract background color class from badge if possible, else default to brand
      const badgeStr = CATEGORY_BADGE[name] || '';
      const bgMatch = badgeStr.match(/bg-([a-z]+-500)/);
      const color = bgMatch ? bgMatch[0] : 'bg-brand-500';
      return {
        name,
        pct: Math.round((count / events.length) * 100),
        color
      };
    });

  useEffect(() => {
    Promise.all([getEvents(), getVendors(), getAnnouncements()])
      .then(([evRes, venRes, annRes]) => {
        setEvents(evRes.data || []);
        setVendors(venRes.data || []);
        setAnnouncements(annRes.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-surface-0 pb-20 pt-24 font-sans selection:bg-brand-500 selection:text-white">
      {/* ── Background Elements ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-400/5 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] rounded-full bg-coral-400/5 blur-[120px]" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Header ── */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-1 border border-surface-border shadow-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wide uppercase text-ink-secondary">Live Now</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink-primary font-extrabold tracking-tight">
              Festival <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-coral-500">Dashboard</span>
            </h1>
            <p className="text-lg text-ink-secondary mt-3 max-w-2xl font-medium">Your central hub for festival insights, upcoming events, and live updates.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/events" className="btn-primary shadow-xl shadow-brand-500/20 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5" />
              Get Tickets
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="py-32 flex justify-center">
            <LoadingSpinner text="Loading dashboard..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* ── Left Column (Main Content) ── */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              
              {/* Festival Stats Row */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              >
                {[
                  { label: 'Upcoming Events', value: events.length > 0 ? events.length : '0', icon: Music, color: 'text-sky-500', bg: 'bg-sky-100', border: 'border-sky-100' },
                  { label: 'Active Vendors', value: vendors.length > 0 ? vendors.length : '0', icon: ShoppingBag, color: 'text-brand-500', bg: 'bg-brand-100', border: 'border-brand-100' },
                  { label: 'Tickets Available', value: totalTickets > 0 ? totalTickets : '---', icon: Ticket, color: 'text-gold-500', bg: 'bg-gold-100', border: 'border-gold-100' },
                ].map((stat, i) => (
                  <div key={i} className={`bg-surface-1 rounded-3xl p-6 border ${stat.border} shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
                    <div className="relative z-10 flex flex-col gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div>
                        <div className="text-3xl font-black text-ink-primary mb-1">{stat.value}</div>
                        <div className="text-sm font-bold text-ink-secondary uppercase tracking-wide">{stat.label}</div>
                      </div>
                    </div>
                    <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out`} />
                  </div>
                ))}
              </motion.div>

              {/* Insights Section */}
              {events.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-surface-1 rounded-3xl p-8 border border-surface-border shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <TrendingUp className="w-48 h-48" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-full bg-lavender-100 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-lavender-500" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-ink-primary">Festival Highlights</h2>
                        <p className="text-sm text-ink-secondary font-medium">Trending activity across all events</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-sm font-bold text-ink-secondary mb-4 uppercase tracking-wider">Most Popular Genres</p>
                        <div className="space-y-4">
                          {sortedCategories.map(g => (
                            <div key={g.name}>
                              <div className="flex justify-between text-sm font-medium mb-1.5">
                                <span className="text-ink-primary">{g.name}</span>
                                <span className="text-ink-secondary">{g.pct}% Demand</span>
                              </div>
                              <div className="h-2.5 bg-surface-border rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${g.pct}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className={`h-full rounded-full ${g.color}`} 
                                />
                              </div>
                            </div>
                          ))}
                          {sortedCategories.length === 0 && (
                            <p className="text-sm text-ink-tertiary italic">Not enough data to determine trends yet.</p>
                          )}
                        </div>
                      </div>
                      <div className="bg-surface-2 rounded-2xl p-6 border border-surface-border flex flex-col justify-center">
                        <p className="text-sm font-bold text-ink-secondary uppercase tracking-wider mb-2">Active Stages</p>
                        <div className="text-5xl font-black text-ink-primary mb-2">{uniqueStages > 0 ? uniqueStages : '--'}</div>
                        <p className="text-sm text-mint-500 font-bold flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Across the festival grounds
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Upcoming Events */}
              <div className="mt-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <h2 className="font-display text-3xl font-bold text-ink-primary">Lineup Spotlight</h2>
                    <p className="text-ink-secondary font-medium mt-1">Don't miss out on these top upcoming events.</p>
                  </div>
                  <Link to="/events" className="text-brand-600 font-bold hover:text-brand-700 flex items-center gap-1 group">
                    View full lineup
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {events.slice(0, 4).map((ev, i) => <EventCard key={ev.id} event={ev} index={i} />)}
                  {events.length === 0 && (
                    <div className="col-span-2 py-12 text-center bg-surface-1 rounded-3xl border border-surface-border border-dashed">
                      <p className="text-ink-tertiary">No upcoming events scheduled yet.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* ── Right Column (Sidebar) ── */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              {/* Announcements Card */}
              {announcements.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-surface-1 rounded-3xl border border-surface-border shadow-sm overflow-hidden"
                >
                  <div className="p-6 border-b border-surface-border flex items-center justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-transparent animate-pulse pointer-events-none" />
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="relative">
                        <span className="absolute -inset-1 rounded-full bg-sky-400 opacity-30 animate-ping" />
                        <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center relative z-10">
                          <Zap className="w-5 h-5 text-sky-500 animate-pulse" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-ink-primary flex items-center gap-2">
                        Live Updates
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-coral-500"></span>
                        </span>
                      </h3>
                    </div>
                  </div>
                  <div className="p-2">
                    {announcements.slice(0, 4).map((ann, i) => (
                      <AnnouncementStrip key={ann.id} ann={ann} index={i} />
                    ))}
                  </div>
                  <Link to="/announcements" className="block w-full text-center py-4 text-sm font-bold text-brand-600 hover:bg-surface-2 transition-colors border-t border-surface-border relative z-10">
                    View all announcements
                  </Link>
                </motion.div>
              )}

              {/* Vendors Snapshot */}
              {vendors.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-surface-1 rounded-3xl border border-surface-border shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-ink-primary">Top Vendors</h3>
                      <p className="text-sm text-ink-secondary mt-1">Trending at the festival</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-gold-500" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 mb-6">
                    {vendors.slice(0, 3).map(v => {
                      const Icon = VENDOR_ICONS[v.category] || Utensils;
                      const vImage = VENDOR_IMAGES[v.category] || VENDOR_IMAGES.Food;
                      return (
                        <Link key={v.id} to="/food-attractions" className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-2 border border-transparent hover:border-surface-border transition-all">
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm relative">
                             <img src={vImage} alt={v.category} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-base text-ink-primary font-bold truncate group-hover:text-brand-600 transition-colors">{v.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-2 text-ink-secondary">
                                {v.category}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-ink-tertiary group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                        </Link>
                      )
                    })}
                  </div>
                  <Link to="/food-attractions" className="btn-secondary w-full justify-center bg-surface-1">
                    Browse all vendors
                  </Link>
                </motion.div>
              )}

              {/* Map CTA - Compact */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-ink-primary rounded-3xl p-8 relative overflow-hidden group shadow-xl mt-4"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-coral-600/20 opacity-50" />
                <Map className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700" />
                
                <div className="relative z-10 flex flex-col items-start">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display text-2xl text-white mb-2">Interactive Map</h3>
                  <p className="text-ink-tertiary text-sm mb-8">Navigate stages, vendors, and facilities with ease.</p>
                  
                  <Link to="/map" className="bg-white text-ink-primary px-6 py-3 rounded-full font-bold text-sm hover:bg-surface-2 transition-colors flex items-center gap-2">
                    Open Map
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
