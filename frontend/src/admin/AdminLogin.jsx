import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please enter your username and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(form.username, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center px-4 md:px-6">
      
      {/* Container */}
      <div className="w-full max-w-md animate-slide-up">
        
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block font-display text-3xl text-ink-primary leading-none mb-3">
            Festival<span className="text-brand-500">Hub</span>
          </Link>
          <p className="eyebrow">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="card p-6 md:p-8">
          <h1 className="font-display text-2xl text-ink-primary mb-6 text-center">Sign In</h1>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="admin-username" className="field-label">Username</label>
              <input
                id="admin-username"
                type="text"
                autoComplete="username"
                className="field-input"
                placeholder="admin"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="field-label">Password</label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                className="field-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
            </div>

            {error && (
              <div className="alert-danger rounded text-sm">
                {error}
              </div>
            )}

            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Credentials helper */}
          <div className="mt-8 pt-6 border-t border-surface-border text-center">
            <p className="text-xs text-ink-tertiary mb-2">Default credentials</p>
            <p className="font-mono text-sm text-ink-secondary bg-surface-2 inline-block px-3 py-1.5 rounded border border-surface-border">
              admin / admin123
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link to="/" className="text-sm text-ink-secondary hover:text-ink-primary transition-colors">
            ← Back to Festival Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
