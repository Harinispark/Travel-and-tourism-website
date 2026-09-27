import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CustomerProfile } from '../types';
import { api, clearStoredToken, getStoredToken } from '../services/api';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { firestoreSync } from '../services/firestoreSync';

interface AuthContextType {
  user: User | null;
  customer: CustomerProfile | null;
  staff: any | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (payload: { name: string; email?: string; phone?: string; password: string; city?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  activePortal: 'customer' | 'staff' | 'admin';
  setActivePortal: (portal: 'customer' | 'staff' | 'admin') => void;
  authModal: { isOpen: boolean; mode: 'login' | 'register' };
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [staff, setStaff] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePortal, setActivePortal] = useState<'customer' | 'staff' | 'admin'>('customer');
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });

  const refreshUser = async () => {
    if (!getStoredToken()) {
      setUser(null);
      setCustomer(null);
      setStaff(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
      setCustomer(data.customer || null);
      setStaff(data.staff || null);
    } catch (err) {
      clearStoredToken();
      setUser(null);
      setCustomer(null);
      setStaff(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await api.login({ identifier, password });
    setUser(res.user);
    setCustomer(res.customer || null);
    setStaff(res.staff || null);

    // Sync to Firestore for persistence
    try {
      await firestoreSync.saveUserProfile({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        phone: res.user.phone,
        role: res.user.role,
        city: res.customer?.city,
        address: res.customer?.address,
      });
    } catch (e) {
      console.warn('Firestore user sync notice:', e);
    }

    if (res.user.role === 'admin') {
      setActivePortal('admin');
    } else if (res.user.role === 'staff') {
      setActivePortal('staff');
    } else {
      setActivePortal('customer');
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const fbUser = cred.user;

      // 1. Sync to Firestore
      try {
        await firestoreSync.saveUserProfile({
          id: fbUser.uid,
          name: fbUser.displayName || 'Traveler Guest',
          email: fbUser.email || undefined,
          phone: fbUser.phoneNumber || undefined,
          role: fbUser.email === '210822205028@kingsedu.ac.in' ? 'admin' : 'customer',
        });
      } catch (e) {
        console.warn('Firestore write warning:', e);
      }

      // 2. Sync to Backend & generate JWT session
      const res = await api.firebaseLogin({
        uid: fbUser.uid,
        email: fbUser.email || undefined,
        name: fbUser.displayName || 'Traveler Guest',
        phone: fbUser.phoneNumber || undefined,
        photoURL: fbUser.photoURL || undefined,
      });

      setUser(res.user);
      setCustomer(res.customer || null);
      setStaff(res.staff || null);

      if (res.user.role === 'admin') {
        setActivePortal('admin');
      } else {
        setActivePortal('customer');
      }
      closeAuthModal();
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: { name: string; email?: string; phone?: string; password: string; city?: string }) => {
    const res = await api.register(payload);
    setUser(res.user);
    setCustomer(res.customer || null);
    setActivePortal('customer');

    // Sync to Firestore for persistence
    try {
      await firestoreSync.saveUserProfile({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        phone: res.user.phone,
        role: res.user.role,
        city: payload.city || 'Chennai',
      });
    } catch (e) {
      console.warn('Firestore user sync notice:', e);
    }
  };

  const logout = () => {
    try {
      signOut(auth).catch(() => {});
    } catch (e) {}
    clearStoredToken();
    setUser(null);
    setCustomer(null);
    setStaff(null);
    setActivePortal('customer');
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customer,
        staff,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        refreshUser,
        activePortal,
        setActivePortal,
        authModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
