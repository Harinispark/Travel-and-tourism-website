import { doc, setDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Booking, Enquiry, CustomerProfile } from '../types';

export const firestoreSync = {
  async saveBooking(booking: Booking): Promise<void> {
    const path = `bookings/${booking.id}`;
    try {
      await setDoc(doc(db, 'bookings', booking.id), {
        id: booking.id,
        bookingCode: booking.bookingCode || '',
        userId: booking.userId || auth.currentUser?.uid || 'guest',
        customerName: booking.customerName,
        customerEmail: booking.customerEmail || '',
        customerPhone: booking.customerPhone || '',
        bookingType: booking.bookingType,
        itemId: booking.itemId,
        itemTitle: booking.itemTitle,
        startDate: booking.startDate,
        endDate: booking.endDate || '',
        guestsCount: booking.guestsCount,
        roomsCount: booking.roomsCount || 1,
        totalAmount: booking.totalAmount,
        currency: booking.currency || 'INR',
        status: booking.status,
        notes: booking.notes || '',
        createdAt: booking.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveEnquiry(enquiry: Enquiry): Promise<void> {
    const path = `enquiries/${enquiry.id}`;
    try {
      await setDoc(doc(db, 'enquiries', enquiry.id), {
        id: enquiry.id,
        enquiryCode: enquiry.enquiryCode || '',
        name: enquiry.name,
        email: enquiry.email || '',
        phone: enquiry.phone,
        destination: enquiry.destination,
        serviceType: enquiry.serviceType,
        travelDate: enquiry.travelDate || '',
        travellersCount: enquiry.travellersCount || 1,
        message: enquiry.message,
        status: enquiry.status || 'New',
        createdAt: enquiry.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveReview(review: {
    id: string;
    authorName: string;
    authorLocation?: string;
    rating: number;
    comment: string;
    journeyType?: string;
  }): Promise<void> {
    const path = `reviews/${review.id}`;
    try {
      await setDoc(doc(db, 'reviews', review.id), {
        id: review.id,
        userId: auth.currentUser?.uid || 'guest',
        authorName: review.authorName,
        authorLocation: review.authorLocation || 'Chennai, India',
        rating: review.rating,
        comment: review.comment,
        journeyType: review.journeyType || 'Pilgrimage Circuit',
        createdAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async saveUserProfile(profile: Partial<CustomerProfile> & { id: string; name: string; email?: string; phone?: string; role?: string }): Promise<void> {
    const path = `users/${profile.id}`;
    try {
      await setDoc(doc(db, 'users', profile.id), {
        id: profile.id,
        name: profile.name,
        email: profile.email || '',
        phone: profile.phone || '',
        role: profile.role || 'customer',
        city: profile.city || 'Chennai',
        address: profile.address || '',
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },
};
