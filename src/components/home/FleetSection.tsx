import React from 'react';
import { Vehicle } from '../../types';
import { Users, Briefcase, Wind, Check, ShieldCheck, ArrowRight, Sparkles, Navigation, Award } from 'lucide-react';

interface FleetSectionProps {
  vehicles: Vehicle[];
  onBookVehicle: (vehicle: Vehicle) => void;
  onEnquireFleet: (vehicle?: Vehicle) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({
  vehicles,
  onBookVehicle,
  onEnquireFleet,
}) => {
  return (
    <section id="fleet" className="relative py-24 bg-slate-50/80 border-t border-slate-200/90 overflow-hidden">
      {/* Subtle travel latitude grid pattern */}
      <div className="absolute inset-0 pattern-latlong opacity-30 pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#BE185D] font-bold">
                04. Executive Mobility
              </span>
              <span className="h-1 w-8 bg-amber-400/80 rounded-full" />
              <span className="text-[11px] font-semibold text-slate-500 font-mono">Chauffeur-Driven Fleet</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Chauffeur Fleet & Transfers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-normal leading-relaxed">
              Meticulously maintained Toyota Innova Crysta, premium executive sedans, and luxury Force Urbania touring coaches. Operated by police-verified, courteous chauffeurs fluent in English & Tamil.
            </p>
          </div>

          <button
            onClick={() => onEnquireFleet()}
            className="self-start md:self-auto rounded-2xl border border-amber-300 bg-white hover:bg-amber-50 px-6 py-3 text-xs sm:text-sm font-bold text-amber-900 shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Custom Outstation / Corporate Fleet Quote</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Mobility Standards Strip */}
        <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-pink-50 text-[#BE185D] flex items-center justify-center font-bold text-xs">
              <Navigation className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">GPS Live Tracking</p>
              <p className="text-[10px] text-slate-500 font-medium">Real-time Safety Monitored</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Verified Chauffeurs</p>
              <p className="text-[10px] text-slate-500 font-medium">10+ Yrs Route Experience</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Pristine Hygiene</p>
              <p className="text-[10px] text-slate-500 font-medium">Sanitized & Bottled Water</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Transparent Rates</p>
              <p className="text-[10px] text-slate-500 font-medium">No Hidden Surcharges</p>
            </div>
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {vehicles.map((veh) => (
            <div
              key={veh.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white overflow-hidden transition-all duration-400 hover:border-amber-400 hover:shadow-xl hover:shadow-slate-900/8 card-3d"
            >
              <div>
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={veh.heroImage}
                    alt={veh.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-106"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* AC badge */}
                  {veh.ac && (
                    <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-900 flex items-center gap-1.5 border border-slate-200 shadow-sm">
                      <Wind className="h-3.5 w-3.5 text-[#BE185D]" />
                      <span>Climate Controlled</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 text-xs font-mono font-bold text-amber-300 uppercase tracking-wide">
                    {veh.vehicleType.replace('_', ' ')}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-[#BE185D] transition-colors">
                    {veh.name}
                  </h3>

                  {/* Spec Row */}
                  <div className="flex items-center gap-4 text-xs text-slate-700 border-y border-slate-100 py-2.5">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Users className="h-3.5 w-3.5 text-[#BE185D]" />
                      <span>{veh.capacitySeats} Seats</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Briefcase className="h-3.5 w-3.5 text-amber-600" />
                      <span>{veh.luggageCapacity} Bags</span>
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    {veh.features.slice(0, 3).map((f, i) => (
                      <p key={i} className="flex items-center gap-2 truncate">
                        <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span className="truncate font-medium">{f}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/60 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Local (8hr / 80km):</span>
                    <span className="font-mono-numbers font-extrabold text-slate-900 text-sm">
                      ₹{veh.localPackage8hr80km.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-500">
                    <span>Outstation Rate:</span>
                    <span className="font-mono-numbers font-bold text-slate-800">₹{veh.perKmRate} / km</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onBookVehicle(veh)}
                  className="w-full rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] py-3 text-xs font-bold text-white shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  Book Chauffeur Ride
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
