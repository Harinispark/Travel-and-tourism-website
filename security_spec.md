# Firebase Security Specification: Prompt Travels

## 1. Data Invariants
- `users`: Each user can read and modify their own profile (`request.auth.uid == userId`). Admins can inspect all. Public profile fields are strictly controlled; RBAC fields cannot be elevated by self.
- `bookings`: Customers can create bookings where `request.auth.uid == incoming().userId`. Customers can read their own bookings. Staff and Admin can view and update booking statuses (`pending` -> `confirmed` / `in_progress` / `completed`).
- `enquiries`: Anyone can create an enquiry (with valid field types & lengths <= 2000 chars). Only staff or admin can update status or read list of enquiries.
- `destinations`: Public read. Write/update restricted to admin.
- `reviews`: Public read. Logged-in verified users can create reviews. Updates/deletions restricted to author or admin.
- `notifications`: Users can read only their own notifications (`userId == request.auth.uid`).

## 2. Dirty Dozen Payloads Handled
1. Identity Spoof: Attempting to create a booking with `userId: 'victim_uid'` while authenticated as `attacker_uid`. Rejection: `incoming().userId == request.auth.uid`.
2. Admin Privilege Escalation: Customer setting their own `role: 'admin'`. Rejection: `incoming().role == 'customer' || isAdmin()`.
3. Overflow / Denial of Wallet Attack: Submitting a 5MB comment or itinerary text. Rejection: `.size() <= 1000` / `.size() <= 2000` constraints.
4. Malicious Document ID injection: Attempting path IDs with special characters or excessive bytes. Rejection: `isValidId(id)`.
5. Terminal Status Tampering: Updating a booking marked `cancelled` or `completed` back to `confirmed` without admin role. Rejection: State lock rules.
6. Shadow Fields: Injecting arbitrary keys into user profile or booking objects. Rejection: `affectedKeys().hasOnly(...)`.
7. Unauthenticated Document Scraping: Blanket reads on private customer profiles or bookings. Rejection: explicit `resource.data.userId == request.auth.uid`.
8. Unverified Email Writes: Bypassing email verification where required. Rejection: verified checks or authenticated guard.
9. Cross-Tenant Leakage: Modifying another user's notifications. Rejection: `resource.data.userId == request.auth.uid`.
10. Price Modification / Client-side Arbitrage: Modifying total amount on confirmed booking. Rejection: `affectedKeys().hasOnly(['status'])` for non-admins.
11. PII Harvesting: Querying the entire user table. Rejection: Disallow listing of full user profiles by non-admins.
12. Malformed Timestamps: Client manipulating `createdAt` into the future. Rejection: `incoming().createdAt is string`.
