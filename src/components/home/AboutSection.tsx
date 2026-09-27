import React from 'react';
import { ShieldCheck, Award, HeartHandshake, Clock, MapPin, CheckCircle2, Sparkles, Building, PhoneCall } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-24 bg-white border-t border-slate-200/90 overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 pattern-dots opacity-35 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-400/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Brand Story (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#BE185D] font-bold">
                05. Heritage & Credentials
              </span>
              <span className="h-1 w-8 bg-[#BE185D]/60 rounded-full" />
              <span className="text-[11px] font-semibold text-slate-500 font-mono">Quarter Century Legacy</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              A Quarter Century of <br />
              <span className="font-serif-luxury font-normal italic bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                Trust, Promptness & Precision.
              </span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              <p>
                Founded in Chennai in 2000, <strong>Prompt Tours & Travels</strong> was born from a singular pledge: to elevate Indian travel beyond standard agency transactions into deeply dependable, respectful, and punctual journeys.
              </p>
              <p>
                Operating with central offices in <strong>Luz, Mylapore</strong> and our dedicated fleet hub in <strong>Porur Gardens, Vanagaram</strong>, we manage end-to-end pilgrim logistics to Tirumala Balaji, coastal escapes to Mahabalipuram and Pondicherry, highland tours across Kerala, and multinational journeys to Dubai and Southeast Asia.
              </p>
              <p>
                Every chauffeur in our uniform is background-screened, courteous, and versed in temple rituals and highway safety protocols. We do not compromise on vehicle maintenance or customer care.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <ShieldCheck className="h-4 w-4 text-[#BE185D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Verified Chauffeurs</h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">Strict background checks and police screenings.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Zero Delay Punctuality</h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">Vehicles report 15 mins before scheduled departure.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <Award className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Temple Darshan Expertise</h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">Assistance with TTD ₹300 Special Entry darshan queues.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <HeartHandshake className="h-4 w-4 text-[#BE185D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Transparent Billing</h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">Tolls, permits, driver allowances all clear upfront.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Overlapping 3D Editorial Photo Composition (5 cols) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Primary Image Frame */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-white bg-white p-2.5 shadow-2xl shadow-slate-900/12">
              <img
                src="/src/assets/images/destination_tirupati_temple_1790508760584.jpg"
                alt="Prompt Travels Temple Spiritual Journey"
                className="h-80 sm:h-96 w-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent rounded-2xl" />

              {/* Floating Overlapping Hub Badge */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-4 shadow-xl text-slate-900">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-900">Chennai Headquarters & Hub</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#BE185D] uppercase">Est. 2000</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-amber-600 shrink-0" />
                    <span>Luz Church Road, Mylapore, Chennai - 600004</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Building className="h-3 w-3 text-[#BE185D] shrink-0" />
                    <span>Fleet Terminal: Porur Gardens Phase II, Chennai</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Overlapping Floating Certificate Chip */}
            <div className="absolute -top-5 -left-4 z-20 rounded-2xl border border-amber-300/80 bg-white/95 backdrop-blur-xl p-3 shadow-lg flex items-center gap-2.5 animate-float-slow">
              <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">TN Tourism Recognized</p>
                <p className="text-[10px] text-slate-500 font-medium">Govt Approved Travel Agency</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
