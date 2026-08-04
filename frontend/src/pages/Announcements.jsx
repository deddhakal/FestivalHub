import { useState, useEffect } from 'react';
import { getAnnouncements } from '../services/api';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/UI';

/* ── Type config ─────────────────────────────────────────────── */
const TYPE_CONFIG = {
  info:    { bar: 'bg-blue-500',   text: 'text-blue-400',   label: 'Info' },
  warning: { bar: 'bg-amber-500',  text: 'text-amber-400',  label: 'Warning' },
  alert:   { bar: 'bg-red-500',    text: 'text-red-400',    label: 'Alert' },
  success: { bar: 'bg-green-500',  text: 'text-green-400',  label: 'Update' },
};

const FILTERS = [
  { key: 'all',     label: 'All' },
  { key: 'alert',   label: 'Alerts' },
  { key: 'warning', label: 'Warnings' },
  { key: 'info',    label: 'Info' },
  { key: 'success', label: 'Updates' },
];

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

/* ── Card ────────────────────────────────────────────────────── */
function AnnouncementCard({ ann, index }) {
  const config = TYPE_CONFIG[ann.type] || TYPE_CONFIG.info;

  return (
    <div
      className="card animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`h-0.5 ${config.bar}`} />
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Indicator */}
          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${config.bar}`} />

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-2xs font-semibold uppercase tracking-widest ${config.text}`}>
                {config.label}
              </span>
              <span className="text-2xs text-ink-tertiary">{timeAgo(ann.created_at)}</span>
            </div>

            {/* Title */}
            <h3 className="font-display text-lg text-ink-primary mb-2">{ann.title}</h3>

            {/* Content */}
            <p className="text-sm text-ink-secondary leading-relaxed">{ann.content}</p>
          </div>
        </div>
      </div>
    </div>
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
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4 md:px-6">

        {/* Page header */}
        <div className="py-10 md:py-14 border-b border-surface-border mb-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-success animate-pulse" />
            <span className="eyebrow">Live updates</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-ink-primary mb-2">Announcements</h1>
          <p className="text-sm text-ink-secondary">Latest news and alerts from FestivalHub organisers.</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter announcements">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              id={`ann-filter-${key}`}
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-150 ${
                filter === key
                  ? 'bg-surface-2 border border-surface-muted text-ink-primary'
                  : 'bg-transparent border border-surface-border text-ink-tertiary hover:text-ink-secondary hover:border-surface-muted'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && <LoadingSpinner text="Loading updates…" />}
        {error   && <ErrorMessage message={error} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState title="No announcements" subtitle="Check back soon for updates." />
        )}

        <div className="space-y-3">
          {filtered.map((ann, i) => (
            <AnnouncementCard key={ann.id} ann={ann} index={i} />
          ))}
        </div>

        {/* Live note */}
        {!loading && !error && (
          <div className="mt-10 pt-6 border-t border-surface-border flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-success animate-pulse" />
            <span className="text-xs text-ink-tertiary">Updates refresh when you reload the page</span>
          </div>
        )}
      </div>
    </div>
  );
}
