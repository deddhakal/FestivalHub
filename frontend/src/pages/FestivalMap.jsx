import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Navigation, Locate, Tent, Info, Music, Coffee, Utensils, ShoppingBag, Ticket, Shield, Info as InfoIcon, Truck, AlertCircle } from 'lucide-react';
import axios from 'axios';

/* ── Fallback Center ────────────────────────────────────────── */
const FESTIVAL_CENTER = [-37.7983, 144.9610];

/* ── Icons & Colors Mapping ─────────────────────────────────── */
const TAG_STYLES = {
  Stage: { color: 'text-coral-500', bg: 'bg-coral-500', ring: 'ring-coral-500', icon: Music },
  Event: { color: 'text-coral-500', bg: 'bg-coral-500', ring: 'ring-coral-500', icon: Music },
  Food: { color: 'text-gold-500', bg: 'bg-gold-500', ring: 'ring-gold-500', icon: Utensils },
  Drinks: { color: 'text-sky-500', bg: 'bg-sky-500', ring: 'ring-sky-500', icon: Coffee },
  Merch: { color: 'text-lavender-500', bg: 'bg-lavender-500', ring: 'ring-lavender-500', icon: ShoppingBag },
  Merchandise: { color: 'text-lavender-500', bg: 'bg-lavender-500', ring: 'ring-lavender-500', icon: ShoppingBag },
  Attraction: { color: 'text-mint-500', bg: 'bg-mint-500', ring: 'ring-mint-500', icon: Ticket },
  Facility: { color: 'text-ink-tertiary', bg: 'bg-ink-tertiary', ring: 'ring-ink-tertiary', icon: Tent },
  Transport: { color: 'text-ink-secondary', bg: 'bg-ink-secondary', ring: 'ring-ink-secondary', icon: Truck },
  Safety: { color: 'text-red-500', bg: 'bg-red-500', ring: 'ring-red-500', icon: Shield },
  Default: { color: 'text-ink-primary', bg: 'bg-ink-primary', ring: 'ring-ink-primary', icon: MapPin },
};

const getStyle = (tag) => TAG_STYLES[tag] || TAG_STYLES.Default;

/* ── Custom Marker Icon ──────────────────────────────────────── */
const createCustomIcon = (tag, label, isActive) => {
  const style = getStyle(tag);
  const glowClasses = isActive 
    ? `ring-4 ${style.ring} ring-opacity-60 animate-pulse scale-125` 
    : 'scale-100 group-hover:scale-110';
    
  return L.divIcon({
    className: 'bg-transparent border-none outline-none',
    html: `
      <div class="relative group cursor-pointer w-10 h-10 flex items-center justify-center -top-5 -left-5 ${isActive ? 'z-50' : 'z-10'}">
        <div class="absolute inset-0 bg-white rounded-full shadow-lift flex items-center justify-center border-2 border-surface-0 transition-all duration-300 ${glowClasses}">
          <div class="w-2.5 h-2.5 rounded-full ${style.bg}"></div>
        </div>
        <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity whitespace-nowrap bg-ink-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-soft pointer-events-none z-[9999]">
          ${label}
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

/* ── Static Zone Definitions ─────────────────────────────────── */
const STATIC_ZONES = [
  {
    id: 'medical',
    label: 'Medical Tent',
    tag: 'Safety',
    desc: 'Fully staffed medical tent at Gate A. Open 24 hours during the festival.',
    details: ['24/7 staffed', 'First aid equipment', 'Located at Gate A'],
    pos: [-37.7978, 144.9585],
  },
  {
    id: 'parking',
    label: 'Main Parking',
    tag: 'Transport',
    desc: 'Main parking at Gate C. Accessible parking near Gate A. CBD shuttles available.',
    details: ['Gate C Location', 'Accessible at Gate A', 'CBD Shuttles'],
    pos: [-37.8000, 144.9640],
  },
  {
    id: 'info-point',
    label: 'Info Point',
    tag: 'Facility',
    desc: 'Collect wristbands, pick up festival guides, lost & found, and accessibility support.',
    details: ['Wristband pickup', 'Lost & found', 'Festival guides'],
    pos: [-37.7985, 144.9615],
  },
  {
    id: 'atm',
    label: 'ATM & Cash',
    tag: 'Facility',
    desc: 'ATMs at Gate A and Gate C. Most vendors accept cashless payments.',
    details: ['ATM at Gate A & C', 'EFTPOS / Cashless preferred'],
    pos: [-37.7972, 144.9605],
  },
  {
    id: 'restrooms-1',
    label: 'Main Restrooms',
    tag: 'Facility',
    desc: 'Large block of restrooms and handwashing stations.',
    details: ['Accessible stalls', 'Baby changing facilities'],
    pos: [-37.7992, 144.9625],
  }
];

/* ── Map Controller Component ────────────────────────────────── */
function MapController({ activeZonePos }) {
  const map = useMap();
  useEffect(() => {
    if (activeZonePos) {
      map.flyTo(activeZonePos, 18, { duration: 1.2, easeLinearity: 0.25 });
    }
  }, [activeZonePos, map]);
  return null;
}

/* ── Main Component ──────────────────────────────────────────── */
export default function FestivalMap() {
  const location = useLocation();
  const [activeZoneId, setActiveZoneId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Fetch dynamic data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, vendorsRes] = await Promise.all([
          axios.get('/api/events'),
          axios.get('/api/vendors')
        ]);

        const events = eventsRes.data.map(e => {
          // Generate slight random offset for missing coords to avoid complete overlap
          const lat = e.latitude || FESTIVAL_CENTER[0] + (Math.random() - 0.5) * 0.005;
          const lng = e.longitude || FESTIVAL_CENTER[1] + (Math.random() - 0.5) * 0.005;
          
          return {
            id: `event-${e.id}`,
            label: e.title,
            tag: e.category || 'Event',
            desc: e.description,
            details: [`Stage: ${e.stage}`, `Start: ${e.start_time}`],
            pos: [lat, lng],
            type: 'event'
          };
        });

        const vendors = vendorsRes.data.map(v => {
          const lat = v.latitude || FESTIVAL_CENTER[0] + (Math.random() - 0.5) * 0.005;
          const lng = v.longitude || FESTIVAL_CENTER[1] + (Math.random() - 0.5) * 0.005;
          
          return {
            id: `vendor-${v.id}`,
            label: v.name,
            tag: v.category || 'Food',
            desc: v.description,
            details: [`Stall: ${v.stall_name || 'N/A'}`, `Location: ${v.location || 'General Area'}`],
            pos: [lat, lng],
            type: 'vendor'
          };
        });

        setItems([...STATIC_ZONES, ...events, ...vendors]);
      } catch (err) {
        console.error('Failed to fetch map data:', err);
        // Fallback to static zones if API fails
        setItems(STATIC_ZONES);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle URL param selection on load
  useEffect(() => {
    if (!loading && items.length > 0) {
      const params = new URLSearchParams(location.search);
      const zoneFromUrl = params.get('zone');
      if (zoneFromUrl) {
        // Attempt to find exact match or partial match
        const found = items.find(i => i.id === zoneFromUrl || i.id.includes(zoneFromUrl));
        if (found) {
          setActiveZoneId(found.id);
        }
      }
    }
  }, [location.search, loading, items]);

  // Click outside to close search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items for search
  const filteredItems = items.filter(item => 
    (item.type === 'event' || item.type === 'vendor') &&
    (item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeItem = items.find(i => i.id === activeZoneId);

  const handleSelect = (item) => {
    setActiveZoneId(item.id);
    setSearchQuery(item.label);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full h-screen pt-fluid-xl bg-surface-0 overflow-hidden flex flex-col">
      {/* Decorative Header */}
      <div className="absolute top-20 left-4 md:left-8 z-[9999] pointer-events-none">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-primary drop-shadow-md bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/50">
          Festival Map
        </h1>
      </div>

      {/* Main Map Container */}
      <div className="flex-1 w-full relative z-0">
        <MapContainer
          center={FESTIVAL_CENTER}
          zoom={16}
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full"
        >
          {/* Beautiful light map style */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
          
          <MapController activeZonePos={activeItem?.pos || null} />

          {items.map((item) => (
            <Marker 
              key={item.id} 
              position={item.pos}
              icon={createCustomIcon(item.tag, item.label, item.id === activeZoneId)}
              eventHandlers={{
                click: () => setActiveZoneId(item.id === activeZoneId ? null : item.id),
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* ── Overlay: Search & Directory ───────────────────────── */}
      <div className="absolute top-40 left-4 md:left-8 z-[9999] w-80 max-w-[calc(100vw-2rem)] flex flex-col gap-4">
        
        {/* Search Bar */}
        <div ref={searchRef} className="relative w-full z-10">
          <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 shadow-lift rounded-2xl flex items-center px-4 py-3 transition-all focus-within:ring-2 ring-coral-500 ring-opacity-50">
            <Search className="w-5 h-5 text-ink-tertiary mr-3 shrink-0" />
            <input 
              type="text"
              placeholder="Search event, food, vendor..."
              className="bg-transparent border-none outline-none w-full text-ink-primary font-medium placeholder:text-ink-tertiary/70 p-0 focus:ring-0"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredItems.length > 0) {
                  handleSelect(filteredItems[0]);
                }
              }}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setActiveZoneId(null); }} className="p-1 hover:bg-surface-2 rounded-full transition-colors ml-2">
                <X className="w-4 h-4 text-ink-tertiary" />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-xl border border-surface-border shadow-lift rounded-2xl overflow-hidden max-h-80 overflow-y-auto custom-scrollbar"
              >
                {filteredItems.length > 0 ? (
                  <ul className="py-2">
                    {filteredItems.map(item => {
                      const style = getStyle(item.tag);
                      const Icon = style.icon;
                      return (
                        <li key={`search-${item.id}`}>
                          <button 
                            onClick={() => handleSelect(item)}
                            className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-surface-1 transition-colors"
                          >
                            <div className={`w-8 h-8 rounded-full ${style.bg} bg-opacity-10 flex items-center justify-center shrink-0`}>
                              <Icon className={`w-4 h-4 ${style.color}`} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-ink-primary leading-tight">{item.label}</p>
                              <p className="text-xs text-ink-secondary">{item.tag}</p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-ink-tertiary">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Directory List (Desktop Only, Optional) */}
        {!activeItem && (
          <div className="hidden md:block bg-white/80 backdrop-blur-xl border border-white/50 shadow-soft rounded-2xl overflow-hidden animate-slide-up animation-delay-100">
            <div className="px-5 py-4 border-b border-surface-border/50 bg-white/50 flex items-center gap-2">
              <Locate className="w-4 h-4 text-coral-500" />
              <h3 className="font-display font-bold text-ink-primary">Directory</h3>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
              {loading ? (
                <div className="p-4 text-center text-sm text-ink-secondary">Loading directory...</div>
              ) : (
                items.slice(0, 15).map(item => {
                  const style = getStyle(item.tag);
                  const Icon = style.icon;
                  return (
                    <button
                      key={`dir-${item.id}`}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white transition-colors text-left group"
                    >
                      <div className={`w-7 h-7 rounded-full ${style.bg} bg-opacity-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-3.5 h-3.5 ${style.color}`} />
                      </div>
                      <span className="text-sm font-semibold text-ink-secondary group-hover:text-ink-primary transition-colors truncate">
                        {item.label}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Overlay: Details Panel ────────────────────────────── */}
      <AnimatePresence>
        {activeItem && (
          <motion.div 
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-6 left-4 right-4 md:bottom-auto md:left-auto md:top-20 md:right-8 z-[9999] md:w-80 bg-white/95 backdrop-blur-2xl border border-white/50 shadow-lift rounded-3xl overflow-hidden"
          >
            {/* Color Accent Header */}
            <div className={`h-3 w-full ${getStyle(activeItem.tag).bg}`} />
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`px-2.5 py-1 rounded-md bg-opacity-10 text-xs font-bold uppercase tracking-wider ${getStyle(activeItem.tag).color} ${getStyle(activeItem.tag).bg.replace('bg-', 'bg-').concat('/10')}`}>
                    {activeItem.tag}
                  </div>
                </div>
                <button 
                  onClick={() => setActiveZoneId(null)}
                  className="p-1.5 hover:bg-surface-2 rounded-full transition-colors shrink-0"
                >
                  <X className="w-5 h-5 text-ink-tertiary" />
                </button>
              </div>
              
              <h2 className="font-display text-2xl font-bold text-ink-primary mb-2 leading-tight pr-4">
                {activeItem.label}
              </h2>
              
              <p className="text-sm text-ink-secondary leading-relaxed mb-6 font-medium">
                {activeItem.desc || 'No description available for this location.'}
              </p>
              
              {activeItem.details && activeItem.details.length > 0 && (
                <div className="bg-surface-1 p-4 rounded-2xl mb-6">
                  <p className="eyebrow mb-3 text-ink-tertiary flex items-center gap-1.5">
                    <InfoIcon className="w-3.5 h-3.5" /> Quick Info
                  </p>
                  <ul className="space-y-2.5">
                    {activeItem.details.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-ink-secondary font-medium">
                        <div className={`w-1.5 h-1.5 mt-1.5 rounded-full ${getStyle(activeItem.tag).bg} shrink-0`} />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (Mobile Only) */}
      <div className="absolute bottom-6 right-4 md:hidden z-[9999]">
        <button 
          onClick={() => {
            const map = document.querySelector('.leaflet-container')?._leaflet_map;
            if (map) map.flyTo(FESTIVAL_CENTER, 16, { duration: 1 });
          }}
          className="w-12 h-12 bg-white text-ink-primary shadow-soft rounded-full flex items-center justify-center active:scale-95 transition-transform"
        >
          <Locate className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
