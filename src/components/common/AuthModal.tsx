import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Mail, Phone, Lock, User, CheckCircle2, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';

export const AuthModal: React.FC = () => {
  const { user, authModal, closeAuthModal, openAuthModal, login, loginWithGoogle, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registerVia, setRegisterVia] = useState<'phone' | 'email'>('phone');

  // Form fields
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Chennai');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 1. Sync internal mode with authModal.mode
  useEffect(() => {
    if (authModal.mode) {
      setMode(authModal.mode);
    }
  }, [authModal.mode]);

  // 2. Load remembered username if present
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('prompt_remembered_username');
      if (savedUser) {
        setIdentifier(savedUser);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // 3. Automatic Popup on initial page load (within 1.2 seconds) if not already logged in or dismissed
  useEffect(() => {
    // If user is already logged in, do not trigger auto popup
    if (user) return;

    try {
      const dismissed = sessionStorage.getItem('prompt_travels_auth_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          // Double check if user opened it manually or logged in during the 1.2s delay
          if (!sessionStorage.getItem('prompt_travels_auth_dismissed')) {
            openAuthModal('login');
          }
        }, 1200);

        return () => clearTimeout(timer);
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [user]);

  // 4. Keyboard Escape listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && authModal.isOpen) {
        handleDismiss();
      }
    };

    if (authModal.isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [authModal.isOpen]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('prompt_travels_auth_dismissed', 'true');
    } catch (e) {
      // ignore
    }
    closeAuthModal();
  };

  if (!authModal.isOpen) return null;

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError(null);
    setSuccessMsg(null);
  };

  const handleFillDemo = (type: 'customer' | 'staff' | 'admin') => {
    setMode('login');
    setError(null);
    if (type === 'customer') {
      setIdentifier('traveler@prompttravels.com');
      setPassword('Travel@123');
    } else if (type === 'staff') {
      setIdentifier('staff@prompttravels.com');
      setPassword('Staff@123');
    } else if (type === 'admin') {
      setIdentifier('admin@prompttravels.com');
      setPassword('Admin@123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const inputId = identifier.trim();
        if (!inputId || !password) {
          throw new Error('Please enter your Email / Username and Password.');
        }

        if (rememberMe) {
          localStorage.setItem('prompt_remembered_username', inputId);
        } else {
          localStorage.removeItem('prompt_remembered_username');
        }

        await login(inputId, password);
        setSuccessMsg('Successfully signed in! Welcome to Prompt Travels.');
        try {
          sessionStorage.setItem('prompt_travels_auth_dismissed', 'true');
        } catch (e) {}

        setTimeout(() => {
          closeAuthModal();
        }, 600);
      } else {
        // Register mode
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (registerVia === 'phone' && !phone.trim()) {
          throw new Error('Please enter your mobile phone number.');
        }
        if (registerVia === 'email' && !identifier.trim()) {
          throw new Error('Please enter your email address.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }

        await register({
          name: name.trim(),
          email: registerVia === 'email' ? identifier.trim() : undefined,
          phone: registerVia === 'phone' ? phone.trim() : undefined,
          password,
          city: city.trim(),
        });

        setSuccessMsg('Account created successfully! Welcome to Prompt Travels.');
        try {
          sessionStorage.setItem('prompt_travels_auth_dismissed', 'true');
        } catch (e) {}

        setTimeout(() => {
          closeAuthModal();
        }, 800);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        // Close when clicking on background overlay
        if (e.target === e.currentTarget) {
          handleDismiss();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-amber-200/80 bg-white p-6 sm:p-7 shadow-2xl shadow-slate-900/15">
        {/* Subtle decorative top accent bar with brand colors */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#BE185D]" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header with Custom Logo */}
        <div className="text-center pt-2 mb-5">
          <div className="flex justify-center mb-3">
            <Logo size="md" />
          </div>
          <h2
            id="auth-modal-title"
            className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
          >
            Welcome! Sign In or Register to Continue
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
            {mode === 'login'
              ? 'Access your journeys, confirmed bookings, and personalized luxury travel itineraries.'
              : 'Join Prompt Travels for exclusive pilgrimage packages, luxury vehicles, and concierge bookings.'}
          </p>
        </div>

        {/* Tabbed Navigation / Toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-4 border border-slate-200/80">
          <button
            type="button"
            onClick={() => handleModeSwitch('login')}
            className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch('register')}
            className={`flex-1 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {/* Firebase Google Auth Button */}
        <button
          type="button"
          onClick={async () => {
            try {
              setLoading(true);
              setError(null);
              await loginWithGoogle();
              setSuccessMsg('Signed in with Google!');
              setTimeout(() => {
                closeAuthModal();
              }, 400);
            } catch (err: any) {
              setError(err.message || 'Google sign-in could not be completed.');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-xs sm:text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 hover:border-amber-400 hover:text-slate-950 transition-all cursor-pointer mb-4"
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
          <span className="ml-auto text-[10px] font-mono uppercase tracking-wide bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-semibold">Firebase</span>
        </button>

        <div className="relative flex items-center justify-center mb-4">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-2 text-[10px] uppercase tracking-wider text-slate-400 font-mono">or email / mobile</span>
          <div className="border-t border-slate-200 w-full" />
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Register Channel Choice */}
        {mode === 'register' && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Register with:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRegisterVia('phone')}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-all cursor-pointer ${
                  registerVia === 'phone'
                    ? 'border-[#BE185D] bg-pink-50 text-[#BE185D] font-semibold'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Mobile Number</span>
              </button>
              <button
                type="button"
                onClick={() => setRegisterVia('email')}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-all cursor-pointer ${
                  registerVia === 'email'
                    ? 'border-[#BE185D] bg-pink-50 text-[#BE185D] font-semibold'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email Address</span>
              </button>
            </div>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sundaram"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {mode === 'login' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email or Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="traveler@prompttravels.com or 9841802288"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
                />
              </div>
            </div>
          ) : registerVia === 'phone' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number (India +91) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="9841802288"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-10 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Location
              </label>
              <input
                type="text"
                placeholder="Chennai, Tamil Nadu"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
              />
            </div>
          )}

          {/* Remember Me Checkbox & Forgot Password */}
          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#BE185D] focus:ring-pink-500 cursor-pointer"
                />
                <span className="font-medium">Remember Me</span>
              </label>
              <button
                type="button"
                onClick={() => handleFillDemo('customer')}
                className="text-[#BE185D] hover:underline font-semibold"
              >
                Auto-fill traveler
              </button>
            </div>
          )}

          {/* CTA Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-amber-900/10 hover:shadow-lg hover:brightness-105 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Authenticating...</span>
              </>
            ) : mode === 'login' ? (
              <span>Sign In</span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Demo Fast Access Credentials */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2">
            <span className="flex items-center gap-1.5 text-amber-700">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>One-Click Test Sign In:</span>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleFillDemo('customer')}
              className="rounded-lg border border-amber-200 bg-amber-50/70 px-2 py-1.5 font-medium text-amber-900 hover:bg-amber-100/80 transition-colors cursor-pointer text-center"
            >
              👤 Traveler
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('staff')}
              className="rounded-lg border border-blue-200 bg-blue-50/70 px-2 py-1.5 font-medium text-blue-900 hover:bg-blue-100/80 transition-colors cursor-pointer text-center"
            >
              💼 Staff
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="rounded-lg border border-purple-200 bg-purple-50/70 px-2 py-1.5 font-medium text-purple-900 hover:bg-purple-100/80 transition-colors cursor-pointer text-center"
            >
              🛡️ Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
