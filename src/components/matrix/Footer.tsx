import React, { useState } from 'react';
import { Zap, Github, Twitter, Linkedin, Mail, ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => { setSubscribed(false); setEmail(''); }, 3000);
    }
  };

  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Features', page: 'home' },
        { label: 'Pricing', page: 'pricing' },
        { label: 'Support', page: 'support' },
        { label: 'API Docs', page: 'docs' },
        { label: 'Playground', page: 'playground' },
        { label: 'Changelog', page: 'home' },
        { label: 'Status', page: 'home' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', page: 'docs' },
        { label: 'Python SDK', page: 'docs' },
        { label: 'API Reference', page: 'docs' },
        { label: 'Tutorials', page: 'docs' },
        { label: 'Blog', page: 'home' },
        { label: 'Community', page: 'home' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', page: 'home' },
        { label: 'Careers', page: 'home' },
        { label: 'Contact', page: 'home' },
        { label: 'Partners', page: 'home' },
        { label: 'Press', page: 'home' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', page: 'home' },
        { label: 'Terms of Service', page: 'home' },
        { label: 'Cookie Policy', page: 'home' },
        { label: 'DPA', page: 'home' },
        { label: 'Security', page: 'home' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 mb-12 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Stay up to date</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Get product updates, performance tips, and engineering insights.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="flex-1 md:w-64 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              {subscribed ? <><Check className="w-4 h-4" /> Subscribed!</> : <><Mail className="w-4 h-4" /> Subscribe</>}
            </button>
          </form>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                MatrixAccel<span className="text-blue-500"> Pro</span>
              </span>
            </button>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              High-performance matrix computation API. 10x faster than NumPy, no GPUs needed.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  onClick={e => e.preventDefault()}
                  className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => onNavigate(link.page)}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} MatrixAccel Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </span>
            <span>v2.4.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
