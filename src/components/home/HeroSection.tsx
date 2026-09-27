import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  Building2,
  Car,
  Search,
  Award,
  Users,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  ChevronRight,
  PlaneTakeoff,
  Globe2,
} from 'lucide-react';

interface HeroSectionProps {
  onSearch: (type: 'package' | 'hotel' | 'vehicle', destination: string) => void;
  onExploreClick: () => void;
  onBookFleetClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onExploreClick,
  onBookFleetClick,
}) => {
  const [activeTab, setActiveTab] = useState<'package' | 'hotel' | 'vehicle'>('package');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [passengers, setPassengers] = useState('2-4 Guests');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(activeTab, selectedDestination);
  };

  return (
    <section id="hero" className="relative min-h-[96vh] flex flex-col justify-center overflow-hidden pt-6 pb-20 bg-[#FDFBF7]">
      {/* 1. Cinematic Background Layer with Slow Ambient Zoom & Light Depth */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/hero_cinematic_travel_1790508747634.jpg"
          alt="Prompt Travels Scenic Journey"
          className="h-full w-full object-cover object-center scale-105 transform motion-safe:animate-[pulse_14s_ease-in-out_infinite]"
          referrerPolicy="no-referrer"
        />
        {/* Layered soft luminous gradients that protect readability while preserving rich photo texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/95 via-[#FDFBF7]/85 to-[#FDFBF7]/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/60 via-transparent to-[#FDFBF7]" />
        {/* Subtle geometric travel latitude grid watermark */}
        <div className="absolute inset-0 pattern-latlong opacity-30" />
      </div>

      {/* 2. Abstract 3D Floating Shapes & Glow Halos */}
      <div className="absolute top-16 right-1/4 h-96 w-96 rounded-full bg-amber-400/10 blur-[130px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-20 left-10 h-80 w-80 rounded-full bg-pink-500/10 blur-[120px] pointer-events-none animate-pulse-glow" />
      
      {/* Floating 3D Gold Ring / Latitude Arc */}
      <div className="absolute -top-12 -right-12 w-96 h-96 border border-amber-300/30 rounded-full pointer-events-none animate-spin-slow opacity-60" />
      <div className="absolute top-20 right-8 w-64 h-64 border border-pink-400/20 rounded-full pointer-events-none animate-spin-slow opacity-40" />

      {/* 3. Main Composition Grid: Editorial Story (Left) + 3D Dimensional Showcase (Right) */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Editorial Typography & High-Status Storytelling */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Status Pill with Shimmer & Verification */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-300/80 bg-white/90 backdrop-blur-md px-3.5 py-1.5 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BE185D]" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#BE185D] font-bold">
                TN Tourism Govt Recognized · 25+ Years of Excellence
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="hidden sm:inline text-[11px] font-semibold text-slate-600">
                100% On-Time VIP Pickups
              </span>
            </div>

            {/* Majestic Headline with Expressive Editorial Weights */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-bold tracking-tight text-slate-900 leading-[1.05] text-balance">
              Extraordinary Journeys. <br />
              <span className="font-serif-luxury font-normal italic bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                Uncompromising
              </span>{' '}
              Elegance.
            </h1>

            {/* Editorial Subheading */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-sans-ui font-medium">
              Chennai’s most trusted luxury travel authority. We curate guaranteed VIP temple darshans, private coastal estates along the East Coast Road, misty high-range hill sanctuaries, and flawless executive chauffeur mobility across Southern India.
            </p>

            {/* Quick Interactive Route Destination Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-mono text-slate-600 font-semibold uppercase mr-1">Trending:</span>
              {[
                { name: 'Tirupati VIP Darshan', dest: 'dest_tirupati' },
                { name: 'Munnar Mist Sanctuary', dest: 'dest_munnar_kerala' },
                { name: 'Mahabalipuram Coastal', dest: 'dest_mahabs_pondicherry' },
                { name: 'Dubai Emirates', dest: 'dest_dubai' },
              ].map((item) => (
                <button
                  key={item.dest}
                  type="button"
                  onClick={() => {
                    setSelectedDestination(item.dest);
                    onSearch('package', item.dest);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/95 border border-slate-200/90 text-slate-700 hover:border-amber-400 hover:text-[#BE185D] hover:shadow-sm transition-all cursor-pointer"
                >
                  <MapPin className="h-3 w-3 text-amber-500" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-900/15 hover:shadow-xl hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                <Compass className="h-4 w-4" />
                <span>Explore Tour Corridors</span>
                <ArrowRight className="h-4 w-4 ml-1 opacity-80" />
              </button>

              <button
                onClick={onBookFleetClick}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-300 bg-white/95 backdrop-blur-md px-6 py-3.5 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:border-amber-400 shadow-sm transition-all cursor-pointer"
              >
                <Car className="h-4 w-4 text-[#BE185D]" />
                <span>Executive Chauffeur Fleet</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Layered Perspective Composition & Floating Cards */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Ambient Background Glow for 3D element */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-pink-400/15 to-transparent rounded-3xl blur-2xl transform scale-95" />

            {/* Main Primary Visual Card with Editorial Depth Framing */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-white/90 bg-white p-2.5 shadow-2xl shadow-slate-900/12 transform transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden">
                <img
                  src="/src/assets/images/luxury_voyage_panorama_1790514285975.jpg"
                  alt="Prompt Travels Exclusive Journeys"
                  className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Photo Top Badge */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/75 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-amber-300 border border-white/20">
                    <Sparkles className="h-3 w-3" />
                    <span>Curated South India Grand Circuit</span>
                  </span>
                  <span className="font-mono text-[10px] text-white/90 bg-slate-900/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">
                    13°N · 80°E
                  </span>
                </div>

                {/* Photo Bottom Caption */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[11px] font-mono text-amber-300 font-semibold tracking-wide uppercase">Signature Experience</p>
                  <h3 className="font-display text-xl font-bold leading-snug">
                    Spiritual Sanctums & Pristine Hill Estates
                  </h3>
                  <p className="text-xs text-slate-200 mt-1 line-clamp-1">
                    Private air-conditioned Toyota Innova Crysta transfers with local heritage escorts.
                  </p>
                </div>
              </div>
            </div>

            {/* Overlapping Floating Card 1: Top-Right "Confirmed VIP Darshan Pass" */}
            <div className="absolute -top-6 -right-4 sm:-right-6 z-20 w-64 rounded-2xl border border-amber-300/80 bg-white/95 backdrop-blur-xl p-3.5 shadow-xl shadow-slate-900/10 animate-float-slow hidden sm:block">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-lg bg-pink-100 text-[#BE185D] flex items-center justify-center font-bold text-xs">
                    VIP
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-none">Tirupati Sanctum</p>
                    <p className="text-[10px] text-slate-600 font-medium">Quick Darshan Guaranteed</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Approved</span>
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                <span>Daily Escorted Departs</span>
                <span className="font-bold text-slate-900 font-mono">04:30 AM Daily</span>
              </div>
            </div>

            {/* Overlapping Floating Card 2: Bottom-Left "Live Traveler Trust & Review" */}
            <div className="absolute -bottom-6 -left-4 sm:-left-6 z-20 w-72 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl p-4 shadow-xl shadow-slate-900/10 animate-float-reverse">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="/src/assets/images/destination_kerala_munnar_1790508773124.jpg"
                    alt="Munnar Hills"
                    className="h-12 w-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-800 ml-1">4.9/5</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    "Flawless Tirupati & Munnar trip"
                  </p>
                  <p className="text-[10px] text-slate-600 font-medium truncate">
                    Verified Customer · Chennai Family Journey
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Compass Widget */}
            <div className="absolute -top-3 left-4 z-20 flex items-center gap-2 rounded-xl bg-slate-900/90 text-white px-3 py-1.5 backdrop-blur-md border border-white/20 shadow-md">
              <Globe2 className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
              <span className="text-[11px] font-mono font-semibold tracking-wider">CHENNAI · SOUTH ASIA</span>
            </div>
          </div>
        </div>

        {/* ================= ARCHITECTURAL INTEGRATED BOOKING CONSOLE ================= */}
        <div className="mt-14 relative z-20 max-w-5xl mx-auto rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl shadow-slate-900/8">
          {/* Subtle top golden light rim */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

          {/* Console Header Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('package')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'package'
                    ? 'bg-gradient-to-r from-[#BE185D] to-[#D4AF37] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Curated Tour Packages</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hotel')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'hotel'
                    ? 'bg-gradient-to-r from-[#BE185D] to-[#D4AF37] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>Luxury Hotels & Stays</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vehicle')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'vehicle'
                    ? 'bg-gradient-to-r from-[#BE185D] to-[#D4AF37] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Car className="h-4 w-4" />
                <span>Executive Innova & Fleets</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-600 font-mono">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span>Instant Confirmation</span>
            </div>
          </div>

          {/* Interactive Form Fields */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Field 1: Destination / Route */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                Corridor / Destination
              </label>
              <div className="relative">
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50/60 py-3 pl-3.5 pr-8 text-xs sm:text-sm text-slate-900 font-semibold focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="all">🌟 All Curated Corridors</option>
                  <option value="dest_tirupati">Tirupati Balaji (VIP Darshan)</option>
                  <option value="dest_mahabs_pondicherry">Mahabalipuram & Pondicherry ECR</option>
                  <option value="dest_munnar_kerala">Munnar & Kerala Tea Hills</option>
                  <option value="dest_dubai">Dubai & Arabian Emirates</option>
                  <option value="dest_rameshwaram_madurai">Madurai, Rameshwaram & Kanyakumari</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <ChevronRight className="h-4 w-4 transform rotate-90" />
                </div>
              </div>
            </div>

            {/* Field 2: Party Size / Vehicle Class */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                {activeTab === 'vehicle' ? 'Vehicle Class' : 'Travelers / Party'}
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/60 py-3 px-3.5 text-xs sm:text-sm text-slate-900 font-semibold focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all cursor-pointer"
              >
                {activeTab === 'vehicle' ? (
                  <>
                    <option value="innova">Toyota Innova Crysta (6-7 Seats)</option>
                    <option value="dzire">Swift Dzire Executive Sedan (4 Seats)</option>
                    <option value="urbania">Force Urbania Luxury Van (10-15 Seats)</option>
                    <option value="coach">Luxury AC Coach (25-45 Seats)</option>
                  </>
                ) : (
                  <>
                    <option value="solo">Solo Pilgrim / Traveler</option>
                    <option value="2-4 Guests">Couples / Family (2-4 Guests)</option>
                    <option value="5-8 Guests">Joint Family Group (5-8 Guests)</option>
                    <option value="9+ Guests">Corporate / Pilgrimage Sangam (9+)</option>
                  </>
                )}
              </select>
            </div>

            {/* Field 3: Service Focus / Perks */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                Concierge Inclusions
              </label>
              <div className="rounded-xl border border-slate-200 bg-slate-100/70 py-3 px-3.5 text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>
                  {activeTab === 'package' && 'VIP Pass + Chauffeur + Stays'}
                  {activeTab === 'hotel' && 'Breakfast + Free Cancellation'}
                  {activeTab === 'vehicle' && 'AC Chauffeur + All Tolls Included'}
                </span>
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 ml-1" />
              </div>
            </div>

            {/* Field 4: Search Button */}
            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-[#BE185D] py-3.5 px-6 text-xs sm:text-sm font-bold text-white shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer group"
              >
                <Search className="h-4 w-4 text-amber-400 group-hover:text-white transition-colors" />
                <span>
                  {activeTab === 'package' ? 'Search Packages' : activeTab === 'hotel' ? 'Find Stays' : 'View Fleet Tariffs'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* 4. Quantified Credibility Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-200/90 pt-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold">
              25+
            </div>
            <div>
              <p className="font-mono-numbers text-lg sm:text-xl font-extrabold text-slate-900 leading-none">25+ Years</p>
              <p className="text-[11px] font-semibold text-slate-600 mt-1">Chennai Ops Since 2000</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-[#BE185D] font-bold">
              45k
            </div>
            <div>
              <p className="font-mono-numbers text-lg sm:text-xl font-extrabold text-[#BE185D] leading-none">45,000+</p>
              <p className="text-[11px] font-semibold text-slate-600 mt-1">Pilgrimages & Tours Hosted</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
              100%
            </div>
            <div>
              <p className="font-mono-numbers text-lg sm:text-xl font-extrabold text-slate-900 leading-none">100% On-Time</p>
              <p className="text-[11px] font-semibold text-slate-600 mt-1">Doorstep Pickup Guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold">
              4.9★
            </div>
            <div>
              <p className="font-mono-numbers text-lg sm:text-xl font-extrabold text-[#C59B27] leading-none">4.9 / 5.0</p>
              <p className="text-[11px] font-semibold text-slate-600 mt-1">Verified Traveler Reviews</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
