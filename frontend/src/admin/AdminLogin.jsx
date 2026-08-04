import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [view, setView]       = useState('login'); // 'login' or 'forgot'
  const [form, setForm]       = useState({ username: '', password: '', email: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please enter your username and password.');
      setSuccess('');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await login(form.username, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!form.email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError('');
    
    // Simulate sending email
    setTimeout(() => {
      setLoading(false);
      setSuccess('If an account matches that email, a password reset link has been sent.');
      setForm(f => ({ ...f, email: '' }));
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col lg:flex-row">
      
      {/* ── Left Column: Brand & Graphic ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-1 items-center justify-center overflow-hidden">
        
        {/* Soft abstract background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-coral-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />
        
        <div className="relative z-10 max-w-lg px-12">
          <Link to="/" className="inline-block font-display text-4xl text-ink-primary font-bold mb-8 transition-transform hover:scale-105">
            Festival<span className="text-coral-500">Hub</span>
          </Link>
          
          <h2 className="font-display text-5xl font-bold text-ink-primary leading-tight mb-6">
            Manage your campus events with ease.
          </h2>
          
          <p className="text-lg text-ink-secondary font-medium leading-relaxed mb-10">
            Welcome to the Festival Hub command center. Access real-time analytics, manage ticket allocations, and coordinate vendors all in one beautiful dashboard.
          </p>

          <div className="flex items-center gap-4 text-sm font-bold text-ink-primary">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-surface-0 bg-surface-2 flex items-center justify-center shadow-soft">
                  <span className="text-sm">👤</span>
                </div>
              ))}
            </div>
            <p>Trusted by 50+ campus organizers</p>
          </div>
        </div>
      </div>

      {/* ── Right Column: Login Form ─────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8 bg-surface-0">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden absolute top-8 left-6">
          <Link to="/" className="inline-block font-display text-2xl text-ink-primary font-bold">
            Festival<span className="text-coral-500">Hub</span>
          </Link>
        </div>

        <div className="w-full max-w-md animate-slide-up">
          
          {view === 'login' ? (
            <>
              <div className="mb-10 text-center lg:text-left">
                <h1 className="font-display text-3xl font-bold text-ink-primary mb-2">Welcome back</h1>
                <p className="text-sm font-medium text-ink-secondary">Sign in to your admin portal.</p>
              </div>

              <form onSubmit={handleLoginSubmit} noValidate className="space-y-6">
                
                <div>
                  <label htmlFor="admin-username" className="text-sm font-bold text-ink-primary mb-2 block">Username</label>
                  <input
                    id="admin-username"
                    type="text"
                    autoComplete="username"
                    className="w-full bg-surface-1 border border-surface-border rounded-xl px-4 py-3 text-ink-primary font-medium focus:outline-none focus:ring-2 focus:ring-coral-500 transition-shadow"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={e => {
                      setForm(f => ({ ...f, username: e.target.value }));
                      setError('');
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="admin-password" className="text-sm font-bold text-ink-primary">Password</label>
                    <button 
                      type="button" 
                      onClick={() => { setView('forgot'); setError(''); setSuccess(''); }}
                      className="text-xs font-bold text-coral-600 hover:text-coral-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="w-full bg-surface-1 border border-surface-border rounded-xl px-4 py-3 text-ink-primary font-medium focus:outline-none focus:ring-2 focus:ring-coral-500 transition-shadow pr-12"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => {
                        setForm(f => ({ ...f, password: e.target.value }));
                        setError('');
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink-primary text-sm font-medium transition-colors focus:outline-none"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>



                {error && (
                  <div className="bg-red-50 text-red-600 font-bold p-4 rounded-xl text-sm border border-red-200 animate-fade-in">
                    {error}
                  </div>
                )}

                <button
                  id="admin-login-submit"
                  type="submit"
                  disabled={loading}
                  className="btn-primary btn-lg w-full"
                >
                  {loading ? 'Authenticating…' : 'Sign In'}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* ── Forgot Password View ── */}
              <div className="mb-10 text-center lg:text-left">
                <h1 className="font-display text-3xl font-bold text-ink-primary mb-2">Reset Password</h1>
                <p className="text-sm font-medium text-ink-secondary">Enter your email and we'll send you a recovery link.</p>
              </div>

              <form onSubmit={handleForgotSubmit} noValidate className="space-y-6">
                <div>
                  <label htmlFor="admin-email" className="text-sm font-bold text-ink-primary mb-2 block">Email Address</label>
                  <input
                    id="admin-email"
                    type="email"
                    className="w-full bg-surface-1 border border-surface-border rounded-xl px-4 py-3 text-ink-primary font-medium focus:outline-none focus:ring-2 focus:ring-coral-500 transition-shadow"
                    placeholder="admin@festivalhub.com"
                    value={form.email}
                    onChange={e => {
                      setForm(f => ({ ...f, email: e.target.value }));
                      setError('');
                    }}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 font-bold p-4 rounded-xl text-sm border border-red-200 animate-fade-in">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 text-green-700 font-bold p-4 rounded-xl text-sm border border-green-200 animate-fade-in">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary btn-lg w-full"
                >
                  {loading ? 'Sending link…' : 'Send Recovery Link'}
                </button>

                <div className="text-center mt-6">
                  <button 
                    type="button" 
                    onClick={() => { setView('login'); setError(''); setSuccess(''); }}
                    className="text-sm font-bold text-ink-secondary hover:text-ink-primary transition-colors"
                  >
                    ← Back to login
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Footer Security Notice */}
          <div className="mt-12 text-center lg:text-left">
            <p className="text-xs font-bold text-ink-tertiary flex items-center justify-center lg:justify-start gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Administrator Portal
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
