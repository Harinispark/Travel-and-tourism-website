import React, { useState } from 'react';
import { FAQ } from '../../types';
import { ChevronDown, HelpCircle, PhoneCall, Sparkles } from 'lucide-react';

interface FaqSectionProps {
  faqs: FAQ[];
  onOpenEnquiry?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs, onOpenEnquiry }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative py-24 bg-white border-t border-slate-200/90 overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 pattern-dots opacity-25 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#BE185D] font-bold">
              06. Frequently Asked Questions
            </span>
            <span className="h-1 w-8 bg-amber-400/80 rounded-full" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Travel Policies & Clear Answers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Detailed clarity on Tirupati Balaji darshan, outstation fleet rates, Razorpay payment transactions, and cancellations.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-sm hover:border-amber-400"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#BE185D] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-[#BE185D] bg-pink-50 border border-pink-100 px-2.5 py-1 rounded-lg">
                      {faq.category}
                    </span>
                    <span className="font-bold text-slate-800">{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#BE185D]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/60 font-sans-ui">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 rounded-3xl border border-amber-300/80 bg-gradient-to-r from-amber-50/90 via-white to-pink-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs shadow-md">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base">Have a customized pilgrimage or multi-city request?</p>
              <p className="text-slate-600 mt-0.5">Our Chennai travel desks are active 24/7 to formulate tailored itineraries and group fleet quotes.</p>
            </div>
          </div>
          <button
            onClick={onOpenEnquiry}
            className="rounded-2xl bg-slate-900 hover:bg-[#BE185D] px-6 py-3.5 font-bold text-xs sm:text-sm text-white transition-all whitespace-nowrap cursor-pointer shadow-md"
          >
            Speak With Operations Desk
          </button>
        </div>
      </div>
    </section>
  );
};
