import React, { useState } from 'react';
import { api } from '../../services/api';
import { firestoreSync } from '../../services/firestoreSync';
import { X, Send, CheckCircle2, AlertCircle, Phone, Mail, User, Calendar, MapPin, Users } from 'lucide-react';
import { Logo } from './Logo';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledDestination?: string;
  prefilledService?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  prefilledDestination = '',
  prefilledService = 'tours',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState(prefilledService);
  const [destination, setDestination] = useState(prefilledDestination || 'Tirupati & Tirumala Balaji');
  const [travelDate, setTravelDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [travellersCount, setTravellersCount] = useState(2);
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!email.trim() && !phone.trim())) {
      setError('Please provide your name and either an email or mobile phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.submitEnquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        serviceType,
        destination,
        travelDate,
        travellersCount,
        message: message.trim(),
      });

      setEnquirySuccess(res.enquiry.enquiryCode);

      // Sync enquiry to Firebase Firestore
      firestoreSync.saveEnquiry(res.enquiry).catch((err) => {
        console.warn('Firestore enquiry sync notice:', err);
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl shadow-slate-900/15 max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#BE185D]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close enquiry modal"
        >
          <X className="h-5 w-5" />
        </button>

        {enquirySuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold text-slate-900">Enquiry Received</h3>
              <p className="text-xs text-slate-600 mt-1">
                Your enquiry reference is <span className="font-mono text-[#BE185D] font-bold">{enquirySuccess}</span>.
              </p>
              <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
                Prompt Travels operations desk in Mylapore & Porur has received your itinerary request. A dedicated travel coordinator will contact you promptly.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl bg-gradient-to-r from-[#BE185D] to-[#D4AF37] px-6 py-2.5 text-xs font-bold text-white hover:brightness-105 transition-all cursor-pointer shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-5 pt-1">
              <span className="text-[11px] font-mono font-bold text-[#BE185D] uppercase tracking-widest">
                Prompt Travels Desk · Direct Enquiry
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Plan Your Customized Journey
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Tell us your destination, travel dates, and group size for an all-inclusive quote.
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karthik Sundar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="karthik@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98418 02288"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Type</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs sm:text-sm text-slate-800 font-medium focus:border-amber-500 focus:outline-none"
                  >
                    <option value="pilgrimage">Pilgrimage Tour (Tirupati / Navagraha)</option>
                    <option value="car_rental">Innova / Vehicle Chauffeur Rental</option>
                    <option value="coastal_tour">Pondicherry & ECR Coastal Escape</option>
                    <option value="kerala_holiday">Munnar & Kerala Highlands</option>
                    <option value="corporate">Corporate Transport / Group Bus</option>
                    <option value="international">International Holiday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination / Route</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Tirupati Balaji VIP"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Travelers</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={travellersCount}
                      onChange={(e) => setTravellersCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Requirements or Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Need wheelchair assistance for elders, doorstep pickup from Anna Nagar, 3-star AC room..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <span>Submitting Enquiry...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Request to Operations Desk</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
