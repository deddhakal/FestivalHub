import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent, uploadImage } from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/UI';

const BLANK = {
  title: '', description: '', stage: 'Main Stage',
  event_date: '', start_time: '', end_time: '',
  category: 'Pop', tickets_available: 100,
};

const STAGES     = ['Main Stage', 'Dance Arena', 'Garden Stage', 'Family Zone'];
const CATEGORIES = ['Electronic', 'Pop', 'Rock', 'Jazz', 'Reggae', 'Dance', 'Acoustic', 'Family', 'Ceremony', 'Wellness'];

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
          <select className="field-input bg-white" value={form.stage} onChange={e => u('stage', e.target.value)}>
            {STAGES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Category</label>
          <select className="field-input bg-white" value={form.category} onChange={e => u('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="field-label">Date *</label>
        <input type="date" className="field-input" value={form.event_date} onChange={e => u('event_date', e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Start Time *</label>
          <input type="time" className="field-input" value={form.start_time} onChange={e => u('start_time', e.target.value)} required />
        </div>
        <div>
          <label className="field-label">End Time</label>
          <input type="time" className="field-input" value={form.end_time} onChange={e => u('end_time', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="field-label">Tickets Available</label>
        <input type="number" min="0" className="field-input" value={form.tickets_available} onChange={e => u('tickets_available', Number(e.target.value))} />
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
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Details</th>
                <th>Date</th>
                <th>Stage & Time</th>
                <th>Availability</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id}>
                  <td>
                    <p className="font-bold text-ink-primary">{ev.title}</p>
                    <p className="text-ink-tertiary text-xs font-semibold uppercase tracking-wider mt-0.5">{ev.category}</p>
                  </td>
                  <td className="text-ink-secondary font-medium">
                    {new Date(ev.event_date).toLocaleDateString('en-US', { weekday:'short', day:'numeric', month:'short' })}
                  </td>
                  <td>
                    <p className="text-ink-secondary font-medium">{ev.stage}</p>
                    <p className="text-ink-tertiary text-xs font-semibold">{ev.start_time?.slice(0,5)}</p>
                  </td>
                  <td>
                    <span className={`chip ${ev.tickets_available < 30 ? 'chip-warning' : 'chip-success'}`}>
                      {ev.tickets_available} tickets
                    </span>
                  </td>
                  <td>
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
