import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

/* ── Custom Marker Icon ──────────────────────────────────────── */
const createCustomIcon = (tagColorClass) => {
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `
      <div class="relative w-8 h-8 flex items-center justify-center -top-4 -left-4">
        <div class="absolute inset-0 bg-white rounded-full shadow-soft flex items-center justify-center ${tagColorClass}">
          <span class="text-xl">📍</span>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

/* ── Zone definitions ────────────────────────────────────────── */
const ZONES = [
  {
    id:   'main-stage',
    label: 'Main Stage',
    tag:   'Stage',
    cap:   'Capacity: 500',
    desc:  'Our largest stage hosting headline acts. Capacity 500. Located at the north end of the grounds with large screens on both sides.',
    details: ['Capacity: 500', 'Accessible viewing area', 'Large screens both sides', 'Premium sound system'],
    pos: [-37.7963, 144.9610],
  },
  {
    id:   'dance-arena',
    label: 'Dance Arena',
    tag:   'Stage',
    cap:   'Capacity: 350',
    desc:  'Indoor climate-controlled arena for electronic and dance music. VIP tier available above the main floor.',
    details: ['Capacity: 350', 'Indoor / climate controlled', 'VIP tier available', 'Professional lighting rig'],
    pos: [-37.7985, 144.9630],
  },
  {
    id:   'garden-stage',
    label: 'Garden Stage',
    tag:   'Stage',
    cap:   'Capacity: 200',
    desc:  'Intimate outdoor stage surrounded by greenery — ideal for acoustic, jazz and wellness sets. Seating available.',
    details: ['Capacity: 200', 'Seated area available', 'Picnic blankets welcome', 'Acoustic-focused'],
    pos: [-37.7995, 144.9605],
  },
  {
    id:   'food-court',
    label: 'Food Court',
    tag:   'Food',
    cap:   '15+ vendors',
    desc:  'Central food hub with 6 food stalls, 3 drink bars, and seating for 300+. Open 11AM – midnight.',
    details: ['15+ vendors', 'Seating for 300+', 'Open 11AM – Midnight', 'Cashless payments only'],
    pos: [-37.7975, 144.9615],
  },
  {
    id:   'drinks-zone',
    label: 'Drinks Zone',
    tag:   'Drinks',
    cap:   'Craft bars',
    desc:  'Craft beers on tap, cocktails, mocktails, cold brew coffee. ID required for alcohol.',
    details: ['Craft beers on tap', 'Cocktail & mocktail bar', 'Cold brew coffee', 'ID required for alcohol'],
    pos: [-37.7970, 144.9620],
  },
  {
    id:   'merch-hub',
    label: 'Merch Hub',
    tag:   'Merch',
    cap:   'Artist & official',
    desc:  'Official FestivalHub merchandise, artist merch, vinyl records, and exclusive limited prints.',
    details: ['Official FestivalHub merch', 'Artist merchandise', 'Vinyl records', 'Exclusive limited prints'],
    pos: [-37.7980, 144.9600],
  },
  {
    id:   'fairground',
    label: 'Fairground',
    tag:   'Attraction',
    cap:   'All ages',
    desc:  'Ferris wheel, carnival games, photo booth, and face painting. Fun for all ages.',
    details: ['Ferris wheel', 'Carnival games', 'Photo booth', 'Face painting'],
    pos: [-37.7990, 144.9590],
  },
  {
    id:   'family-zone',
    label: 'Family Zone',
    tag:   'Facility',
    cap:   'Kids welcome',
    desc:  'Dedicated family area with supervised activities, quiet feeding rooms, and children\'s entertainment on Sundays.',
    details: ['Supervised play area', 'Quiet feeding room', 'Kids activities', 'Sunday family shows'],
    pos: [-37.7992, 144.9625],
  },
  {
    id:   'medical',
    label: 'Medical',
    tag:   'Safety',
    cap:   '24/7 staffed',
    desc:  'Fully staffed medical tent at Gate A. Open 24 hours during the festival. For emergencies contact security.',
    details: ['24/7 staffed', 'Located at Gate A', 'First aid equipment', 'Emergency: see wristband'],
    pos: [-37.7978, 144.9585],
  },
  {
    id:   'parking',
    label: 'Parking',
    tag:   'Transport',
    cap:   'Gate C',
    desc:  'Main parking at Gate C. Accessible parking near Gate A. CBD shuttles every 30 min from 3PM.',
    details: ['Main lot – Gate C', 'Accessible – Gate A', 'CBD shuttles every 30 min', '$20/day parking'],
    pos: [-37.8000, 144.9640],
  },
  {
    id:   'info-point',
    label: 'Info Point',
    tag:   'Facility',
    cap:   'Gate B',
    desc:  'Collect wristbands, pick up festival guides, lost & found, and accessibility support.',
    details: ['Wristband pickup', 'Lost & found', 'Festival guides', 'Accessibility support'],
    pos: [-37.7985, 144.9615],
  },
  {
    id:   'atm',
    label: 'ATM & Cash',
    tag:   'Facility',
    cap:   'Gates A & C',
    desc:  'ATMs at Gate A and Gate C. All vendors accept cashless payments — EFTPOS, Visa, Mastercard, Apple Pay.',
    details: ['ATM at Gate A & Gate C', 'EFTPOS accepted', 'Visa / Mastercard', 'Apple Pay accepted'],
    pos: [-37.7972, 144.9605],
  },
];

/* ── Tag accent ──────────────────────────────────────────────── */
const TAG_COLOR = {
  Stage:      'text-coral-500',
  Food:       'text-gold-500',
  Drinks:     'text-sky-500',
  Merch:      'text-lavender-500',
  Attraction: 'text-mint-500',
  Facility:   'text-ink-tertiary',
  Transport:  'text-ink-tertiary',
  Safety:     'text-coral-600',
};

/* ── Fly to selected zone ────────────────────────────────────── */
function MapController({ activeZoneId }) {
  const map = useMap();
  useEffect(() => {
    if (activeZoneId) {
      const zone = ZONES.find(z => z.id === activeZoneId);
      if (zone) {
        map.flyTo(zone.pos, 17, { duration: 1.5 });
      }
    } else {
      map.flyTo([-37.7983, 144.9610], 16, { duration: 1.5 });
    }
  }, [activeZoneId, map]);
  return null;
}

/* ── Main ────────────────────────────────────────────────────── */
export default function FestivalMap() {
  const location = useLocation();
  const [active, setActive] = useState(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const zoneFromUrl = params.get('zone');
    if (zoneFromUrl) {
      setActive(zoneFromUrl);
    }
  }, [location.search]);

  const selected = ZONES.find(z => z.id === active);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-surface-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Page header */}
        <div className="py-10 md:py-14 border-b border-surface-border mb-8 animate-slide-up">
          <p className="eyebrow mb-3">Navigate the grounds</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-primary mb-2">Interactive Map</h1>
          <p className="text-sm text-ink-secondary font-semibold">Explore the campus and click a location to see details.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 xl:gap-10">

          {/* Map Area — 2 cols */}
          <div className="lg:col-span-2 h-[600px] card shadow-soft p-2 relative z-0">
            <MapContainer
              center={[-37.7983, 144.9610]}
              zoom={16}
              scrollWheelZoom={false}
              className="w-full h-full rounded-[1.2rem]"
            >
              {/* Elegant Light map style via CartoDB Positron */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                subdomains="abcd"
                maxZoom={19}
              />
              
              <MapController activeZoneId={active} />

              {ZONES.map((zone) => (
                <Marker 
                  key={zone.id} 
                  position={zone.pos}
                  icon={createCustomIcon(TAG_COLOR[zone.tag] || 'text-ink-primary')}
                  eventHandlers={{
                    click: () => setActive(zone.id === active ? null : zone.id),
                  }}
                />
              ))}
            </MapContainer>
          </div>

          {/* Info panel — 1 col */}
          <div className="lg:col-span-1">
            {selected ? (
              <div className="card sticky top-24 animate-slide-down overflow-hidden shadow-lift border border-surface-border z-10">
                <div className="h-2 bg-coral-500" />
                <div className="p-6">
                  <div className="mb-4">
                    <span className={`text-xs font-bold uppercase tracking-widest ${TAG_COLOR[selected.tag] || 'text-ink-tertiary'}`}>
                      {selected.tag}
                    </span>
                    <h2 className="font-display text-2xl font-bold text-ink-primary mt-1">{selected.label}</h2>
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed mb-5 font-medium">{selected.desc}</p>
                  <p className="eyebrow mb-3">Details</p>
                  <ul className="space-y-2">
                    {selected.details.map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-ink-secondary font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-coral-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => setActive(null)}
                    className="mt-6 w-full btn-secondary btn-sm"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="card p-6 sticky top-24 shadow-soft">
                <p className="eyebrow mb-4">Directory</p>
                <div className="space-y-1 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                  {ZONES.map(z => (
                    <button
                      key={z.id}
                      onClick={() => setActive(z.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-colors text-left group"
                    >
                      <span className="text-sm font-semibold text-ink-secondary group-hover:text-ink-primary transition-colors">
                        {z.label}
                      </span>
                      <span className={`text-2xs font-bold uppercase tracking-wider ${TAG_COLOR[z.tag] || 'text-ink-tertiary'}`}>
                        {z.tag}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-ink-tertiary font-semibold mt-4 pt-4 border-t border-surface-border text-center">
                  Select a zone on the map or list to see full details.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
