'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { auth, db } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function AdminLogin() {
  const router = useRouter();
  const { adminUser, login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Debug: Log what's happening
  useEffect(() => {
    console.log('🔍 AdminLogin - Current adminUser:', adminUser);
    console.log(' AdminLogin - adminUser role:', adminUser?.role);
    console.log(' AdminLogin - adminUser state:', adminUser?.state);
    
    if (adminUser) {
      console.log('🔍 AdminLogin - Redirecting to dashboard for role:', adminUser.role);
      // Redirect based on admin role
      switch (adminUser.role) {
        case 'hq':
          console.log('🔍 Redirecting to HQ Dashboard');
          router.push('/admin/hq/dashboard');
          break;
        case 'state':
          console.log('🔍 Redirecting to State Dashboard');
          router.push('/admin/state/dashboard');
          break;
        case 'district':
          console.log('🔍 Redirecting to District Dashboard');
          router.push('/admin/district/dashboard');
          break;
      }
    } else {
      console.log('🔍 AdminLogin - No admin user, staying on login page');
    }
  }, [adminUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔄 Login form submitted');
    setIsLoading(true);
    setError('');
    
    console.log('📧 Attempting login for:', email);

    try {
      console.log('🔥 Calling Firebase auth...');
      await login(email, password);
      console.log('✅ Login successful in component');
    } catch (error: any) {
      console.log('❌ Login error in component:', error);
      
      // Handle Firebase Auth errors with user-friendly messages
      if (error.code === 'auth/invalid-credential') {
        setError('Emel atau kata laluan salah. Sila periksa semula maklumat anda.');
      } else if (error.code === 'auth/user-not-found') {
        setError('Emel tidak dijumpai dalam sistem. Sila daftar terlebih dahulu.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Kata laluan salah. Sila cuba lagi.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percubaan log masuk. Sila tunggu beberapa minit sebelum cuba lagi.');
      } else if (error.code === 'auth/user-disabled') {
        setError('Akaun anda telah dinyahaktifkan. Sila hubungi pentadbir sistem.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Format emel tidak sah. Sila masukkan emel yang betul.');
      } else if (error.message && error.message.includes('auth/')) {
        // Fallback for other Firebase auth errors
        setError('Ralat log masuk. Sila cuba lagi atau hubungi pentadbir sistem.');
      } else {
        // Generic error for non-Firebase errors
        setError('Log masuk gagal. Sila cuba lagi atau hubungi pentadbir sistem.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Home */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Laman Utama
          </Link>
        </div>

        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Log Masuk Pentadbir
          </h2>
          <p className="text-gray-600">
            Akses panel pentadbir KEMAS
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Emel / Nama Pengguna
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  placeholder="admin@kemas.gov.my"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Kata Laluan
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Memproses...' : 'Log Masuk'}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Lupa kata laluan?{' '}
              <Link href="/admin/contact" className="font-medium text-purple-600 hover:text-purple-500">
                Hubungi pentadbir sistem
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
