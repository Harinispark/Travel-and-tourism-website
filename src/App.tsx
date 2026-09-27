import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import {
  Destination,
  Package,
  Hotel,
  Vehicle,
  FAQ,
  GalleryItem,
  Booking,
} from './types';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { BookingModal } from './components/common/BookingModal';
import { EnquiryModal } from './components/common/EnquiryModal';
import { HeroSection } from './components/home/HeroSection';
import { DestinationsSection } from './components/home/DestinationsSection';
import { PackagesSection } from './components/home/PackagesSection';
import { HotelsSection } from './components/home/HotelsSection';
import { FleetSection } from './components/home/FleetSection';
import { AboutSection } from './components/home/AboutSection';
import { GallerySection } from './components/home/GallerySection';
import { FaqSection } from './components/home/FaqSection';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainAppContent: React.FC = () => {
  const { user, activePortal, setActivePortal, openAuthModal } = useAuth();

  // Data states
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Active view inside customer mode: 'home' | 'account'
  const [customerView, setCustomerView] = useState<'home' | 'account'>('home');

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'package' | 'hotel' | 'vehicle' | 'custom'>('package');
  const [selectedItemForBooking, setSelectedItemForBooking] = useState<any>(null);

  // Enquiry Modal State
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryDestination, setEnquiryDestination] = useState('');
  const [enquiryService, setEnquiryService] = useState('tours');

  const loadInitialData = async () => {
    setDataLoading(true);
    try {
      const [d, p, h, v, f, g] = await Promise.all([
        api.getDestinations(),
        api.getPackages(),
        api.getHotels(),
        api.getVehicles(),
        api.getFaqs(),
        api.getGallery(),
      ]);
      setDestinations(d);
      setPackages(p);
      setHotels(h);
      setVehicles(v);
      setFaqs(f);
      setGallery(g);
    } catch (e) {
      console.error('Data fetching error:', e);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleOpenBooking = (type: 'package' | 'hotel' | 'vehicle' | 'custom', item?: any) => {
    setBookingType(type);
    setSelectedItemForBooking(item || null);
    setBookingModalOpen(true);
  };

  const handleOpenEnquiry = (dest = '', service = 'tours') => {
    setEnquiryDestination(dest);
    setEnquiryService(service);
    setEnquiryModalOpen(true);
  };

  const handleNavigateSection = (sectionId: string) => {
    setCustomerView('home');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleHeroSearch = (type: 'package' | 'hotel' | 'vehicle', destinationId: string) => {
    if (type === 'package') {
      handleNavigateSection('packages');
    } else if (type === 'hotel') {
      handleNavigateSection('hotels');
    } else {
      handleNavigateSection('fleet');
    }
  };

  // If user requests Staff portal
  if (activePortal === 'staff') {
    if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-7 text-center space-y-4 shadow-xl">
            <h3 className="font-display text-xl font-bold text-slate-900">Staff Authentication Required</h3>
            <p className="text-xs text-slate-500">
              Please sign in with a verified Prompt Travels Staff or Operations account.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setActivePortal('customer')}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Back to Site
              </button>
              <button
                onClick={() => openAuthModal('login')}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] py-2.5 text-xs font-bold text-white shadow-md hover:brightness-105 transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <StaffDashboard
        onBackToHome={() => {
          setActivePortal('customer');
          setCustomerView('home');
        }}
      />
    );
  }

  // If user requests Admin portal
  if (activePortal === 'admin') {
    if (!user || user.role !== 'admin') {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-7 text-center space-y-4 shadow-xl">
            <h3 className="font-display text-xl font-bold text-slate-900">Administrator Access Restricted</h3>
            <p className="text-xs text-slate-500">
              Only authorized Prompt Travels administrative directors may access the database console.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setActivePortal('customer')}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Back to Site
              </button>
              <button
                onClick={() => openAuthModal('login')}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#BE185D] via-[#D4AF37] to-[#B38F24] py-2.5 text-xs font-bold text-white shadow-md hover:brightness-105 transition-all"
              >
                Admin Sign In
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <AdminDashboard
        onBackToHome={() => {
          setActivePortal('customer');
          setCustomerView('home');
        }}
      />
    );
  }

  // Customer Experience
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-pink-100 selection:text-pink-900">
      {/* Navigation */}
      <Navbar
        onOpenBooking={handleOpenBooking}
        onOpenEnquiry={() => handleOpenEnquiry()}
        onNavigateSection={handleNavigateSection}
      />

      {customerView === 'account' && user ? (
        <CustomerDashboard
          onBackToHome={() => setCustomerView('home')}
          onPayBooking={(b) => handleOpenBooking(b.bookingType, { ...b, title: b.itemTitle })}
        />
      ) : (
        <main>
          {/* Hero Section */}
          <HeroSection
            onSearch={handleHeroSearch}
            onExploreClick={() => handleNavigateSection('packages')}
            onBookFleetClick={() => handleNavigateSection('fleet')}
          />

          {/* Destinations */}
          <DestinationsSection
            destinations={destinations}
            onSelectDestinationPackage={(pkg) => handleOpenBooking('package', pkg)}
            onBookItem={(type, item) => handleOpenBooking(type, item)}
          />

          {/* Packages */}
          <PackagesSection
            packages={packages}
            onBookPackage={(pkg) => handleOpenBooking('package', pkg)}
            onEnquirePackage={(pkg) => handleOpenEnquiry(pkg.destinationName, 'pilgrimage')}
          />

          {/* Hotels & Resorts */}
          <HotelsSection
            hotels={hotels}
            onBookHotel={(hotel) => handleOpenBooking('hotel', hotel)}
          />

          {/* Chauffeur Fleet */}
          <FleetSection
            vehicles={vehicles}
            onBookVehicle={(veh) => handleOpenBooking('vehicle', veh)}
            onEnquireFleet={(veh) => handleOpenEnquiry(veh ? veh.name : '', 'car_rental')}
          />

          {/* About Prompt Travels */}
          <AboutSection />

          {/* Gallery */}
          <GallerySection galleryItems={gallery} />

          {/* FAQs */}
          <FaqSection
            faqs={faqs}
            onOpenEnquiry={() => handleOpenEnquiry()}
          />
        </main>
      )}

      {/* Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenEnquiry={() => handleOpenEnquiry()}
      />

      {/* Auth Modal (Register / Login) */}
      <AuthModal />

      {/* Step-by-Step Booking & Razorpay Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        bookingType={bookingType}
        item={selectedItemForBooking}
        onBookingSuccess={() => {
          loadInitialData();
        }}
      />

      {/* Custom Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        prefilledDestination={enquiryDestination}
        prefilledService={enquiryService}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
