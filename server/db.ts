import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  passwordHash: string;
  role: 'customer' | 'staff' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
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
  createdAt: string;
}

export interface Staff {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  employeeCode: string;
  active: boolean;
  createdAt: string;
}

export interface Admin {
  id: string;
  userId: string;
  permissions: string[];
  createdAt: string;
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
  createdAt: string;
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
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  category: 'tours' | 'car_rental' | 'flight_booking' | 'hotel_reservation' | 'visa_assistance' | 'corporate_travel';
  shortDescription: string;
  fullDescription: string;
  icon: string;
  heroImage: string;
  features: string[];
  pricingInfo: string;
  active: boolean;
  createdAt: string;
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
  createdAt: string;
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
  createdAt: string;
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

export interface GalleryItem {
  id: string;
  title: string;
  category: 'pilgrimage' | 'heritage' | 'destinations' | 'fleet' | 'stays';
  imageUrl: string;
  caption: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  targetEntity: string;
  targetId: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  customers: Customer[];
  staff: Staff[];
  admins: Admin[];
  destinations: Destination[];
  packages: Package[];
  services: Service[];
  hotels: Hotel[];
  vehicles: Vehicle[];
  bookings: Booking[];
  payments: Payment[];
  refunds: Refund[];
  enquiries: Enquiry[];
  notifications: Notification[];
  gallery: GalleryItem[];
  faqs: FAQ[];
  audit_logs: AuditLog[];
  website_content: Record<string, any>;
}

// Password hashing helper (PBKDF2 HMAC-SHA256 with 10,000 iterations)
export function hashPassword(password: string): string {
  const salt = 'prompt_travels_secure_salt_chennai_2026';
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'prompt_travels_db.json');

class DatabaseEngine {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDirectory();
    this.data = this.loadDatabase();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(DB_FILE)) {
      try {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      } catch (err) {
        console.error('Failed to parse database file, re-seeding:', err);
      }
    }
    const seeded = this.createInitialSeedData();
    this.persist(seeded);
    return seeded;
  }

  public persist(data?: DatabaseSchema) {
    if (data) this.data = data;
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  public get db(): DatabaseSchema {
    return this.data;
  }

  private createInitialSeedData(): DatabaseSchema {
    const now = new Date().toISOString();

    const adminUser: User = {
      id: 'usr_admin_001',
      name: 'Ramanjit Bedi (MD)',
      email: 'admin@prompttravels.com',
      phone: '+919841802288',
      passwordHash: hashPassword('Admin@123'),
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    };

    const staffUser: User = {
      id: 'usr_staff_001',
      name: 'Karthik Raja (Tour Ops)',
      email: 'staff@prompttravels.com',
      phone: '+919444013395',
      passwordHash: hashPassword('Staff@123'),
      role: 'staff',
      createdAt: now,
      updatedAt: now,
    };

    const customerUser: User = {
      id: 'usr_cust_001',
      name: 'Ananya Sharma',
      email: 'traveler@prompttravels.com',
      phone: '9841802288',
      passwordHash: hashPassword('Travel@123'),
      role: 'customer',
      createdAt: now,
      updatedAt: now,
    };

    const customerRecord: Customer = {
      id: 'cust_001',
      userId: customerUser.id,
      name: customerUser.name,
      email: customerUser.email,
      phone: customerUser.phone,
      address: 'Plot 45, Luz Church Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      preferences: 'Prefers temple packages with AC vehicle and ground floor resort stays',
      createdAt: now,
    };

    const staffRecord: Staff = {
      id: 'stf_001',
      userId: staffUser.id,
      name: staffUser.name,
      email: staffUser.email || 'staff@prompttravels.com',
      phone: staffUser.phone || '+919444013395',
      department: 'Fleet & Pilgrim Operations',
      employeeCode: 'PT-OPS-09',
      active: true,
      createdAt: now,
    };

    const adminRecord: Admin = {
      id: 'adm_001',
      userId: adminUser.id,
      permissions: ['ALL'],
      createdAt: now,
    };

    const destinations: Destination[] = [
      {
        id: 'dest_tirupati',
        name: 'Tirupati & Tirumala Balaji',
        slug: 'tirupati-balaji',
        region: 'South India',
        state: 'Andhra Pradesh',
        country: 'India',
        tagline: 'Sacred Seven Hills & Divine Balaji Darshan',
        description: 'Experience holy tranquility atop the Venkatadri hills. Prompt Travels is the premier South Indian specialist for official Tirupati packages with special entry darshan arrangements, private vehicle transit from Chennai, and experienced temple guides.',
        heroImage: '/src/assets/images/destination_tirupati_temple_1790508760584.jpg',
        gallery: [
          '/src/assets/images/destination_tirupati_temple_1790508760584.jpg',
          '/src/assets/images/hero_cinematic_travel_1790508747634.jpg'
        ],
        bestTimeToVisit: 'September to March',
        highlights: ['Special Entry Darshan Coordination', 'Chennai Doorstep Pickup & Drop', 'Alipiri & Kapila Theertham visit', 'Dedicated Temple Escort'],
        isFeatured: true,
        active: true,
        createdAt: now,
      },
      {
        id: 'dest_mahabs_pondicherry',
        name: 'Mahabalipuram & Pondicherry ECR',
        slug: 'mahabalipuram-pondicherry',
        region: 'Tamil Nadu',
        state: 'Tamil Nadu',
        country: 'India',
        tagline: 'UNESCO Shore Temples & French Colonial Coastal Elegance',
        description: 'Cruise along the scenic East Coast Road from Chennai to the stone-carved marvels of Mahabalipuram and the serene bohemian boulevards of White Town, Pondicherry. Auroville, French cafes, and private beach resorts.',
        heroImage: '/src/assets/images/hero_cinematic_travel_1790508747634.jpg',
        gallery: [
          '/src/assets/images/hero_cinematic_travel_1790508747634.jpg',
          '/src/assets/images/fleet_luxury_transport_1790508785516.jpg'
        ],
        bestTimeToVisit: 'October to March',
        highlights: ['Shore Temple & Pancha Rathas UNESCO site', 'Promenade Beach & French Quarter Walk', 'Auroville Matrimandir viewpoint', 'Scenic Bay of Bengal coastal highway drive'],
        isFeatured: true,
        active: true,
        createdAt: now,
      },
      {
        id: 'dest_munnar_kerala',
        name: 'Munnar & Thekkady Misty Hills',
        slug: 'munnar-thekkady',
        region: 'South India',
        state: 'Kerala',
        country: 'India',
        tagline: 'Emerald Tea Valleys, Wildlife Reserves & Cool Highland Air',
        description: 'Escape to Kerala’s breathtaking high-altitude hill country. Endless emerald tea plantations, spice gardens, wildlife boat safaris on Periyar Lake, and luxury treehouse resorts with personal chauffeur transit.',
        heroImage: '/src/assets/images/destination_kerala_munnar_1790508773124.jpg',
        gallery: [
          '/src/assets/images/destination_kerala_munnar_1790508773124.jpg'
        ],
        bestTimeToVisit: 'September to May',
        highlights: ['Eravikulam National Park Nilgiri Tahr', 'Tea Museum & Organic Estate Tasting', 'Periyar Wildlife Sanctuary boat safari', 'Kathakali & Kalaripayattu cultural performance'],
        isFeatured: true,
        active: true,
        createdAt: now,
      },
      {
        id: 'dest_dubai',
        name: 'Dubai & Arabian Emirates',
        slug: 'dubai-emirates',
        region: 'International',
        state: 'Dubai',
        country: 'United Arab Emirates',
        tagline: 'Futuristic Luxury, Desert Dynasties & Architectural Marvels',
        description: 'A world-class international getaway crafted by Prompt Travels. Enjoy premium hotel stays near Downtown Dubai, Burj Khalifa At The Top access, VIP 4x4 desert safari with sunset dinner, and marina dhow cruises.',
        heroImage: '/src/assets/images/destination_dubai_skyline_1790508797502.jpg',
        gallery: [
          '/src/assets/images/destination_dubai_skyline_1790508797502.jpg'
        ],
        bestTimeToVisit: 'November to April',
        highlights: ['Burj Khalifa Level 124/125 observation deck', 'VIP Red Dune Desert Safari with BBQ feast', 'Dubai Mall & Palm Jumeirah monorail tour', 'Marina Yacht Cruise with international dining'],
        isFeatured: true,
        active: true,
        createdAt: now,
      },
      {
        id: 'dest_rameshwaram_madurai',
        name: 'Madurai, Rameshwaram & Kanyakumari',
        slug: 'madurai-rameshwaram-kanyakumari',
        region: 'Tamil Nadu',
        state: 'Tamil Nadu',
        country: 'India',
        tagline: 'Grand Meenakshi Temple, Pamban Sea Bridge & Ocean Confluence',
        description: 'The definitive southern spiritual pilgrimage. Witness the towering sculpted gopurams of Madurai Meenakshi Amman, cross the iconic Pamban Bridge to holy Rameshwaram, and watch the triveni sangam sunrise at Kanyakumari.',
        heroImage: '/src/assets/images/destination_tirupati_temple_1790508760584.jpg',
        gallery: [
          '/src/assets/images/destination_tirupati_temple_1790508760584.jpg'
        ],
        bestTimeToVisit: 'October to March',
        highlights: ['Meenakshi Amman night ceremony', 'Pamban Sea Bridge train & road crossing', 'Agni Theertham & Ramanathaswamy 22 holy wells', 'Vivekananda Rock Memorial & Thiruvalluvar Statue'],
        isFeatured: false,
        active: true,
        createdAt: now,
      }
    ];

    const packages: Package[] = [
      {
        id: 'pkg_tirupati_same_day',
        title: 'Tirupati Balaji VIP Same-Day Divine Package',
        slug: 'tirupati-balaji-same-day-vip',
        destinationId: 'dest_tirupati',
        destinationName: 'Tirupati & Tirumala Balaji',
        category: 'pilgrimage',
        durationDays: 1,
        durationNights: 0,
        startingPrice: 3850,
        description: 'Our most renowned signature spiritual package from Chennai. Doorstep morning pickup at 05:00 AM in executive AC Innova or Etios, breakfast en route, Tirumala hill ascent, assistance with ₹300 Special Entry Darshan, Padmavathi Temple visit, and return to Chennai by night.',
        highlights: [
          'Guaranteed ₹300 Special Entry Darshan arrangement',
          'Doorstep pickup & drop anywhere in Chennai',
          'Traditional South Indian breakfast & lunch included',
          'Tiruchanur Sri Padmavathi Ammavari Temple visit',
          'Complimentary Laddu Prasadam assistance'
        ],
        inclusions: [
          'AC Vehicle (Innova / Etios / Tempo Traveller)',
          'Toll fees, parking, driver bata and state permit',
          'Driver cum tour guide knowledgeable about temple rituals',
          'Door-to-door transit from Chennai residence/hotel'
        ],
        exclusions: [
          'Personal expenses, tonshuring or special pooja seva fees',
          'Hotel room stay (same-day roundtrip)'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Chennai to Tirumala Balaji & Return',
            description: '05:00 AM pickup from Chennai. Scenic drive to Tirupati via Tiruttani. Breakfast break at Kanipakam highway. Ascend the sacred Seven Hills to Tirumala. Dedicated coordinator assists with Special Entry Darshan queue. Post darshan and laddu collection, descend to Tirupati for Padmavathi Ammavari temple darshan. Evening drive back to Chennai reaching by 09:30 PM.',
            meals: 'Breakfast & Traditional Lunch Included',
            stay: 'Same-day return'
          }
        ],
        heroImage: '/src/assets/images/destination_tirupati_temple_1790508760584.jpg',
        gallery: [
          '/src/assets/images/destination_tirupati_temple_1790508760584.jpg',
          '/src/assets/images/fleet_luxury_transport_1790508785516.jpg'
        ],
        active: true,
        isFeatured: true,
        createdAt: now,
      },
      {
        id: 'pkg_mahabs_pondicherry_weekend',
        title: 'French Enclave & Shore Temples 2-Day Coastal Escape',
        slug: 'pondicherry-mahabalipuram-coastal-escape',
        destinationId: 'dest_mahabs_pondicherry',
        destinationName: 'Mahabalipuram & Pondicherry ECR',
        category: 'weekend',
        durationDays: 2,
        durationNights: 1,
        startingPrice: 7999,
        description: 'A serene coastal weekend getaway following the Bay of Bengal coastline. Explore UNESCO 7th-century rock cut architecture in Mahabalipuram, savor French croissants in White Town Pondicherry, stroll Promenade Beach, and tour Auroville.',
        highlights: [
          'ECR oceanview drive from Chennai',
          'UNESCO Shore Temple & Arjuna Penance guided walk',
          'French Quarter White Town bicycle or walking experience',
          '1-night stay at luxury 4-star boutique French hotel',
          'Auroville visitor centre and Matrimandir viewpoint'
        ],
        inclusions: [
          'Dedicated air-conditioned luxury vehicle throughout the tour',
          '1 night luxury hotel accommodation with breakfast',
          'All highway tolls, parking charges, and driver allowances',
          'Guided sightseeing in Mahabalipuram and Pondicherry'
        ],
        exclusions: [
          'Lunch and dinners at French cafes (to allow freedom of choice)',
          'Entry tickets for monuments'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Chennai to Mahabalipuram & Pondicherry Arrival',
            description: 'Depart Chennai at 08:30 AM along East Coast Road. Tour Mahabalipuram Shore Temple, Krishna’s Butterball, and Five Rathas. Lunch at seafood specialty retreat. Drive to Pondicherry. Check in to heritage French hotel. Evening sunset stroll along Goubert Avenue Promenade.',
            meals: 'Welcome drink & Afternoon refreshments',
            stay: 'Heritage Boutique Stay, White Town Pondicherry'
          },
          {
            day: 2,
            title: 'Auroville, Sri Aurobindo Ashram & Return to Chennai',
            description: 'Breakfast at boutique hotel. Visit Sri Aurobindo Ashram and Manakula Vinayagar Temple. Drive to international township of Auroville and visit the Matrimandir viewing pavilion. Post lunch, leisurely drive back to Chennai via ECR arriving by 07:00 PM.',
            meals: 'Breakfast at hotel',
            stay: 'Tour concludes in Chennai'
          }
        ],
        heroImage: '/src/assets/images/hero_cinematic_travel_1790508747634.jpg',
        gallery: [
          '/src/assets/images/hero_cinematic_travel_1790508747634.jpg',
          '/src/assets/images/fleet_luxury_transport_1790508785516.jpg'
        ],
        active: true,
        isFeatured: true,
        createdAt: now,
      },
      {
        id: 'pkg_munnar_kerala_retreat',
        title: 'Munnar & Thekkady 4-Day Kerala Highland Discovery',
        slug: 'munnar-thekkady-kerala-highlands',
        destinationId: 'dest_munnar_kerala',
        destinationName: 'Munnar & Thekkady Misty Hills',
        category: 'hill_station',
        durationDays: 4,
        durationNights: 3,
        startingPrice: 16500,
        description: 'Immerse in the cool mists and sprawling spice valleys of God’s Own Country. Drive through cascading Cheeyappara waterfalls to Munnar tea estates, followed by the spice-scented forests of Thekkady and Periyar Lake wildlife cruise.',
        highlights: [
          'Panoramic tea gardens of Mattupetty Dam & Echo Point',
          'Periyar Lake boat safari with wild elephant sightings',
          'Authentic spice plantation tour with master botanist',
          '3 nights accommodation in premium hill resorts with breakfast'
        ],
        inclusions: [
          'Private chauffeur-driven AC Toyota Innova Crysta throughout',
          '3 Nights 4-Star Resort stays with daily breakfast',
          'All interstate permits, hill tolls, driver allowances',
          'Complimentary spice plantation walk'
        ],
        exclusions: [
          'Boating tickets and sanctuary entry fees',
          'Airfare or train tickets to Kochi/Coimbatore'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival Kochi / Coimbatore & Transfer to Munnar',
            description: 'Meet Prompt Travels chauffeur upon arrival. Scenic hill ascent past rubber estates and Cheeyappara waterfalls. Check in to scenic cliffside resort.',
            meals: 'Welcome drink & Dinner',
            stay: 'Luxury Valley View Resort, Munnar'
          },
          {
            day: 2,
            title: 'Munnar Tea Estates & Eravikulam Sanctuary',
            description: 'Visit Eravikulam National Park, home of the endangered Nilgiri Tahr. Tour the Tata Tea Museum with tea tasting. Photo stop at Mattupetty Dam and Kundala Lake.',
            meals: 'Breakfast & Dinner',
            stay: 'Luxury Valley View Resort, Munnar'
          },
          {
            day: 3,
            title: 'Munnar to Thekkady (Periyar Wildlife)',
            description: 'Morning drive along spice routes to Thekkady. Afternoon boat safari on Periyar Lake. Evening spice market shopping and Kalaripayattu martial arts show.',
            meals: 'Breakfast & Dinner',
            stay: 'Spice Heritage Resort, Thekkady'
          },
          {
            day: 4,
            title: 'Thekkady to Kochi Drop',
            description: 'Leisurely breakfast. Drop at Kochi Airport or Ernakulam Railway Station for onward journey.',
            meals: 'Breakfast',
            stay: 'Tour concludes'
          }
        ],
        heroImage: '/src/assets/images/destination_kerala_munnar_1790508773124.jpg',
        gallery: [
          '/src/assets/images/destination_kerala_munnar_1790508773124.jpg'
        ],
        active: true,
        isFeatured: true,
        createdAt: now,
      },
      {
        id: 'pkg_dubai_luxury_voyage',
        title: 'Dubai Futuristic Wonders & Desert Royalty 5-Day Tour',
        slug: 'dubai-futuristic-wonders-5-day',
        destinationId: 'dest_dubai',
        destinationName: 'Dubai & Arabian Emirates',
        category: 'international',
        durationDays: 5,
        durationNights: 4,
        startingPrice: 42999,
        description: 'A bespoke 5-day international journey featuring prime 4-star city accommodations, Burj Khalifa 124th floor access, Dubai Frame, 4x4 red dune desert safari with VIP majlis seating and barbecue dinner, and a luxury Dubai Marina cruise.',
        highlights: [
          'Burj Khalifa At The Top Level 124 & 125 tickets',
          'VIP Red Dune Desert Safari with dune bashing & belly dance show',
          'Luxury Dubai Marina Dhow Dinner Cruise with live saxophone',
          'Prompt Travels personal visa processing and airport meet & assist'
        ],
        inclusions: [
          '4 Nights 4-Star Hotel in Downtown / Bur Dubai with breakfast',
          'All airport transfers in private AC vehicle',
          'UAE tourist visa assistance & processing',
          'Tours and admissions as per verified itinerary'
        ],
        exclusions: [
          'International flight tickets (can be booked via Prompt flight desk)',
          'Tourism Dirham fee payable directly at hotel'
        ],
        itinerary: [
          {
            day: 1,
            title: 'Dubai Arrival & Luxury Marina Dinner Cruise',
            description: 'Meet and assist at Dubai International Airport. Private transfer to hotel. Evening pickup for two-hour glass-boat cruise along Dubai Marina with 5-star international buffet.',
            meals: 'Marina Dinner Buffet',
            stay: 'Grand Central Hotel / Millennium Dubai'
          },
          {
            day: 2,
            title: 'Half-Day Dubai City Tour & Burj Khalifa At The Top',
            description: 'Explore Dubai Creek, Gold & Spice Souk via water Abra, Jumeirah Mosque, and Burj Al Arab photo stop. Afternoon entry to Burj Khalifa observation deck and Dubai Mall fountain show.',
            meals: 'Breakfast',
            stay: 'Grand Central Hotel / Millennium Dubai'
          },
          {
            day: 3,
            title: 'Dubai Frame & Thrilling Red Dune Desert Safari',
            description: 'Morning visit to the iconic Dubai Frame. At 03:00 PM, 4x4 Land Cruiser pickup for high-dune bashing, sandboarding, camel rides, and starlit BBQ dinner at Bedouin desert camp.',
            meals: 'Breakfast & Desert BBQ Feast',
            stay: 'Grand Central Hotel / Millennium Dubai'
          },
          {
            day: 4,
            title: 'Day at Leisure or Miracle Garden / Global Village',
            description: 'Enjoy free time for tax-free shopping at Meena Bazaar or visit the seasonal Dubai Miracle Garden and Global Village.',
            meals: 'Breakfast',
            stay: 'Grand Central Hotel / Millennium Dubai'
          },
          {
            day: 5,
            title: 'Farewell Dubai & Departure Transfer',
            description: 'Breakfast at hotel. Private transfer to Dubai International Airport for flight back to Chennai.',
            meals: 'Breakfast',
            stay: 'Tour concludes'
          }
        ],
        heroImage: '/src/assets/images/destination_dubai_skyline_1790508797502.jpg',
        gallery: [
          '/src/assets/images/destination_dubai_skyline_1790508797502.jpg'
        ],
        active: true,
        isFeatured: true,
        createdAt: now,
      }
    ];

    const services: Service[] = [
      {
        id: 'srv_pilgrimage',
        title: 'Pilgrimage Tours & Seva Assistance',
        slug: 'pilgrimage-tours',
        category: 'tours',
        shortDescription: 'Dedicated darshan packages for Tirupati, Navagraha, Arupadai Veedu, Rameshwaram, and Chidambaram.',
        fullDescription: 'Prompt Travels is the most trusted name in Chennai for spiritual journeys. We coordinate hassle-free temple packages with doorstep pickup, queue guidance, senior citizen assistance, and comfortable stays near sanctums.',
        icon: 'Sparkles',
        heroImage: '/src/assets/images/destination_tirupati_temple_1790508760584.jpg',
        features: ['Special Entry Darshan Assistance', 'Knowledgeable Spiritual Drivers', 'Elderly Friendly Travel', 'Flexible Puja Schedules'],
        pricingInfo: 'Starting from ₹3,850 per person',
        active: true,
        createdAt: now,
      },
      {
        id: 'srv_car_rental',
        title: 'Executive Car & Fleet Rental',
        slug: 'car-rental-fleet',
        category: 'car_rental',
        shortDescription: 'Modern AC sedans, Innova Crysta, Fortuner, Tempo Travellers, and Urbania for local & outstation travel.',
        fullDescription: 'From airport transfers in Chennai to multi-day South India road tours, our fleet features pristine, GPS-equipped, sanitized vehicles operated by courteous, verified professional chauffeurs.',
        icon: 'Car',
        heroImage: '/src/assets/images/fleet_luxury_transport_1790508785516.jpg',
        features: ['Pristine Toyota Fleet', '24x7 Airport Pickup/Drop', 'Uniformed Chauffeurs', 'Transparent Per-Km Rates'],
        pricingInfo: 'Sedans from ₹2,200/8hrs · Crysta from ₹3,600/8hrs',
        active: true,
        createdAt: now,
      },
      {
        id: 'srv_hotel_booking',
        title: 'Luxury Hotel & Resort Bookings',
        slug: 'hotel-resort-bookings',
        category: 'hotel_reservation',
        shortDescription: 'Curated heritage stays, beach resorts along ECR, and handpicked hill cottages at exclusive rates.',
        fullDescription: 'Prompt Travels maintains direct partnerships with premium hotels across Tamil Nadu, Kerala, Karnataka, and international destinations to guarantee best room categories and breakfast inclusions.',
        icon: 'Building2',
        heroImage: '/src/assets/images/hero_cinematic_travel_1790508747634.jpg',
        features: ['Direct Property Partnerships', 'Early Check-in Requests', 'Free Cancellation Options', 'Complimentary Breakfasts'],
        pricingInfo: 'Starting from ₹2,900 per night',
        active: true,
        createdAt: now,
      },
      {
        id: 'srv_international_holidays',
        title: 'International Customized Holidays',
        slug: 'international-holidays',
        category: 'tours',
        shortDescription: 'Seamless international getaways to Dubai, Singapore, Malaysia, Thailand, and Sri Lanka.',
        fullDescription: 'Complete end-to-end holiday planning including visa documentation, flight ticketing, 4-star hotel accommodations, verified sightseeing vouchers, and 24x7 helpline assistance.',
        icon: 'Globe',
        heroImage: '/src/assets/images/destination_dubai_skyline_1790508797502.jpg',
        features: ['Hassle-Free Visa Services', 'Curated Private Itineraries', 'Indian Meal Options Abroad', 'Complete Travel Insurance'],
        pricingInfo: 'Starting from ₹34,500 per person',
        active: true,
        createdAt: now,
      },
      {
        id: 'srv_corporate_mobility',
        title: 'Corporate Travel & Event Mobility',
        slug: 'corporate-travel-mobility',
        category: 'corporate_travel',
        shortDescription: 'Comprehensive fleet contracts for Chennai IT corridors, airport delegates, and large conference shuttles.',
        fullDescription: 'Serving leading enterprises in Chennai, OMR, Guindy, and Ambattur with dedicated monthly fleet management, billing transparency, GST invoicing, and 100% on-time guarantee.',
        icon: 'Briefcase',
        heroImage: '/src/assets/images/fleet_luxury_transport_1790508785516.jpg',
        features: ['GST Invoicing & Billing Portal', 'OMR & Airport Dedicated Desks', 'Bulk Conference Shuttles', 'VIP Chauffeur Protocols'],
        pricingInfo: 'Custom Monthly Contracts & Rate Cards Available',
        active: true,
        createdAt: now,
      }
    ];

    const hotels: Hotel[] = [
      {
        id: 'htl_mahabs_beach_resort',
        name: 'The Shoreline Pavilion & Beach Resort',
        slug: 'shoreline-pavilion-beach-resort',
        destinationId: 'dest_mahabs_pondicherry',
        destinationName: 'Mahabalipuram & Pondicherry ECR',
        address: '5/42 East Coast Road, Mahabalipuram Coastal Strip',
        city: 'Mahabalipuram',
        category: 'luxury_resort',
        starRating: 5,
        pricePerNightStart: 6800,
        description: 'An idyllic oceanfront sanctuary overlooking the Bay of Bengal. Features private beach access, infinity swimming pool, seaside seafood grill, and lavish coastal suites inspired by Dravidian stone architecture.',
        heroImage: '/src/assets/images/hero_cinematic_travel_1790508747634.jpg',
        gallery: [
          '/src/assets/images/hero_cinematic_travel_1790508747634.jpg',
          '/src/assets/images/fleet_luxury_transport_1790508785516.jpg'
        ],
        amenities: ['Private Beach Access', 'Infinity Pool', 'Seaside Spa', 'Complimentary Breakfast', 'Free High-Speed Wi-Fi', '24-hour Room Service', 'Valet Parking'],
        policies: ['Check-in: 02:00 PM', 'Check-out: 11:00 AM', 'Free cancellation up to 48 hours prior to check-in'],
        rooms: [
          {
            id: 'rm_beach_deluxe_ocean',
            hotelId: 'htl_mahabs_beach_resort',
            roomType: 'Deluxe Ocean View Room',
            title: 'Deluxe Ocean View Room with Private Balcony',
            description: 'Spacious 450 sq.ft room with panoramic views of the Bay of Bengal, king bed, and marble bath with rain shower.',
            maxGuests: 3,
            bedType: '1 King Bed or 2 Twin Beds',
            pricePerNight: 6800,
            amenities: ['Ocean Balcony', 'Smart 55" TV', 'Mini Bar', 'Espresso Machine', 'Bathtub'],
            image: '/src/assets/images/hero_cinematic_travel_1790508747634.jpg',
            active: true,
            totalRooms: 12
          },
          {
            id: 'rm_beach_luxury_suite',
            hotelId: 'htl_mahabs_beach_resort',
            roomType: 'Royal Coastal Villa Suite',
            title: 'Royal Coastal Villa with Plunge Pool',
            description: '850 sq.ft private stand-alone villa featuring personal plunge pool, open-sky garden shower, and direct beach trail.',
            maxGuests: 4,
            bedType: '1 Master King Bed + Daybed',
            pricePerNight: 12500,
            amenities: ['Private Plunge Pool', 'Living Pavilion', 'Butler Service', 'Sunset Deck'],
            image: '/src/assets/images/hero_cinematic_travel_1790508747634.jpg',
            active: true,
            totalRooms: 6
          }
        ],
        isFeatured: true,
        active: true,
        createdAt: now,
      },
      {
        id: 'htl_tirupati_grand_residency',
        name: 'Saptagiri Grand Heritage Hotel',
        slug: 'saptagiri-grand-heritage-tirupati',
        destinationId: 'dest_tirupati',
        destinationName: 'Tirupati & Tirumala Balaji',
        address: '14-2/B, Renigunta Road, Opp. RTC Central Bus Stand',
        city: 'Tirupati',
        category: 'pilgrimage_comfort',
        starRating: 4,
        pricePerNightStart: 3200,
        description: 'The preferred choice for devotees seeking spotless comfort and seamless pilgrimage logistics. Located minutes from the Alipiri toll gate with 24-hour hot water, vegetarian dining with satvik food, and temple transit desk.',
        heroImage: '/src/assets/images/destination_tirupati_temple_1790508760584.jpg',
        gallery: [
          '/src/assets/images/destination_tirupati_temple_1790508760584.jpg'
        ],
        amenities: ['100% Pure Vegetarian Restaurant', '24x7 Temple Transit Desk', '24x7 Hot Water Supply', 'Free Wi-Fi', 'Devotee Luggage Storage', 'Free Parking'],
        policies: ['Check-in: 12:00 PM', 'Check-out: 11:00 AM', 'Alcohol strictly prohibited on premises'],
        rooms: [
          {
            id: 'rm_tirupati_executive',
            hotelId: 'htl_tirupati_grand_residency',
            roomType: 'Executive Devotee Room',
            title: 'Executive AC Room',
            description: 'Air-conditioned room with orthopedic mattresses, hot water showers, and quiet courtyard view.',
            maxGuests: 3,
            bedType: 'Queen Bed or Twin Beds',
            pricePerNight: 3200,
            amenities: ['AC', 'Hot Water Geyser', 'Satellite TV', 'Complimentary Bottled Water'],
            image: '/src/assets/images/destination_tirupati_temple_1790508760584.jpg',
            active: true,
            totalRooms: 20
          },
          {
            id: 'rm_tirupati_family_suite',
            hotelId: 'htl_tirupati_grand_residency',
            roomType: 'Pilgrim Family Suite (4-Bedded)',
            title: 'Pilgrim Family Suite with 4 Beds',
            description: 'Large family suite designed for groups and families travelling together for Balaji darshan.',
            maxGuests: 5,
            bedType: '2 Queen Beds',
            pricePerNight: 5100,
            amenities: ['2 Double Beds', '2 Bathrooms', 'AC', 'Living Area'],
            image: '/src/assets/images/destination_tirupati_temple_1790508760584.jpg',
            active: true,
            totalRooms: 8
          }
        ],
        isFeatured: true,
        active: true,
        createdAt: now,
      },
      {
        id: 'htl_munnar_cloud_valley',
        name: 'The Highland Mist Plantation Resort',
        slug: 'highland-mist-plantation-resort',
        destinationId: 'dest_munnar_kerala',
        destinationName: 'Munnar & Thekkady Misty Hills',
        address: 'Chithirapuram Post, Pallivasal Valley',
        city: 'Munnar',
        category: 'luxury_resort',
        starRating: 5,
        pricePerNightStart: 7400,
        description: 'Perched at 5,400 feet amidst private organic tea bushes, this luxury retreat offers misty mountain mornings, fireplace suites, Ayurvedic rejuvenation therapy, and curated nature treks.',
        heroImage: '/src/assets/images/destination_kerala_munnar_1790508773124.jpg',
        gallery: [
          '/src/assets/images/destination_kerala_munnar_1790508773124.jpg'
        ],
        amenities: ['Tea Plantation Walk', 'Ayurvedic Wellness Spa', 'Fireplace in Lounge', 'Valley View Restaurant', 'Campfire Evenings', 'Free Wi-Fi'],
        policies: ['Check-in: 01:00 PM', 'Check-out: 11:00 AM', 'Free cancellation up to 72 hours prior to arrival'],
        rooms: [
          {
            id: 'rm_munnar_plantation_cottage',
            hotelId: 'htl_munnar_cloud_valley',
            roomType: 'Plantation View Cottage',
            title: 'Plantation View Cottage with Valley Balcony',
            description: 'Warm wooden architecture, large glass windows facing rolling green slopes, and private heated bathroom.',
            maxGuests: 3,
            bedType: '1 King Bed',
            pricePerNight: 7400,
            amenities: ['Balcony with View', 'Tea Maker', 'Heater on Request', 'Room Service'],
            image: '/src/assets/images/destination_kerala_munnar_1790508773124.jpg',
            active: true,
            totalRooms: 10
          }
        ],
        isFeatured: true,
        active: true,
        createdAt: now,
      }
    ];

    const vehicles: Vehicle[] = [
      {
        id: 'veh_innova_crysta',
        name: 'Toyota Innova Crysta (Luxury 7-Seater)',
        slug: 'toyota-innova-crysta',
        vehicleType: 'luxury_suv',
        capacitySeats: 7,
        luggageCapacity: 4,
        ac: true,
        perKmRate: 18,
        localPackage8hr80km: 3600,
        outstationMinKmDay: 250,
        description: 'The benchmark of highway comfort in India. Captain seats, superior climate control, expansive legroom, and effortless highway cruising for families and VIP executives.',
        heroImage: '/src/assets/images/fleet_luxury_transport_1790508785516.jpg',
        features: ['Plush Captain Seats', 'Dual Zone Climate Control', 'High Speed USB Fast Chargers', 'Generous Luggage Bay', 'Professional Chauffeur in Uniform'],
        active: true,
        createdAt: now,
      },
      {
        id: 'veh_etios_sedan',
        name: 'Toyota Etios / Maruti Dzire (Executive Sedan)',
        slug: 'executive-sedan-etios-dzire',
        vehicleType: 'executive_sedan',
        capacitySeats: 4,
        luggageCapacity: 3,
        ac: true,
        perKmRate: 13,
        localPackage8hr80km: 2200,
        outstationMinKmDay: 250,
        description: 'Crisp, economical, and comfortable executive sedan for Chennai airport pickups, business meetings, and compact family weekend trips.',
        heroImage: '/src/assets/images/fleet_luxury_transport_1790508785516.jpg',
        features: ['Comfortable Rear Seating', 'Smooth AC Cooling', 'Boot Space for 3 Bags', 'Sanitized Interiors', 'City & Highway Ready'],
        active: true,
        createdAt: now,
      },
      {
        id: 'veh_tempo_traveller_14',
        name: 'Force Tempo Traveller (14-Seater Luxury Executive)',
        slug: 'force-tempo-traveller-14-seater',
        vehicleType: 'tempo_traveller',
        capacitySeats: 14,
        luggageCapacity: 8,
        ac: true,
        perKmRate: 24,
        localPackage8hr80km: 4800,
        outstationMinKmDay: 300,
        description: 'Customized luxury pushback seats, individual AC vents, LCD entertainment system, and generous overhead racks. The ideal choice for pilgrim groups and family reunions.',
        heroImage: '/src/assets/images/fleet_luxury_transport_1790508785516.jpg',
        features: ['Luxury Push-Back 2x1 Seats', 'Individual AC Vents per Passenger', 'Audio-Visual LED System', 'Spacious Center Aisle', 'Rear Luggage Compartment'],
        active: true,
        createdAt: now,
      },
      {
        id: 'veh_urbania_luxury',
        name: 'Force Urbania (16-Seater Monocoque VIP Coach)',
        slug: 'force-urbania-16-seater',
        vehicleType: 'urbania_luxury',
        capacitySeats: 16,
        luggageCapacity: 10,
        ac: true,
        perKmRate: 32,
        localPackage8hr80km: 6500,
        outstationMinKmDay: 300,
        description: 'Next-generation European-style monocoque luxury coach with whisper-quiet ride, panoramic tinted glass, recliner leatherette seats, and aircraft-style lighting.',
        heroImage: '/src/assets/images/fleet_luxury_transport_1790508785516.jpg',
        features: ['Monocoque Chassis Ultra-Smooth Ride', 'Aircraft-Style Reading Lights', 'Panoramic Tinted Side Windows', 'Individual USB Ports', 'Dual Airbags & ESP Safety'],
        active: true,
        createdAt: now,
      }
    ];

    const bookings: Booking[] = [
      {
        id: 'bk_sample_001',
        bookingCode: 'PT-BK-260901',
        userId: customerUser.id,
        customerName: 'Ananya Sharma',
        customerEmail: 'traveler@prompttravels.com',
        customerPhone: '9841802288',
        bookingType: 'package',
        itemId: 'pkg_tirupati_same_day',
        itemTitle: 'Tirupati Balaji VIP Same-Day Divine Package',
        startDate: '2026-10-10',
        endDate: '2026-10-10',
        guestsCount: 2,
        status: 'Confirmed',
        subtotal: 7700,
        taxAmount: 385,
        totalAmount: 8085,
        currency: 'INR',
        notes: 'Please arrange 05:30 AM pickup from Mylapore residence.',
        assignedStaffId: staffRecord.id,
        assignedStaffName: staffRecord.name,
        travellers: [
          { fullName: 'Ananya Sharma', age: 34, gender: 'Female' },
          { fullName: 'Deepak Sharma', age: 38, gender: 'Male' }
        ],
        createdAt: '2026-09-20T10:30:00Z',
        updatedAt: '2026-09-20T10:45:00Z',
      },
      {
        id: 'bk_sample_002',
        bookingCode: 'PT-BK-260902',
        userId: customerUser.id,
        customerName: 'Ananya Sharma',
        customerEmail: 'traveler@prompttravels.com',
        customerPhone: '9841802288',
        bookingType: 'hotel',
        itemId: 'htl_mahabs_beach_resort',
        itemTitle: 'The Shoreline Pavilion & Beach Resort',
        startDate: '2026-10-24',
        endDate: '2026-10-26',
        guestsCount: 2,
        roomsCount: 1,
        status: 'Confirmed',
        subtotal: 13600,
        taxAmount: 1632,
        totalAmount: 15232,
        currency: 'INR',
        notes: 'Sea view room requested for anniversary trip.',
        assignedStaffId: staffRecord.id,
        assignedStaffName: staffRecord.name,
        createdAt: '2026-09-22T14:15:00Z',
        updatedAt: '2026-09-22T14:30:00Z',
      }
    ];

    const payments: Payment[] = [
      {
        id: 'pay_sample_001',
        bookingId: 'bk_sample_001',
        bookingCode: 'PT-BK-260901',
        paymentCode: 'PAY-PT-901',
        razorpayOrderId: 'order_PT260901981',
        razorpayPaymentId: 'pay_RZP260901981',
        razorpaySignature: 'sig_verified_hmac_prompt_travels_mock',
        amount: 8085,
        currency: 'INR',
        status: 'captured',
        paymentMethod: 'UPI / NetBanking',
        customerEmail: 'traveler@prompttravels.com',
        customerPhone: '9841802288',
        createdAt: '2026-09-20T10:45:00Z',
        updatedAt: '2026-09-20T10:45:00Z',
      },
      {
        id: 'pay_sample_002',
        bookingId: 'bk_sample_002',
        bookingCode: 'PT-BK-260902',
        paymentCode: 'PAY-PT-902',
        razorpayOrderId: 'order_PT260902441',
        razorpayPaymentId: 'pay_RZP260902441',
        razorpaySignature: 'sig_verified_hmac_prompt_travels_mock',
        amount: 15232,
        currency: 'INR',
        status: 'captured',
        paymentMethod: 'Razorpay Credit Card',
        customerEmail: 'traveler@prompttravels.com',
        customerPhone: '9841802288',
        createdAt: '2026-09-22T14:30:00Z',
        updatedAt: '2026-09-22T14:30:00Z',
      }
    ];

    const enquiries: Enquiry[] = [
      {
        id: 'enq_001',
        enquiryCode: 'ENQ-PT-101',
        name: 'Venkatesh Iyer',
        email: 'v.iyer@chennaicorp.com',
        phone: '+919884102938',
        serviceType: 'pilgrimage',
        destination: 'Tirupati & Tirumala Balaji',
        travelDate: '2026-10-18',
        travellersCount: 6,
        message: 'Require 6-seater Innova Crysta pickup from Adyar for elderly parents. Need special senior citizen darshan guidance.',
        status: 'In Progress',
        assignedStaffId: staffRecord.id,
        assignedStaffName: staffRecord.name,
        internalNotes: 'Contacted customer on phone. Confirmed availability of Crysta. Waiting on confirmation for morning darshan slot.',
        createdAt: '2026-09-24T08:00:00Z',
        updatedAt: '2026-09-24T11:20:00Z',
      },
      {
        id: 'enq_002',
        enquiryCode: 'ENQ-PT-102',
        name: 'Priya Meenakshi',
        email: 'priya.m@techzone.io',
        phone: '+919445109822',
        serviceType: 'car_rental',
        destination: 'Mahabalipuram & Pondicherry ECR',
        travelDate: '2026-11-05',
        travellersCount: 12,
        message: 'Looking for a 14-seater luxury Tempo Traveller for corporate team offsite to Pondicherry over the weekend.',
        status: 'New',
        createdAt: '2026-09-26T16:45:00Z',
        updatedAt: '2026-09-26T16:45:00Z',
      }
    ];

    const notifications: Notification[] = [
      {
        id: 'notif_001',
        userId: customerUser.id,
        roleTarget: 'customer',
        title: 'Booking Confirmed: Tirupati Balaji VIP Tour',
        message: 'Your booking PT-BK-260901 has been confirmed. Chauffeur details will be shared 12 hours before pickup.',
        type: 'booking',
        link: '/account/bookings',
        isRead: false,
        createdAt: '2026-09-20T10:46:00Z',
      },
      {
        id: 'notif_002',
        userId: staffUser.id,
        roleTarget: 'staff',
        title: 'New Enquiry Assigned',
        message: 'Enquiry ENQ-PT-101 from Venkatesh Iyer has been assigned to you.',
        type: 'enquiry',
        link: '/staff/enquiries',
        isRead: true,
        createdAt: '2026-09-24T08:05:00Z',
      },
      {
        id: 'notif_003',
        userId: adminUser.id,
        roleTarget: 'admin',
        title: 'Payment Received: ₹15,232',
        message: 'Payment received for hotel booking PT-BK-260902 via Razorpay.',
        type: 'payment',
        link: '/admin/payments',
        isRead: false,
        createdAt: '2026-09-22T14:31:00Z',
      }
    ];

    const gallery: GalleryItem[] = [
      {
        id: 'gal_001',
        title: 'Shore Temple Sunrise at Mahabalipuram',
        category: 'heritage',
        imageUrl: '/src/assets/images/hero_cinematic_travel_1790508747634.jpg',
        caption: '8th-century Dravidian architectural triumph along the Bay of Bengal coastline.',
        isFeatured: true,
        createdAt: now,
      },
      {
        id: 'gal_002',
        title: 'Sacred Hill Sanctum of Tirumala',
        category: 'pilgrimage',
        imageUrl: '/src/assets/images/destination_tirupati_temple_1790508760584.jpg',
        caption: 'Golden Gopuram glow amidst the sacred Seshachalam hills at dusk.',
        isFeatured: true,
        createdAt: now,
      },
      {
        id: 'gal_003',
        title: 'Highland Tea Estate Deck in Munnar',
        category: 'destinations',
        imageUrl: '/src/assets/images/destination_kerala_munnar_1790508773124.jpg',
        caption: 'Misty mornings across the emerald carpeted tea valleys of Kerala.',
        isFeatured: true,
        createdAt: now,
      },
      {
        id: 'gal_004',
        title: 'Prompt Travels Premium Executive Fleet',
        category: 'fleet',
        imageUrl: '/src/assets/images/fleet_luxury_transport_1790508785516.jpg',
        caption: 'Pristine luxury touring vehicles ready for long-distance highways and coastal drives.',
        isFeatured: true,
        createdAt: now,
      },
      {
        id: 'gal_005',
        title: 'Downtown Dubai Twilight Skyline',
        category: 'destinations',
        imageUrl: '/src/assets/images/destination_dubai_skyline_1790508797502.jpg',
        caption: 'The pinnacle of international luxury and modern architectural magnificence.',
        isFeatured: true,
        createdAt: now,
      }
    ];

    const faqs: FAQ[] = [
      {
        id: 'faq_001',
        category: 'Pilgrimage & Tirupati',
        question: 'How do you coordinate Tirupati Balaji Special Entry Darshan?',
        answer: 'Prompt Travels assists with official TTD ₹300 Special Entry Darshan slot booking well in advance. Our experienced drivers guide you through the designated reporting queues at Tirumala, handle your luggage and footwear safely, and wait until your darshan and prasadam collection is fully complete.',
        sortOrder: 1,
        active: true,
        createdAt: now,
      },
      {
        id: 'faq_002',
        category: 'Vehicle Rentals',
        question: 'Are highway tolls, state permits, and driver bata included in vehicle quotes?',
        answer: 'Yes! Our tour packages and fixed outstation quotes provide transparent, all-inclusive pricing covering interstate permits (e.g., Andhra Pradesh, Pondicherry, Kerala), toll plaza fees, parking, and driver allowances with zero hidden charges.',
        sortOrder: 2,
        active: true,
        createdAt: now,
      },
      {
        id: 'faq_003',
        category: 'Payments & Razorpay',
        question: 'What payment methods do you accept online?',
        answer: 'We accept all major payment modes through our secure Razorpay integration: UPI (Google Pay, PhonePe, Paytm), Credit & Debit cards (Visa, MasterCard, RuPay), NetBanking from 50+ Indian banks, and corporate credit cards. All transactions generate automated digital tax invoices and verified receipts.',
        sortOrder: 3,
        active: true,
        createdAt: now,
      },
      {
        id: 'faq_004',
        category: 'Cancellations & Refunds',
        question: 'What is Prompt Travels cancellation policy?',
        answer: 'Package and vehicle cancellations made at least 48 hours before departure are eligible for a full refund or free rescheduling. For hotel and flights, cancellations follow the specific property or airline tariff rules. All refunds are initiated securely back to the original payment source.',
        sortOrder: 4,
        active: true,
        createdAt: now,
      }
    ];

    const websiteContent = {
      hero: {
        headline: 'Extraordinary Journeys. Uncompromising Elegance.',
        subheadline: 'Chennai’s premier luxury travel authority. From sacred South Indian pilgrimage corridors to bespoke international escapes and executive corporate mobility.',
        primaryCta: 'Explore Journeys',
        secondaryCta: 'Book Executive Fleet',
      },
      company: {
        name: 'Prompt Travels',
        legalName: 'Prompt Tours & Travels',
        foundedYear: '2000',
        tagline: 'Reliable, Prompt, Premium Travel Across India & Abroad',
        headOffice: '177/93, 2nd Floor, SMS Center, Luz, Mylapore, Chennai – 600 004',
        operationsOffice: 'No. 142, 4th Cross Street, 3rd Main Road, Porur Gardens, Phase - II, Vanagaram, Chennai - 600 095',
        primaryPhone: '+91 98418 02288',
        secondaryPhone: '+91 94440 13395',
        landline: '+91 44 2498 0288',
        primaryEmail: 'prompt_travels@yahoo.co.in',
        secondaryEmail: 'prompttours2000@gmail.com',
        website: 'https://prompttravels.com',
      }
    };

    return {
      users: [adminUser, staffUser, customerUser],
      customers: [customerRecord],
      staff: [staffRecord],
      admins: [adminRecord],
      destinations,
      packages,
      services,
      hotels,
      vehicles,
      bookings,
      payments,
      refunds: [],
      enquiries,
      notifications,
      gallery,
      faqs,
      audit_logs: [],
      website_content: websiteContent,
    };
  }
}

export const dbEngine = new DatabaseEngine();
