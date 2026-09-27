export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'customer' | 'staff' | 'admin';
}

export interface CustomerProfile {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  preferences?: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  region: 'Tamil Nadu' | 'South India' | 'North India' | 'International';
  state: string;
  country: string;
  tagline: string;
  description: string;
  heroImage: string;
  gallery: string[];
  bestTimeToVisit: string;
  highlights: string[];
  isFeatured: boolean;
  active: boolean;
  packages?: Package[];
  hotels?: Hotel[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string;
  stay: string;
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  destinationId: string;
  destinationName: string;
  category: 'pilgrimage' | 'weekend' | 'cultural' | 'international' | 'hill_station' | 'luxury_honeymoon';
  durationDays: number;
  durationNights: number;
  startingPrice: number;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  heroImage: string;
  gallery: string[];
  active: boolean;
  isFeatured: boolean;
}

export interface HotelRoom {
  id: string;
  hotelId: string;
  roomType: string;
  title: string;
  description: string;
  maxGuests: number;
  bedType: string;
  pricePerNight: number;
  amenities: string[];
  image: string;
  active: boolean;
  totalRooms: number;
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  destinationId: string;
  destinationName: string;
  address: string;
  city: string;
  category: 'luxury_resort' | 'heritage' | 'premium_business' | 'pilgrimage_comfort';
  starRating: number;
  pricePerNightStart: number;
  description: string;
  heroImage: string;
  gallery: string[];
  amenities: string[];
  policies: string[];
  rooms: HotelRoom[];
  isFeatured: boolean;
  active: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  slug: string;
  vehicleType: 'luxury_suv' | 'executive_sedan' | 'tempo_traveller' | 'urbania_luxury' | 'coach_bus';
  capacitySeats: number;
  luggageCapacity: number;
  ac: boolean;
  perKmRate: number;
  localPackage8hr80km: number;
  outstationMinKmDay: number;
  description: string;
  heroImage: string;
  features: string[];
  active: boolean;
}

export interface BookingTraveller {
  fullName: string;
  age: number;
  gender: string;
  idType?: string;
  idNumber?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingType: 'package' | 'hotel' | 'vehicle' | 'custom';
  itemId: string;
  itemTitle: string;
  startDate: string;
  endDate: string;
  guestsCount: number;
  roomsCount?: number;
  status: 'Enquiry' | 'Pending' | 'Payment Pending' | 'Confirmed' | 'Cancelled' | 'Refund Pending' | 'Refunded' | 'Completed';
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  travellers?: BookingTraveller[];
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  bookingCode: string;
  paymentCode: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
  paymentMethod?: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  bookingId: string;
  bookingCode: string;
  amount: number;
  reason: string;
  status: 'Pending' | 'Processed' | 'Rejected';
  razorpayRefundId?: string;
  requestedBy: string;
  requestedAt: string;
  processedAt?: string;
}

export interface Enquiry {
  id: string;
  enquiryCode: string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  destination: string;
  travelDate: string;
  travellersCount: number;
  message: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Converted' | 'Closed';
  assignedStaffId?: string;
  assignedStaffName?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId?: string;
  roleTarget?: 'customer' | 'staff' | 'admin' | 'all';
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'enquiry' | 'system';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'pilgrimage' | 'heritage' | 'destinations' | 'fleet' | 'stays';
  imageUrl: string;
  caption: string;
  isFeatured: boolean;
}

export interface AdminMetrics {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  totalCustomers: number;
  totalStaff: number;
  totalEnquiries: number;
  activeEnquiries: number;
  totalPackages: number;
  totalVehicles: number;
  totalHotels: number;
}
