import { useState, useEffect } from 'react';
import { getVendors, createVendor, updateVendor, deleteVendor } from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/UI';

const BLANK = { name: '', description: '', category: 'Food', location: '', is_active: 1 };
const CATEGORIES = ['Food', 'Drinks', 'Merchandise', 'Attraction'];
const CAT_ICONS  = { Food:'🍔', Drinks:'🍺', Merchandise:'👕', Attraction:'🎡' };

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

function VendorForm({ initial = BLANK, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial);
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div>
        <label className="label">Vendor Name *</label>
        <input className="input" value={form.name} onChange={e => u('name', e.target.value)} required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={3} value={form.description} onChange={e => u('description', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category *</label>
          <select className="input" value={form.category} onChange={e => u('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.is_active} onChange={e => u('is_active', Number(e.target.value))}>
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">Location</label>
        <input className="input" placeholder="e.g. Food Court - Stall A1" value={form.location} onChange={e => u('location', e.target.value)} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
          {saving ? '⏳ Saving...' : '💾 Save Vendor'}
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
  const [catFilter, setCatFilter] = useState('All');

  const load = () => {
    setLoading(true);
    getVendors().then(r => setVendors(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const flash = m => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (modal?.edit) { await updateVendor(modal.edit.id, form); flash('✅ Vendor updated.'); }
      else             { await createVendor(form);               flash('✅ Vendor created.'); }
      setModal(null); load();
    } catch (e) { flash(`❌ ${e.response?.data?.error || e.message}`); }
    finally { setSaving(false); }
  };

  const handleDelete = async (v) => {
    setSaving(true);
    try {
      await deleteVendor(v.id);
      flash('✅ Vendor deleted.');
      setModal(null); load();
    } catch (e) { flash(`❌ ${e.response?.data?.error || e.message}`); }
    finally { setSaving(false); }
  };

  const displayed = catFilter === 'All' ? vendors : vendors.filter(v => v.category === catFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Manage Vendors</h1>
          <p className="text-gray-400 text-sm mt-1">{vendors.length} vendors total</p>
        </div>
        <button id="add-vendor-btn" onClick={() => setModal('add')} className="btn-primary">＋ Add Vendor</button>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${msg.startsWith('✅') ? 'bg-green-900/30 border border-green-700/50 text-green-300' : 'bg-red-900/30 border border-red-700/50 text-red-300'}`}>
          {msg}
        </div>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['All', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              catFilter === c ? 'bg-primary-600 text-white' : 'bg-festival-card border border-festival-border text-gray-400 hover:text-white'
            }`}
          >
            {CAT_ICONS[c] || '✨'} {c}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : displayed.length === 0 ? (
        <EmptyState icon="🍔" title="No vendors" subtitle="Add one to get started." />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>Vendor</th><th>Category</th><th>Location</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {displayed.map(v => (
                <tr key={v.id}>
                  <td>
                    <p className="text-white font-medium">{v.name}</p>
                    <p className="text-gray-500 text-xs line-clamp-1">{v.description}</p>
                  </td>
                  <td><span className="badge-gold">{CAT_ICONS[v.category]} {v.category}</span></td>
                  <td className="text-gray-400 text-sm">{v.location || '—'}</td>
                  <td>
                    <span className={`badge ${v.is_active ? 'badge-green' : 'badge-red'}`}>
                      {v.is_active ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => setModal({ edit: v })} className="px-3 py-1 bg-blue-900/40 hover:bg-blue-900/70 text-blue-300 text-xs rounded-lg border border-blue-700/40 transition-colors">✏️ Edit</button>
                      <button onClick={() => setModal({ delete: v })} className="px-3 py-1 bg-red-900/40 hover:bg-red-900/70 text-red-300 text-xs rounded-lg border border-red-700/40 transition-colors">🗑️</button>
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
            initial={modal?.edit ? { name: modal.edit.name, description: modal.edit.description || '', category: modal.edit.category, location: modal.edit.location || '', is_active: modal.edit.is_active } : BLANK}
            onSave={handleSave} onCancel={() => setModal(null)} saving={saving}
          />
        </Modal>
      )}

      {modal?.delete && (
        <Modal title="Delete Vendor" onClose={() => setModal(null)}>
          <p className="text-gray-300 mb-2">Delete vendor:</p>
          <p className="text-white font-bold text-lg mb-6">"{modal.delete.name}"</p>
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
