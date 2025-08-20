'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function AdminPage() {
  const router = useRouter();
  const { adminUser, loading } = useAdminAuth();

  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (!loading && adminUser) {
      switch (adminUser.role) {
        case 'hq':
          router.push('/admin/hq/dashboard');
          break;
        case 'state':
          router.push('/admin/state/dashboard');
          break;
        case 'district':
          router.push('/admin/district/dashboard');
          break;
        default:
          router.push('/admin/login');
      }
    } else if (!loading && !adminUser) {
      // If no user is logged in, redirect to login
      router.push('/admin/login');
    }
  }, [adminUser, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa status log masuk...</p>
        </div>
      </div>
    );
  }

  // This should not render if redirects work properly
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Mengalihkan ke halaman log masuk...</p>
      </div>
    </div>
  );
}
