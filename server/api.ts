import express, { Router, Request, Response } from 'express';
import {
  dbEngine,
  User,
  Customer,
  Staff,
  Booking,
  Payment,
  Refund,
  Enquiry,
  Notification,
  Destination,
  Package,
  Hotel,
  Vehicle,
  Service,
  FAQ,
  GalleryItem,
  hashPassword,
  verifyPassword,
} from './db';
import {
  AuthRequest,
  generateToken,
  requireAuth,
  requireRole,
  logAuditEvent,
} from './auth';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  razorpayConfig,
} from './razorpay';

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION & CUSTOMER PROFILE
// ==========================================

apiRouter.post('/auth/register', (req: Request, res: Response): void => {
  const { name, email, phone, password, address, city } = req.body;

  if (!name || (!email && !phone) || !password) {
    res.status(400).json({ error: 'Name, password, and either Email or Mobile Number are required.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    return;
  }

  // Check existing
  const existing = dbEngine.db.users.find(
    (u) =>
      (email && u.email?.toLowerCase() === email.toLowerCase()) ||
      (phone && u.phone === phone)
  );

  if (existing) {
    res.status(409).json({ error: 'An account with this email or mobile number already exists.' });
    return;
  }

  const now = new Date().toISOString();
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newUser: User = {
    id: userId,
    name: name.trim(),
    email: email ? email.trim().toLowerCase() : undefined,
    phone: phone ? phone.trim() : undefined,
    passwordHash: hashPassword(password),
    role: 'customer',
    createdAt: now,
    updatedAt: now,
  };

  const newCustomer: Customer = {
    id: `cust_${Date.now()}`,
    userId: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    address: address?.trim(),
    city: city?.trim() || 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    createdAt: now,
  };

  dbEngine.db.users.push(newUser);
  dbEngine.db.customers.push(newCustomer);

  // Welcome notification
  const welcomeNotif: Notification = {
    id: `notif_${Date.now()}`,
    userId: newUser.id,
    roleTarget: 'customer',
    title: 'Welcome to Prompt Travels',
    message: `Greetings ${newUser.name}, your account has been created. Explore our curated pilgrimage tours, luxury getaways, and executive fleet.`,
    type: 'system',
    link: '/account/profile',
    isRead: false,
    createdAt: now,
  };
  dbEngine.db.notifications.unshift(welcomeNotif);

  dbEngine.persist();

  const token = generateToken(newUser);
  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    },
    customer: newCustomer,
  });
});

apiRouter.post('/auth/login', (req: Request, res: Response): void => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    res.status(400).json({ error: 'Please provide email or phone, and your password.' });
    return;
  }

  const cleanIdentifier = identifier.trim().toLowerCase();
  const user = dbEngine.db.users.find(
    (u) =>
      u.email?.toLowerCase() === cleanIdentifier ||
      u.phone?.replace(/[^0-9]/g, '') === cleanIdentifier.replace(/[^0-9]/g, '')
  );

  if (!user || !verifyPassword(password, user.passwordHash)) {
    res.status(401).json({ error: 'Invalid email/phone or password. Please try again.' });
    return;
  }

  const token = generateToken(user);
  const customer = dbEngine.db.customers.find((c) => c.userId === user.id);
  const staff = dbEngine.db.staff.find((s) => s.userId === user.id);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    customer,
    staff,
  });
});

apiRouter.post('/auth/firebase-login', (req: Request, res: Response): void => {
  const { uid, email, name, phone } = req.body;

  if (!uid) {
    res.status(400).json({ error: 'Firebase UID is required' });
    return;
  }

  const cleanEmail = email ? email.trim().toLowerCase() : undefined;
  const isAdminEmail = cleanEmail === '210822205028@kingsedu.ac.in';

  // Find user by Firebase UID or email
  let user = dbEngine.db.users.find(
    (u) => u.id === uid || (cleanEmail && u.email?.toLowerCase() === cleanEmail)
  );

  const now = new Date().toISOString();

  if (!user) {
    // Auto-create user for Firebase authenticated identity
    user = {
      id: uid,
      name: (name || (cleanEmail ? cleanEmail.split('@')[0] : 'Traveler Guest')).trim(),
      email: cleanEmail,
      phone: phone || undefined,
      passwordHash: 'firebase_oauth_managed',
      role: isAdminEmail ? 'admin' : 'customer',
      createdAt: now,
      updatedAt: now,
    };
    dbEngine.db.users.push(user);

    // Create customer profile if not exists
    const newCustomer: Customer = {
      id: `cust_${uid}`,
      userId: user.id,
      name: user.name,
      email: cleanEmail,
      phone: phone || undefined,
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      address: 'Chennai, Tamil Nadu, India',
      preferences: JSON.stringify({
        preferredDestinations: ['Tirupati', 'Mahabalipuram', 'Munnar'],
        dietary: 'Vegetarian',
      }),
      createdAt: now,
    };
    dbEngine.db.customers.push(newCustomer);
    dbEngine.persist();
  } else if (isAdminEmail && user.role !== 'admin') {
    user.role = 'admin';
    user.updatedAt = now;
    dbEngine.persist();
  }

  const token = generateToken(user);
  const customer = dbEngine.db.customers.find((c) => c.userId === user.id);
  const staff = dbEngine.db.staff.find((s) => s.userId === user.id);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    customer,
    staff,
  });
});

apiRouter.get('/auth/me', requireAuth, (req: AuthRequest, res: Response): void => {
  const user = dbEngine.db.users.find((u) => u.id === req.user?.id);
  if (!user) {
    res.status(404).json({ error: 'User account not found.' });
    return;
  }

  const customer = dbEngine.db.customers.find((c) => c.userId === user.id);
  const staff = dbEngine.db.staff.find((s) => s.userId === user.id);

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    customer,
    staff,
  });
});

apiRouter.put('/auth/profile', requireAuth, (req: AuthRequest, res: Response): void => {
  const { name, email, phone, address, city, state, country, preferences } = req.body;
  const user = dbEngine.db.users.find((u) => u.id === req.user?.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (name) user.name = name.trim();
  if (email) user.email = email.trim().toLowerCase();
  if (phone) user.phone = phone.trim();
  user.updatedAt = new Date().toISOString();

  let customer = dbEngine.db.customers.find((c) => c.userId === user.id);
  if (!customer) {
    customer = {
      id: `cust_${Date.now()}`,
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: new Date().toISOString(),
    };
    dbEngine.db.customers.push(customer);
  }

  customer.name = user.name;
  if (email) customer.email = user.email;
  if (phone) customer.phone = user.phone;
  if (address !== undefined) customer.address = address;
  if (city !== undefined) customer.city = city;
  if (state !== undefined) customer.state = state;
  if (country !== undefined) customer.country = country;
  if (preferences !== undefined) customer.preferences = preferences;

  dbEngine.persist();
  res.json({ success: true, user, customer });
});

// ==========================================
// 2. DESTINATIONS
// ==========================================

apiRouter.get('/destinations', (req: Request, res: Response): void => {
  const { featured } = req.query;
  let items = dbEngine.db.destinations.filter((d) => d.active);
  if (featured === 'true') {
    items = items.filter((d) => d.isFeatured);
  }
  res.json(items);
});

apiRouter.get('/destinations/:slug', (req: Request, res: Response): void => {
  const dest = dbEngine.db.destinations.find(
    (d) => d.slug === req.params.slug || d.id === req.params.slug
  );
  if (!dest) {
    res.status(404).json({ error: 'Destination not found' });
    return;
  }
  // Also attach packages belonging to this destination
  const relatedPackages = dbEngine.db.packages.filter(
    (p) => p.destinationId === dest.id && p.active
  );
  const relatedHotels = dbEngine.db.hotels.filter(
    (h) => h.destinationId === dest.id && h.active
  );
  res.json({ ...dest, packages: relatedPackages, hotels: relatedHotels });
});

apiRouter.post('/destinations', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const now = new Date().toISOString();
  const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const newDest: Destination = {
    id: `dest_${Date.now()}`,
    slug: req.body.slug || slug,
    name: req.body.name,
    region: req.body.region || 'South India',
    state: req.body.state || 'Tamil Nadu',
    country: req.body.country || 'India',
    tagline: req.body.tagline || '',
    description: req.body.description || '',
    heroImage: req.body.heroImage || '/src/assets/images/hero_cinematic_travel_1790508747634.jpg',
    gallery: req.body.gallery || [],
    bestTimeToVisit: req.body.bestTimeToVisit || 'All year round',
    highlights: req.body.highlights || [],
    isFeatured: req.body.isFeatured || false,
    active: true,
    createdAt: now,
  };
  dbEngine.db.destinations.push(newDest);
  dbEngine.persist();
  logAuditEvent(req, 'CREATE_DESTINATION', 'destination', newDest.id, `Created destination: ${newDest.name}`);
  res.status(201).json(newDest);
});

apiRouter.put('/destinations/:id', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const dest = dbEngine.db.destinations.find((d) => d.id === req.params.id);
  if (!dest) {
    res.status(404).json({ error: 'Destination not found' });
    return;
  }
  Object.assign(dest, req.body);
  dbEngine.persist();
  logAuditEvent(req, 'UPDATE_DESTINATION', 'destination', dest.id, `Updated destination: ${dest.name}`);
  res.json(dest);
});

apiRouter.delete('/destinations/:id', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const index = dbEngine.db.destinations.findIndex((d) => d.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Destination not found' });
    return;
  }
  const removed = dbEngine.db.destinations.splice(index, 1)[0];
  dbEngine.persist();
  logAuditEvent(req, 'DELETE_DESTINATION', 'destination', removed.id, `Deleted destination: ${removed.name}`);
  res.json({ success: true, removed });
});

// ==========================================
// 3. PACKAGES & TOURS
// ==========================================

apiRouter.get('/packages', (req: Request, res: Response): void => {
  const { category, destination, featured, search } = req.query;
  let pkgs = dbEngine.db.packages.filter((p) => p.active);

  if (category && typeof category === 'string' && category !== 'all') {
    pkgs = pkgs.filter((p) => p.category === category);
  }
  if (destination && typeof destination === 'string' && destination !== 'all') {
    pkgs = pkgs.filter((p) => p.destinationId === destination || p.destinationName.toLowerCase().includes(destination.toLowerCase()));
  }
  if (featured === 'true') {
    pkgs = pkgs.filter((p) => p.isFeatured);
  }
  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    pkgs = pkgs.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.destinationName.toLowerCase().includes(s)
    );
  }

  res.json(pkgs);
});

apiRouter.get('/packages/:slug', (req: Request, res: Response): void => {
  const pkg = dbEngine.db.packages.find(
    (p) => p.slug === req.params.slug || p.id === req.params.slug
  );
  if (!pkg) {
    res.status(404).json({ error: 'Tour package not found' });
    return;
  }
  res.json(pkg);
});

apiRouter.post('/packages', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const now = new Date().toISOString();
  const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const newPkg: Package = {
    id: `pkg_${Date.now()}`,
    slug: req.body.slug || slug,
    title: req.body.title,
    destinationId: req.body.destinationId,
    destinationName: req.body.destinationName,
    category: req.body.category || 'pilgrimage',
    durationDays: Number(req.body.durationDays) || 1,
    durationNights: Number(req.body.durationNights) || 0,
    startingPrice: Number(req.body.startingPrice) || 3000,
    description: req.body.description || '',
    highlights: req.body.highlights || [],
    inclusions: req.body.inclusions || [],
    exclusions: req.body.exclusions || [],
    itinerary: req.body.itinerary || [],
    heroImage: req.body.heroImage || '/src/assets/images/destination_tirupati_temple_1790508760584.jpg',
    gallery: req.body.gallery || [],
    active: true,
    isFeatured: req.body.isFeatured || false,
    createdAt: now,
  };
  dbEngine.db.packages.push(newPkg);
  dbEngine.persist();
  logAuditEvent(req, 'CREATE_PACKAGE', 'package', newPkg.id, `Created package: ${newPkg.title}`);
  res.status(201).json(newPkg);
});

apiRouter.put('/packages/:id', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const pkg = dbEngine.db.packages.find((p) => p.id === req.params.id);
  if (!pkg) {
    res.status(404).json({ error: 'Package not found' });
    return;
  }
  Object.assign(pkg, req.body);
  dbEngine.persist();
  logAuditEvent(req, 'UPDATE_PACKAGE', 'package', pkg.id, `Updated package: ${pkg.title}`);
  res.json(pkg);
});

apiRouter.delete('/packages/:id', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const index = dbEngine.db.packages.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Package not found' });
    return;
  }
  const removed = dbEngine.db.packages.splice(index, 1)[0];
  dbEngine.persist();
  logAuditEvent(req, 'DELETE_PACKAGE', 'package', removed.id, `Deleted package: ${removed.title}`);
  res.json({ success: true, removed });
});

// ==========================================
// 4. HOTELS & ROOMS
// ==========================================

apiRouter.get('/hotels', (req: Request, res: Response): void => {
  const { destination, category, featured, maxPrice } = req.query;
  let hotels = dbEngine.db.hotels.filter((h) => h.active);

  if (destination && typeof destination === 'string' && destination !== 'all') {
    hotels = hotels.filter((h) => h.destinationId === destination || h.city.toLowerCase().includes(destination.toLowerCase()));
  }
  if (category && typeof category === 'string' && category !== 'all') {
    hotels = hotels.filter((h) => h.category === category);
  }
  if (featured === 'true') {
    hotels = hotels.filter((h) => h.isFeatured);
  }
  if (maxPrice && !isNaN(Number(maxPrice))) {
    hotels = hotels.filter((h) => h.pricePerNightStart <= Number(maxPrice));
  }

  res.json(hotels);
});

apiRouter.get('/hotels/:slug', (req: Request, res: Response): void => {
  const hotel = dbEngine.db.hotels.find(
    (h) => h.slug === req.params.slug || h.id === req.params.slug
  );
  if (!hotel) {
    res.status(404).json({ error: 'Hotel not found' });
    return;
  }
  res.json(hotel);
});

apiRouter.post('/hotels', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const now = new Date().toISOString();
  const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const newHotel: Hotel = {
    id: `htl_${Date.now()}`,
    slug: req.body.slug || slug,
    name: req.body.name,
    destinationId: req.body.destinationId,
    destinationName: req.body.destinationName,
    address: req.body.address || '',
    city: req.body.city || '',
    category: req.body.category || 'luxury_resort',
    starRating: Number(req.body.starRating) || 4,
    pricePerNightStart: Number(req.body.pricePerNightStart) || 4500,
    description: req.body.description || '',
    heroImage: req.body.heroImage || '/src/assets/images/hero_cinematic_travel_1790508747634.jpg',
    gallery: req.body.gallery || [],
    amenities: req.body.amenities || [],
    policies: req.body.policies || [],
    rooms: req.body.rooms || [],
    isFeatured: req.body.isFeatured || false,
    active: true,
    createdAt: now,
  };
  dbEngine.db.hotels.push(newHotel);
  dbEngine.persist();
  logAuditEvent(req, 'CREATE_HOTEL', 'hotel', newHotel.id, `Created hotel: ${newHotel.name}`);
  res.status(201).json(newHotel);
});

apiRouter.put('/hotels/:id', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const hotel = dbEngine.db.hotels.find((h) => h.id === req.params.id);
  if (!hotel) {
    res.status(404).json({ error: 'Hotel not found' });
    return;
  }
  Object.assign(hotel, req.body);
  dbEngine.persist();
  logAuditEvent(req, 'UPDATE_HOTEL', 'hotel', hotel.id, `Updated hotel: ${hotel.name}`);
  res.json(hotel);
});

apiRouter.delete('/hotels/:id', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const index = dbEngine.db.hotels.findIndex((h) => h.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Hotel not found' });
    return;
  }
  const removed = dbEngine.db.hotels.splice(index, 1)[0];
  dbEngine.persist();
  logAuditEvent(req, 'DELETE_HOTEL', 'hotel', removed.id, `Deleted hotel: ${removed.name}`);
  res.json({ success: true, removed });
});

// ==========================================
// 5. VEHICLES & TRANSFERS FLEET
// ==========================================

apiRouter.get('/vehicles', (_req: Request, res: Response): void => {
  const vehicles = dbEngine.db.vehicles.filter((v) => v.active);
  res.json(vehicles);
});

apiRouter.post('/vehicles', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const now = new Date().toISOString();
  const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const newVehicle: Vehicle = {
    id: `veh_${Date.now()}`,
    slug: req.body.slug || slug,
    name: req.body.name,
    vehicleType: req.body.vehicleType || 'luxury_suv',
    capacitySeats: Number(req.body.capacitySeats) || 7,
    luggageCapacity: Number(req.body.luggageCapacity) || 4,
    ac: req.body.ac !== false,
    perKmRate: Number(req.body.perKmRate) || 16,
    localPackage8hr80km: Number(req.body.localPackage8hr80km) || 3200,
    outstationMinKmDay: Number(req.body.outstationMinKmDay) || 250,
    description: req.body.description || '',
    heroImage: req.body.heroImage || '/src/assets/images/fleet_luxury_transport_1790508785516.jpg',
    features: req.body.features || [],
    active: true,
    createdAt: now,
  };
  dbEngine.db.vehicles.push(newVehicle);
  dbEngine.persist();
  logAuditEvent(req, 'CREATE_VEHICLE', 'vehicle', newVehicle.id, `Created vehicle: ${newVehicle.name}`);
  res.status(201).json(newVehicle);
});

apiRouter.put('/vehicles/:id', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const veh = dbEngine.db.vehicles.find((v) => v.id === req.params.id);
  if (!veh) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }
  Object.assign(veh, req.body);
  dbEngine.persist();
  logAuditEvent(req, 'UPDATE_VEHICLE', 'vehicle', veh.id, `Updated vehicle: ${veh.name}`);
  res.json(veh);
});

apiRouter.delete('/vehicles/:id', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const index = dbEngine.db.vehicles.findIndex((v) => v.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }
  const removed = dbEngine.db.vehicles.splice(index, 1)[0];
  dbEngine.persist();
  logAuditEvent(req, 'DELETE_VEHICLE', 'vehicle', removed.id, `Deleted vehicle: ${removed.name}`);
  res.json({ success: true, removed });
});

// ==========================================
// 6. SERVICES
// ==========================================

apiRouter.get('/services', (_req: Request, res: Response): void => {
  res.json(dbEngine.db.services.filter((s) => s.active));
});

apiRouter.post('/services', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const now = new Date().toISOString();
  const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const srv: Service = {
    id: `srv_${Date.now()}`,
    slug: req.body.slug || slug,
    title: req.body.title,
    category: req.body.category || 'tours',
    shortDescription: req.body.shortDescription || '',
    fullDescription: req.body.fullDescription || '',
    icon: req.body.icon || 'Sparkles',
    heroImage: req.body.heroImage || '/src/assets/images/hero_cinematic_travel_1790508747634.jpg',
    features: req.body.features || [],
    pricingInfo: req.body.pricingInfo || '',
    active: true,
    createdAt: now,
  };
  dbEngine.db.services.push(srv);
  dbEngine.persist();
  logAuditEvent(req, 'CREATE_SERVICE', 'service', srv.id, `Created service: ${srv.title}`);
  res.status(201).json(srv);
});

// ==========================================
// 7. BOOKINGS ENGINE
// ==========================================

apiRouter.post('/bookings', (req: AuthRequest, res: Response): void => {
  const {
    bookingType,
    itemId,
    startDate,
    endDate,
    guestsCount,
    roomsCount,
    customerName,
    customerEmail,
    customerPhone,
    notes,
    travellers,
  } = req.body;

  if (!bookingType || !itemId || !startDate || !customerName || (!customerEmail && !customerPhone)) {
    res.status(400).json({ error: 'Missing required booking details.' });
    return;
  }

  // Calculate pricing server-side based on actual database inventory
  let subtotal = 0;
  let taxRate = 0.05; // 5% GST on travel tours & transport, 12% on luxury resorts
  let itemTitle = '';

  const guests = Math.max(1, Number(guestsCount) || 1);

  if (bookingType === 'package') {
    const pkg = dbEngine.db.packages.find((p) => p.id === itemId);
    if (!pkg) {
      res.status(404).json({ error: 'Selected package was not found.' });
      return;
    }
    itemTitle = pkg.title;
    subtotal = pkg.startingPrice * guests;
    taxRate = 0.05;
  } else if (bookingType === 'hotel') {
    const hotel = dbEngine.db.hotels.find((h) => h.id === itemId);
    if (!hotel) {
      res.status(404).json({ error: 'Selected hotel was not found.' });
      return;
    }
    itemTitle = hotel.name;
    const rooms = Math.max(1, Number(roomsCount) || 1);
    // calculate nights
    const start = new Date(startDate).getTime();
    const end = endDate ? new Date(endDate).getTime() : start + 86400000;
    const nights = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    subtotal = hotel.pricePerNightStart * rooms * nights;
    taxRate = 0.12; // 12% hospitality GST
  } else if (bookingType === 'vehicle') {
    const veh = dbEngine.db.vehicles.find((v) => v.id === itemId);
    if (!veh) {
      res.status(404).json({ error: 'Selected vehicle was not found.' });
      return;
    }
    itemTitle = veh.name;
    subtotal = veh.localPackage8hr80km;
    taxRate = 0.05;
  } else {
    itemTitle = 'Prompt Travels Custom Itinerary';
    subtotal = 5000;
  }

  const taxAmount = Math.round(subtotal * taxRate);
  const totalAmount = subtotal + taxAmount;
  const now = new Date().toISOString();
  const bookingCode = `PT-BK-${Date.now().toString().slice(-6)}`;

  // Find or determine user id
  let userId = req.user?.id;
  if (!userId) {
    // Check if user already exists with this email or phone
    const existing = dbEngine.db.users.find(
      (u) =>
        (customerEmail && u.email?.toLowerCase() === customerEmail.toLowerCase()) ||
        (customerPhone && u.phone === customerPhone)
    );
    if (existing) {
      userId = existing.id;
    } else {
      // Auto-register customer so they can track bookings seamlessly
      userId = `usr_${Date.now()}`;
      const tempUser: User = {
        id: userId,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        passwordHash: hashPassword('PromptTravel@2026'),
        role: 'customer',
        createdAt: now,
        updatedAt: now,
      };
      dbEngine.db.users.push(tempUser);
      dbEngine.db.customers.push({
        id: `cust_${Date.now()}`,
        userId,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        createdAt: now,
      });
    }
  }

  // Auto-assign available staff member
  const availableStaff = dbEngine.db.staff.find((s) => s.active);

  const newBooking: Booking = {
    id: `bk_${Date.now()}`,
    bookingCode,
    userId,
    customerName,
    customerEmail: customerEmail || '',
    customerPhone: customerPhone || '',
    bookingType,
    itemId,
    itemTitle,
    startDate,
    endDate: endDate || startDate,
    guestsCount: guests,
    roomsCount: roomsCount ? Number(roomsCount) : undefined,
    status: 'Payment Pending',
    subtotal,
    taxAmount,
    totalAmount,
    currency: 'INR',
    notes,
    assignedStaffId: availableStaff?.id,
    assignedStaffName: availableStaff?.name,
    travellers,
    createdAt: now,
    updatedAt: now,
  };

  dbEngine.db.bookings.unshift(newBooking);

  // Notifications
  dbEngine.db.notifications.unshift({
    id: `notif_${Date.now()}_cust`,
    userId,
    roleTarget: 'customer',
    title: `Booking Initiated: ${bookingCode}`,
    message: `Your booking for ${itemTitle} has been drafted. Complete payment to confirm your reservations.`,
    type: 'booking',
    link: `/account/bookings`,
    isRead: false,
    createdAt: now,
  });

  if (availableStaff) {
    dbEngine.db.notifications.unshift({
      id: `notif_${Date.now()}_stf`,
      userId: availableStaff.userId,
      roleTarget: 'staff',
      title: `New Booking Assigned: ${bookingCode}`,
      message: `${customerName} initiated booking for ${itemTitle} (₹${totalAmount.toLocaleString('en-IN')}).`,
      type: 'booking',
      link: `/staff/bookings`,
      isRead: false,
      createdAt: now,
    });
  }

  dbEngine.persist();
  res.status(201).json(newBooking);
});

// Customer's own bookings
apiRouter.get('/bookings/my', requireAuth, (req: AuthRequest, res: Response): void => {
  const myBookings = dbEngine.db.bookings.filter(
    (b) =>
      b.userId === req.user?.id ||
      (req.user?.email && b.customerEmail.toLowerCase() === req.user.email.toLowerCase()) ||
      (req.user?.phone && b.customerPhone === req.user.phone)
  );
  res.json(myBookings);
});

// Staff / Admin all bookings
apiRouter.get('/bookings', requireRole('staff', 'admin'), (req: AuthRequest, res: Response): void => {
  const { status, search, assignedToMe } = req.query;
  let items = dbEngine.db.bookings;

  if (assignedToMe === 'true' && req.user?.role === 'staff') {
    const staff = dbEngine.db.staff.find((s) => s.userId === req.user?.id);
    if (staff) {
      items = items.filter((b) => b.assignedStaffId === staff.id);
    }
  }

  if (status && typeof status === 'string' && status !== 'all') {
    items = items.filter((b) => b.status === status);
  }

  if (search && typeof search === 'string') {
    const s = search.toLowerCase();
    items = items.filter(
      (b) =>
        b.bookingCode.toLowerCase().includes(s) ||
        b.customerName.toLowerCase().includes(s) ||
        b.customerEmail.toLowerCase().includes(s) ||
        b.customerPhone.includes(s) ||
        b.itemTitle.toLowerCase().includes(s)
    );
  }

  res.json(items);
});

apiRouter.get('/bookings/:id', (req: Request, res: Response): void => {
  const booking = dbEngine.db.bookings.find(
    (b) => b.id === req.params.id || b.bookingCode === req.params.id
  );
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }
  const payment = dbEngine.db.payments.find((p) => p.bookingId === booking.id);
  res.json({ ...booking, payment });
});

apiRouter.put('/bookings/:id/status', requireRole('staff', 'admin'), (req: AuthRequest, res: Response): void => {
  const { status, notes } = req.body;
  const booking = dbEngine.db.bookings.find((b) => b.id === req.params.id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  const oldStatus = booking.status;
  booking.status = status;
  if (notes) booking.notes = notes;
  booking.updatedAt = new Date().toISOString();

  // Notify customer
  dbEngine.db.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: booking.userId,
    roleTarget: 'customer',
    title: `Booking Update: ${booking.bookingCode}`,
    message: `Your booking status changed from ${oldStatus} to ${status}.`,
    type: 'booking',
    link: '/account/bookings',
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  dbEngine.persist();
  logAuditEvent(req, 'UPDATE_BOOKING_STATUS', 'booking', booking.id, `Status updated to ${status}`);
  res.json(booking);
});

apiRouter.put('/bookings/:id/assign', requireRole('admin', 'staff'), (req: AuthRequest, res: Response): void => {
  const { staffId } = req.body;
  const booking = dbEngine.db.bookings.find((b) => b.id === req.params.id);
  const staff = dbEngine.db.staff.find((s) => s.id === staffId);

  if (!booking || !staff) {
    res.status(404).json({ error: 'Booking or Staff member not found' });
    return;
  }

  booking.assignedStaffId = staff.id;
  booking.assignedStaffName = staff.name;
  booking.updatedAt = new Date().toISOString();

  dbEngine.persist();
  logAuditEvent(req, 'ASSIGN_BOOKING', 'booking', booking.id, `Assigned to staff: ${staff.name}`);
  res.json(booking);
});

// ==========================================
// 8. RAZORPAY PAYMENT ARCHITECTURE & VERIFICATION
// ==========================================

apiRouter.post('/payments/create-order', (req: AuthRequest, res: Response): void => {
  const { bookingId } = req.body;
  const booking = dbEngine.db.bookings.find((b) => b.id === bookingId);

  if (!booking) {
    res.status(404).json({ error: 'Booking record not found for payment' });
    return;
  }

  if (booking.status === 'Confirmed') {
    res.status(400).json({ error: 'This booking has already been paid and confirmed.' });
    return;
  }

  // Create real server-side Razorpay order
  const order = createRazorpayOrder(booking.totalAmount, booking.bookingCode);

  // Record initial payment record in DB
  const payment: Payment = {
    id: `pay_${Date.now()}`,
    bookingId: booking.id,
    bookingCode: booking.bookingCode,
    paymentCode: `PAY-${booking.bookingCode.replace('PT-BK-', '')}`,
    razorpayOrderId: order.orderId,
    amount: booking.totalAmount,
    currency: 'INR',
    status: 'created',
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dbEngine.db.payments.unshift(payment);
  dbEngine.persist();

  res.json({
    orderId: order.orderId,
    amount: order.amount, // in paise
    currency: order.currency,
    keyId: order.keyId,
    bookingCode: booking.bookingCode,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    itemTitle: booking.itemTitle,
    isTestMode: razorpayConfig.isTestMode,
  });
});

apiRouter.post('/payments/verify', (req: AuthRequest, res: Response): void => {
  const {
    bookingId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    paymentMethod,
  } = req.body;

  const booking = dbEngine.db.bookings.find((b) => b.id === bookingId);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found for payment verification.' });
    return;
  }

  // Server-side HMAC-SHA256 signature verification
  const verification = verifyRazorpaySignature(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  );

  if (!verification.isValid) {
    res.status(400).json({
      error: verification.message || 'Payment verification failed: Signature mismatch',
    });
    return;
  }

  // Prevent duplicate double payment
  if (booking.status === 'Confirmed') {
    res.json({ success: true, message: 'Payment already processed and booking confirmed.' });
    return;
  }

  // Update booking to Confirmed
  const now = new Date().toISOString();
  booking.status = 'Confirmed';
  booking.updatedAt = now;

  // Update or create payment record
  let payment = dbEngine.db.payments.find((p) => p.razorpayOrderId === razorpayOrderId);
  if (!payment) {
    payment = {
      id: `pay_${Date.now()}`,
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      paymentCode: `PAY-${booking.bookingCode.replace('PT-BK-', '')}`,
      razorpayOrderId,
      amount: booking.totalAmount,
      currency: 'INR',
      status: 'captured',
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      createdAt: now,
      updatedAt: now,
    };
    dbEngine.db.payments.unshift(payment);
  }

  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  payment.status = 'captured';
  payment.paymentMethod = paymentMethod || 'Razorpay UPI/Card';
  payment.updatedAt = now;

  // Add confirmations to notifications
  dbEngine.db.notifications.unshift({
    id: `notif_${Date.now()}_conf`,
    userId: booking.userId,
    roleTarget: 'customer',
    title: `Payment Successful! Booking Confirmed: ${booking.bookingCode}`,
    message: `Payment of ₹${booking.totalAmount.toLocaleString('en-IN')} received. We have sent the confirmation voucher to ${booking.customerEmail}.`,
    type: 'payment',
    link: `/account/bookings`,
    isRead: false,
    createdAt: now,
  });

  dbEngine.db.notifications.unshift({
    id: `notif_${Date.now()}_admin_pay`,
    roleTarget: 'admin',
    title: `Payment Received: ₹${booking.totalAmount.toLocaleString('en-IN')}`,
    message: `${booking.customerName} completed payment for ${booking.itemTitle} (${booking.bookingCode}).`,
    type: 'payment',
    link: `/admin/payments`,
    isRead: false,
    createdAt: now,
  });

  dbEngine.persist();
  logAuditEvent(req, 'PAYMENT_CAPTURED', 'payment', payment.id, `Payment captured ₹${booking.totalAmount} for ${booking.bookingCode}`);

  res.json({
    success: true,
    booking,
    payment,
    message: 'Payment verified and booking confirmed successfully.',
  });
});

apiRouter.get('/payments', requireRole('admin', 'staff'), (_req: Request, res: Response): void => {
  res.json(dbEngine.db.payments);
});

apiRouter.post('/refunds/request', requireRole('customer', 'staff', 'admin'), (req: AuthRequest, res: Response): void => {
  const { bookingId, reason } = req.body;
  const booking = dbEngine.db.bookings.find((b) => b.id === bookingId);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }

  const payment = dbEngine.db.payments.find((p) => p.bookingId === booking.id && p.status === 'captured');
  if (!payment) {
    res.status(400).json({ error: 'No captured payment found to refund.' });
    return;
  }

  const refund: Refund = {
    id: `ref_${Date.now()}`,
    paymentId: payment.id,
    bookingId: booking.id,
    bookingCode: booking.bookingCode,
    amount: payment.amount,
    reason: reason || 'Customer requested cancellation',
    status: 'Pending',
    requestedBy: req.user?.name || booking.customerName,
    requestedAt: new Date().toISOString(),
  };

  booking.status = 'Refund Pending';
  dbEngine.db.refunds.unshift(refund);
  dbEngine.persist();

  logAuditEvent(req, 'REFUND_REQUESTED', 'refund', refund.id, `Refund requested for ${booking.bookingCode}`);
  res.json({ success: true, refund });
});

apiRouter.put('/refunds/:id/process', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const { action } = req.body; // 'approve' | 'reject'
  const refund = dbEngine.db.refunds.find((r) => r.id === req.params.id);
  if (!refund) {
    res.status(404).json({ error: 'Refund record not found' });
    return;
  }

  const booking = dbEngine.db.bookings.find((b) => b.id === refund.bookingId);
  const now = new Date().toISOString();

  if (action === 'approve') {
    refund.status = 'Processed';
    refund.processedAt = now;
    refund.razorpayRefundId = `rfnd_pt_${Date.now()}`;
    if (booking) booking.status = 'Refunded';

    const payment = dbEngine.db.payments.find((p) => p.id === refund.paymentId);
    if (payment) payment.status = 'refunded';
  } else {
    refund.status = 'Rejected';
    refund.processedAt = now;
    if (booking) booking.status = 'Confirmed';
  }

  dbEngine.persist();
  logAuditEvent(req, 'REFUND_PROCESSED', 'refund', refund.id, `Refund action: ${action}`);
  res.json({ success: true, refund });
});

apiRouter.get('/refunds', requireRole('admin'), (_req: Request, res: Response): void => {
  res.json(dbEngine.db.refunds);
});

// ==========================================
// 9. ENQUIRY SYSTEM
// ==========================================

apiRouter.post('/enquiries', (req: Request, res: Response): void => {
  const { name, email, phone, serviceType, destination, travelDate, travellersCount, message } = req.body;

  if (!name || (!email && !phone)) {
    res.status(400).json({ error: 'Please provide your Name and either an Email or Phone number.' });
    return;
  }

  const now = new Date().toISOString();
  const enquiryCode = `ENQ-PT-${Date.now().toString().slice(-4)}`;
  const availableStaff = dbEngine.db.staff.find((s) => s.active);

  const newEnquiry: Enquiry = {
    id: `enq_${Date.now()}`,
    enquiryCode,
    name: name.trim(),
    email: email ? email.trim() : '',
    phone: phone ? phone.trim() : '',
    serviceType: serviceType || 'tours',
    destination: destination || 'South India',
    travelDate: travelDate || '',
    travellersCount: Number(travellersCount) || 2,
    message: message || '',
    status: 'New',
    assignedStaffId: availableStaff?.id,
    assignedStaffName: availableStaff?.name,
    createdAt: now,
    updatedAt: now,
  };

  dbEngine.db.enquiries.unshift(newEnquiry);

  // Notify admin & staff
  dbEngine.db.notifications.unshift({
    id: `notif_${Date.now()}_enq`,
    roleTarget: 'staff',
    title: `New Travel Enquiry: ${enquiryCode}`,
    message: `${newEnquiry.name} enquired about ${newEnquiry.destination} (${newEnquiry.serviceType}).`,
    type: 'enquiry',
    link: `/staff/enquiries`,
    isRead: false,
    createdAt: now,
  });

  dbEngine.persist();
  res.status(201).json({ success: true, enquiry: newEnquiry });
});

apiRouter.get('/enquiries', requireRole('staff', 'admin'), (req: AuthRequest, res: Response): void => {
  const { status, assignedToMe } = req.query;
  let items = dbEngine.db.enquiries;

  if (assignedToMe === 'true' && req.user?.role === 'staff') {
    const staff = dbEngine.db.staff.find((s) => s.userId === req.user?.id);
    if (staff) {
      items = items.filter((e) => e.assignedStaffId === staff.id);
    }
  }

  if (status && typeof status === 'string' && status !== 'all') {
    items = items.filter((e) => e.status === status);
  }

  res.json(items);
});

apiRouter.put('/enquiries/:id', requireRole('staff', 'admin'), (req: AuthRequest, res: Response): void => {
  const { status, assignedStaffId, internalNotes } = req.body;
  const enquiry = dbEngine.db.enquiries.find((e) => e.id === req.params.id);

  if (!enquiry) {
    res.status(404).json({ error: 'Enquiry not found' });
    return;
  }

  if (status) enquiry.status = status;
  if (internalNotes !== undefined) enquiry.internalNotes = internalNotes;
  if (assignedStaffId) {
    const staff = dbEngine.db.staff.find((s) => s.id === assignedStaffId);
    if (staff) {
      enquiry.assignedStaffId = staff.id;
      enquiry.assignedStaffName = staff.name;
    }
  }
  enquiry.updatedAt = new Date().toISOString();

  dbEngine.persist();
  logAuditEvent(req, 'UPDATE_ENQUIRY', 'enquiry', enquiry.id, `Updated enquiry status to ${enquiry.status}`);
  res.json(enquiry);
});

// ==========================================
// 10. NOTIFICATIONS
// ==========================================

apiRouter.get('/notifications', requireAuth, (req: AuthRequest, res: Response): void => {
  const role = req.user?.role || 'customer';
  const userId = req.user?.id;

  const notifs = dbEngine.db.notifications.filter(
    (n) =>
      n.userId === userId ||
      n.roleTarget === role ||
      n.roleTarget === 'all'
  );

  res.json(notifs);
});

apiRouter.put('/notifications/:id/read', requireAuth, (req: Request, res: Response): void => {
  const notif = dbEngine.db.notifications.find((n) => n.id === req.params.id);
  if (notif) {
    notif.isRead = true;
    dbEngine.persist();
  }
  res.json({ success: true });
});

apiRouter.put('/notifications/read-all', requireAuth, (req: AuthRequest, res: Response): void => {
  const userId = req.user?.id;
  const role = req.user?.role;
  dbEngine.db.notifications.forEach((n) => {
    if (n.userId === userId || n.roleTarget === role || n.roleTarget === 'all') {
      n.isRead = true;
    }
  });
  dbEngine.persist();
  res.json({ success: true });
});

// ==========================================
// 11. GALLERY, CMS & FAQS
// ==========================================

apiRouter.get('/gallery', (_req: Request, res: Response): void => {
  res.json(dbEngine.db.gallery);
});

apiRouter.post('/gallery', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const item: GalleryItem = {
    id: `gal_${Date.now()}`,
    title: req.body.title,
    category: req.body.category || 'destinations',
    imageUrl: req.body.imageUrl,
    caption: req.body.caption || '',
    isFeatured: req.body.isFeatured || false,
    createdAt: new Date().toISOString(),
  };
  dbEngine.db.gallery.unshift(item);
  dbEngine.persist();
  res.status(201).json(item);
});

apiRouter.delete('/gallery/:id', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const index = dbEngine.db.gallery.findIndex((g) => g.id === req.params.id);
  if (index !== -1) {
    dbEngine.db.gallery.splice(index, 1);
    dbEngine.persist();
  }
  res.json({ success: true });
});

apiRouter.get('/faqs', (_req: Request, res: Response): void => {
  res.json(dbEngine.db.faqs.filter((f) => f.active));
});

apiRouter.post('/faqs', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const faq: FAQ = {
    id: `faq_${Date.now()}`,
    category: req.body.category || 'General',
    question: req.body.question,
    answer: req.body.answer,
    sortOrder: Number(req.body.sortOrder) || dbEngine.db.faqs.length + 1,
    active: true,
    createdAt: new Date().toISOString(),
  };
  dbEngine.db.faqs.push(faq);
  dbEngine.persist();
  res.status(201).json(faq);
});

apiRouter.put('/faqs/:id', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const faq = dbEngine.db.faqs.find((f) => f.id === req.params.id);
  if (!faq) {
    res.status(404).json({ error: 'FAQ not found' });
    return;
  }
  Object.assign(faq, req.body);
  dbEngine.persist();
  res.json(faq);
});

apiRouter.delete('/faqs/:id', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const index = dbEngine.db.faqs.findIndex((f) => f.id === req.params.id);
  if (index !== -1) {
    dbEngine.db.faqs.splice(index, 1);
    dbEngine.persist();
  }
  res.json({ success: true });
});

apiRouter.get('/cms', (_req: Request, res: Response): void => {
  res.json(dbEngine.db.website_content);
});

apiRouter.put('/cms', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  Object.assign(dbEngine.db.website_content, req.body);
  dbEngine.persist();
  logAuditEvent(req, 'UPDATE_CMS', 'cms', 'website_content', 'Updated website CMS content');
  res.json(dbEngine.db.website_content);
});

// ==========================================
// 12. ADMIN DASHBOARD METRICS & AUDIT LOGS
// ==========================================

apiRouter.get('/admin/metrics', requireRole('admin', 'staff'), (_req: Request, res: Response): void => {
  const db = dbEngine.db;

  const totalBookings = db.bookings.length;
  const confirmedBookings = db.bookings.filter((b) => b.status === 'Confirmed').length;
  const pendingBookings = db.bookings.filter((b) => b.status === 'Pending' || b.status === 'Payment Pending').length;
  const cancelledBookings = db.bookings.filter((b) => b.status === 'Cancelled').length;

  const totalRevenue = db.payments
    .filter((p) => p.status === 'captured')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCustomers = db.customers.length;
  const totalStaff = db.staff.length;
  const totalEnquiries = db.enquiries.length;
  const activeEnquiries = db.enquiries.filter((e) => e.status === 'New' || e.status === 'In Progress').length;

  res.json({
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    totalRevenue,
    totalCustomers,
    totalStaff,
    totalEnquiries,
    activeEnquiries,
    totalPackages: db.packages.filter((p) => p.active).length,
    totalVehicles: db.vehicles.filter((v) => v.active).length,
    totalHotels: db.hotels.filter((h) => h.active).length,
  });
});

apiRouter.get('/admin/users', requireRole('admin'), (_req: Request, res: Response): void => {
  const usersSafe = dbEngine.db.users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    createdAt: u.createdAt,
  }));
  res.json(usersSafe);
});

apiRouter.put('/admin/users/:id/role', requireRole('admin'), (req: AuthRequest, res: Response): void => {
  const { role } = req.body;
  if (!['customer', 'staff', 'admin'].includes(role)) {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }
  const user = dbEngine.db.users.find((u) => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  user.role = role;
  user.updatedAt = new Date().toISOString();

  // If promoted to staff, ensure staff record
  if (role === 'staff') {
    const existingStaff = dbEngine.db.staff.find((s) => s.userId === user.id);
    if (!existingStaff) {
      dbEngine.db.staff.push({
        id: `stf_${Date.now()}`,
        userId: user.id,
        name: user.name,
        email: user.email || '',
        phone: user.phone || '',
        department: 'Operations',
        employeeCode: `PT-STF-${Date.now().toString().slice(-4)}`,
        active: true,
        createdAt: new Date().toISOString(),
      });
    }
  }

  dbEngine.persist();
  logAuditEvent(req, 'UPDATE_USER_ROLE', 'user', user.id, `Role changed to ${role}`);
  res.json({ success: true, user });
});

apiRouter.get('/admin/audit-logs', requireRole('admin'), (_req: Request, res: Response): void => {
  res.json(dbEngine.db.audit_logs);
});
