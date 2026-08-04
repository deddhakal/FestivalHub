import { useState, useEffect } from 'react';
import { getBookings, deleteBooking, getEvents, updateEvent } from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/UI';

export default function ManageTickets() {
  const [bookings,  setBookings]  = useState([]);
  const [events,    setEvents]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState('bookings'); // 'bookings' | 'availability'
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState('');
  const [search,    setSearch]    = useState('');

  const flash = m => { setMsg(m); setTimeout(() => setMsg(''), 3500); };

  const load = async () => {
    setLoading(true);
    try {
      const [bRes, eRes] = await Promise.all([getBookings(), getEvents()]);
      setBookings(bRes.data);
      setEvents(eRes.data);
    } catch (e) { flash(`❌ ${e.response?.data?.error || e.message}`); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCancelBooking = async (b) => {
    if (!window.confirm(`Cancel booking ${b.booking_ref} for ${b.visitor_name}?`)) return;
    setSaving(true);
    try {
      await deleteBooking(b.id);
      flash('✅ Booking cancelled and tickets restored.');
      load();
    } catch (e) { flash(`❌ ${e.response?.data?.error || e.message}`); }
    finally { setSaving(false); }
  };

  const handleTicketUpdate = async (event, newCount) => {
    const count = Number(newCount);
    if (isNaN(count) || count < 0) return;
    setSaving(true);
    try {
      await updateEvent(event.id, { ...event, tickets_available: count });
      flash('✅ Ticket count updated.');
      load();
    } catch (e) { flash(`❌ ${e.response?.data?.error || e.message}`); }
    finally { setSaving(false); }
  };

  const filtered = bookings.filter(b =>
    !search ||
    b.visitor_name?.toLowerCase().includes(search.toLowerCase()) ||
    b.visitor_email?.toLowerCase().includes(search.toLowerCase()) ||
    b.booking_ref?.toLowerCase().includes(search.toLowerCase()) ||
    b.event_title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Tickets & Bookings</h1>
          <p className="text-gray-400 text-sm mt-1">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={load} className="btn-secondary btn-sm">🔄 Refresh</button>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${msg.startsWith('✅') ? 'bg-green-900/30 border border-green-700/50 text-green-300' : 'bg-red-900/30 border border-red-700/50 text-red-300'}`}>
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'bookings',     label: `🎟️ Bookings (${bookings.length})` },
          { key: 'availability', label: '📊 Ticket Availability' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.key ? 'bg-primary-600 text-white' : 'bg-festival-card border border-festival-border text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {/* ── Bookings table ────────────────────────────── */}
          {tab === 'bookings' && (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  className="input max-w-sm"
                  placeholder="🔍 Search by name, email, ref, event..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {filtered.length === 0 ? (
                <EmptyState icon="🎟️" title="No bookings found" />
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Ref</th><th>Visitor</th><th>Event</th>
                        <th>Type</th><th>Qty</th><th>Date</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(b => (
                        <tr key={b.id}>
                          <td><span className="font-mono text-primary-400 text-xs">{b.booking_ref}</span></td>
                          <td>
                            <p className="text-white text-sm font-medium">{b.visitor_name}</p>
                            <p className="text-gray-500 text-xs">{b.visitor_email}</p>
                          </td>
                          <td>
                            <p className="text-gray-300 text-sm">{b.event_title}</p>
                            <p className="text-gray-500 text-xs">{b.stage}</p>
                          </td>
                          <td>
                            <span className={`badge ${b.ticket_type === 'VIP' ? 'badge-gold' : 'badge-blue'}`}>
                              {b.ticket_type === 'VIP' ? '⭐' : '🎟️'} {b.ticket_type}
                            </span>
                          </td>
                          <td className="text-white font-semibold">{b.quantity}</td>
                          <td className="text-gray-400 text-sm">
                            {new Date(b.created_at).toLocaleDateString('en-AU', { day:'numeric', month:'short' })}
                          </td>
                          <td>
                            <button
                              disabled={saving}
                              onClick={() => handleCancelBooking(b)}
                              className="px-3 py-1 bg-red-900/40 hover:bg-red-900/70 text-red-300 text-xs rounded-lg border border-red-700/40 transition-colors disabled:opacity-40"
                            >
                              ✕ Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* ── Ticket availability ────────────────────────── */}
          {tab === 'availability' && (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr><th>Event</th><th>Date</th><th>Stage</th><th>Available</th><th>Adjust</th></tr>
                </thead>
                <tbody>
                  {events.map(ev => (
                    <TicketRow key={ev.id} event={ev} saving={saving} onUpdate={handleTicketUpdate} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TicketRow({ event, saving, onUpdate }) {
  const [val, setVal] = useState(event.tickets_available);
  const changed = val !== event.tickets_available;

  return (
    <tr>
      <td>
        <p className="text-white text-sm font-medium">{event.title}</p>
        <p className="text-gray-500 text-xs">{event.category}</p>
      </td>
      <td className="text-gray-300 text-sm">
        {new Date(event.event_date).toLocaleDateString('en-AU', { weekday:'short', day:'numeric', month:'short' })}
      </td>
      <td className="text-gray-400 text-sm">{event.stage}</td>
      <td>
        <span className={`text-sm font-bold ${val < 30 ? 'text-red-400' : 'text-green-400'}`}>{val}</span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <button onClick={() => setVal(v => Math.max(0, v - 10))} className="w-7 h-7 rounded-lg bg-festival-darker border border-festival-border text-white hover:bg-festival-border transition-colors text-sm">−</button>
          <input
            type="number"
            min="0"
            className="w-16 text-center bg-festival-darker border border-festival-border rounded-lg px-2 py-1 text-white text-sm focus:border-primary-500 focus:outline-none"
            value={val}
            onChange={e => setVal(Number(e.target.value))}
          />
          <button onClick={() => setVal(v => v + 10)} className="w-7 h-7 rounded-lg bg-festival-darker border border-festival-border text-white hover:bg-festival-border transition-colors text-sm">+</button>
          {changed && (
            <button
              disabled={saving}
              onClick={() => onUpdate(event, val)}
              className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
            >
              Save
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
