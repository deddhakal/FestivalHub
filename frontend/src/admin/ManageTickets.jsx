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
  const [msgType,   setMsgType]   = useState('success');
  const [search,    setSearch]    = useState('');

  const flash = (m, type='success') => { setMsg(m); setMsgType(type); setTimeout(() => setMsg(''), 3500); };

  const load = async () => {
    setLoading(true);
    try {
      const [bRes, eRes] = await Promise.all([getBookings(), getEvents()]);
      setBookings(bRes.data);
      setEvents(eRes.data);
    } catch (e) { flash(e.response?.data?.error || e.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCancelBooking = async (b) => {
    if (!window.confirm(`Cancel booking ${b.booking_ref} for ${b.visitor_name}?`)) return;
    setSaving(true);
    try {
      await deleteBooking(b.id);
      flash('Booking cancelled and tickets restored.', 'success');
      load();
    } catch (e) { flash(e.response?.data?.error || e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleTicketUpdate = async (event, newCount) => {
    const count = Number(newCount);
    if (isNaN(count) || count < 0) return;
    setSaving(true);
    try {
      await updateEvent(event.id, { ...event, tickets_available: count });
      flash('Ticket count updated.', 'success');
      load();
    } catch (e) { flash(e.response?.data?.error || e.message, 'error'); }
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-ink-primary">Tickets & Bookings</h1>
          <p className="text-ink-secondary text-sm mt-1">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={load} className="btn-secondary btn-sm">🔄 Refresh</button>
      </div>

      {msg && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border animate-fade-in ${msgType === 'success' ? 'bg-mint-50 border-mint-200 text-mint-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {msgType === 'success' ? '✅' : '⚠️'} {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3 mb-8 border-b border-surface-border pb-4 overflow-x-auto custom-scrollbar">
        {[
          { key: 'bookings',     label: `🎟️ Bookings (${bookings.length})` },
          { key: 'availability', label: '📊 Ticket Availability' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border whitespace-nowrap ${
              tab === t.key 
                ? 'bg-mint-50 border-mint-200 text-mint-700 shadow-sm' 
                : 'bg-surface-0 border-surface-border text-ink-secondary hover:bg-surface-1 hover:text-ink-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <div className="py-20 flex justify-center"><LoadingSpinner /></div> : (
        <>
          {/* ── Bookings table ────────────────────────────── */}
          {tab === 'bookings' && (
            <>
              <div className="mb-6 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-ink-tertiary">🔍</span>
                  </div>
                  <input
                    type="text"
                    className="field-input pl-11"
                    placeholder="Search by name, email, ref, event..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="card p-12 text-center border border-surface-border">
                  <div className="text-5xl mb-4">🎟️</div>
                  <h3 className="font-display text-xl font-bold text-ink-primary mb-2">No bookings found</h3>
                  <p className="text-ink-secondary text-sm">Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div className="card border border-surface-border overflow-hidden">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Ref</th>
                        <th>Visitor Details</th>
                        <th>Event</th>
                        <th>Tickets</th>
                        <th>Booked On</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(b => (
                        <tr key={b.id}>
                          <td><span className="ref-code">{b.booking_ref}</span></td>
                          <td>
                            <p className="text-ink-primary text-sm font-bold">{b.visitor_name}</p>
                            <p className="text-ink-tertiary text-xs font-medium">{b.visitor_email}</p>
                          </td>
                          <td>
                            <p className="text-ink-secondary text-sm font-bold">{b.event_title}</p>
                            <p className="text-ink-tertiary text-xs font-medium mt-0.5">{b.stage}</p>
                          </td>
                          <td>
                            <div className="flex flex-col items-start gap-1">
                              <span className={`badge ${b.ticket_type === 'VIP' ? 'badge-gold' : 'badge-sky'}`}>
                                {b.ticket_type === 'VIP' ? '⭐' : '🎟️'} {b.ticket_type}
                              </span>
                              <span className="text-xs font-bold text-ink-secondary mt-1">Qty: {b.quantity}</span>
                            </div>
                          </td>
                          <td className="text-ink-secondary font-medium">
                            {new Date(b.created_at).toLocaleDateString('en-US', { day:'numeric', month:'short' })}
                          </td>
                          <td>
                            <div className="flex justify-end">
                              <button
                                disabled={saving}
                                onClick={() => handleCancelBooking(b)}
                                className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold px-3 py-1.5 text-xs rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
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
            <div className="card border border-surface-border overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date & Stage</th>
                    <th>Available Tickets</th>
                    <th>Adjust Inventory</th>
                  </tr>
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
        <p className="font-bold text-ink-primary">{event.title}</p>
        <p className="text-ink-tertiary text-xs font-semibold uppercase tracking-wider mt-0.5">{event.category}</p>
      </td>
      <td>
        <p className="text-ink-secondary font-medium">{new Date(event.event_date).toLocaleDateString('en-US', { weekday:'short', day:'numeric', month:'short' })}</p>
        <p className="text-ink-tertiary text-xs font-medium mt-0.5">{event.stage}</p>
      </td>
      <td>
        <span className={`chip ${val < 30 ? 'chip-warning' : 'chip-success'}`}>
          {val} available
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setVal(v => Math.max(0, v - 10))} 
            className="w-8 h-8 rounded-xl bg-surface-2 border border-surface-border text-ink-secondary hover:bg-surface-border transition-colors font-bold flex items-center justify-center shadow-sm"
          >
            −
          </button>
          <input
            type="number"
            min="0"
            className="w-20 text-center bg-white border border-surface-border rounded-xl px-2 py-1.5 text-ink-primary font-bold focus:border-coral-500 focus:outline-none focus:ring-1 focus:ring-coral-500"
            value={val}
            onChange={e => setVal(Number(e.target.value))}
          />
          <button 
            onClick={() => setVal(v => v + 10)} 
            className="w-8 h-8 rounded-xl bg-surface-2 border border-surface-border text-ink-secondary hover:bg-surface-border transition-colors font-bold flex items-center justify-center shadow-sm"
          >
            +
          </button>
          
          {changed && (
            <button
              disabled={saving}
              onClick={() => onUpdate(event, val)}
              className="ml-2 btn-primary px-4 py-1.5 text-xs disabled:opacity-50"
            >
              Save
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
