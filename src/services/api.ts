import {
  User,
  CustomerProfile,
  Destination,
  Package,
  Hotel,
  Vehicle,
  Booking,
  Payment,
  Refund,
  Enquiry,
  Notification,
  FAQ,
  GalleryItem,
  AdminMetrics,
} from '../types';

const TOKEN_KEY = 'prompt_travels_jwt';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(payload: { name: string; email?: string; phone?: string; password: string; city?: string; address?: string }) {
    const res = await request<{ token: string; user: User; customer: CustomerProfile }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setStoredToken(res.token);
    return res;
  },

  async login(payload: { identifier: string; password: string }) {
    const res = await request<{ token: string; user: User; customer?: CustomerProfile; staff?: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setStoredToken(res.token);
    return res;
  },

  async firebaseLogin(payload: { uid: string; email?: string; name: string; phone?: string; photoURL?: string }) {
    const res = await request<{ token: string; user: User; customer?: CustomerProfile; staff?: any }>('/auth/firebase-login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setStoredToken(res.token);
    return res;
  },

  async getMe() {
    return request<{ user: User; customer?: CustomerProfile; staff?: any }>('/auth/me');
  },

  async updateProfile(payload: Partial<CustomerProfile> & { name?: string }) {
    return request<{ success: boolean; user: User; customer: CustomerProfile }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Destinations
  async getDestinations(featured = false) {
    return request<Destination[]>(`/destinations${featured ? '?featured=true' : ''}`);
  },

  async getDestination(slug: string) {
    return request<Destination>(`/destinations/${slug}`);
  },

  async createDestination(payload: Partial<Destination>) {
    return request<Destination>('/destinations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateDestination(id: string, payload: Partial<Destination>) {
    return request<Destination>(`/destinations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteDestination(id: string) {
    return request<{ success: boolean }>(`/destinations/${id}`, { method: 'DELETE' });
  },

  // Packages
  async getPackages(filter?: { category?: string; destination?: string; featured?: boolean; search?: string }) {
    const params = new URLSearchParams();
    if (filter?.category) params.append('category', filter.category);
    if (filter?.destination) params.append('destination', filter.destination);
    if (filter?.featured) params.append('featured', 'true');
    if (filter?.search) params.append('search', filter.search);
    const q = params.toString();
    return request<Package[]>(`/packages${q ? `?${q}` : ''}`);
  },

  async getPackage(slug: string) {
    return request<Package>(`/packages/${slug}`);
  },

  async createPackage(payload: Partial<Package>) {
    return request<Package>('/packages', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updatePackage(id: string, payload: Partial<Package>) {
    return request<Package>(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deletePackage(id: string) {
    return request<{ success: boolean }>(`/packages/${id}`, { method: 'DELETE' });
  },

  // Hotels
  async getHotels(filter?: { destination?: string; category?: string; featured?: boolean; maxPrice?: number }) {
    const params = new URLSearchParams();
    if (filter?.destination) params.append('destination', filter.destination);
    if (filter?.category) params.append('category', filter.category);
    if (filter?.featured) params.append('featured', 'true');
    if (filter?.maxPrice) params.append('maxPrice', filter.maxPrice.toString());
    const q = params.toString();
    return request<Hotel[]>(`/hotels${q ? `?${q}` : ''}`);
  },

  async getHotel(slug: string) {
    return request<Hotel>(`/hotels/${slug}`);
  },

  async createHotel(payload: Partial<Hotel>) {
    return request<Hotel>('/hotels', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateHotel(id: string, payload: Partial<Hotel>) {
    return request<Hotel>(`/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteHotel(id: string) {
    return request<{ success: boolean }>(`/hotels/${id}`, { method: 'DELETE' });
  },

  // Vehicles
  async getVehicles() {
    return request<Vehicle[]>('/vehicles');
  },

  async createVehicle(payload: Partial<Vehicle>) {
    return request<Vehicle>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateVehicle(id: string, payload: Partial<Vehicle>) {
    return request<Vehicle>(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteVehicle(id: string) {
    return request<{ success: boolean }>(`/vehicles/${id}`, { method: 'DELETE' });
  },

  // Bookings
  async createBooking(payload: {
    bookingType: 'package' | 'hotel' | 'vehicle' | 'custom';
    itemId: string;
    startDate: string;
    endDate?: string;
    guestsCount: number;
    roomsCount?: number;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    notes?: string;
    travellers?: Array<{ fullName: string; age: number; gender: string }>;
  }) {
    return request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMyBookings() {
    return request<Booking[]>('/bookings/my');
  },

  async getAllBookings(filter?: { status?: string; search?: string; assignedToMe?: boolean }) {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.search) params.append('search', filter.search);
    if (filter?.assignedToMe) params.append('assignedToMe', 'true');
    const q = params.toString();
    return request<Booking[]>(`/bookings${q ? `?${q}` : ''}`);
  },

  async getBooking(id: string) {
    return request<Booking>(`/bookings/${id}`);
  },

  async updateBookingStatus(id: string, status: string, notes?: string) {
    return request<Booking>(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  },

  async assignBookingStaff(id: string, staffId: string) {
    return request<Booking>(`/bookings/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ staffId }),
    });
  },

  // Razorpay Payments
  async createPaymentOrder(bookingId: string) {
    return request<{
      orderId: string;
      amount: number;
      currency: string;
      keyId: string;
      bookingCode: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      itemTitle: string;
      isTestMode: boolean;
    }>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ bookingId }),
    });
  },

  async verifyPayment(payload: {
    bookingId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    paymentMethod?: string;
  }) {
    return request<{
      success: boolean;
      booking: Booking;
      payment: Payment;
      message: string;
    }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getAllPayments() {
    return request<Payment[]>('/payments');
  },

  async requestRefund(bookingId: string, reason: string) {
    return request<{ success: boolean; refund: Refund }>('/refunds/request', {
      method: 'POST',
      body: JSON.stringify({ bookingId, reason }),
    });
  },

  async processRefund(id: string, action: 'approve' | 'reject') {
    return request<{ success: boolean; refund: Refund }>(`/refunds/${id}/process`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    });
  },

  async getAllRefunds() {
    return request<Refund[]>('/refunds');
  },

  // Enquiries
  async submitEnquiry(payload: {
    name: string;
    email?: string;
    phone?: string;
    serviceType: string;
    destination: string;
    travelDate: string;
    travellersCount: number;
    message: string;
  }) {
    return request<{ success: boolean; enquiry: Enquiry }>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getEnquiries(filter?: { status?: string; assignedToMe?: boolean }) {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.assignedToMe) params.append('assignedToMe', 'true');
    const q = params.toString();
    return request<Enquiry[]>(`/enquiries${q ? `?${q}` : ''}`);
  },

  async updateEnquiry(id: string, payload: { status?: string; internalNotes?: string; assignedStaffId?: string }) {
    return request<Enquiry>(`/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Notifications
  async getNotifications() {
    return request<Notification[]>('/notifications');
  },

  async markNotificationRead(id: string) {
    return request<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PUT' });
  },

  async markAllNotificationsRead() {
    return request<{ success: boolean }>('/notifications/read-all', { method: 'PUT' });
  },

  // Gallery & FAQ & Content
  async getGallery() {
    return request<GalleryItem[]>('/gallery');
  },

  async getFaqs() {
    return request<FAQ[]>('/faqs');
  },

  async getWebsiteContent() {
    return request<any>('/cms');
  },

  async updateWebsiteContent(content: any) {
    return request<any>('/cms', {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  },

  // Admin Metrics & Users
  async getAdminMetrics() {
    return request<AdminMetrics>('/admin/metrics');
  },

  async getAdminUsers() {
    return request<User[]>('/admin/users');
  },

  async updateUserRole(id: string, role: 'customer' | 'staff' | 'admin') {
    return request<{ success: boolean; user: User }>(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  async getAuditLogs() {
    return request<any[]>('/admin/audit-logs');
  },
};
