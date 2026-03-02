import React from 'react';
import { useTheme } from '@/components/theme-provider';
import {
  Zap, Sun, Moon, Menu, X, ChevronDown,
  LayoutDashboard, BookOpen, DollarSign, FlaskConical, LogOut, User
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isLoggedIn: boolean;
  userEmail: string;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentPage, setCurrentPage, isLoggedIn, userEmail,
  onLoginClick, onSignupClick, onLogout
}) => {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const isDark = theme === 'dark';

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'support', label: 'Support' },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'docs', label: 'API Docs', icon: BookOpen },
    ...(isLoggedIn ? [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'playground', label: 'Playground', icon: FlaskConical },
    ] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              MatrixAccel<span className="text-blue-500"> Pro</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === link.id
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="max-w-[120px] truncate">{userEmail}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl z-50 py-1">
                      <button
                        onClick={() => { setCurrentPage('dashboard'); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </button>
                      <button
                        onClick={() => { setCurrentPage('playground'); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <FlaskConical className="w-4 h-4" /> Playground
                      </button>
                      <hr className="my-1 border-slate-200 dark:border-slate-700" />
                      <button
                        onClick={() => { onLogout(); setUserMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onSignupClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25"
                >
                  Start Free Trial
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => { setCurrentPage(link.id); setMobileMenuOpen(false); }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentPage === link.id
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
            {!isLoggedIn && (
              <div className="pt-2 space-y-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
                  Sign In
                </button>
                <button onClick={() => { onSignupClick(); setMobileMenuOpen(false); }} className="block w-full text-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg">
                  Start Free Trial
                </button>
              </div>
            )}
            {isLoggedIn && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-red-600">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
