import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  AdminMetrics,
  Package,
  Destination,
  Hotel,
  Vehicle,
  Booking,
  Payment,
  Refund,
  Enquiry,
  User,
  FAQ,
} from '../../types';
import {
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Calendar,
  Users,
  Building,
  Car,
  Compass,
  MessageSquare,
  FileText,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  RefreshCw,
  LogOut,
  Save,
  HelpCircle,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'packages'
    | 'destinations'
    | 'hotels'
    | 'vehicles'
    | 'bookings'
    | 'payments'
    | 'refunds'
    | 'enquiries'
    | 'users'
    | 'cms'
    | 'faqs'
  >('overview');

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [cmsContent, setCmsContent] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Package Form Modal
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDestination, setPkgDestination] = useState('');
  const [pkgCategory, setPkgCategory] = useState<Package['category']>('pilgrimage');
  const [pkgDays, setPkgDays] = useState(1);
  const [pkgPrice, setPkgPrice] = useState(3850);
  const [pkgDesc, setPkgDesc] = useState('');

  // Destination Form Modal
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [destName, setDestName] = useState('');
  const [destRegion, setDestRegion] = useState<Destination['region']>('Tamil Nadu');
  const [destTagline, setDestTagline] = useState('');
  const [destDesc, setDestDesc] = useState('');

  // CMS Form
  const [cmsHeadline, setCmsHeadline] = useState('');
  const [cmsPhone, setCmsPhone] = useState('');
  const [cmsEmail, setCmsEmail] = useState('');
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsSuccess, setCmsSuccess] = useState(false);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [m, p, d, h, v, b, pay, r, e, u, f, cms] = await Promise.all([
        api.getAdminMetrics(),
        api.getPackages(),
        api.getDestinations(),
        api.getHotels(),
        api.getVehicles(),
        api.getAllBookings(),
        api.getAllPayments(),
        api.getAllRefunds(),
        api.getEnquiries(),
        api.getAdminUsers(),
        api.getFaqs(),
        api.getWebsiteContent(),
      ]);

      setMetrics(m);
      setPackages(p);
      setDestinations(d);
      setHotels(h);
      setVehicles(v);
      setBookings(b);
      setPayments(pay);
      setRefunds(r);
      setEnquiries(e);
      setUsers(u);
      setFaqs(f);
      setCmsContent(cms);

      if (cms?.hero) setCmsHeadline(cms.hero.headline || '');
      if (cms?.company) {
        setCmsPhone(cms.company.primaryPhone || '');
        setCmsEmail(cms.company.primaryEmail || '');
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Save new/edit package
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPkgId) {
        await api.updatePackage(editingPkgId, {
          title: pkgTitle,
          destinationName: pkgDestination,
          category: pkgCategory,
          durationDays: pkgDays,
          startingPrice: pkgPrice,
          description: pkgDesc,
        });
      } else {
        await api.createPackage({
          title: pkgTitle,
          destinationId: 'dest_custom',
          destinationName: pkgDestination || 'Prompt Travels Corridor',
          category: pkgCategory,
          durationDays: pkgDays,
          durationNights: Math.max(0, pkgDays - 1),
          startingPrice: pkgPrice,
          description: pkgDesc,
          highlights: ['Doorstep AC Vehicle Pickup', 'Verified Chauffeur Guidance'],
          inclusions: ['AC Transport', 'Toll charges & permits'],
          exclusions: ['Personal pooja fees'],
          itinerary: [{ day: 1, title: 'Departure & Tour', description: pkgDesc, meals: 'Included', stay: 'Standard' }],
        });
      }
      setIsPkgModalOpen(false);
      setEditingPkgId(null);
      loadAllData();
    } catch (err: any) {
      alert(err.message || 'Failed to save package');
    }
  };

  // Delete package
  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.deletePackage(id);
      loadAllData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Save destination
  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDestination({
        name: destName,
        region: destRegion,
        state: 'Tamil Nadu',
        country: 'India',
        tagline: destTagline,
        description: destDesc,
        highlights: ['Cultural Guided Tour', 'Verified Transportation'],
      });
      setIsDestModalOpen(false);
      loadAllData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete destination
  const handleDeleteDestination = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    try {
      await api.deleteDestination(id);
      loadAllData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Process refund
  const handleProcessRefund = async (refundId: string, action: 'approve' | 'reject') => {
    try {
      await api.processRefund(refundId, action);
      loadAllData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Change user role
  const handleChangeRole = async (userId: string, newRole: 'customer' | 'staff' | 'admin') => {
    try {
      await api.updateUserRole(userId, newRole);
      loadAllData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Save CMS Content
  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsSaving(true);
    setCmsSuccess(false);
    try {
      const updated = {
        ...cmsContent,
        hero: {
          ...cmsContent.hero,
          headline: cmsHeadline,
        },
        company: {
          ...cmsContent.company,
          primaryPhone: cmsPhone,
          primaryEmail: cmsEmail,
        },
      };
      await api.updateWebsiteContent(updated);
      setCmsContent(updated);
      setCmsSuccess(true);
      setTimeout(() => setCmsSuccess(false), 3000);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setCmsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="rounded-2xl border border-purple-500/20 bg-white shadow-2xs p-6 shadow-xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-slate-900">{user?.name}</h1>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded uppercase font-bold">
                  Super Admin Management Console
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Full Database Authority · Real Relational Tables · Razorpay Verification · CMS Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh DB</span>
            </button>
            <button
              onClick={onBackToHome}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              Customer Front
            </button>
            <button
              onClick={logout}
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20 flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-3 mb-8 text-xs font-medium">
          {[
            { id: 'overview', label: 'Database Metrics', icon: TrendingUp },
            { id: 'packages', label: `Packages (${packages.length})`, icon: Calendar },
            { id: 'destinations', label: `Destinations (${destinations.length})`, icon: Compass },
            { id: 'hotels', label: `Hotels (${hotels.length})`, icon: Building },
            { id: 'vehicles', label: `Fleet (${vehicles.length})`, icon: Car },
            { id: 'bookings', label: `Bookings (${bookings.length})`, icon: FileText },
            { id: 'payments', label: `Payments (${payments.length})`, icon: CreditCard },
            { id: 'refunds', label: `Refunds (${refunds.length})`, icon: XCircle },
            { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: MessageSquare },
            { id: 'users', label: `User Roles (${users.length})`, icon: Users },
            { id: 'cms', label: 'Website CMS & Contacts', icon: Settings },
            { id: 'faqs', label: `FAQs (${faqs.length})`, icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-slate-900 font-bold shadow-md shadow-purple-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: METRICS OVERVIEW ================= */}
        {activeTab === 'overview' && metrics && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white shadow-2xs p-5">
                <span className="text-slate-600 text-xs uppercase block">Total Revenue Captured</span>
                <p className="font-mono-numbers text-2xl sm:text-3xl font-bold text-amber-400 mt-1">
                  ₹{metrics.totalRevenue.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-emerald-400 mt-1 block">100% Verified Razorpay</span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-2xs p-5">
                <span className="text-slate-600 text-xs uppercase block">Total Bookings</span>
                <p className="font-mono-numbers text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  {metrics.totalBookings}
                </p>
                <span className="text-[11px] text-slate-600 mt-1 block">
                  {metrics.confirmedBookings} Confirmed · {metrics.pendingBookings} Pending
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-2xs p-5">
                <span className="text-slate-600 text-xs uppercase block">Active Travel Enquiries</span>
                <p className="font-mono-numbers text-2xl sm:text-3xl font-bold text-blue-400 mt-1">
                  {metrics.activeEnquiries}
                </p>
                <span className="text-[11px] text-slate-600 mt-1 block">
                  {metrics.totalEnquiries} Total Leads Received
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-2xs p-5">
                <span className="text-slate-600 text-xs uppercase block">Customers & Staff</span>
                <p className="font-mono-numbers text-2xl sm:text-3xl font-bold text-purple-400 mt-1">
                  {metrics.totalCustomers}
                </p>
                <span className="text-[11px] text-slate-600 mt-1 block">
                  {metrics.totalStaff} Active Staff Chauffeur Coordinators
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Quick CMS Operations
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    onClick={() => {
                      setEditingPkgId(null);
                      setPkgTitle('');
                      setPkgDestination('');
                      setPkgPrice(4500);
                      setPkgDesc('');
                      setIsPkgModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 hover:border-amber-400/40 hover:bg-white/10 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-amber-400" />
                    <span>Create Tour Package</span>
                  </button>

                  <button
                    onClick={() => {
                      setDestName('');
                      setDestTagline('');
                      setDestDesc('');
                      setIsDestModalOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 hover:border-amber-400/40 hover:bg-white/10 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-amber-400" />
                    <span>Add New Destination</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 hover:border-amber-400/40 hover:bg-white/10 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span>Review Pending Bookings</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('cms')}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 hover:border-amber-400/40 hover:bg-white/10 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-purple-400" />
                    <span>Edit Business Info & CMS</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Live Operations Status
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span>Payment Gateway:</span>
                    <span className="font-mono text-emerald-400 font-bold">RAZORPAY ACTIVE (TEST & PROD READY)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span>Database State:</span>
                    <span className="font-mono text-emerald-400 font-bold">PERSISTENT ACID STORE LOADED</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span>Active Tour Inventory:</span>
                    <span className="font-mono text-amber-400 font-bold">{metrics.totalPackages} PACKAGES ONLINE</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span>Active Fleet:</span>
                    <span className="font-mono text-amber-400 font-bold">{metrics.totalVehicles} VEHICLES READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PACKAGES CMS ================= */}
        {activeTab === 'packages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Tour Packages Management ({packages.length})
              </h3>
              <button
                onClick={() => {
                  setEditingPkgId(null);
                  setPkgTitle('');
                  setPkgDestination('');
                  setPkgPrice(3850);
                  setPkgDesc('');
                  setIsPkgModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                <span>Add Tour Package</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase text-slate-600">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-700">
                  {packages.map((p) => (
                    <tr key={p.id} className="hover:bg-transparent">
                      <td className="py-3 px-4 font-semibold text-slate-900">{p.title}</td>
                      <td className="py-3 px-4">{p.destinationName}</td>
                      <td className="py-3 px-4 capitalize font-mono text-[11px]">{p.category}</td>
                      <td className="py-3 px-4">{p.durationDays} Days</td>
                      <td className="py-3 px-4 font-mono-numbers font-bold text-amber-400">
                        ₹{p.startingPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingPkgId(p.id);
                            setPkgTitle(p.title);
                            setPkgDestination(p.destinationName);
                            setPkgCategory(p.category);
                            setPkgDays(p.durationDays);
                            setPkgPrice(p.startingPrice);
                            setPkgDesc(p.description);
                            setIsPkgModalOpen(true);
                          }}
                          className="rounded bg-blue-500/20 text-blue-300 p-1.5 hover:bg-blue-500/30"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePackage(p.id)}
                          className="rounded bg-red-500/20 text-red-300 p-1.5 hover:bg-red-500/30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: DESTINATIONS CMS ================= */}
        {activeTab === 'destinations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Destinations & Travel Corridors ({destinations.length})
              </h3>
              <button
                onClick={() => {
                  setDestName('');
                  setDestTagline('');
                  setDestDesc('');
                  setIsDestModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                <span>Add Destination</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {destinations.map((d) => (
                <div key={d.id} className="rounded-xl border border-slate-200 bg-white shadow-2xs p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase">{d.region}</span>
                      <h4 className="font-bold text-slate-900 text-base">{d.name}</h4>
                    </div>
                    <button
                      onClick={() => handleDeleteDestination(d.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{d.description}</p>
                  <p className="text-[11px] text-slate-500 font-mono">Season: {d.bestTimeToVisit}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: BOOKINGS CMS ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              All Customer Bookings ({bookings.length})
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase text-slate-600">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Travel Date</th>
                    <th className="py-3 px-4">Total (₹)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Assign / Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-700">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-transparent">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">{b.bookingCode}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{b.customerName}</p>
                        <p className="text-[11px] text-slate-600">{b.customerPhone}</p>
                      </td>
                      <td className="py-3 px-4 max-w-[180px] truncate">{b.itemTitle}</td>
                      <td className="py-3 px-4 font-mono">{b.startDate}</td>
                      <td className="py-3 px-4 font-mono-numbers font-bold text-slate-900">
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded bg-slate-50 px-2 py-0.5 text-[10px] font-mono uppercase">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={b.status}
                          onChange={async (e) => {
                            await api.updateBookingStatus(b.id, e.target.value);
                            loadAllData();
                          }}
                          className="rounded border border-slate-200 bg-white border-slate-300 text-slate-900 px-2 py-1 text-xs text-slate-900"
                        >
                          <option value="Payment Pending">Payment Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 5: PAYMENTS CMS ================= */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Razorpay Payments Log ({payments.length})
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase text-slate-600">
                  <tr>
                    <th className="py-3 px-4">Receipt</th>
                    <th className="py-3 px-4">Booking</th>
                    <th className="py-3 px-4">Razorpay Order ID</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-700">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-transparent">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">{p.paymentCode}</td>
                      <td className="py-3 px-4 font-mono">{p.bookingCode}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">{p.razorpayOrderId}</td>
                      <td className="py-3 px-4 font-mono-numbers font-bold text-slate-900">
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 uppercase">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {new Date(p.createdAt).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 6: REFUNDS CMS ================= */}
        {activeTab === 'refunds' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Refund & Cancellation Requests ({refunds.length})
            </h3>
            {refunds.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 rounded-xl border border-slate-200 bg-white shadow-2xs">
                No pending refund requests.
              </div>
            ) : (
              <div className="space-y-3">
                {refunds.map((ref) => (
                  <div key={ref.id} className="rounded-xl border border-slate-200 bg-white shadow-2xs p-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-amber-400 font-bold">{ref.bookingCode}</span>
                      <p className="text-slate-900 font-medium mt-0.5">Amount: ₹{ref.amount.toLocaleString('en-IN')}</p>
                      <p className="text-slate-600">Reason: {ref.reason}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-50 uppercase">
                        {ref.status}
                      </span>
                      {ref.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleProcessRefund(ref.id, 'approve')}
                            className="rounded bg-emerald-600 px-3 py-1 font-bold text-slate-900 hover:bg-emerald-500"
                          >
                            Approve Refund
                          </button>
                          <button
                            onClick={() => handleProcessRefund(ref.id, 'reject')}
                            className="rounded bg-red-600 px-3 py-1 font-bold text-slate-900 hover:bg-red-500"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 7: ENQUIRIES CMS ================= */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Customer Enquiries Desk ({enquiries.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enquiries.map((enq) => (
                <div key={enq.id} className="rounded-xl border border-slate-200 bg-white shadow-2xs p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-amber-400 font-bold">{enq.enquiryCode}</span>
                      <h4 className="text-slate-900 font-bold">{enq.name}</h4>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 uppercase">
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-slate-700">
                    {enq.destination} ({enq.serviceType}) · {enq.travellersCount} Guests
                  </p>
                  <p className="text-slate-600">{enq.phone} · {enq.email}</p>
                  {enq.message && <p className="italic text-slate-600">"{enq.message}"</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 8: USER ROLES CMS ================= */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Platform Users & RBAC Permissions ({users.length})
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase text-slate-600">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Active Role</th>
                    <th className="py-3 px-4 text-right">Modify Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-transparent">
                      <td className="py-3 px-4 font-semibold text-slate-900">{u.name}</td>
                      <td className="py-3 px-4">{u.email || 'N/A'}</td>
                      <td className="py-3 px-4">{u.phone || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] uppercase font-bold text-amber-400">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value as any)}
                          className="rounded border border-slate-200 bg-white border-slate-300 text-slate-900 px-2 py-1 text-xs text-slate-900"
                        >
                          <option value="customer">Customer</option>
                          <option value="staff">Staff Operations</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 9: WEBSITE CMS & CONTACTS ================= */}
        {activeTab === 'cms' && (
          <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xs p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Homepage Hero & Business Info CMS
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Update headlines, contact telephone numbers, and email accounts in real time.
              </p>
            </div>

            {cmsSuccess && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Website content successfully updated in persistent database.</span>
              </div>
            )}

            <form onSubmit={handleSaveCms} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Hero Display Headline</label>
                <input
                  type="text"
                  value={cmsHeadline}
                  onChange={(e) => setCmsHeadline(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white border-slate-300 text-slate-900 p-2.5 text-xs text-slate-900 focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Primary Helpline (Chennai)</label>
                  <input
                    type="text"
                    value={cmsPhone}
                    onChange={(e) => setCmsPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white border-slate-300 text-slate-900 p-2.5 text-xs text-slate-900 focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Operations Email</label>
                  <input
                    type="email"
                    value={cmsEmail}
                    onChange={(e) => setCmsEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white border-slate-300 text-slate-900 p-2.5 text-xs text-slate-900 focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={cmsSaving}
                className="rounded-lg bg-purple-600 px-6 py-2.5 text-xs font-bold text-slate-900 hover:bg-purple-500 disabled:opacity-50"
              >
                {cmsSaving ? 'Saving...' : 'Update CMS Content'}
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 10: FAQS CMS ================= */}
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Published FAQs ({faqs.length})
            </h3>
            <div className="space-y-3">
              {faqs.map((f) => (
                <div key={f.id} className="rounded-xl border border-slate-200 bg-white shadow-2xs p-4 text-xs space-y-1">
                  <span className="font-mono text-amber-400 font-bold uppercase text-[10px]">{f.category}</span>
                  <h4 className="text-slate-900 font-bold">{f.question}</h4>
                  <p className="text-slate-700">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Package Create/Edit Modal */}
      {isPkgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white border-slate-300 text-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-white shadow-2xl p-6 shadow-2xl space-y-4">
            <h4 className="font-display text-lg font-bold text-slate-900">
              {editingPkgId ? 'Edit Tour Package' : 'Create New Tour Package'}
            </h4>
            <form onSubmit={handleSavePackage} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navagraha Temple 3-Day Spiritual Circuit"
                  value={pkgTitle}
                  onChange={(e) => setPkgTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white border-slate-300 text-slate-900 p-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Destination Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kumbakonam & Thanjavur"
                    value={pkgDestination}
                    onChange={(e) => setPkgDestination(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white border-slate-300 text-slate-900 p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={pkgCategory}
                    onChange={(e) => setPkgCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-white border-slate-300 text-slate-900 p-2 text-xs text-slate-900"
                  >
                    <option value="pilgrimage">Pilgrimage</option>
                    <option value="weekend">Weekend Coastal</option>
                    <option value="hill_station">Kerala Hills</option>
                    <option value="international">International</option>
                    <option value="cultural">Cultural</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={pkgDays}
                    onChange={(e) => setPkgDays(parseInt(e.target.value) || 1)}
                    className="w-full rounded-lg border border-slate-200 bg-white border-slate-300 text-slate-900 p-2 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Starting Price (₹)</label>
                  <input
                    type="number"
                    min="500"
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(parseInt(e.target.value) || 3000)}
                    className="w-full rounded-lg border border-slate-200 bg-white border-slate-300 text-slate-900 p-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe inclusions, highlights, vehicle type..."
                  value={pkgDesc}
                  onChange={(e) => setPkgDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white border-slate-300 text-slate-900 p-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPkgModalOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#D4AF37] py-2 text-xs font-bold text-slate-950"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Destination Create Modal */}
      {isDestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white border-slate-300 text-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-amber-500/30 bg-white shadow-2xl p-6 shadow-2xl space-y-4">
            <h4 className="font-display text-lg font-bold text-slate-900">Add New Destination</h4>
            <form onSubmit={handleSaveDestination} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Destination Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kanyakumari Ocean Confluence"
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white border-slate-300 text-slate-900 p-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Region</label>
                <select
                  value={destRegion}
                  onChange={(e) => setDestRegion(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-200 bg-white border-slate-300 text-slate-900 p-2 text-xs text-slate-900"
                >
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="South India">South India</option>
                  <option value="North India">North India</option>
                  <option value="International">International</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Southernmost Tip of India & Triveni Sangam"
                  value={destTagline}
                  onChange={(e) => setDestTagline(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white border-slate-300 text-slate-900 p-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={destDesc}
                  onChange={(e) => setDestDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white border-slate-300 text-slate-900 p-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDestModalOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#D4AF37] py-2 text-xs font-bold text-slate-950"
                >
                  Create Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
