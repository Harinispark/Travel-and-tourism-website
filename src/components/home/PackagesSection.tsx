import React, { useState } from 'react';
import { Package } from '../../types';
import { Clock, Calendar, ShieldCheck, Check, X, ArrowRight, Eye, Sparkles, MapPin, Star, Award, HeartHandshake } from 'lucide-react';

interface PackagesSectionProps {
  packages: Package[];
  onBookPackage: (pkg: Package) => void;
  onEnquirePackage: (pkg: Package) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  onBookPackage,
  onEnquirePackage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [detailedPackage, setDetailedPackage] = useState<Package | null>(null);

  const categories = [
    { id: 'all', label: 'All Curated Packages' },
    { id: 'pilgrimage', label: 'Spiritual Sanctums' },
    { id: 'weekend', label: 'ECR & Coastal Heritage' },
    { id: 'hill_station', label: 'Kerala Mist & Tea Hills' },
    { id: 'international', label: 'International Holidays' },
  ];

  const filtered = packages.filter((p) =>
    selectedCategory === 'all' ? true : p.category === selectedCategory
  );

  // Flagship featured package for the editorial showcase
  const featuredPackage = packages.find((p) => p.isFeatured) || packages[0];
  const regularPackages = filtered.filter((p) => p.id !== featuredPackage?.id);

  return (
    <section id="packages" className="relative py-24 bg-[#F8FAFC] border-t border-slate-200/90 overflow-hidden">
      {/* Background ambient light layers & travel contour pattern */}
      <div className="absolute inset-0 pattern-latlong opacity-35 pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#BE185D] font-bold">
                02. Signature Journeys
              </span>
              <span className="h-1 w-8 bg-amber-400/80 rounded-full" />
              <span className="text-[11px] font-semibold text-slate-500 font-mono">End-to-End Managed Travel</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Curated Tour Packages
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-normal leading-relaxed">
              Every itinerary is operated directly by our seasoned chauffeurs and heritage concierges. No outsourced guesswork, guaranteed darshan entries, and handpicked luxury resorts.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 self-start md:self-auto overflow-x-auto shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#BE185D] to-[#D4AF37] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. EDITORIAL FLAGSHIP HERO SHOWCASE (Avoids Repetitive Cards) */}
        {featuredPackage && (selectedCategory === 'all' || featuredPackage.category === selectedCategory) && (
          <div className="mb-14 relative rounded-3xl border border-amber-300/80 bg-white shadow-xl shadow-slate-900/6 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Visual Area */}
              <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[440px] overflow-hidden">
                <img
                  src={featuredPackage.heroImage}
                  alt={featuredPackage.title}
                  className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/85 via-slate-950/30 to-transparent" />
                
                {/* Floating Flagship Badge */}
                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#BE185D] text-white px-3.5 py-1 text-xs font-bold shadow-md">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>Prompt Signature Flagship</span>
                  </span>
                  <span className="rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 px-3 py-1 text-xs font-mono font-bold border border-white/20">
                    {featuredPackage.durationDays} Days / {featuredPackage.durationNights} Nights
                  </span>
                </div>

                {/* Overlapping Info Strip */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-xs font-mono text-amber-300 font-semibold tracking-wider uppercase">
                    {featuredPackage.destinationName}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold mt-1 text-balance">
                    {featuredPackage.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>Dedicated AC Chauffeur</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span>Heritage & 4-Star Stays</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span>All Tolls & Permits Included</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Editorial Details & Actions */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-white to-slate-50/60">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#BE185D] uppercase tracking-wider">
                      Verified Itinerary
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Award className="h-3.5 w-3.5" />
                      <span>Top Rated Experience</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {featuredPackage.description}
                  </p>

                  {/* Highlights Bulleted */}
                  <div className="space-y-2 border-t border-slate-200/80 pt-4">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      What's Included
                    </p>
                    <div className="space-y-1.5">
                      {featuredPackage.highlights.slice(0, 3).map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="h-4 w-4 text-[#BE185D] shrink-0 mt-0.5" />
                          <span className="font-medium">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="border-t border-slate-200 pt-5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono block">All-Inclusive Fare</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono-numbers text-2xl sm:text-3xl font-extrabold text-slate-900">
                        ₹{featuredPackage.startingPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/ person</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailedPackage(featuredPackage)}
                      className="rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onBookPackage(featuredPackage)}
                      className="rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Book Signature Tour
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. REGULAR PACKAGES GRID with Floating Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {regularPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white overflow-hidden transition-all duration-400 hover:border-amber-400 hover:shadow-xl hover:shadow-slate-900/8 card-3d"
            >
              <div>
                {/* Image Cover */}
                <div className="relative h-60 w-full overflow-hidden">
                  <img
                    src={pkg.heroImage}
                    alt={pkg.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-106"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                  {/* Top unboxed duration tag */}
                  <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-200/90 text-xs font-bold text-slate-900 flex items-center gap-1.5 shadow-sm">
                    <Clock className="h-3.5 w-3.5 text-[#BE185D]" />
                    <span>
                      {pkg.durationDays} Day{pkg.durationDays > 1 ? 's' : ''}{' '}
                      {pkg.durationNights > 0 && `· ${pkg.durationNights} Night${pkg.durationNights > 1 ? 's' : ''}`}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">
                    {pkg.destinationName}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#BE185D] transition-colors line-clamp-2">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans-ui">
                    {pkg.description}
                  </p>

                  {/* Highlights snippet */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    {pkg.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Price & Booking Actions */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono font-semibold">Starting from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono-numbers text-xl font-extrabold text-slate-900">
                      ₹{pkg.startingPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-slate-500">/ person</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailedPackage(pkg)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
                    title="View Day-by-Day Itinerary"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onBookPackage(pkg)}
                    className="rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Detail Modal */}
      {detailedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setDetailedPackage(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={detailedPackage.heroImage}
                alt={detailedPackage.title}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                  {detailedPackage.destinationName} · {detailedPackage.durationDays} Days / {detailedPackage.durationNights} Nights
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold mt-1">
                  {detailedPackage.title}
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-6 bg-white text-slate-900">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#BE185D] mb-2 font-mono">
                  Tour Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {detailedPackage.description}
                </p>
              </div>

              {/* Day-by-Day Itinerary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono">
                  Day-by-Day Verified Itinerary
                </h4>
                <div className="space-y-3">
                  {detailedPackage.itinerary.map((day) => (
                    <div
                      key={day.day}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#BE185D]">
                          Day 0{day.day}: {day.title}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium bg-white px-2 py-0.5 rounded border border-slate-200">
                          {day.meals}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{day.description}</p>
                      <p className="text-[11px] text-slate-500 font-mono">Stay: {day.stay}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5">
                  <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2.5 font-mono">
                    Inclusions
                  </h5>
                  <ul className="space-y-2 text-xs text-emerald-950 font-medium">
                    {detailedPackage.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 sm:p-5">
                  <h5 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2.5 font-mono">
                    Exclusions
                  </h5>
                  <ul className="space-y-2 text-xs text-rose-950 font-medium">
                    {detailedPackage.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <X className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Bottom Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Package Price</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono-numbers text-2xl font-extrabold text-slate-900">
                      ₹{detailedPackage.startingPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500">/ person</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setDetailedPackage(null);
                      onEnquirePackage(detailedPackage);
                    }}
                    className="flex-1 sm:flex-none rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Custom Quote
                  </button>

                  <button
                    onClick={() => {
                      const pkgToBook = detailedPackage;
                      setDetailedPackage(null);
                      onBookPackage(pkgToBook);
                    }}
                    className="flex-1 sm:flex-none rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] px-7 py-3 text-xs sm:text-sm font-bold text-white hover:brightness-105 shadow-md transition-all cursor-pointer"
                  >
                    Proceed with Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
