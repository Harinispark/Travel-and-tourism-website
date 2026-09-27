import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Booking, Payment, CustomerProfile } from '../../types';
import {
  Calendar,
  CreditCard,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  FileText,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  LogOut,
  Ban,
  Building,
  Car,
  Compass,
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface CustomerDashboardProps {
  onBackToHome: () => void;
  onPayBooking: (booking: Booking) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onBackToHome,
  onPayBooking,
}) => {
  const { user, customer, logout, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'payments' | 'profile'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookingForVoucher, setSelectedBookingForVoucher] = useState<Booking | null>(null);

  // Profile edit states
  const [profileName, setProfileName] = useState(customer?.name || user?.name || '');
  const [profileEmail, setProfileEmail] = useState(customer?.email || user?.email || '');
  const [profilePhone, setProfilePhone] = useState(customer?.phone || user?.phone || '');
  const [profileAddress, setProfileAddress] = useState(customer?.address || '');
  const [profileCity, setProfileCity] = useState(customer?.city || 'Chennai');
  const [profilePreferences, setProfilePreferences] = useState(customer?.preferences || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Refund request modal state
  const [refundBookingId, setRefundBookingId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundLoading, setRefundLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(null);
    try {
      await api.updateProfile({
        name: profileName,
        email: profileEmail,
        phone: profilePhone,
        address: profileAddress,
        city: profileCity,
        preferences: profilePreferences,
      });
      await refreshUser();
      setProfileSuccess('Profile details saved successfully.');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleRequestRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundBookingId) return;
    setRefundLoading(true);
    try {
      await api.requestRefund(refundBookingId, refundReason);
      setRefundBookingId(null);
      setRefundReason('');
      fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Refund request failed.');
    } finally {
      setRefundLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700">
            <CheckCircle className="h-3 w-3" />
            CONFIRMED
          </span>
        );
      case 'Payment Pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-800">
            <Clock className="h-3 w-3" />
            PAYMENT PENDING
          </span>
        );
      case 'Refund Pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-700">
            REFUND PENDING
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-700">
            REFUNDED
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-mono font-bold text-red-700">
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#9D174D] via-[#D81B60] to-[#F59E0B] p-0.5 shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white">
                <span className="font-display text-xl font-bold bg-gradient-to-br from-[#BE185D] to-[#D4AF37] bg-clip-text text-transparent">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-slate-900">{user?.name}</h1>
                <span className="text-[10px] font-mono font-bold text-[#BE185D] bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-md uppercase">
                  Verified Customer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {user?.email || user?.phone} · Prompt Travels Member
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Browse Travel Services
            </button>
            <button
              onClick={logout}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-[#BE185D] to-[#D4AF37] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>My Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-gradient-to-r from-[#BE185D] to-[#D4AF37] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Payment History & Receipts</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-[#BE185D] to-[#D4AF37] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Profile & Preferences</span>
          </button>
        </div>

        {/* ================= TAB 1: MY BOOKINGS ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Active Itineraries & Reservation Records
              </h3>
              <button
                onClick={fetchBookings}
                className="flex items-center gap-1 text-xs text-[#BE185D] hover:underline font-bold cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Refresh</span>
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500 font-medium">
                Loading your database reservations...
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3 shadow-xs">
                <Compass className="h-10 w-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-800">No bookings found yet.</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Explore our Tirupati Balaji pilgrimage tours, ECR coastal getaways, or luxury vehicle fleet to make your first reservation.
                </p>
                <button
                  onClick={onBackToHome}
                  className="rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] px-5 py-2 text-xs font-bold text-white shadow-sm hover:brightness-105 cursor-pointer"
                >
                  Explore Destinations
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-amber-400 hover:shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-[#BE185D]">
                            {booking.bookingCode}
                          </span>
                          {getStatusBadge(booking.status)}
                          <span className="text-[11px] text-slate-500">
                            Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <h4 className="font-display text-lg font-bold text-slate-900 mt-1">
                          {booking.itemTitle}
                        </h4>
                      </div>

                      <div className="text-right sm:self-center">
                        <span className="text-[10px] text-slate-500 block uppercase font-medium">Total Amount</span>
                        <span className="font-mono-numbers text-xl font-bold text-slate-900">
                          ₹{booking.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-700">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Travel Date:</span>
                        <span className="font-mono-numbers text-slate-900 font-bold">{booking.startDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Guests / Rooms:</span>
                        <span className="font-medium">{booking.guestsCount} Guests {booking.roomsCount ? `· ${booking.roomsCount} Rooms` : ''}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Assigned Operations Staff:</span>
                        <span className="text-[#BE185D] font-bold">{booking.assignedStaffName || 'Desk Review'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Pickup Notes:</span>
                        <span className="truncate block font-medium">{booking.notes || 'Doorstep Pickup'}</span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <div>
                        {booking.status === 'Confirmed' && (
                          <button
                            onClick={() => setSelectedBookingForVoucher(booking)}
                            className="inline-flex items-center gap-1.5 text-[#BE185D] hover:underline font-bold cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>View Digital Travel Voucher</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {booking.status === 'Payment Pending' && (
                          <button
                            onClick={() => onPayBooking(booking)}
                            className="rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:brightness-105 cursor-pointer"
                          >
                            Pay ₹{booking.totalAmount.toLocaleString('en-IN')} via Razorpay
                          </button>
                        )}

                        {booking.status === 'Confirmed' && (
                          <button
                            onClick={() => setRefundBookingId(booking.id)}
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 cursor-pointer"
                          >
                            Request Cancellation / Refund
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: PAYMENTS HISTORY ================= */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Verified Razorpay Transaction History
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase text-slate-600 font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Receipt Code</th>
                    <th className="py-3.5 px-4">Booking</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Razorpay Order ID</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {bookings
                    .filter((b) => b.status === 'Confirmed' || b.payment)
                    .map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#BE185D]">
                          REC-{b.bookingCode.replace('PT-BK-', '')}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-[180px] truncate">
                          {b.itemTitle}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {new Date(b.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          order_PT{b.bookingCode.slice(-6)}
                        </td>
                        <td className="py-3.5 px-4 font-mono-numbers font-bold text-slate-900">
                          ₹{b.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700">
                            CAPTURED
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedBookingForVoucher(b)}
                            className="text-[#BE185D] hover:underline font-mono text-xs font-bold cursor-pointer"
                          >
                            Print Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  {bookings.filter((b) => b.status === 'Confirmed').length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                        No completed payment records found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PROFILE SETTINGS ================= */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Personal Information & Contact Preferences
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Keep your mobile number and pickup preferences up to date for smooth dispatch.
              </p>
            </div>

            {profileSuccess && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs sm:text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs sm:text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs sm:text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Residential / Pickup Address</label>
                <input
                  type="text"
                  placeholder="e.g. Plot 45, Luz Church Road, Mylapore"
                  value={profileAddress}
                  onChange={(e) => setProfileAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs sm:text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region</label>
                <input
                  type="text"
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs sm:text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Special Travel Preferences</label>
                <textarea
                  rows={2}
                  placeholder="e.g. AC vehicle with ground-floor room accommodation, vegetarian meal assistance."
                  value={profilePreferences}
                  onChange={(e) => setProfilePreferences(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs sm:text-sm text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] px-6 py-2.5 text-xs font-bold text-white hover:brightness-105 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              >
                {profileSaving ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Digital Voucher Modal */}
      {selectedBookingForVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <Logo size="sm" />
                <p className="text-[10px] text-slate-500 mt-1">Official Confirmation Voucher</p>
              </div>
              <span className="font-mono text-xs font-bold text-[#BE185D]">
                {selectedBookingForVoucher.bookingCode}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Service:</span>
                <span className="text-slate-900 font-bold">{selectedBookingForVoucher.itemTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Travel Date:</span>
                <span className="text-slate-900 font-bold">{selectedBookingForVoucher.startDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Customer:</span>
                <span className="text-slate-900">{selectedBookingForVoucher.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Contact:</span>
                <span className="text-slate-900">{selectedBookingForVoucher.customerPhone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Total Paid:</span>
                <span className="text-emerald-700 font-bold">
                  ₹{selectedBookingForVoucher.totalAmount.toLocaleString('en-IN')} (INCL. GST)
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Operations Desk:</span>
                <span className="text-[#BE185D] font-bold">{selectedBookingForVoucher.assignedStaffName || 'Mylapore Desk'}</span>
              </div>
              <div className="py-2 text-[11px] text-slate-600 font-sans space-y-1">
                <p>· Chauffeur and vehicle registration details are dispatched via SMS/WhatsApp 12 hours prior to journey.</p>
                <p>· 24x7 Emergency Operations Line: +91 98418 02288.</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Print Voucher</span>
              </button>
              <button
                onClick={() => setSelectedBookingForVoucher(null)}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] py-2.5 text-xs font-bold text-white hover:brightness-105 transition-all cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Request Modal */}
      {refundBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <h4 className="font-display text-lg font-bold text-slate-900">
              Request Booking Cancellation
            </h4>
            <p className="text-xs text-slate-600">
              Cancellations made 48 hours before travel qualify for a full refund back to your original Razorpay payment method.
            </p>

            <form onSubmit={handleRequestRefund} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Cancellation</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Schedule change, emergency, or family postponement..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRefundBookingId(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  disabled={refundLoading}
                  className="flex-1 rounded-xl bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
                >
                  {refundLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
