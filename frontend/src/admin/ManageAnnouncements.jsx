import { useState, useEffect } from 'react';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/UI';

const BLANK = { title: '', content: '', type: 'info' };
const TYPES = ['info', 'warning', 'alert', 'success'];
const TYPE_CONFIG = {
  info:    { color: 'bg-blue-900/30 border-blue-700/50 text-blue-300',   label: 'ℹ️ Info' },
  warning: { color: 'bg-yellow-900/30 border-yellow-700/50 text-yellow-300', label: '⚠️ Warning' },
  alert:   { color: 'bg-red-900/30 border-red-700/50 text-red-300',      label: '🚨 Alert' },
  success: { color: 'bg-green-900/30 border-green-700/50 text-green-300',label: '✅ News' },
};

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-festival-card border border-festival-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-festival-border sticky top-0 bg-festival-card">
          <h2 className="font-display font-bold text-white text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function AnnForm({ initial = BLANK, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div>
        <label className="label">Title *</label>
        <input className="input" value={form.title} onChange={e => u('title', e.target.value)} required />
      </div>
      <div>
        <label className="label">Content *</label>
        <textarea className="input resize-none" rows={4} value={form.content} onChange={e => u('content', e.target.value)} required />
      </div>
      <div>
        <label className="label">Type</label>
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => u('type', t)}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                form.type === t
                  ? `border-2 ${TYPE_CONFIG[t].color}`
                  : 'border-festival-border bg-festival-darker text-gray-400 hover:text-white'
              }`}
            >
              {TYPE_CONFIG[t].label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
          {saving ? '⏳ Saving...' : '💾 Post Announcement'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

export default function ManageAnnouncements() {
  const [anns,   setAnns]   = useState([]);
  const [loading,setLoading]= useState(true);
  const [modal,  setModal]  = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg,    setMsg]    = useState('');

  const load = () => {
    setLoading(true);
    getAnnouncements().then(r => setAnns(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const flash = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal?.edit) { await updateAnnouncement(modal.edit.id, form); flash('✅ Announcement updated.'); }
      else             { await createAnnouncement(form);                flash('✅ Announcement posted.'); }
      setModal(null); load();
    } catch (e) { flash(`❌ ${e.response?.data?.error || e.message}`); }
    finally { setSaving(false); }
  };

  const handleDelete = async (a) => {
    setSaving(true);
    try {
      await deleteAnnouncement(a.id);
      flash('✅ Announcement deleted.');
      setModal(null); load();
    } catch (e) { flash(`❌ ${e.response?.data?.error || e.message}`); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Manage Announcements</h1>
          <p className="text-gray-400 text-sm mt-1">{anns.length} announcements</p>
        </div>
        <button id="add-announcement-btn" onClick={() => setModal('add')} className="btn-primary">＋ Post Announcement</button>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${msg.startsWith('✅') ? 'bg-green-900/30 border border-green-700/50 text-green-300' : 'bg-red-900/30 border border-red-700/50 text-red-300'}`}>
          {msg}
        </div>
      )}

      {loading ? <LoadingSpinner /> : anns.length === 0 ? (
        <EmptyState icon="📢" title="No announcements yet" subtitle="Post one above." />
      ) : (
        <div className="space-y-3">
          {anns.map(a => {
            const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.info;
            return (
              <div key={a.id} className={`card border overflow-hidden ${cfg.color.includes('border') ? '' : ''}`}>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold">{a.title}</h3>
                        <span className={`badge border text-xs ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{a.content}</p>
                      <p className="text-gray-600 text-xs mt-2">
                        {new Date(a.created_at).toLocaleDateString('en-AU', { weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setModal({ edit: a })} className="px-3 py-1 bg-blue-900/40 hover:bg-blue-900/70 text-blue-300 text-xs rounded-lg border border-blue-700/40 transition-colors">✏️ Edit</button>
                      <button onClick={() => setModal({ delete: a })} className="px-3 py-1 bg-red-900/40 hover:bg-red-900/70 text-red-300 text-xs rounded-lg border border-red-700/40 transition-colors">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(modal === 'add' || modal?.edit) && (
        <Modal title={modal?.edit ? 'Edit Announcement' : 'Post New Announcement'} onClose={() => setModal(null)}>
          <AnnForm
            initial={modal?.edit ? { title: modal.edit.title, content: modal.edit.content, type: modal.edit.type } : BLANK}
            onSave={handleSave} onCancel={() => setModal(null)} saving={saving}
          />
        </Modal>
      )}

      {modal?.delete && (
        <Modal title="Delete Announcement" onClose={() => setModal(null)}>
          <p className="text-gray-300 mb-2">Delete this announcement?</p>
          <p className="text-white font-bold mb-6">"{modal.delete.title}"</p>
          <div className="flex gap-3">
            <button disabled={saving} onClick={() => handleDelete(modal.delete)} className="btn-danger flex-1 justify-center disabled:opacity-60">
              {saving ? '⏳...' : '🗑️ Delete'}
            </button>
            <button onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
