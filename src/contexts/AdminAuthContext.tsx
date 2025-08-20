'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/firebase/config';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  UserCredential 
} from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface AdminUser {
  uid: string;
  email: string;
  name: string;
  phone: string; // Add this missing property
  role: string;
  state: string;
  district: string;
  status: string;
  createdAt: Date;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>; // Change return type to void
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(' AdminAuthContext - User signed in:', user.email);
        
        // Check if user exists in admins collection
        const adminQuery = query(collection(db, 'admins'), where('uid', '==', user.uid));
        const adminSnapshot = await getDocs(adminQuery);
        
        if (!adminSnapshot.empty) {
          const adminData = adminSnapshot.docs[0].data();
          console.log('✅ AdminAuthContext - Admin data found:', adminData);
          
          // Fix the createdAt field handling here too
          let createdAt: Date;
          if (adminData.createdAt && typeof adminData.createdAt.toDate === 'function') {
            createdAt = adminData.createdAt.toDate();
          } else if (adminData.createdAt instanceof Date) {
            createdAt = adminData.createdAt;
          } else if (adminData.createdAt) {
            createdAt = new Date(adminData.createdAt);
          } else {
            createdAt = new Date();
          }
          
          setAdminUser({
            uid: user.uid,
            email: user.email!,
            name: adminData.name || '',
            phone: adminData.phone || '',
            role: adminData.role || '',
            state: adminData.state || '',
            district: adminData.district || '',
            status: adminData.status || 'active',
            createdAt: createdAt
          });
        } else {
          console.log('❌ AdminAuthContext - User not found in admins collection');
          setAdminUser(null);
        }
      } else {
        console.log(' AdminAuthContext - User signed out');
        setAdminUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log(' AdminAuthContext - Attempting login for:', email);
      
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ AdminAuthContext - Firebase Auth successful for:', userCredential.user.email);
      console.log(' AdminAuthContext - User UID:', userCredential.user.uid);
      
      // Search by UID (secure approach)
      const adminQuery = query(collection(db, 'admins'), where('uid', '==', userCredential.user.uid));
      console.log(' AdminAuthContext - Searching for UID:', userCredential.user.uid);
      
      const adminSnapshot = await getDocs(adminQuery);
      console.log(' AdminAuthContext - Query result:', adminSnapshot.empty ? 'empty' : 'found documents');
      
      if (adminSnapshot.empty) {
        console.log('❌ AdminAuthContext - User not found in admins collection');
        console.log(' AdminAuthContext - Let me check what documents exist:');
        
        // List all documents in admins collection for debugging
        const allAdmins = await getDocs(collection(db, 'admins'));
        allAdmins.forEach(doc => {
          const data = doc.data();
          console.log('  - Document ID:', doc.id, 'UID field:', data.uid, 'Email:', data.email);
        });
        
        await signOut(auth);
        throw new Error('Akaun pentadbir tidak dijumpai. Sila hubungi pentadbir sistem.');
      }
      
      const adminData = adminSnapshot.docs[0].data();
      console.log('✅ AdminAuthContext - Admin data found:', adminData);
      
      // Fix the createdAt field handling
      let createdAt: Date;
      if (adminData.createdAt && typeof adminData.createdAt.toDate === 'function') {
        // It's a Firebase Timestamp
        createdAt = adminData.createdAt.toDate();
      } else if (adminData.createdAt instanceof Date) {
        // It's already a Date object
        createdAt = adminData.createdAt;
      } else if (adminData.createdAt) {
        // It's a string or other format, convert to Date
        createdAt = new Date(adminData.createdAt);
      } else {
        // No createdAt, use current date
        createdAt = new Date();
      }
      
      // Set admin user
      setAdminUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        name: adminData.name || '',
        phone: adminData.phone || '',
        role: adminData.role || '',
        state: adminData.state || '',
        district: adminData.district || '',
        status: adminData.status || 'active',
        createdAt: createdAt
      });
      
      console.log('✅ AdminAuthContext - Admin user set successfully');
      
    } catch (error: any) {
      console.error('❌ AdminAuthContext - Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setAdminUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
