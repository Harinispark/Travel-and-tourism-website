import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  Calendar,
  Building2,
  Car,
  Phone,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  Briefcase,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { NotificationBell } from './NotificationBell';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenBooking?: (type: 'package' | 'hotel' | 'vehicle' | 'custom', item?: any) => void;
  onOpenEnquiry?: () => void;
  currentSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenEnquiry,
  onNavigateSection,
}) => {
  const { user, logout, activePortal, setActivePortal, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (activePortal !== 'customer') {
      setActivePortal('customer');
    }
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top micro-announcement banner & Portal selector */}
      <div className="border-b border-slate-200/70 bg-slate-50/90 px-4 py-1.5 text-xs text-slate-600">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[#BE185D] font-bold">Prompt Travels</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="hidden sm:inline font-medium text-slate-600">Chennai HQ: Luz, Mylapore & Porur</span>
            <span className="hidden md:inline text-slate-300">·</span>
            <a
              href="tel:+919841802288"
              className="hidden md:inline font-mono-numbers text-slate-700 hover:text-[#BE185D] transition-colors"
            >
              24/7 Helpline: +91 98418 02288
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Active Portal Indicator & Switcher */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-amber-400 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <span className="text-slate-400 font-normal">Portal:</span>
                <span className="capitalize text-[#BE185D] font-bold">{activePortal}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {portalDropdownOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setPortalDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      setActivePortal('customer');
                      setPortalDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                      activePortal === 'customer'
                        ? 'bg-pink-50 text-[#BE185D] font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Compass className="h-3.5 w-3.5 text-amber-600" />
                    <span>Customer Experience</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!user) {
                        openAuthModal('login');
                      } else {
                        setActivePortal('staff');
                      }
                      setPortalDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                      activePortal === 'staff'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                    <span>Staff Operations</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!user) {
                        openAuthModal('login');
                      } else {
                        setActivePortal('admin');
                      }
                      setPortalDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                      activePortal === 'admin'
                        ? 'bg-purple-50 text-purple-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                    <span>Admin Console</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Zone 1: Prominent Custom Logo */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('hero');
            }}
            className="focus:outline-none"
            title="Prompt Travels - Home"
          >
            <Logo size="md" />
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
          <button
            onClick={() => handleNavClick('destinations')}
            className="hover:text-[#BE185D] transition-colors whitespace-nowrap cursor-pointer py-1"
          >
            Destinations
          </button>
          <button
            onClick={() => handleNavClick('packages')}
            className="hover:text-[#BE185D] transition-colors whitespace-nowrap cursor-pointer py-1"
          >
            Tours & Packages
          </button>
          <button
            onClick={() => handleNavClick('hotels')}
            className="hover:text-[#BE185D] transition-colors whitespace-nowrap cursor-pointer py-1"
          >
            Hotels & Resorts
          </button>
          <button
            onClick={() => handleNavClick('fleet')}
            className="hover:text-[#BE185D] transition-colors whitespace-nowrap cursor-pointer py-1"
          >
            Fleet & Rentals
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="hover:text-[#BE185D] transition-colors whitespace-nowrap cursor-pointer py-1"
          >
            About & Trust
          </button>
        </nav>

        {/* Zone 3: Actions + Authentication */}
        <div className="flex items-center gap-3">
          {/* Notifications for logged in user */}
          {user && <NotificationBell />}

          {/* Quick Enquiry CTA */}
          <button
            onClick={onOpenEnquiry}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/80 px-3.5 py-2 text-xs font-bold text-amber-900 transition-all hover:bg-amber-100 hover:border-amber-400 whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <Phone className="h-3.5 w-3.5 text-amber-700" />
            <span>Enquire / Plan</span>
          </button>

          {/* User Sign In or Account Menu */}
          {!user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] px-4 py-2 text-xs font-bold text-white shadow-sm hover:shadow-md hover:brightness-105 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
              >
                <UserIcon className="h-3.5 w-3.5" />
                <span>Sign In / Register</span>
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 transition-colors hover:bg-slate-100 cursor-pointer shadow-2xs"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-[#BE185D] font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline font-semibold max-w-[120px] truncate">{user.name}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email || user.phone}</p>
                    <span className="mt-1 inline-block text-[10px] font-mono text-[#BE185D] bg-pink-50 border border-pink-200 px-1.5 py-0.5 rounded-md uppercase font-bold">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActivePortal('customer');
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-amber-600" />
                      <span>My Bookings & Profile</span>
                    </button>

                    {(user.role === 'staff' || user.role === 'admin') && (
                      <button
                        onClick={() => {
                          setActivePortal('staff');
                          setUserDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                        <span>Staff Operations</span>
                      </button>
                    )}

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setActivePortal('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                        <span>Admin Console</span>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-medium"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            <button
              onClick={() => handleNavClick('destinations')}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-slate-100 text-left transition-colors cursor-pointer"
            >
              <Compass className="h-4 w-4 text-[#BE185D]" />
              <span>Destinations</span>
            </button>
            <button
              onClick={() => handleNavClick('packages')}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-slate-100 text-left transition-colors cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-[#BE185D]" />
              <span>Tours & Packages</span>
            </button>
            <button
              onClick={() => handleNavClick('hotels')}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-slate-100 text-left transition-colors cursor-pointer"
            >
              <Building2 className="h-4 w-4 text-[#BE185D]" />
              <span>Hotels & Resorts</span>
            </button>
            <button
              onClick={() => handleNavClick('fleet')}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-slate-100 text-left transition-colors cursor-pointer"
            >
              <Car className="h-4 w-4 text-[#BE185D]" />
              <span>Fleet & Rentals</span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 hover:bg-slate-100 text-left transition-colors cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-[#BE185D]" />
              <span>About Prompt Travels</span>
            </button>

            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenEnquiry) onOpenEnquiry();
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-xs font-bold text-amber-900 cursor-pointer"
              >
                <Phone className="h-3.5 w-3.5 text-amber-700" />
                <span>Custom Enquiry & Quote</span>
              </button>

              {!user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>Sign In / Register</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-600 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out ({user.name})</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
