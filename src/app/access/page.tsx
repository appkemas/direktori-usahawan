'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Building2, 
  Users, 
  ArrowRight,
  Key,
  UserCheck,
  BarChart3,
  Settings
} from 'lucide-react';

export default function AccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Akses Sistem KEMAS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih jenis akses yang sesuai dengan peranan anda dalam sistem KEMAS
          </p>
        </div>

        {/* Access Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Admin Access */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Akses Admin</h2>
                <p className="text-gray-600">Pengurusan sistem dan usahawan</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-700">
                <Key className="h-5 w-5 mr-3 text-blue-600" />
                <span>Log masuk dengan akaun admin yang diberi</span>
              </div>
              <div className="flex items-center text-gray-700">
                <BarChart3 className="h-5 w-5 mr-3 text-blue-600" />
                <span>Lihat statistik dan laporan</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Settings className="h-5 w-5 mr-3 text-blue-600" />
                <span>Urus akaun dan sistem</span>
              </div>
            </div>

            <Link 
              href="/admin/login"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Log Masuk Admin
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Entrepreneur Access */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="h-16 w-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Akses Usahawan</h2>
                <p className="text-gray-600">Urus profil dan produk perniagaan</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-700">
                <UserCheck className="h-5 w-5 mr-3 text-green-600" />
                <span>Log masuk dengan akaun usahawan</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Building2 className="h-5 w-5 mr-3 text-green-600" />
                <span>Urus profil perniagaan</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Users className="h-5 w-5 mr-3 text-green-600" />
                <span>Urus produk dan media</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                href="/entrepreneur/login"
                className="inline-flex items-center justify-center w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Log Masuk Usahawan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link 
                href="/register"
                className="inline-flex items-center justify-center w-full bg-white border-2 border-green-600 text-green-600 font-semibold py-3 px-6 rounded-xl hover:bg-green-50 transition-all duration-200"
              >
                Daftar Usahawan Baru
              </Link>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Maklumat Penting
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Admin</h4>
              <p className="text-sm text-gray-600">
                Akses terhad kepada pegawai KEMAS yang diberi kuasa
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Usahawan</h4>
              <p className="text-sm text-gray-600">
                Daftar dan urus perniagaan anda dalam sistem KEMAS
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Komuniti</h4>
              <p className="text-sm text-gray-600">
                Cari dan sokong usahawan tempatan anda
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
