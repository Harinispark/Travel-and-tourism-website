import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Booking, Enquiry } from '../../types';
import {
  Briefcase,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  User,
  RefreshCw,
  LogOut,
  Save,
  Filter,
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface StaffDashboardProps {
  onBackToHome: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ onBackToHome }) => {
  const { user, staff, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'bookings'>('enquiries');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterAssignedToMe, setFilterAssignedToMe] = useState(false);
  const [loading, setLoading] = useState(true);

  // Selected enquiry for updating status/notes
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [enquiryStatus, setEnquiryStatus] = useState<Enquiry['status']>('New');
  const [internalNotes, setInternalNotes] = useState('');
  const [savingEnquiry, setSavingEnquiry] = useState(false);

  // Selected booking for updating status
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingStatus, setBookingStatus] = useState<Booking['status']>('Confirmed');
  const [bookingNotes, setBookingNotes] = useState('');
  const [savingBooking, setSavingBooking] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enqs, bks] = await Promise.all([
        api.getEnquiries({ assignedToMe: filterAssignedToMe }),
        api.getAllBookings({ assignedToMe: filterAssignedToMe }),
      ]);
      setEnquiries(enqs);
      setBookings(bks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterAssignedToMe]);

  const handleSaveEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setSavingEnquiry(true);
    try {
      await api.updateEnquiry(selectedEnquiry.id, {
        status: enquiryStatus,
        internalNotes,
      });
      setSelectedEnquiry(null);
      fetchData();
    } catch (e: any) {
      alert(e.message || 'Failed to update enquiry');
    } finally {
      setSavingEnquiry(false);
    }
  };

  const handleSaveBookingStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setSavingBooking(true);
    try {
      await api.updateBookingStatus(selectedBooking.id, bookingStatus, bookingNotes);
      setSelectedBooking(null);
      fetchData();
    } catch (e: any) {
      alert(e.message || 'Failed to update booking');
    } finally {
      setSavingBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Staff Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-slate-900">{user?.name}</h1>
                <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md uppercase">
                  Staff Operations Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Department: {staff?.department || 'Tour & Pilgrim Operations'} · Code: {staff?.employeeCode || 'PT-OPS-09'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Customer Front
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

        {/* Tab & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 mb-8 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'enquiries'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Assigned Enquiries ({enquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Customer Bookings ({bookings.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
              <input
                type="checkbox"
                checked={filterAssignedToMe}
                onChange={(e) => setFilterAssignedToMe(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Assigned to me only</span>
            </label>
            <button
              onClick={fetchData}
              className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh Desk</span>
            </button>
          </div>
        </div>

        {/* ================= STAFF TAB 1: ENQUIRIES ================= */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500 font-medium">Loading enquiries...</div>
            ) : enquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-medium bg-white rounded-2xl border border-slate-200">
                No enquiries found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#BE185D]">
                          {enq.enquiryCode}
                        </span>
                        <h4 className="font-bold text-slate-900 mt-0.5">{enq.name}</h4>
                      </div>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                          enq.status === 'New'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : enq.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : enq.status === 'Converted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-700">
                      <p>
                        <strong className="text-slate-500">Destination:</strong> {enq.destination} ({enq.serviceType})
                      </p>
                      <p>
                        <strong className="text-slate-500">Travel Date:</strong> {enq.travelDate || 'Flexible'} · {enq.travellersCount} Travelers
                      </p>
                      <p className="flex items-center gap-2 pt-1 text-[11px] text-slate-600">
                        <Phone className="h-3 w-3 text-amber-600" /> {enq.phone || 'N/A'}
                        <Mail className="h-3 w-3 text-amber-600 ml-2" /> {enq.email || 'N/A'}
                      </p>
                      {enq.message && (
                        <p className="rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-700 italic border border-slate-200 mt-2">
                          "{enq.message}"
                        </p>
                      )}
                      {enq.internalNotes && (
                        <p className="rounded-xl bg-blue-50/70 p-2.5 text-[11px] text-blue-900 border border-blue-200 mt-1">
                          <strong>Staff Notes:</strong> {enq.internalNotes}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Assigned: {enq.assignedStaffName || 'Unassigned'}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedEnquiry(enq);
                          setEnquiryStatus(enq.status);
                          setInternalNotes(enq.internalNotes || '');
                        }}
                        className="rounded-xl bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        Update Status / Notes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= STAFF TAB 2: BOOKINGS ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase text-slate-600 font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Booking Code</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Travel Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#BE185D]">{b.bookingCode}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{b.customerName}</p>
                        <p className="text-[11px] text-slate-500">{b.customerPhone}</p>
                      </td>
                      <td className="py-3.5 px-4 max-w-[200px] truncate font-medium text-slate-800">{b.itemTitle}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{b.startDate}</td>
                      <td className="py-3.5 px-4 font-mono-numbers font-bold text-slate-900">
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-slate-700">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setBookingStatus(b.status);
                            setBookingNotes(b.notes || '');
                          }}
                          className="rounded-xl bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Update Enquiry Status */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <h4 className="font-display text-lg font-bold text-slate-900">
              Update Enquiry: {selectedEnquiry.enquiryCode}
            </h4>
            <p className="text-xs text-slate-500">
              Customer: {selectedEnquiry.name} ({selectedEnquiry.phone || selectedEnquiry.email})
            </p>

            <form onSubmit={handleSaveEnquiry} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={enquiryStatus}
                  onChange={(e) => setEnquiryStatus(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Converted">Converted to Booking</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Internal Operations Notes</label>
                <textarea
                  rows={3}
                  placeholder="Record customer preferences, quote provided, vehicle details..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEnquiry}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
                >
                  {savingEnquiry ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Update Booking Status */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <h4 className="font-display text-lg font-bold text-slate-900">
              Update Booking: {selectedBooking.bookingCode}
            </h4>
            <p className="text-xs text-slate-500">
              Customer: {selectedBooking.customerName} · Total: ₹{selectedBooking.totalAmount.toLocaleString('en-IN')}
            </p>

            <form onSubmit={handleSaveBookingStatus} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={bookingStatus}
                  onChange={(e) => setBookingStatus(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Payment Pending">Payment Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chauffeur / Dispatch Notes</label>
                <textarea
                  rows={3}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBooking}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
                >
                  {savingBooking ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
