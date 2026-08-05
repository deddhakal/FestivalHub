import { useState, useEffect } from 'react';
import { getAnnouncements } from '../services/api';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, AlertTriangle, Info, CheckCircle2, Megaphone, BellRing, Sparkles } from 'lucide-react';

/* ── Type config ─────────────────────────────────────────────── */
const TYPE_CONFIG = {
  info:    { 
    bg: 'bg-sky-500/10', 
    border: 'border-sky-200', 
    iconText: 'text-sky-500', 
    label: 'Information',
    Icon: Info 
  },
  warning: { 
    bg: 'bg-amber-500/10', 
    border: 'border-amber-200', 
    iconText: 'text-amber-500', 
    label: 'Warning',
    Icon: AlertTriangle 
  },
  alert:   { 
    bg: 'bg-coral-500/10', 
    border: 'border-coral-200', 
    iconText: 'text-coral-500', 
    label: 'Critical Alert',
    Icon: Radio 
  },
  success: { 
    bg: 'bg-mint-500/10', 
    border: 'border-mint-200', 
    iconText: 'text-mint-500', 
    label: 'Update',
    Icon: CheckCircle2 
  },
};

const FILTERS = [
  { key: 'all',     label: 'All Updates', icon: Megaphone },
  { key: 'alert',   label: 'Alerts', icon: Radio },
  { key: 'warning', label: 'Warnings', icon: AlertTriangle },
  { key: 'info',    label: 'Info', icon: Info },
  { key: 'success', label: 'Success', icon: CheckCircle2 },
];

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

/* ── Card ────────────────────────────────────────────────────── */
function AnnouncementCard({ ann, index }) {
  const config = TYPE_CONFIG[ann.type] || TYPE_CONFIG.info;
  const Icon = config.Icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, delay: index * 0.05, type: 'spring', stiffness: 250, damping: 20 }}
      className={`relative group overflow-hidden rounded-3xl border-2 ${config.border} bg-white shadow-soft hover:shadow-lift transition-shadow duration-300`}
    >
      {/* Decorative gradient blob */}
      <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${config.bg.replace('/10', '')}`} />

      <div className="p-6 md:p-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          {/* Icon Badge */}
          <div className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ${config.bg} ${config.border} border`}>
            <Icon className={`w-6 h-6 md:w-7 md:h-7 ${config.iconText}`} strokeWidth={2.5} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.bg} ${config.iconText}`}>
                {config.label}
              </span>
              <span className="text-sm font-medium text-ink-tertiary flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5" />
                {timeAgo(ann.created_at)}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-display text-xl md:text-2xl text-ink-primary mb-3 font-bold group-hover:text-brand-500 transition-colors duration-300">
              {ann.title}
            </h3>

            {/* Content */}
            <p className="text-base text-ink-secondary leading-relaxed">
              {ann.content}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main ────────────────────────────────────────────────────── */
export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [filter,        setFilter]        = useState('all');

  useEffect(() => {
    getAnnouncements()
      .then(r => setAnnouncements(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all'
    ? announcements
    : announcements.filter(a => a.type === filter);

  return (
    <div className="min-h-screen pt-12 pb-12 bg-surface-0 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-brand-500/10 to-transparent blur-3xl opacity-50 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">

        {/* Page header */}
        <div className="py-6 md:py-10 text-center mb-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white border border-surface-border shadow-sm"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-signal-success"></span>
            </span>
            <span className="text-sm font-bold tracking-widest uppercase text-ink-secondary">Live Broadcast Hub</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl text-ink-primary mb-4 tracking-tight flex items-center justify-center gap-4"
          >
            Festival Updates
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-ink-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Stay in the loop with real-time announcements, schedule changes, and crucial alerts directly from the FestivalHub organisers.
          </motion.p>
        </div>

        {/* Filter tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-8" 
          role="tablist" 
          aria-label="Filter announcements"
        >
          {FILTERS.map(({ key, label, icon: FilterIcon }) => (
            <button
              key={key}
              id={`ann-filter-${key}`}
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                filter === key
                  ? 'bg-ink-primary text-white shadow-md scale-105'
                  : 'bg-white border-2 border-surface-border text-ink-secondary hover:text-ink-primary hover:border-ink-tertiary hover:bg-surface-1'
              }`}
            >
              <FilterIcon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <div className="min-h-[400px]">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner text="Fetching latest updates…" />
            </div>
          )}
          
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ErrorMessage message={error} />
            </motion.div>
          )}
          
          {!loading && !error && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState 
                title="No updates right now" 
                subtitle="We'll notify you here when there's something new." 
                icon={<Sparkles className="w-12 h-12 text-brand-500 mb-4 mx-auto opacity-50" />}
              />
            </motion.div>
          )}

          <motion.div layout className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((ann, i) => (
                <AnnouncementCard key={ann.id} ann={ann} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Live note footer */}
        {!loading && !error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-surface-border flex flex-col items-center justify-center text-center gap-3"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-2 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-success"></span>
              </span>
              <span className="text-sm font-semibold text-ink-tertiary">Live connection active</span>
            </div>
            <p className="text-xs text-ink-tertiary">Updates will appear here automatically</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
