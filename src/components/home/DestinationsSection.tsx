import React, { useState } from 'react';
import { Destination } from '../../types';
import { MapPin, Calendar, Sparkles, ArrowRight, X, Check, Compass, Star, ChevronRight, Eye } from 'lucide-react';

interface DestinationsSectionProps {
  destinations: Destination[];
  onSelectDestinationPackage: (pkg: any) => void;
  onBookItem: (type: 'package' | 'hotel', item: any) => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  destinations,
  onBookItem,
}) => {
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'Tamil Nadu' | 'South India' | 'International'>('all');

  const filtered = destinations.filter((d) =>
    activeFilter === 'all' ? true : d.region === activeFilter
  );

  return (
    <section id="destinations" className="relative py-24 bg-white overflow-hidden">
      {/* Decorative ambient background grid & delicate light washes */}
      <div className="absolute inset-0 pattern-dots opacity-40 pointer-events-none" />
      <div className="absolute -top-32 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-pink-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative top section transition separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header with Status Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#BE185D] font-bold">
                01. Curated Corridors
              </span>
              <span className="h-1 w-8 bg-[#BE185D]/60 rounded-full" />
              <span className="text-[11px] font-semibold text-slate-500 font-mono">Southern India & Arabian Gulf</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Immersive Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
              From the sanctified hills of Tirumala to the wind-swept stone temples of Mahabalipuram, the emerald heights of Munnar, and the soaring skylines of Dubai.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/90 self-start md:self-auto overflow-x-auto shadow-sm">
            {(['all', 'Tamil Nadu', 'South India', 'International'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-gradient-to-r from-[#BE185D] to-[#D4AF37] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
                }`}
              >
                {cat === 'all' ? 'All Corridors' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetrical Editorial Composition Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-7">
          {filtered.map((dest, idx) => {
            // Creative Asymmetrical Sizing: First is 7 cols, second is 5 cols, then 4-4-4
            let colSpan = 'md:col-span-6 lg:col-span-4';
            let heightClass = 'h-80 sm:h-96';
            if (idx === 0) {
              colSpan = 'md:col-span-12 lg:col-span-7';
              heightClass = 'h-96 sm:h-[28rem]';
            } else if (idx === 1) {
              colSpan = 'md:col-span-12 lg:col-span-5';
              heightClass = 'h-96 sm:h-[28rem]';
            }

            return (
              <div
                key={dest.id}
                onClick={() => setSelectedDest(dest)}
                className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white cursor-pointer transition-all duration-500 hover:border-amber-400 hover:shadow-2xl hover:shadow-slate-900/10 ${colSpan}`}
              >
                {/* Visual Image container with aspect ratio and smooth zoom */}
                <div className={`relative w-full overflow-hidden ${heightClass}`}>
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-108"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle dark gradient scrim at the bottom to ensure high contrast white text over photography */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  
                  {/* Ambient subtle hover tint */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#BE185D]/10 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Top unboxed floating metadata badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="font-mono text-[11px] font-bold tracking-wide bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-md">
                      {dest.region}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-md">
                      <Calendar className="h-3.5 w-3.5 text-amber-300" />
                      {dest.bestTimeToVisit}
                    </span>
                  </div>

                  {/* Overlapping Floating Tag inside card */}
                  <div className="absolute top-16 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 hidden sm:block">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-400/90 text-slate-900 text-[10px] font-bold px-2.5 py-1 shadow-md">
                      <Sparkles className="h-3 w-3" />
                      <span>Curated by Prompt Travels</span>
                    </span>
                  </div>

                  {/* Bottom Content with Layered Typography */}
                  <div className="absolute bottom-5 left-5 right-5 space-y-2.5 text-white">
                    <div className="flex items-center gap-2 text-xs text-amber-300 font-mono font-medium">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{dest.state}, {dest.country}</span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-bold group-hover:text-amber-300 transition-colors">
                      {dest.name}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed font-sans-ui">
                      {dest.tagline}
                    </p>

                    <div className="pt-3 flex items-center justify-between border-t border-white/20 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="text-[11px] font-medium text-slate-300">Daily Departures Available</span>
                      </div>
                      <span className="flex items-center gap-1.5 font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                        <span>Explore Corridor</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Destination Detail Modal */}
      {selectedDest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 max-h-[92vh] overflow-y-auto">
            {/* Header Hero Image */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={selectedDest.heroImage}
                alt={selectedDest.name}
                className="h-full w-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

              <button
                onClick={() => setSelectedDest(null)}
                className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                  {selectedDest.region} · {selectedDest.state}
                </span>
                <h3 className="font-display text-2xl sm:text-4xl font-bold mt-1">
                  {selectedDest.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 italic font-serif-luxury">
                  "{selectedDest.tagline}"
                </p>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-6 sm:p-8 space-y-6 bg-white text-slate-900">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#BE185D] mb-2 font-mono">
                  Destination Story & Context
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {selectedDest.description}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono">
                  Signature Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedDest.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                      <Check className="h-4 w-4 text-[#BE185D] shrink-0 mt-0.5" />
                      <span className="font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
                <div className="text-xs text-slate-600">
                  <span className="text-slate-500">Ideal Travel Season: </span>
                  <span className="text-slate-900 font-bold ml-1">{selectedDest.bestTimeToVisit}</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const matchingPkg = selectedDest.packages?.[0];
                      setSelectedDest(null);
                      if (matchingPkg) {
                        onBookItem('package', matchingPkg);
                      } else {
                        onBookItem('package', {
                          title: `${selectedDest.name} Tour Package`,
                          startingPrice: 3850,
                        });
                      }
                    }}
                    className="flex-1 sm:flex-none rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] px-7 py-3 text-xs sm:text-sm font-bold text-white hover:brightness-105 shadow-md transition-all cursor-pointer"
                  >
                    Reserve Tour for this Destination
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
