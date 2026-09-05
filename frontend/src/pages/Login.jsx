import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || '/';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const quickFill = (email) => setForm({ email, password: 'password123' });

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4 py-16">
      <div className="absolute inset-0 bg-hero-radial" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="card-dark p-8 sm:p-10">
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-wine-gradient text-2xl shadow-card">
              🍷
            </span>
            <h1 className="mt-5 font-display text-3xl text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-ink-400">
              Sign in to access your cellar, favorites, and reviews.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="label-caps !text-[10px]">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-dark mt-2"
                disabled={submitting}
              />
            </div>

            <div>
              <label htmlFor="password" className="label-caps !text-[10px]">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-dark mt-2"
                disabled={submitting}
              />
            </div>

            {error && (
              <p className="rounded-lg bg-wine-950/50 px-4 py-3 text-sm text-wine-300">{error}</p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Demo accounts for easy exploration */}
          <div className="mt-6 rounded-xl border border-white/5 bg-ink-950/50 p-4">
            <p className="text-[10px] uppercase tracking-widest2 text-ink-500">Demo accounts</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {['ava@example.com', 'diego@example.com', 'maya@example.com'].map((email) => (
                <button
                  key={email}
                  type="button"
                  onClick={() => quickFill(email)}
                  className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-ink-300 transition hover:border-gold-400/50 hover:text-white"
                >
                  {email.split('@')[0]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-ink-600">password: password123</p>
          </div>

          <p className="mt-6 text-center text-sm text-ink-400">
            New to Wine Explorer?{' '}
            <Link to="/register" className="font-medium text-gold-300 hover:text-gold-200">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
