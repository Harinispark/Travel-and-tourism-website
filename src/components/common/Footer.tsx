import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigateSection?: (sectionId: string) => void;
  onOpenEnquiry?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenEnquiry }) => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Logo size="md" />
            </div>

            <p className="text-xs leading-relaxed text-slate-600">
              Chennai’s trusted travel and corporate mobility authority since 2000. Seamless pilgrimage darshans, luxury coastal getaways, bespoke international journeys, and executive transport.
            </p>

            <div className="pt-2 text-xs flex items-center gap-2 text-slate-800 font-bold">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Government Registered · Active GST Fleet</span>
            </div>
          </div>

          {/* Real Chennai Offices */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Offices & Operations Hub
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#BE185D] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Head Office (Mylapore):</p>
                  <p className="text-slate-600 mt-0.5">
                    177/93, 2nd Floor, SMS Center, Luz, Mylapore, Chennai – 600 004
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#BE185D] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Operations Hub (Porur):</p>
                  <p className="text-slate-600 mt-0.5">
                    No. 142, 4th Cross St, 3rd Main Rd, Porur Gardens Phase - II, Vanagaram, Chennai – 600 095
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Contact & 24/7 Helpline
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <a href="tel:+919841802288" className="font-mono-numbers font-bold text-slate-900 hover:text-[#BE185D] transition-colors">
                  +91 98418 02288
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <a href="tel:+919444013395" className="font-mono-numbers font-bold text-slate-900 hover:text-[#BE185D] transition-colors">
                  +91 94440 13395
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <a href="tel:04424980288" className="font-mono-numbers font-bold text-slate-900 hover:text-[#BE185D] transition-colors">
                  044 - 2498 0288
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Mail className="h-3.5 w-3.5 text-[#BE185D] shrink-0" />
                <a href="mailto:prompt_travels@yahoo.co.in" className="text-slate-700 hover:text-[#BE185D] transition-colors">
                  prompt_travels@yahoo.co.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#BE185D] shrink-0" />
                <a href="mailto:prompttours2000@gmail.com" className="text-slate-700 hover:text-[#BE185D] transition-colors">
                  prompttours2000@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Explore & Book
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection && onNavigateSection('destinations')}
                  className="hover:text-[#BE185D] transition-colors cursor-pointer text-left font-medium"
                >
                  Tirupati Balaji Darshan Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection && onNavigateSection('packages')}
                  className="hover:text-[#BE185D] transition-colors cursor-pointer text-left font-medium"
                >
                  Mahabalipuram & Pondicherry ECR Coastal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection && onNavigateSection('fleet')}
                  className="hover:text-[#BE185D] transition-colors cursor-pointer text-left font-medium"
                >
                  Toyota Innova Crysta & Urbania Rental
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection && onNavigateSection('hotels')}
                  className="hover:text-[#BE185D] transition-colors cursor-pointer text-left font-medium"
                >
                  Luxury Resorts & Temple Stays
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenEnquiry}
                  className="text-[#BE185D] font-bold hover:underline cursor-pointer block pt-1"
                >
                  Request Customized Corporate Quote →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Prompt Tours & Travels. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex items-center gap-6 font-medium">
            <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-900 cursor-pointer">Cancellation & Refunds</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
