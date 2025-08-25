'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Building2, Mail, Lock, Eye, EyeOff, AlertCircle, X, CheckCircle } from 'lucide-react';

export default function EntrepreneurLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStatus, setResetStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [resetError, setResetError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login for entrepreneur:', formData.email);
      
      // Step 1: Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log('Firebase Auth login successful:', userCredential.user.email);

      // Step 2: Verify entrepreneur exists in Firestore and get their data
      const entrepreneursRef = collection(db, 'entrepreneurs');
      const q = query(entrepreneursRef, where('email', '==', formData.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const entrepreneurDoc = querySnapshot.docs[0];
        const entrepreneurData = entrepreneurDoc.data();
        
        console.log('Entrepreneur data found:', entrepreneurData);
        
        // Check if account is approved
        if (entrepreneurData.status === 'pending') {
          setError('Akaun anda masih dalam proses kelulusan. Sila tunggu kelulusan daripada pentadbir daerah.');
          await auth.signOut(); // Sign out if not approved
          return;
        }

        if (entrepreneurData.status === 'rejected') {
          setError('Akaun anda telah ditolak. Sila hubungi pentadbir daerah untuk maklumat lanjut.');
          await auth.signOut(); // Sign out if rejected
          return;
        }

        // Success - redirect to entrepreneur dashboard with user ID
        console.log('Entrepreneur login successful, redirecting to dashboard');
        router.push(`/entrepreneur/dashboard?id=${entrepreneurDoc.id}`);
      } else {
        setError('Akaun usahawan tidak dijumpai. Sila daftar terlebih dahulu.');
        await auth.signOut();
      }

    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.code === 'auth/user-not-found') {
        setError('Emel tidak dijumpai. Sila daftar terlebih dahulu.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Kata laluan tidak betul. Sila cuba lagi.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Format emel tidak sah.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percubaan log masuk. Sila cuba lagi selepas beberapa minit.');
      } else {
        setError(`Log masuk gagal: ${error.message}. Sila cuba lagi.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus('sending');
    setResetError('');

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetStatus('success');
      setResetEmail('');
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setShowResetModal(false);
        setResetStatus('idle');
      }, 5000);
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.code === 'auth/user-not-found') {
        setResetError('Emel tidak dijumpai dalam sistem. Sila daftar terlebih dahulu.');
      } else if (error.code === 'auth/invalid-email') {
        setResetError('Format emel tidak sah. Sila masukkan emel yang betul.');
      } else if (error.code === 'auth/too-many-requests') {
        setResetError('Terlalu banyak permintaan. Sila tunggu beberapa minit sebelum cuba lagi.');
      } else {
        setResetError('Ralat menghantar emel reset. Sila cuba lagi.');
      }
      
      setResetStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Log Masuk Usahawan
          </h2>
          <p className="text-gray-600">
            Akses dashboard perniagaan anda
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 py-8 px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Emel
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="contoh@email.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Kata Laluan
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Masukkan kata laluan"
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memproses...
                </>
              ) : (
                'Log Masuk'
              )}
            </button>

            {/* Links */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Belum ada akaun?{' '}
                <a href="/register" className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200">
                  Daftar di sini
                </a>
              </p>
              <p className="text-sm text-gray-600">
                <a href="/" className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200">
                  Kembali ke laman utama
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Add this below the login form */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Lupa kata laluan?{' '}
          <button
            onClick={() => setShowResetModal(true)}
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Reset kata laluan
          </button>
        </p>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reset Kata Laluan</h3>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetStatus('idle');
                  setResetError('');
                  setResetEmail('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {resetStatus === 'success' ? (
              <div className="text-center py-4">
                <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Emel Reset Dihantar!</h4>
                <p className="text-gray-600 text-sm">
                  Sila periksa emel anda dan ikuti arahan untuk reset kata laluan.
                  Emel mungkin berada dalam folder spam atau junk.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Emel Anda
                  </label>
                  <input
                    type="email"
                    id="resetEmail"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="emel@contoh.com"
                  />
                </div>

                {resetError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {resetError}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={resetStatus === 'sending'}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resetStatus === 'sending' ? 'Menghantar...' : 'Hantar Emel Reset'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetModal(false);
                      setResetStatus('idle');
                      setResetError('');
                      setResetEmail('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
