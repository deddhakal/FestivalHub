import { useState, useEffect } from 'react';
import { getVendors, createVendor, updateVendor, deleteVendor } from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/UI';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

const BLANK = { name: '', stall_name: '', description: '', category: 'Food', location: '', latitude: '', longitude: '', is_active: 1 };
const CATEGORIES = ['Food', 'Drinks', 'Merchandise', 'Attraction'];
const CAT_ICONS  = { Food:'🍔', Drinks:'🍺', Merchandise:'👕', Attraction:'🎡' };
const CAT_BADGE_CLASSES = {
  Food: 'badge-gold',
  Drinks: 'badge-sky',
  Merchandise: 'badge-lavender',
  Attraction: 'badge-mint'
};

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/20 backdrop-blur-sm">
      <div className="bg-surface-0 border border-surface-border shadow-lift rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-surface-border sticky top-0 bg-surface-0/95 backdrop-blur z-10">
          <h2 className="font-display font-bold text-ink-primary text-xl">{title}</h2>
          <button onClick={onClose} className="text-ink-tertiary hover:text-ink-primary text-xl transition-colors">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapController({ centerPos }) {
  const map = useMap();
  useEffect(() => {
    if (centerPos && centerPos[0] && centerPos[1]) {
      map.flyTo(centerPos, 16);
    }
  }, [centerPos, map]);
  return null;
}

function LocationPicker({ lat, lng, onChange }) {
  const [search, setSearch] = useState('');
  const position = lat && lng ? [lat, lng] : [-37.7983, 144.9610];
  
  function MapEvents() {
    useMapEvents({
      click(e) {
        onChange(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        onChange(newLat, newLng);
      } else {
        alert('Location not found');
      }
    } catch (err) {
      console.error(err);
      alert('Search failed');
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Search location (e.g. Melbourne University)" 
          className="field-input py-1.5 px-3 text-sm flex-1 bg-surface-1" 
        />
        <button type="submit" className="btn-secondary py-1.5 px-3 text-xs">Search</button>
      </form>
      <div className="h-48 w-full rounded-xl overflow-hidden border border-surface-border z-0 relative">
        <MapContainer center={position} zoom={16} className="h-full w-full bg-surface-1">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
          <MapEvents />
          <MapController centerPos={lat && lng ? [lat, lng] : null} />
          {lat && lng && <Marker position={[lat, lng]} icon={defaultIcon} />}
        </MapContainer>
        <div className="absolute bottom-2 left-2 z-[400] bg-white/90 px-2 py-1 text-2xs font-bold rounded shadow-sm text-ink-secondary pointer-events-none">
          Click map to pin exactly
        </div>
      </div>
    </div>
  );
}

function VendorForm({ initial = BLANK, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Vendor Name *</label>
          <input className="field-input" placeholder="e.g. The Matcha Bar" value={form.name} onChange={e => u('name', e.target.value)} required />
        </div>
        <div>
          <label className="field-label">Stall Name</label>
          <input className="field-input" placeholder="e.g. Stall A1" value={form.stall_name} onChange={e => u('stall_name', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="field-label">Description</label>
        <textarea className="field-input resize-none" placeholder="What are they selling?" rows={3} value={form.description} onChange={e => u('description', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Category *</label>
          <select className="field-input bg-white" value={form.category} onChange={e => u('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Status</label>
          <select className="field-input bg-white" value={form.is_active} onChange={e => u('is_active', Number(e.target.value))}>
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>
      </div>
      <div>
        <label className="field-label">Location Description</label>
        <input className="field-input" placeholder="e.g. Food Court - Stall A1" value={form.location} onChange={e => u('location', e.target.value)} />
      </div>
      <div>
        <label className="field-label">Map Coordinates (Optional)</label>
        <div className="flex gap-2 mb-2">
          <input type="number" step="any" className="field-input text-xs flex-1" placeholder="Latitude" value={form.latitude} onChange={e => u('latitude', e.target.value)} />
          <input type="number" step="any" className="field-input text-xs flex-1" placeholder="Longitude" value={form.longitude} onChange={e => u('longitude', e.target.value)} />
        </div>
        <LocationPicker lat={form.latitude} lng={form.longitude} onChange={(lat, lng) => setForm(f => ({ ...f, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }))} />
      </div>
      <div className="flex gap-3 pt-4 mt-6 border-t border-surface-border">
        <button type="submit" disabled={saving} className="btn-primary flex-1">
          {saving ? 'Saving...' : 'Save Vendor'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

export default function ManageVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [msgType, setMsgType] = useState('success');
  const [catFilter, setCatFilter] = useState('All');

  const load = () => {
    setLoading(true);
    getVendors().then(r => setVendors(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const flash = (m, type='success') => { setMsg(m); setMsgType(type); setTimeout(() => setMsg(''), 3000); };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal?.edit) { await updateVendor(modal.edit.id, form); flash('Vendor updated successfully.', 'success'); }
      else             { await createVendor(form);               flash('Vendor created successfully.', 'success'); }
      setModal(null); load();
    } catch (e) { flash(e.response?.data?.error || e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (v) => {
    setSaving(true);
    try {
      await deleteVendor(v.id);
      flash('Vendor deleted.', 'success');
      setModal(null); load();
    } catch (e) { flash(e.response?.data?.error || e.message, 'error'); }
    finally { setSaving(false); }
  };

  const displayed = catFilter === 'All' ? vendors : vendors.filter(v => v.category === catFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-ink-primary">Manage Vendors</h1>
          <p className="text-ink-secondary text-sm mt-1">{vendors.length} vendors total</p>
        </div>
        <button id="add-vendor-btn" onClick={() => setModal('add')} className="btn-primary btn-sm">＋ Add Vendor</button>
      </div>

      {msg && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border animate-fade-in ${msgType === 'success' ? 'bg-mint-50 border-mint-200 text-mint-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {msgType === 'success' ? '✅' : '⚠️'} {msg}
        </div>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['All', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 border ${
              catFilter === c ? 'bg-coral-50 border-coral-200 text-coral-600 shadow-sm' : 'bg-surface-0 border-surface-border text-ink-secondary hover:bg-surface-1 hover:text-ink-primary'
            }`}
          >
            {c === 'All' ? '✨' : CAT_ICONS[c]} {c}
          </button>
        ))}
      </div>

      {loading ? <div className="py-20 flex justify-center"><LoadingSpinner /></div> : displayed.length === 0 ? (
        <div className="card p-12 text-center border border-surface-border">
          <div className="text-5xl mb-4">🍔</div>
          <h3 className="font-display text-xl font-bold text-ink-primary mb-2">No vendors found</h3>
          <p className="text-ink-secondary text-sm mb-6">Change your filter or add a new vendor.</p>
          <button onClick={() => setModal('add')} className="btn-secondary btn-sm">Add Vendor</button>
        </div>
      ) : (
        <div className="card border border-surface-border overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vendor & Stall</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(v => (
                <tr key={v.id}>
                  <td>
                    <p className="font-bold text-ink-primary">{v.name}</p>
                    <div className="text-ink-secondary text-xs font-medium mt-0.5 flex flex-col gap-0.5">
                      {v.stall_name && <span className="text-amber-600">[{v.stall_name}]</span>}
                      <span className="line-clamp-1">{v.description}</span>
                    </div>
                  </td>
                  <td>
                    <span className={CAT_BADGE_CLASSES[v.category] || 'badge-default'}>
                      {CAT_ICONS[v.category]} {v.category}
                    </span>
                  </td>
                  <td className="text-ink-secondary text-xs font-medium">
                    <p>{v.location || '—'}</p>
                    {v.latitude && v.longitude && <p className="text-2xs text-ink-tertiary font-mono">{v.latitude}, {v.longitude}</p>}
                  </td>
                  <td>
                    <span className={`chip ${v.is_active ? 'chip-success' : 'bg-surface-2 text-ink-tertiary'}`}>
                      {v.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setModal({ edit: v })} className="btn-secondary px-3 py-1.5 text-xs rounded-lg">Edit</button>
                      <button onClick={() => setModal({ delete: v })} className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold px-3 py-1.5 text-xs rounded-lg shadow-sm transition-all duration-200">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(modal === 'add' || modal?.edit) && (
        <Modal title={modal?.edit ? `Edit: ${modal.edit.name}` : 'Add New Vendor'} onClose={() => setModal(null)}>
          <VendorForm
            initial={modal?.edit ? { name: modal.edit.name, stall_name: modal.edit.stall_name || '', description: modal.edit.description || '', category: modal.edit.category, location: modal.edit.location || '', latitude: modal.edit.latitude || '', longitude: modal.edit.longitude || '', is_active: modal.edit.is_active } : BLANK}
            onSave={handleSave} onCancel={() => setModal(null)} saving={saving}
          />
        </Modal>
      )}

      {modal?.delete && (
        <Modal title="Delete Vendor" onClose={() => setModal(null)}>
          <p className="text-ink-secondary mb-2">Are you sure you want to permanently delete:</p>
          <p className="font-display font-bold text-ink-primary text-xl mb-6">"{modal.delete.name}"</p>
          <div className="flex gap-3">
            <button disabled={saving} onClick={() => handleDelete(modal.delete)} className="bg-red-500 text-white hover:bg-red-600 font-bold px-6 py-3 rounded-full flex-1 shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60">
              {saving ? 'Deleting...' : 'Yes, Delete Vendor'}
            </button>
            <button onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
