import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/api';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-festival-card border border-festival-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-festival-border sticky top-0 bg-festival-card">
          <h2 className="font-display font-bold text-white text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl transition-colors">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function EventForm({ initial = BLANK, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div>
        <label className="label">Title *</label>
        <input className="input" value={form.title} onChange={e => u('title', e.target.value)} required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={3} value={form.description} onChange={e => u('description', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Stage</label>
          <select className="input" value={form.stage} onChange={e => u('stage', e.target.value)}>
            {STAGES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.category} onChange={e => u('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Date *</label>
        <input type="date" className="input" value={form.event_date} onChange={e => u('event_date', e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Start Time *</label>
          <input type="time" className="input" value={form.start_time} onChange={e => u('start_time', e.target.value)} required />
        </div>
        <div>
          <label className="label">End Time</label>
          <input type="time" className="input" value={form.end_time} onChange={e => u('end_time', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Tickets Available</label>
        <input type="number" min="0" className="input" value={form.tickets_available} onChange={e => u('tickets_available', Number(e.target.value))} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
          {saving ? '⏳ Saving...' : '💾 Save Event'}
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

  const load = () => {
    setLoading(true);
    getEvents().then(r => setEvents(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal?.edit) {
        await updateEvent(modal.edit.id, form);
        flash('✅ Event updated successfully.');
      } else {
        await createEvent(form);
        flash('✅ Event created successfully.');
      }
      setModal(null);
      load();
    } catch (e) {
      flash(`❌ ${e.response?.data?.error || e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ev) => {
    setSaving(true);
    try {
      await deleteEvent(ev.id);
      flash('✅ Event deleted.');
      setModal(null);
      load();
    } catch (e) {
      flash(`❌ ${e.response?.data?.error || e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Manage Events</h1>
          <p className="text-gray-400 text-sm mt-1">{events.length} event{events.length !== 1 ? 's' : ''} total</p>
        </div>
        <button id="add-event-btn" onClick={() => setModal('add')} className="btn-primary">
          ＋ Add Event
        </button>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${msg.startsWith('✅') ? 'bg-green-900/30 border border-green-700/50 text-green-300' : 'bg-red-900/30 border border-red-700/50 text-red-300'}`}>
          {msg}
        </div>
      )}

      {loading ? <LoadingSpinner /> : events.length === 0 ? (
        <EmptyState icon="🎭" title="No events yet" subtitle="Click 'Add Event' to create the first one." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Stage</th>
                <th>Time</th>
                <th>Tickets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id}>
                  <td>
                    <p className="text-white font-medium">{ev.title}</p>
                    <p className="text-gray-500 text-xs">{ev.category}</p>
                  </td>
                  <td className="text-gray-300 text-sm">
                    {new Date(ev.event_date).toLocaleDateString('en-AU', { weekday:'short', day:'numeric', month:'short' })}
                  </td>
                  <td className="text-gray-300 text-sm">{ev.stage}</td>
                  <td className="text-gray-300 text-sm">{ev.start_time?.slice(0,5)}</td>
                  <td>
                    <span className={`text-sm font-medium ${ev.tickets_available < 30 ? 'text-red-400' : 'text-green-400'}`}>
                      {ev.tickets_available}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModal({ edit: ev })}
                        className="px-3 py-1 bg-blue-900/40 hover:bg-blue-900/70 text-blue-300 text-xs rounded-lg border border-blue-700/40 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setModal({ delete: ev })}
                        className="px-3 py-1 bg-red-900/40 hover:bg-red-900/70 text-red-300 text-xs rounded-lg border border-red-700/40 transition-colors"
                      >
                        🗑️ Delete
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
          <p className="text-gray-300 mb-2">Are you sure you want to delete:</p>
          <p className="text-white font-bold text-lg mb-6">"{modal.delete.title}"</p>
          <p className="text-red-400 text-sm mb-6">⚠️ This will also delete all bookings for this event.</p>
          <div className="flex gap-3">
            <button disabled={saving} onClick={() => handleDelete(modal.delete)} className="btn-danger flex-1 justify-center disabled:opacity-60">
              {saving ? '⏳ Deleting...' : '🗑️ Yes, Delete'}
            </button>
            <button onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
