import { useState, useEffect } from 'react';
import { getMessages, deleteMessage } from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/UI';

export default function AdminMessages() {
  const [msgs,    setMsgs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');
  const [expanded,setExpanded]= useState(null);

  const flash = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const load = () => {
    setLoading(true);
    getMessages().then(r => setMsgs(r.data)).catch(e => flash(`❌ ${e.message}`)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (m) => {
    if (!window.confirm(`Delete message from ${m.name}?`)) return;
    setSaving(true);
    try {
      await deleteMessage(m.id);
      flash('✅ Message deleted.');
      load();
    } catch (e) { flash(`❌ ${e.message}`); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Contact Messages</h1>
          <p className="text-gray-400 text-sm mt-1">{msgs.length} message{msgs.length !== 1 ? 's' : ''} received</p>
        </div>
        <button onClick={load} className="btn-secondary btn-sm">🔄 Refresh</button>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${msg.startsWith('✅') ? 'bg-green-900/30 border border-green-700/50 text-green-300' : 'bg-red-900/30 border border-red-700/50 text-red-300'}`}>
          {msg}
        </div>
      )}

      {loading ? <LoadingSpinner /> : msgs.length === 0 ? (
        <EmptyState icon="✉️" title="No messages yet" subtitle="Contact form submissions will appear here." />
      ) : (
        <div className="space-y-3">
          {msgs.map(m => (
            <div key={m.id} className="card overflow-hidden">
              <div
                className="p-5 cursor-pointer hover:bg-festival-darker/50 transition-colors"
                onClick={() => setExpanded(expanded === m.id ? null : m.id)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-blue-300 font-bold shrink-0">
                      {m.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium">{m.name}</p>
                      <p className="text-gray-500 text-xs truncate">{m.email}</p>
                    </div>
                    {m.subject && (
                      <span className="badge-blue hidden sm:inline-flex">{m.subject}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-gray-500 text-xs">
                      {new Date(m.created_at).toLocaleDateString('en-AU', { day:'numeric', month:'short' })}
                    </p>
                    <span className="text-gray-500 text-sm">{expanded === m.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Preview when collapsed */}
                {expanded !== m.id && (
                  <p className="text-gray-500 text-sm mt-2 ml-12 line-clamp-1">{m.message}</p>
                )}
              </div>

              {/* Expanded body */}
              {expanded === m.id && (
                <div className="px-5 pb-5 border-t border-festival-border pt-4">
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{m.message}</p>
                  <div className="flex gap-3">
                    <a href={`mailto:${m.email}?subject=Re: ${m.subject || 'Your Festival Hub Enquiry'}`}
                      className="btn-secondary btn-sm text-xs">
                      📧 Reply via Email
                    </a>
                    <button
                      disabled={saving}
                      onClick={() => handleDelete(m)}
                      className="btn-danger btn-sm text-xs disabled:opacity-50"
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
