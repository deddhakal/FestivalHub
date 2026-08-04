import { useState, useEffect } from 'react';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/UI';

const BLANK = { title: '', content: '', type: 'info' };
const TYPES = ['info', 'warning', 'alert', 'success'];
const TYPE_CONFIG = {
  info:    { class: 'bg-sky-50 border-sky-200 text-sky-700',   icon: 'ℹ️', label: 'Information' },
  warning: { class: 'bg-gold-50 border-gold-200 text-gold-700', icon: '⚠️', label: 'Warning' },
  alert:   { class: 'bg-coral-50 border-coral-200 text-coral-700', icon: '🚨', label: 'Alert' },
  success: { class: 'bg-mint-50 border-mint-200 text-mint-700', icon: '✅', label: 'Success' },
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

function AnnForm({ initial = BLANK, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-5">
      <div>
        <label className="field-label">Announcement Title *</label>
        <input className="field-input" placeholder="e.g. Schedule Update" value={form.title} onChange={e => u('title', e.target.value)} required />
      </div>
      <div>
        <label className="field-label">Message Content *</label>
        <textarea className="field-input resize-none" placeholder="What do you want to tell attendees?" rows={4} value={form.content} onChange={e => u('content', e.target.value)} required />
      </div>
      <div>
        <label className="field-label mb-2">Message Type</label>
        <div className="grid grid-cols-2 gap-3">
          {TYPES.map(t => {
            const isSelected = form.type === t;
            const cfg = TYPE_CONFIG[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => u('type', t)}
                className={`p-3 rounded-xl border text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSelected
                    ? `${cfg.class} ring-2 ring-offset-1 ring-${cfg.class.split('-')[1]}-500 shadow-sm`
                    : 'bg-white border-surface-border text-ink-secondary hover:bg-surface-1'
                }`}
              >
                <span>{cfg.icon}</span> {cfg.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex gap-3 pt-4 mt-6 border-t border-surface-border">
        <button type="submit" disabled={saving} className="btn-primary flex-1">
          {saving ? 'Saving...' : 'Broadcast Announcement'}
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
  const [msgType, setMsgType] = useState('success');

  const load = () => {
    setLoading(true);
    getAnnouncements().then(r => setAnns(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  const flash = (m, type='success') => { setMsg(m); setMsgType(type); setTimeout(() => setMsg(''), 3000); };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal?.edit) { await updateAnnouncement(modal.edit.id, form); flash('Announcement updated successfully.', 'success'); }
      else             { await createAnnouncement(form);                flash('Announcement posted successfully.', 'success'); }
      setModal(null); load();
    } catch (e) { flash(e.response?.data?.error || e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (a) => {
    setSaving(true);
    try {
      await deleteAnnouncement(a.id);
      flash('Announcement deleted.', 'success');
      setModal(null); load();
    } catch (e) { flash(e.response?.data?.error || e.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-ink-primary">Broadcast Announcements</h1>
          <p className="text-ink-secondary text-sm mt-1">{anns.length} active announcements</p>
        </div>
        <button id="add-announcement-btn" onClick={() => setModal('add')} className="btn-primary btn-sm">＋ Post Announcement</button>
      </div>

      {msg && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border animate-fade-in ${msgType === 'success' ? 'bg-mint-50 border-mint-200 text-mint-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {msgType === 'success' ? '✅' : '⚠️'} {msg}
        </div>
      )}

      {loading ? <div className="py-20 flex justify-center"><LoadingSpinner /></div> : anns.length === 0 ? (
        <div className="card p-12 text-center border border-surface-border">
          <div className="text-5xl mb-4">📢</div>
          <h3 className="font-display text-xl font-bold text-ink-primary mb-2">No announcements</h3>
          <p className="text-ink-secondary text-sm mb-6">Create an announcement to broadcast it to the public homepage.</p>
          <button onClick={() => setModal('add')} className="btn-secondary btn-sm">Create Announcement</button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {anns.map(a => {
            const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.info;
            return (
              <div key={a.id} className="card border border-surface-border overflow-hidden flex flex-col group">
                <div className={`h-1.5 w-full ${cfg.class.split(' ')[0]}`}></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cfg.icon}</span>
                      <h3 className="font-bold text-ink-primary text-lg">{a.title}</h3>
                    </div>
                  </div>
                  <p className="text-ink-secondary text-sm leading-relaxed mb-6 flex-1">{a.content}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-surface-border mt-auto">
                    <p className="text-ink-tertiary text-xs font-bold uppercase tracking-wider">
                      {new Date(a.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' })}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => setModal({ edit: a })} className="btn-secondary px-3 py-1.5 text-xs rounded-lg shadow-none border-transparent hover:border-surface-border">Edit</button>
                      <button onClick={() => setModal({ delete: a })} className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold px-3 py-1.5 text-xs rounded-lg transition-colors">Delete</button>
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
          <p className="text-ink-secondary mb-2">Are you sure you want to permanently delete:</p>
          <p className="font-display font-bold text-ink-primary text-xl mb-6">"{modal.delete.title}"</p>
          <div className="flex gap-3">
            <button disabled={saving} onClick={() => handleDelete(modal.delete)} className="bg-red-500 text-white hover:bg-red-600 font-bold px-6 py-3 rounded-full flex-1 shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60">
              {saving ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
