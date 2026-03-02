import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme-provider';
import Navbar from './matrix/Navbar';
import Hero from './matrix/Hero';
import Features from './matrix/Features';
import PricingSection from './matrix/PricingSection';
import TestimonialsAndFAQ from './matrix/TestimonialsAndFAQ';
import Footer from './matrix/Footer';
import AuthModal from './matrix/AuthModal';
import Dashboard from './matrix/Dashboard';
import Playground from './matrix/Playground';
import ApiDocs from './matrix/ApiDocs';

interface UserData {
  id: string;
  email: string;
  plan: string;
}

const AppLayout: React.FC = () => {
  const { setTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<UserData | null>(null);

  // Set dark theme by default for dev tools
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (!saved) {
      setTheme('dark');
    }
  }, []);

  // Persist user session
  useEffect(() => {
    const savedUser = localStorage.getItem('matrixaccel_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }
  }, []);

  const handleAuthSuccess = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('matrixaccel_user', JSON.stringify(userData));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('matrixaccel_user');
    setCurrentPage('home');
  };

  const openLogin = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthModalTab('signup');
    setAuthModalOpen(true);
  };

  const handleSelectPlan = (plan: string) => {
    if (!user) {
      openSignup();
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleGetStarted = () => {
    if (user) {
      setCurrentPage('dashboard');
    } else {
      openSignup();
    }
  };

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={!!user}
        userEmail={user?.email || ''}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        onLogout={handleLogout}
      />

      {/* Home Page */}
      {currentPage === 'home' && (
        <>
          <Hero
            onGetStarted={handleGetStarted}
            onViewDocs={() => setCurrentPage('docs')}
          />
          <Features />

          {/* SDK Teaser Section */}
          <section className="py-20 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
                    Coming Soon
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Python SDK for seamless integration
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    Drop-in replacement for NumPy operations. Install with pip, import, and your existing code
                    runs on our accelerated backend automatically. Zero code changes needed.
                  </p>
                  <div className="space-y-3">
                    {[
                      'NumPy-compatible API — swap imports, keep your code',
                      'Automatic batching for large workloads',
                      'Built-in retry logic and error handling',
                      'Async support for concurrent operations',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-[#0d1117] p-6 font-mono text-sm">
                  <div className="flex gap-1.5 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <p><span className="text-slate-500">$</span> <span className="text-emerald-400">pip install</span> matrixaccel</p>
                    <p className="text-slate-500 text-xs mt-2"># In your Python code:</p>
                    <p><span className="text-purple-400">from</span> matrixaccel <span className="text-purple-400">import</span> Client</p>
                    <p><span className="text-purple-400">import</span> numpy <span className="text-purple-400">as</span> np</p>
                    <p className="text-slate-500 text-xs mt-2"># Initialize client</p>
                    <p>client = Client(api_key=<span className="text-emerald-400">"ma_sk_..."</span>)</p>
                    <p className="text-slate-500 text-xs mt-2"># Use like NumPy — runs on our backend</p>
                    <p>A = np.random.rand(<span className="text-amber-400">1000</span>, <span className="text-amber-400">1000</span>)</p>
                    <p>B = np.random.rand(<span className="text-amber-400">1000</span>, <span className="text-amber-400">1000</span>)</p>
                    <p>result = client.multiply(A, B)</p>
                    <p className="text-slate-500 text-xs mt-2"># 13.9x faster than np.matmul!</p>
                    <p>print(f<span className="text-emerald-400">"Done in </span>{'{'}result.duration_ms{'}'}<span className="text-emerald-400">ms"</span>)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTJ2NEgyNFYwSDI0djRIMTJ2MmgxMlYwaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
            <div className="relative max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to accelerate your matrix computations?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Join 2,400+ developers and data scientists who trust MatrixAccel Pro for their numerical workloads.
                Start with 10,000 free GFLOPS today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-3.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg text-sm"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => setCurrentPage('docs')}
                  className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20 text-sm"
                >
                  Read the Docs
                </button>
              </div>
            </div>
          </section>

          <TestimonialsAndFAQ />
          <Footer onNavigate={setCurrentPage} />
        </>
      )}

      {/* Pricing Page */}
      {currentPage === 'pricing' && (
        <>
          <div className="pt-16">
            <PricingSection
              onSelectPlan={handleSelectPlan}
              onContactEnterprise={() => {}}
              currentPlan={user?.plan}
            />
          </div>

          {/* Pricing FAQ */}
          <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">Pricing FAQ</h3>
              <div className="space-y-4">
                {[
                  { q: 'Can I switch plans anytime?', a: 'Yes, you can upgrade or downgrade at any time. Changes take effect immediately and billing is prorated.' },
                  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, Amex) and wire transfer for Enterprise plans.' },
                  { q: 'Is there a free trial for paid plans?', a: 'The Free Trial gives you 10,000 GFLOPS to test everything. No credit card required to start.' },
                  { q: 'What happens if I go over my rate limit?', a: 'Requests over the rate limit receive a 429 response. You can upgrade your plan for higher limits.' },
                ].map((faq, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                    <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-1">{faq.q}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <Footer onNavigate={setCurrentPage} />
        </>
      )}

      {/* API Docs */}
      {currentPage === 'docs' && (
        <>
          <ApiDocs />
          <Footer onNavigate={setCurrentPage} />
        </>
      )}

      {/* Dashboard (protected) */}
      {currentPage === 'dashboard' && user && (
        <Dashboard
          userId={user.id}
          userEmail={user.email}
          userPlan={user.plan}
          onNavigate={setCurrentPage}
        />
      )}

      {/* Playground (protected) */}
      {currentPage === 'playground' && user && (
        <Playground userId={user.id} />
      )}

      {/* Redirect to login if not authenticated */}
      {(currentPage === 'dashboard' || currentPage === 'playground') && !user && (
        <div className="pt-32 pb-16 max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sign in required</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            You need to be signed in to access the {currentPage === 'dashboard' ? 'dashboard' : 'playground'}.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={openLogin}
              className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={openSignup}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default AppLayout;
