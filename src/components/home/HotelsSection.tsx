import React, { useState } from 'react';
import { Hotel } from '../../types';
import { Star, MapPin, Check, Wifi, Coffee, Sparkles, Building2, Eye, X, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

interface HotelsSectionProps {
  hotels: Hotel[];
  onBookHotel: (hotel: Hotel) => void;
}

export const HotelsSection: React.FC<HotelsSectionProps> = ({ hotels, onBookHotel }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [detailedHotel, setDetailedHotel] = useState<Hotel | null>(null);

  const filtered = hotels.filter((h) =>
    selectedCategory === 'all' ? true : h.category === selectedCategory
  );

  return (
    <section id="hotels" className="relative py-24 bg-white border-t border-slate-200/90 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-400/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#BE185D] font-bold">
                03. Hospitality & Sanctuaries
              </span>
              <span className="h-1 w-8 bg-[#BE185D]/60 rounded-full" />
              <span className="text-[11px] font-semibold text-slate-500 font-mono">Curated Stays & Resorts</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Hotels & Coastal Resorts
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-normal leading-relaxed">
              Handpicked heritage properties, beachfront pavilions along the East Coast Road, and serene pilgrimage accommodations with private car parking.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start md:self-auto overflow-x-auto shadow-sm">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-[#BE185D] to-[#D4AF37] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => setSelectedCategory('luxury_resort')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'luxury_resort'
                  ? 'bg-gradient-to-r from-[#BE185D] to-[#D4AF37] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
              }`}
            >
              Beach & Hill Resorts
            </button>
            <button
              onClick={() => setSelectedCategory('pilgrimage_comfort')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'pilgrimage_comfort'
                  ? 'bg-gradient-to-r from-[#BE185D] to-[#D4AF37] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
              }`}
            >
              Pilgrim Accommodations
            </button>
          </div>
        </div>

        {/* CINEMATIC FULL-BLEED FEATURE BANNER: Private Heritage Sanctuary */}
        <div className="relative mb-14 rounded-3xl overflow-hidden border border-amber-300/80 bg-slate-900 shadow-2xl shadow-slate-900/10">
          <div className="relative h-80 sm:h-96 w-full overflow-hidden">
            <img
              src="/src/assets/images/luxury_resort_sanctum_1790514300147.jpg"
              alt="Luxury Heritage Stays by Prompt Travels"
              className="h-full w-full object-cover object-center scale-102 transition-transform duration-1000 ease-out hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          </div>

          {/* Overlapping Content Layer inside Banner */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 text-white pointer-events-none">
            <div className="flex items-center justify-between pointer-events-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-slate-950 px-3.5 py-1 text-xs font-bold shadow-md">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Premier Stay Experience</span>
              </span>
              <span className="font-mono text-xs text-white/90 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                Direct Hotel Partnerships
              </span>
            </div>

            <div className="max-w-2xl space-y-3 pointer-events-auto">
              <p className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                Private Stays & Heritage Sanctuaries
              </p>
              <h3 className="font-display text-2xl sm:text-4xl font-bold leading-tight">
                Authentic Dravidian Courtyards & Oceanfront Pavilions
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans-ui line-clamp-2 sm:line-clamp-none">
                Exclusive benefits for Prompt Travels patrons: complimentary traditional South Indian breakfasts, guaranteed late check-outs, and verified quiet rooms after spiritual journeys.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-amber-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Sanitized & AC Guaranteed</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-200">
                  <HeartHandshake className="h-4 w-4 text-amber-400" />
                  <span>Dedicated Chauffeur Rest Rooms</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {filtered.map((hotel) => (
            <div
              key={hotel.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white overflow-hidden transition-all duration-400 hover:border-amber-400 hover:shadow-xl hover:shadow-slate-900/8 card-3d"
            >
              <div>
                {/* Image */}
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={hotel.heroImage}
                    alt={hotel.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-106"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                  {/* Star Rating Badge */}
                  <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-200/90 flex items-center gap-1.5 text-xs font-bold text-slate-900 shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{hotel.starRating}-Star Certified</span>
                  </div>

                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" />
                    <span>{hotel.city}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 sm:p-6 space-y-3">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#BE185D] transition-colors">
                    {hotel.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-sans-ui">
                    {hotel.description}
                  </p>

                  {/* Amenities snapshot */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs text-slate-700">
                    {hotel.amenities.slice(0, 3).map((a, i) => (
                      <span key={i} className="flex items-center gap-1.5 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span>{a}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Book */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono font-semibold">Nightly rate from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono-numbers text-xl font-extrabold text-slate-900">
                      ₹{hotel.pricePerNightStart.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-slate-500">/ night</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDetailedHotel(hotel)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
                    title="View Rooms & Amenities"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onBookHotel(hotel)}
                    className="rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                  >
                    Reserve Room
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Detail Modal */}
      {detailedHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setDetailedHotel(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header Hero Image */}
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={detailedHotel.heroImage}
                alt={detailedHotel.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                  {detailedHotel.city} · {detailedHotel.starRating} Stars Certified
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold mt-1">
                  {detailedHotel.name}
                </h3>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 space-y-6 bg-white text-slate-900">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#BE185D] mb-2 font-mono">
                  Property Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {detailedHotel.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono">
                  Signature Inclusions & Facilities
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {detailedHotel.amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-mono">
                  Available Room Suites
                </h4>
                <div className="space-y-3">
                  {(detailedHotel.rooms || []).map((rt) => (
                    <div
                      key={rt.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 gap-3"
                    >
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900">{rt.title || rt.roomType}</h5>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Capacity: Up to {rt.maxGuests} Guests · {(rt.amenities || []).join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                        <div className="text-right">
                          <span className="font-mono-numbers text-base font-extrabold text-slate-900">
                            ₹{rt.pricePerNight.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-500 block">/ night</span>
                        </div>
                        <button
                          onClick={() => {
                            const hotelToBook = detailedHotel;
                            setDetailedHotel(null);
                            onBookHotel(hotelToBook);
                          }}
                          className="rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] px-4 py-2 text-xs font-bold text-white hover:brightness-105 transition-all cursor-pointer"
                        >
                          Select Room
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
