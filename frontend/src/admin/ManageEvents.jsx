import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent, uploadImage } from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/UI';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

const BLANK = {
  title: '', description: '', stage: 'Main Stage',
  event_date: '', start_time: '', end_time: '',
  category: 'Pop', tickets_available: 100, is_free: 1, general_price: 0, vip_price: 0,
  latitude: '', longitude: '',
};

const STAGES     = ['Main Stage', 'Dance Arena', 'Garden Stage', 'Family Zone'];
const CATEGORIES = ['Electronic', 'Pop', 'Rock', 'Jazz', 'Reggae', 'Dance', 'Acoustic', 'Family', 'Ceremony', 'Wellness'];

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

function EventForm({ initial = BLANK, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initial.image_url ? `http://localhost:5000${initial.image_url}` : '');
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form, imageFile); }} className="space-y-5">
      <div>
        <label className="field-label">Event Title *</label>
        <input className="field-input" placeholder="e.g. Summer Kickoff" value={form.title} onChange={e => u('title', e.target.value)} required />
      </div>
      <div>
        <label className="field-label">Description</label>
        <textarea className="field-input resize-none" placeholder="Details about the event..." rows={3} value={form.description} onChange={e => u('description', e.target.value)} />
      </div>
      <div>
        <label className="field-label">Event Image</label>
        <div className="flex items-center gap-4">
          {preview && <img src={preview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-surface-border shrink-0" />}
          <input type="file" accept="image/*" className="field-input" onChange={handleFileChange} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Stage</label>
          <input type="text" className="field-input bg-white" placeholder="e.g. Main Stage" value={form.stage} onChange={e => u('stage', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Category</label>
          <input type="text" list="category-options" className="field-input bg-white" placeholder="e.g. Pop" value={form.category} onChange={e => u('category', e.target.value)} />
          <datalist id="category-options">
            {CATEGORIES.map(c => <option key={c} value={c} />)}
          </datalist>
        </div>
      </div>
      <div>
        <label className="field-label">Date (YYYY-MM-DD) *</label>
        <input type="text" className="field-input" placeholder="e.g. 2026-10-15" value={form.event_date} onChange={e => u('event_date', e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Start Time (HH:MM) *</label>
          <input type="text" className="field-input" placeholder="e.g. 18:00" value={form.start_time} onChange={e => u('start_time', e.target.value)} required />
        </div>
        <div>
          <label className="field-label">End Time (HH:MM)</label>
          <input type="text" className="field-input" placeholder="e.g. 23:00" value={form.end_time} onChange={e => u('end_time', e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Tickets Available</label>
          <input type="number" min="0" className="field-input" value={form.tickets_available} onChange={e => u('tickets_available', Number(e.target.value))} />
        </div>
        <div>
          <label className="field-label">Cost</label>
          <div className="flex bg-surface-1 rounded-xl p-1 border border-surface-border">
            <button type="button" onClick={() => u('is_free', 1)} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors ${form.is_free ? 'bg-white shadow-soft text-ink-primary' : 'text-ink-secondary hover:text-ink-primary'}`}>
              Free
            </button>
            <button type="button" onClick={() => u('is_free', 0)} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors ${!form.is_free ? 'bg-white shadow-soft text-ink-primary' : 'text-ink-secondary hover:text-ink-primary'}`}>
              Paid
            </button>
          </div>
        </div>
      </div>
      
      {!form.is_free && (
        <div className="grid grid-cols-2 gap-4 animate-fade-in p-4 bg-surface-1 rounded-xl border border-surface-border">
          <div>
            <label className="field-label">General Ticket Price ($)</label>
            <input type="text" inputMode="decimal" className="field-input bg-white" value={form.general_price} onChange={e => u('general_price', e.target.value.replace(/[^0-9.]/g, ''))} placeholder="e.g. 45.00" />
          </div>
          <div>
            <label className="field-label">VIP Ticket Price ($)</label>
            <input type="text" inputMode="decimal" className="field-input bg-white" value={form.vip_price} onChange={e => u('vip_price', e.target.value.replace(/[^0-9.]/g, ''))} placeholder="e.g. 120.00" />
          </div>
        </div>
      )}

      {/* Map Location Picker */}
      <div className="pt-2 border-t border-surface-border mt-6">
        <label className="field-label">Map Location</label>
        <LocationPicker 
          lat={form.latitude} 
          lng={form.longitude} 
          onChange={(lat, lng) => { u('latitude', lat); u('longitude', lng); }} 
        />
        {form.latitude && form.longitude && (
          <p className="text-2xs text-ink-tertiary mt-2">
            Selected: {Number(form.latitude).toFixed(4)}, {Number(form.longitude).toFixed(4)}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-4 mt-6 border-t border-surface-border">
        <button type="submit" disabled={saving} className="btn-primary flex-1">
          {saving ? 'Saving...' : 'Save Event'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

export default function ManageEvents() {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null); // null | 'add' | { edit: event } | { delete: event }
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [msgType, setMsgType] = useState('success');

  const load = () => {
    setLoading(true);
    getEvents().then(r => setEvents(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const flash = (m, type='success') => { setMsg(m); setMsgType(type); setTimeout(() => setMsg(''), 3000); };

  const handleSave = async (form, imageFile) => {
    setSaving(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const res = await uploadImage(formData);
        imageUrl = res.data.imageUrl;
      }
      const payload = { ...form, image_url: imageUrl };

      if (modal?.edit) {
        await updateEvent(modal.edit.id, payload);
        flash('Event updated successfully.', 'success');
      } else {
        await createEvent(payload);
        flash('Event created successfully.', 'success');
      }
      setModal(null);
      load();
    } catch (e) {
      flash(e.response?.data?.error || e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ev) => {
    setSaving(true);
    try {
      await deleteEvent(ev.id);
      flash('Event deleted.', 'success');
      setModal(null);
      load();
    } catch (e) {
      flash(e.response?.data?.error || e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-ink-primary">Manage Events</h1>
          <p className="text-ink-secondary text-sm mt-1">{events.length} event{events.length !== 1 ? 's' : ''} scheduled</p>
        </div>
        <button id="add-event-btn" onClick={() => setModal('add')} className="btn-primary btn-sm">
          ＋ Add Event
        </button>
      </div>

      {msg && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border animate-fade-in ${msgType === 'success' ? 'bg-mint-50 border-mint-200 text-mint-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {msgType === 'success' ? '✅' : '⚠️'} {msg}
        </div>
      )}

      {loading ? <div className="py-20 flex justify-center"><LoadingSpinner /></div> : events.length === 0 ? (
        <div className="card p-12 text-center border border-surface-border">
          <div className="text-5xl mb-4">🎭</div>
          <h3 className="font-display text-xl font-bold text-ink-primary mb-2">No events yet</h3>
          <p className="text-ink-secondary text-sm mb-6">Click 'Add Event' to create the first one.</p>
          <button onClick={() => setModal('add')} className="btn-secondary btn-sm">Create Event</button>
        </div>
      ) : (
        <div className="card border border-surface-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-surface-border text-ink-tertiary">
                  <th className="font-semibold py-3 px-4">Event</th>
                  <th className="font-semibold py-3 px-4">Date & Time</th>
                  <th className="font-semibold py-3 px-4">Stage / Location</th>
                  <th className="font-semibold py-3 px-4">Tickets</th>
                  <th className="font-semibold py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {events.map(ev => (
                  <tr key={ev.id} className="hover:bg-surface-1/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {ev.image_url ? (
                          <img src={`http://localhost:5000${ev.image_url}`} alt="" className="w-10 h-10 rounded-lg object-cover bg-surface-2 border border-surface-border shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-surface-2 border border-surface-border flex items-center justify-center shrink-0 text-ink-tertiary text-xs font-bold">
                            IMG
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-ink-primary text-base">{ev.title}</p>
                          <span className="badge badge-primary mt-1 text-2xs px-2 py-0.5">{ev.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-ink-primary">{ev.event_date.slice(0, 10)}</p>
                      <p className="text-xs text-ink-tertiary">{ev.start_time.slice(0, 5)} {ev.end_time ? `- ${ev.end_time.slice(0, 5)}` : ''}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-ink-primary">{ev.stage}</p>
                      {ev.latitude && ev.longitude ? (
                        <p className="text-2xs text-brand-500 font-bold mt-0.5">📍 Pinned</p>
                      ) : (
                        <p className="text-2xs text-ink-tertiary mt-0.5">No Map Pin</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`chip ${ev.tickets_available < 30 ? 'chip-warning' : 'chip-success'} mb-1 block w-fit`}>
                        {ev.tickets_available} tickets
                      </span>
                      <span className="text-xs font-bold text-ink-secondary">
                        {ev.is_free ? 'Free' : `From $${Number(ev.general_price).toFixed(2)}`}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setModal({ edit: ev })}
                          className="btn-secondary px-3 py-1.5 text-xs rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setModal({ delete: ev })}
                          className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold px-3 py-1.5 text-xs rounded-lg shadow-sm transition-all duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {(modal === 'add' || modal?.edit) && (
        <Modal
          title={modal?.edit ? `Edit: ${modal.edit.title}` : 'Add New Event'}
          onClose={() => setModal(null)}
        >
          <EventForm
            initial={modal?.edit ? {
              title: modal.edit.title, description: modal.edit.description || '',
              stage: modal.edit.stage, event_date: modal.edit.event_date,
              start_time: modal.edit.start_time?.slice(0,5) || '',
              end_time: modal.edit.end_time?.slice(0,5) || '',
              category: modal.edit.category, tickets_available: modal.edit.tickets_available,
              image_url: modal.edit.image_url, 
              is_free: modal.edit.is_free ?? 1, 
              general_price: modal.edit.general_price ?? 0, 
              vip_price: modal.edit.vip_price ?? 0,
            } : BLANK}
            onSave={handleSave}
            onCancel={() => setModal(null)}
            saving={saving}
          />
        </Modal>
      )}

      {/* Delete confirm modal */}
      {modal?.delete && (
        <Modal title="Delete Event" onClose={() => setModal(null)}>
          <p className="text-ink-secondary mb-2">Are you sure you want to permanently delete:</p>
          <p className="font-display font-bold text-ink-primary text-xl mb-6">"{modal.delete.title}"</p>
          
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-bold mb-8">
            ⚠️ Warning: This will also delete all bookings associated with this event.
          </div>
          
          <div className="flex gap-3">
            <button disabled={saving} onClick={() => handleDelete(modal.delete)} className="bg-red-500 text-white hover:bg-red-600 font-bold px-6 py-3 rounded-full flex-1 shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60">
              {saving ? 'Deleting...' : 'Yes, Delete Event'}
            </button>
            <button onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
