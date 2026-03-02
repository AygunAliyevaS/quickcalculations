import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Zap, ArrowRight, AlertCircle, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
  onAuthSuccess: (user: { id: string; email: string; plan: string }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login', onAuthSuccess }) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  React.useEffect(() => {
    setTab(initialTab);
    setError('');
    setSuccess('');
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) { setError('Please enter a valid email address'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      // Check if user exists in our profiles table
      const { data: profiles, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email.toLowerCase())
        .limit(1);

      if (fetchError) throw fetchError;

      if (!profiles || profiles.length === 0) {
        setError('No account found with this email. Please sign up first.');
        setLoading(false);
        return;
      }

      const user = profiles[0];
      onAuthSuccess({ id: user.id, email: user.email, plan: user.plan });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your name'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      // Check if already exists
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .limit(1);

      if (existing && existing.length > 0) {
        setError('An account with this email already exists. Please sign in.');
        setLoading(false);
        return;
      }

      // Create profile
      const { data: newUser, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          email: email.toLowerCase(),
          display_name: name.trim(),
          plan: 'free_trial',
          gflops_used: 0,
          gflops_limit: 10000,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Generate initial API key
      const apiKey = 'ma_sk_' + crypto.randomUUID().replace(/-/g, '').substring(0, 32);
      await supabase.from('api_keys').insert({
        user_id: newUser.id,
        key_name: 'Default Key',
        api_key: apiKey,
        is_active: true,
      });

      onAuthSuccess({ id: newUser.id, email: newUser.email, plan: newUser.plan });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) { setError('Please enter a valid email address'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSuccess('If an account exists with this email, you will receive a password reset link.');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">MatrixAccel Pro</span>
          </div>

          {tab !== 'forgot' && (
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  tab === 'login'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  tab === 'signup'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 mb-4">
              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email" placeholder="you@company.com" value={email}
                    onChange={e => setEmail(e.target.value)} required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={password}
                    onChange={e => setPassword(e.target.value)} required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => { setTab('forgot'); setError(''); setSuccess(''); }} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Forgot password?
                </button>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {tab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text" placeholder="John Doe" value={name}
                    onChange={e => setName(e.target.value)} required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email" placeholder="you@company.com" value={email}
                    onChange={e => setEmail(e.target.value)} required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={password}
                    onChange={e => setPassword(e.target.value)} required minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {loading ? 'Creating account...' : 'Start Free Trial'}
              </button>
              <p className="text-xs text-center text-slate-400">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          )}

          {tab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Enter your email and we'll send you a password reset link.
              </p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email" placeholder="you@company.com" value={email}
                  onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <button type="button" onClick={() => { setTab('login'); setError(''); setSuccess(''); }} className="w-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
