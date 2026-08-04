import { useState, useEffect } from 'react';
import { getVendors } from '../services/api';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/UI';

/* ── Config ──────────────────────────────────────────────────── */
const CATEGORIES = ['All', 'Food', 'Drinks', 'Merchandise', 'Attraction'];

const CAT_CONFIG = {
  Food:        { accent: 'text-amber-400',  label: 'Food' },
  Drinks:      { accent: 'text-sky-400',    label: 'Drinks' },
  Merchandise: { accent: 'text-pink-400',   label: 'Merch' },
  Attraction:  { accent: 'text-orange-400', label: 'Attractions' },
};

/* ── Vendor card ─────────────────────────────────────────────── */
function VendorCard({ vendor }) {
  const config = CAT_CONFIG[vendor.category] || CAT_CONFIG.Food;
  const initials = vendor.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('');

  return (
    <div className="card p-5">
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded bg-surface-2 border border-surface-border flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-ink-tertiary">{initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-base text-ink-primary leading-snug">{vendor.name}</h3>
            <span className={`text-2xs font-semibold uppercase tracking-widest shrink-0 ${config.accent}`}>
              {config.label}
            </span>
          </div>
          {vendor.location && (
            <p className="text-2xs text-ink-tertiary mt-0.5">{vendor.location}</p>
          )}
        </div>
      </div>
      <p className="text-xs text-ink-secondary leading-relaxed">{vendor.description}</p>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────── */
export default function FoodAttractions() {
  const [vendors,  setVendors]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [category, setCategory] = useState('All');

  useEffect(() => {
    getVendors()
      .then(r => setVendors(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = category === 'All' ? vendors : vendors.filter(v => v.category === category);

  // Grouped view for "All"
  const grouped = CATEGORIES.filter(c => c !== 'All').reduce((acc, cat) => {
    const items = vendors.filter(v => v.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Page header */}
        <div className="py-10 md:py-14 border-b border-surface-border mb-8 animate-slide-up">
          <p className="eyebrow mb-3">On the grounds</p>
          <h1 className="font-display text-4xl md:text-5xl text-ink-primary mb-2">Food, Drinks & Attractions</h1>
          <p className="text-sm text-ink-secondary">
            {vendors.length}+ vendors across the festival grounds. All accept cashless payments.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              id={`vendor-tab-${cat.toLowerCase()}`}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-all duration-150 ${
                category === cat
                  ? 'bg-surface-2 border border-surface-muted text-ink-primary'
                  : 'bg-transparent border border-surface-border text-ink-tertiary hover:text-ink-secondary hover:border-surface-muted'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && <LoadingSpinner text="Loading vendors…" />}
        {error   && <ErrorMessage message={error} />}

        {!loading && !error && (
          category === 'All' ? (
            Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="mb-12">
                <div className="flex items-center gap-4 mb-5">
                  <div>
                    <h2 className="font-display text-2xl text-ink-primary">{cat}</h2>
                    <p className="text-2xs text-ink-tertiary">{items.length} vendor{items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="h-px flex-1 bg-surface-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map(v => <VendorCard key={v.id} vendor={v} />)}
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <EmptyState title={`No ${category} vendors`} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
              {filtered.map(v => <VendorCard key={v.id} vendor={v} />)}
            </div>
          )
        )}

        {/* Vendor tips */}
        {!loading && !error && (
          <div className="mt-16 pt-8 border-t border-surface-border">
            <p className="eyebrow mb-5">Good to know</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  title: 'Cashless only',
                  body:  'All vendors accept EFTPOS, Visa, Mastercard, and Apple Pay. No cash needed.',
                },
                {
                  title: 'Dietary labels',
                  body:  'Look for GF (gluten-free) and V (vegan/vegetarian) labels displayed at each stall.',
                },
                {
                  title: 'Opening hours',
                  body:  'Vendors open from 11AM daily. Most food stalls run until midnight each evening.',
                },
              ].map(({ title, body }) => (
                <div key={title} className="p-4 bg-surface-1 border border-surface-border rounded-lg">
                  <p className="text-sm font-semibold text-ink-primary mb-1">{title}</p>
                  <p className="text-xs text-ink-secondary leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
