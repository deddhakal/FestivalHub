import { useState } from 'react';

/* ── Zone definitions ────────────────────────────────────────── */
const ZONES = [
  {
    id:   'main-stage',
    label: 'Main Stage',
    tag:   'Stage',
    cap:   'Capacity: 500',
    desc:  'Our largest stage hosting headline acts. Capacity 500. Located at the north end of the grounds with large screens on both sides.',
    details: ['Capacity: 500', 'Accessible viewing area', 'Large screens both sides', 'Premium sound system'],
    span: 'col-span-2',
  },
  {
    id:   'dance-arena',
    label: 'Dance Arena',
    tag:   'Stage',
    cap:   'Capacity: 350',
    desc:  'Indoor climate-controlled arena for electronic and dance music. VIP tier available above the main floor.',
    details: ['Capacity: 350', 'Indoor / climate controlled', 'VIP tier available', 'Professional lighting rig'],
    span: 'col-span-1',
  },
  {
    id:   'garden-stage',
    label: 'Garden Stage',
    tag:   'Stage',
    cap:   'Capacity: 200',
    desc:  'Intimate outdoor stage surrounded by greenery — ideal for acoustic, jazz and wellness sets. Seating available.',
    details: ['Capacity: 200', 'Seated area available', 'Picnic blankets welcome', 'Acoustic-focused'],
    span: 'col-span-1',
  },
  {
    id:   'food-court',
    label: 'Food Court',
    tag:   'Food',
    cap:   '15+ vendors',
    desc:  'Central food hub with 6 food stalls, 3 drink bars, and seating for 300+. Open 11AM – midnight.',
    details: ['15+ vendors', 'Seating for 300+', 'Open 11AM – Midnight', 'Cashless payments only'],
    span: 'col-span-1',
  },
  {
    id:   'drinks-zone',
    label: 'Drinks Zone',
    tag:   'Drinks',
    cap:   'Craft bars',
    desc:  'Craft beers on tap, cocktails, mocktails, cold brew coffee. ID required for alcohol.',
    details: ['Craft beers on tap', 'Cocktail & mocktail bar', 'Cold brew coffee', 'ID required for alcohol'],
    span: 'col-span-1',
  },
  {
    id:   'merch-hub',
    label: 'Merch Hub',
    tag:   'Merch',
    cap:   'Artist & official',
    desc:  'Official FestivalHub merchandise, artist merch, vinyl records, and exclusive limited prints.',
    details: ['Official FestivalHub merch', 'Artist merchandise', 'Vinyl records', 'Exclusive limited prints'],
    span: 'col-span-1',
  },
  {
    id:   'fairground',
    label: 'Fairground',
    tag:   'Attraction',
    cap:   'All ages',
    desc:  'Ferris wheel, carnival games, photo booth, and face painting. Fun for all ages.',
    details: ['Ferris wheel', 'Carnival games', 'Photo booth', 'Face painting'],
    span: 'col-span-1',
  },
  {
    id:   'family-zone',
    label: 'Family Zone',
    tag:   'Facility',
    cap:   'Kids welcome',
    desc:  'Dedicated family area with supervised activities, quiet feeding rooms, and children\'s entertainment on Sundays.',
    details: ['Supervised play area', 'Quiet feeding room', 'Kids activities', 'Sunday family shows'],
    span: 'col-span-1',
  },
  {
    id:   'medical',
    label: 'Medical',
    tag:   'Safety',
    cap:   '24/7 staffed',
    desc:  'Fully staffed medical tent at Gate A. Open 24 hours during the festival. For emergencies contact security.',
    details: ['24/7 staffed', 'Located at Gate A', 'First aid equipment', 'Emergency: see wristband'],
    span: 'col-span-1',
  },
  {
    id:   'parking',
    label: 'Parking',
    tag:   'Transport',
    cap:   'Gate C',
    desc:  'Main parking at Gate C. Accessible parking near Gate A. CBD shuttles every 30 min from 3PM.',
    details: ['Main lot – Gate C', 'Accessible – Gate A', 'CBD shuttles every 30 min', '$20/day parking'],
    span: 'col-span-1',
  },
  {
    id:   'info-point',
    label: 'Info Point',
    tag:   'Facility',
    cap:   'Gate B',
    desc:  'Collect wristbands, pick up festival guides, lost & found, and accessibility support.',
    details: ['Wristband pickup', 'Lost & found', 'Festival guides', 'Accessibility support'],
    span: 'col-span-1',
  },
  {
    id:   'atm',
    label: 'ATM & Cash',
    tag:   'Facility',
    cap:   'Gates A & C',
    desc:  'ATMs at Gate A and Gate C. All vendors accept cashless payments — EFTPOS, Visa, Mastercard, Apple Pay.',
    details: ['ATM at Gate A & Gate C', 'EFTPOS accepted', 'Visa / Mastercard', 'Apple Pay accepted'],
    span: 'col-span-1',
  },
];

/* ── Tag accent ──────────────────────────────────────────────── */
const TAG_COLOR = {
  Stage:      'text-brand-400',
  Food:       'text-amber-400',
  Drinks:     'text-sky-400',
  Merch:      'text-pink-400',
  Attraction: 'text-orange-400',
  Facility:   'text-ink-tertiary',
  Transport:  'text-ink-tertiary',
  Safety:     'text-red-400',
};

/* ── Zone tile ───────────────────────────────────────────────── */
function ZoneTile({ zone, active, onSelect }) {
  const isActive = active === zone.id;
  const tagColor = TAG_COLOR[zone.tag] || 'text-ink-tertiary';

  return (
    <button
      id={`map-${zone.id}`}
      onClick={() => onSelect(isActive ? null : zone.id)}
      aria-pressed={isActive}
      className={`${zone.span} p-4 md:p-5 rounded-xl border text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        isActive
          ? 'bg-surface-3 border-surface-muted'
          : 'bg-surface-1 border-surface-border hover:bg-surface-2 hover:border-surface-muted'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-2xs font-semibold uppercase tracking-widest ${tagColor}`}>
          {zone.tag}
        </span>
        {isActive && (
          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-0.5" />
        )}
      </div>
      <p className="text-sm font-semibold text-ink-primary leading-snug">{zone.label}</p>
      <p className="text-2xs text-ink-tertiary mt-0.5">{zone.cap}</p>
    </button>
  );
}

/* ── Main ────────────────────────────────────────────────────── */
export default function FestivalMap() {
  const [active, setActive] = useState(null);
  const selected = ZONES.find(z => z.id === active);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Page header */}
        <div className="py-10 md:py-14 border-b border-surface-border mb-8 animate-slide-up">
          <p className="eyebrow mb-3">Navigate the grounds</p>
          <h1 className="font-display text-4xl md:text-5xl text-ink-primary mb-2">Festival Map</h1>
          <p className="text-sm text-ink-secondary">Select any zone to see details and facilities.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 xl:gap-10">

          {/* Map grid — 2 cols */}
          <div className="lg:col-span-2">

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mb-5 text-2xs">
              {Object.entries(TAG_COLOR).map(([tag, color]) => (
                <span key={tag} className={`font-semibold uppercase tracking-wider ${color}`}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Interactive grid — row 1: stages */}
            <div className="space-y-2">

              {/* Row 1: Main Stage + Dance Arena */}
              <div className="grid grid-cols-3 gap-2">
                {ZONES.slice(0, 2).map(z => (
                  <ZoneTile key={z.id} zone={z} active={active} onSelect={setActive} />
                ))}
              </div>

              {/* Row 2: Garden Stage + Food Court + Drinks */}
              <div className="grid grid-cols-3 gap-2">
                {ZONES.slice(2, 5).map(z => (
                  <ZoneTile key={z.id} zone={z} active={active} onSelect={setActive} />
                ))}
              </div>

              {/* Row 3: Merch + Fairground + Family */}
              <div className="grid grid-cols-3 gap-2">
                {ZONES.slice(5, 8).map(z => (
                  <ZoneTile key={z.id} zone={z} active={active} onSelect={setActive} />
                ))}
              </div>

              {/* Row 4: Services */}
              <div className="grid grid-cols-4 gap-2">
                {ZONES.slice(8).map(z => (
                  <ZoneTile key={z.id} zone={{ ...z, span: 'col-span-1' }} active={active} onSelect={setActive} />
                ))}
              </div>
            </div>

            {/* Gate labels */}
            <div className="flex justify-between mt-4 px-1">
              {['Gate A — Main entrance & Medical', 'Gate B — Info & Charging', 'Gate C — Parking'].map(g => (
                <div key={g} className="text-2xs text-ink-tertiary flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-surface-muted" />
                  {g}
                </div>
              ))}
            </div>
          </div>

          {/* Info panel — 1 col */}
          <div className="lg:col-span-1">
            {selected ? (
              <div className="card sticky top-20 animate-slide-down overflow-hidden">
                <div className="h-0.5 bg-brand-600" />
                <div className="p-6">
                  <div className="mb-4">
                    <span className={`text-2xs font-semibold uppercase tracking-widest ${TAG_COLOR[selected.tag] || 'text-ink-tertiary'}`}>
                      {selected.tag}
                    </span>
                    <h2 className="font-display text-2xl text-ink-primary mt-1">{selected.label}</h2>
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed mb-5">{selected.desc}</p>
                  <p className="eyebrow mb-3">Details</p>
                  <ul className="space-y-2">
                    {selected.details.map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-ink-secondary">
                        <div className="w-1 h-1 rounded-full bg-brand-600 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="card p-6 sticky top-20">
                <p className="eyebrow mb-4">Zone Directory</p>
                <div className="space-y-1">
                  {ZONES.slice(0, 7).map(z => (
                    <button
                      key={z.id}
                      onClick={() => setActive(z.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-surface-2 transition-colors text-left group"
                    >
                      <span className="text-sm text-ink-secondary group-hover:text-ink-primary transition-colors">
                        {z.label}
                      </span>
                      <span className={`text-2xs font-semibold uppercase tracking-wider ${TAG_COLOR[z.tag] || 'text-ink-tertiary'}`}>
                        {z.tag}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-ink-tertiary mt-4 pt-4 border-t border-surface-border">
                  Select a zone on the map to see full details.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tips row */}
        <div className="grid sm:grid-cols-3 gap-4 mt-10 pt-10 border-t border-surface-border">
          {[
            {
              label: 'Getting here',
              body:  'Shuttle buses from Melbourne CBD every 30 min from 3PM. Main parking at Gate C ($20/day).',
            },
            {
              label: 'Water & charging',
              body:  'Free water refill stations throughout the grounds. Phone charging at the Info Point, Gate B.',
            },
            {
              label: 'Accessibility',
              body:  'Accessible parking at Gate A. Accessible viewing at all stages. Contact us for specific needs.',
            },
          ].map(({ label, body }) => (
            <div key={label} className="card p-5">
              <p className="eyebrow mb-2">{label}</p>
              <p className="text-xs text-ink-secondary leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
