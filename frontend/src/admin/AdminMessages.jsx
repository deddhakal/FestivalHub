import { useState, useEffect } from 'react';
import { getMessages, deleteMessage } from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/UI';

export default function AdminMessages() {
  const [msgs,    setMsgs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [msgType, setMsgType] = useState('success');
  const [expanded,setExpanded]= useState(null);

  const flash = (m, type='success') => { setMsg(m); setMsgType(type); setTimeout(() => setMsg(''), 3000); };

  const load = () => {
    setLoading(true);
    getMessages().then(r => setMsgs(r.data)).catch(e => flash(e.message, 'error')).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (m) => {
    if (!window.confirm(`Delete message from ${m.name}?`)) return;
    setSaving(true);
    try {
      await deleteMessage(m.id);
      flash('Message deleted.', 'success');
      load();
    } catch (e) { flash(e.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-ink-primary">Contact Messages</h1>
          <p className="text-ink-secondary text-sm mt-1">{msgs.length} message{msgs.length !== 1 ? 's' : ''} received</p>
        </div>
        <button onClick={load} className="btn-secondary btn-sm">🔄 Refresh Inbox</button>
      </div>

      {msg && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border animate-fade-in ${msgType === 'success' ? 'bg-mint-50 border-mint-200 text-mint-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {msgType === 'success' ? '✅' : '⚠️'} {msg}
        </div>
      )}

      {loading ? <div className="py-20 flex justify-center"><LoadingSpinner /></div> : msgs.length === 0 ? (
        <div className="card p-12 text-center border border-surface-border">
          <div className="text-5xl mb-4">✉️</div>
          <h3 className="font-display text-xl font-bold text-ink-primary mb-2">Inbox is empty</h3>
          <p className="text-ink-secondary text-sm">Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {msgs.map(m => (
            <div key={m.id} className={`card border transition-all duration-200 overflow-hidden ${expanded === m.id ? 'border-coral-200 shadow-md ring-1 ring-coral-100' : 'border-surface-border'}`}>
              <div
                className="p-5 cursor-pointer hover:bg-surface-0 transition-colors"
                onClick={() => setExpanded(expanded === m.id ? null : m.id)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-display font-bold text-lg shrink-0">
                      {m.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-ink-primary font-bold">{m.name}</p>
                      <p className="text-ink-tertiary text-xs font-semibold truncate">{m.email}</p>
                    </div>
                    {m.subject && (
                      <span className="badge-sky hidden sm:inline-flex ml-2">{m.subject}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <p className="text-ink-tertiary text-xs font-bold uppercase tracking-wider hidden sm:block">
                      {new Date(m.created_at).toLocaleDateString('en-US', { day:'numeric', month:'short' })}
                    </p>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${expanded === m.id ? 'bg-surface-2 rotate-180' : 'bg-surface-1'}`}>
                      ▼
                    </div>
                  </div>
                </div>

                {/* Preview when collapsed */}
                {expanded !== m.id && (
                  <p className="text-ink-secondary text-sm mt-3 ml-14 line-clamp-1">{m.message}</p>
                )}
              </div>

              {/* Expanded body */}
              {expanded === m.id && (
                <div className="px-6 pb-6 border-t border-surface-border pt-5 ml-14">
                  <div className="bg-surface-0 p-5 rounded-2xl border border-surface-border mb-5">
                    <p className="text-ink-primary text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
                  </div>
                  <div className="flex gap-3">
                    <a href={`mailto:${m.email}?subject=Re: ${m.subject || 'Your Festival Hub Enquiry'}`}
                      className="btn-primary px-4 py-2 text-sm shadow-none">
                      📧 Reply via Email
                    </a>
                    <button
                      disabled={saving}
                      onClick={(e) => { e.stopPropagation(); handleDelete(m); }}
                      className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold px-4 py-2 text-sm rounded-full shadow-sm transition-all duration-200 disabled:opacity-50"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
