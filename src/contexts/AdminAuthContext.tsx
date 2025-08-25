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

  const login = async (email: string, password: string): Promise<AdminUser> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Look up admin data in Firestore
      const adminQuery = query(
        collection(db, 'admins'),
        where('uid', '==', user.uid)
      );
      
      const adminSnapshot = await getDocs(adminQuery);
      
      if (adminSnapshot.empty) {
        throw new Error('Akaun pentadbir tidak dijumpai. Sila hubungi pentadbir sistem.');
      }
      
      const adminData = adminSnapshot.docs[0].data();
      
      // Type assertion with proper interface
      const adminUser: AdminUser = {
        uid: user.uid,
        email: user.email || '',
        name: adminData.name || '',
        role: adminData.role || '',
        state: adminData.state || '',
        district: adminData.district || '',
        status: adminData.status || '',
        phone: adminData.phone || '',
        createdAt: adminData.createdAt ? adminData.createdAt.toDate() : new Date()
      };
      
      setAdminUser(adminUser);
      return adminUser;
    } catch (error) {
      console.error('Login error:', error);
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
