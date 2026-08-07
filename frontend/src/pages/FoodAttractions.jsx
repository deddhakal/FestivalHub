import { useState, useEffect } from 'react';
import { getVendors } from '../services/api';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/UI';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

/* ── Config ──────────────────────────────────────────────────── */
const CATEGORIES = ['All', 'Food', 'Drinks', 'Merchandise', 'Attraction'];

const CAT_CONFIG = {
  Food:        { accent: 'text-amber-500', bg: 'bg-amber-100', label: 'Food' },
  Drinks:      { accent: 'text-sky-500',   bg: 'bg-sky-100',   label: 'Drinks' },
  Merchandise: { accent: 'text-pink-500',  bg: 'bg-pink-100',  label: 'Merch' },
  Attraction:  { accent: 'text-orange-500',bg: 'bg-orange-100',label: 'Attraction' },
};

const createCustomIcon = (colorClass) => {
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `
      <div class="relative w-10 h-10 flex items-center justify-center transition-transform hover:scale-110">
        <div class="absolute inset-0 bg-white rounded-full shadow-lift flex items-center justify-center ${colorClass}">
          <span class="text-xl">📍</span>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -45]
  });
};

function MapController({ centerPos }) {
  const map = useMap();
  useEffect(() => {
    if (centerPos) {
      map.flyTo(centerPos, 17, { duration: 1.2 });
    } else {
      map.flyTo([-37.7983, 144.9610], 16, { duration: 1.2 });
    }
  }, [centerPos, map]);
  return null;
}

/* ── Vendor card ─────────────────────────────────────────────── */
function VendorCard({ vendor, active, onClick }) {
  const config = CAT_CONFIG[vendor.category] || CAT_CONFIG.Food;
  const initials = vendor.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('');

  return (
    <div 
      onClick={onClick}
      className={`card p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${active ? 'ring-2 ring-coral-500 shadow-lift' : 'hover:shadow-soft hover:border-surface-muted'}`}
    >
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-xl bg-surface-0 border border-surface-border flex items-center justify-center shrink-0 shadow-sm ${config.accent}`}>
          <span className="text-sm font-black uppercase tracking-wider">{initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-lg text-ink-primary font-bold leading-snug line-clamp-1">{vendor.name}</h3>
              {vendor.stall_name && <p className="text-xs font-bold text-coral-500 mt-0.5">{vendor.stall_name}</p>}
            </div>
            <span className={`text-2xs font-bold uppercase tracking-widest shrink-0 px-2 py-1 rounded bg-surface-1 ${config.accent}`}>
              {config.label}
            </span>
          </div>
          {vendor.location && (
            <p className="text-xs font-medium text-ink-tertiary mt-1.5 flex items-center gap-1 line-clamp-1">
              📍 {vendor.location}
            </p>
          )}
        </div>
      </div>
      <p className="text-sm text-ink-secondary leading-relaxed font-medium line-clamp-2">{vendor.description}</p>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────── */
export default function FoodAttractions() {
  const [vendors,  setVendors]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [category, setCategory] = useState('All');
  const [activeVendor, setActiveVendor] = useState(null);

  useEffect(() => {
    getVendors()
      .then(r => setVendors(r.data.filter(v => v.is_active)))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = category === 'All' ? vendors : vendors.filter(v => v.category === category);
  
  const vendorsWithLocation = vendors.filter(v => v.latitude && v.longitude);
  const activeVendorData = vendors.find(v => v.id === activeVendor);
  const mapCenter = activeVendorData?.latitude ? [activeVendorData.latitude, activeVendorData.longitude] : null;

  // Grouped view for "All"
  const grouped = CATEGORIES.filter(c => c !== 'All').reduce((acc, cat) => {
    const items = vendors.filter(v => v.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="min-h-screen pt-fluid-xl bg-surface-0 flex flex-col">
      <div className="container max-w-[1600px] w-full flex-1 flex flex-col lg:flex-row gap-fluid-md lg:gap-fluid-lg pb-fluid-md lg:h-[calc(100vh-80px)]">

        {/* Left Column: List & Filters */}
        <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col h-full overflow-hidden pt-6 lg:pb-6">
          <div className="shrink-0 mb-6 animate-slide-up">
            <p className="eyebrow mb-2">On the grounds</p>
            <h1 className="font-display text-4xl md:text-5xl text-ink-primary mb-3 font-black">Food & Vendors</h1>
            <p className="text-sm text-ink-secondary font-medium">
              {vendors.length} amazing stalls across the festival grounds. All accept cashless payments.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="shrink-0 flex gap-2 overflow-x-auto pb-4 mb-2 custom-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 shrink-0 border ${
                  category === cat
                    ? 'bg-coral-50 border-coral-200 text-coral-600 shadow-sm'
                    : 'bg-surface-0 border-surface-border text-ink-secondary hover:bg-surface-1 hover:text-ink-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar lg:pb-12">
            {loading && <LoadingSpinner text="Loading vendors…" />}
            {error   && <ErrorMessage message={error} />}

            {!loading && !error && (
              category === 'All' ? (
                Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat} className="mb-10">
                    <div className="flex items-center gap-4 mb-5">
                      <h2 className="font-display text-2xl font-bold text-ink-primary">{cat}</h2>
                      <div className="h-px flex-1 bg-surface-border" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {items.map(v => (
                        <VendorCard key={v.id} vendor={v} active={activeVendor === v.id} onClick={() => setActiveVendor(v.id)} />
                      ))}
                    </div>
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <EmptyState title={`No ${category} vendors`} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                  {filtered.map(v => (
                    <VendorCard key={v.id} vendor={v} active={activeVendor === v.id} onClick={() => setActiveVendor(v.id)} />
                  ))}
                </div>
              )
            )}
            
            {/* Vendor tips */}
            {!loading && !error && (
              <div className="mt-10 p-6 bg-surface-1 border border-surface-border rounded-2xl">
                <p className="eyebrow mb-4 text-coral-500">Good to know</p>
                <div className="space-y-4">
                  {[
                    { title: 'Cashless only', body: 'All vendors accept EFTPOS, Visa, Mastercard, and Apple Pay.' },
                    { title: 'Dietary labels', body: 'Look for GF (gluten-free) and V (vegan/vegetarian) labels.' },
                  ].map(({ title, body }) => (
                    <div key={title}>
                      <p className="text-sm font-bold text-ink-primary mb-0.5">{title}</p>
                      <p className="text-xs text-ink-secondary font-medium leading-relaxed">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Map Simulation */}
        <div className="w-full lg:w-1/2 xl:w-7/12 h-[400px] lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24 relative rounded-[2rem] overflow-hidden shadow-soft border border-surface-border mt-2 lg:mt-6 mb-6 lg:mb-0 group animate-fade-in">
          {!loading && !error && (
            <MapContainer
              center={[-37.7983, 144.9610]}
              zoom={16}
              scrollWheelZoom={true}
              className="w-full h-full bg-surface-1"
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
              <MapController centerPos={mapCenter} />
              {vendorsWithLocation.map(v => (
                <Marker 
                  key={v.id} 
                  position={[v.latitude, v.longitude]}
                  icon={createCustomIcon((CAT_CONFIG[v.category] || CAT_CONFIG.Food).accent)}
                  eventHandlers={{ click: () => setActiveVendor(v.id) }}
                  ref={(ref) => {
                    if (ref && activeVendor === v.id) {
                      ref.openPopup();
                    }
                  }}
                >
                  <Popup className="rounded-xl overflow-hidden shadow-lift border-none">
                    <div className="font-display font-bold text-ink-primary text-base mb-1">{v.name}</div>
                    {v.stall_name && <div className="text-xs font-bold text-coral-500 mb-1">{v.stall_name}</div>}
                    <div className="text-xs font-medium text-ink-secondary">{v.category}</div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
          
          <div className="absolute top-6 left-6 z-[400] bg-white/95 backdrop-blur-md px-5 py-4 rounded-2xl shadow-lift border border-white/40 pointer-events-none transition-opacity">
            <p className="text-base font-display font-bold text-ink-primary">Live Vendor Map</p>
            <p className="text-xs font-medium text-ink-secondary mt-1">Click a marker or card to zoom in</p>
          </div>
          {activeVendor && (
            <button 
              onClick={() => setActiveVendor(null)}
              className="absolute top-6 right-6 z-[400] bg-white text-ink-primary px-5 py-2.5 rounded-xl shadow-lift border border-surface-border font-bold text-sm hover:bg-surface-1 transition-transform hover:-translate-y-0.5"
            >
              Reset View
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
