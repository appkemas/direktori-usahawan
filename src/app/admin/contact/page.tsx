'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, Shield, AlertCircle, Users } from 'lucide-react';
import Link from 'next/link';

export default function ContactSystemAdmin() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('');

  const getContactInfo = (role: string) => {
    switch (role) {
      case 'hq':
        return {
          title: 'Hubungi Pentadbir Ibu Pejabat (HQ)',
          description: 'Untuk pentadbir HQ yang menghadapi masalah sistem atau memerlukan bantuan teknikal.',
          contact: 'admin@kemas.gov.my',
          phone: '+603-8891 2682',
          note: 'Pasukan teknikal HQ akan membantu anda dalam masa 24 jam bekerja.'
        };
      case 'state':
        return {
          title: 'Hubungi Pentadbir Ibu Pejabat (HQ)',
          description: 'Untuk pentadbir negeri yang menghadapi masalah sistem atau memerlukan bantuan teknikal.',
          contact: 'admin@kemas.gov.my',
          phone: '+603-8891 2682',
          note: 'Pasukan teknikal HQ akan membantu anda dalam masa 24 jam bekerja.'
        };
      case 'district':
        return {
          title: 'Hubungi Pentadbir Negeri Anda',
          description: 'Untuk pentadbir daerah yang menghadapi masalah sistem atau memerlukan bantuan.',
          contact: 'Pentadbir Negeri anda',
          phone: 'Nombor telefon pentadbir negeri',
          note: 'Sila hubungi pentadbir negeri anda terlebih dahulu. Jika masalah tidak dapat diselesaikan, mereka akan merujuk kepada HQ.'
        };
      default:
        return null;
    }
  };

  const contactInfo = getContactInfo(selectedRole);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/admin/login"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Log Masuk
              </Link>
            </div>
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-purple-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">KEMAS Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Hubungi Pentadbir Sistem
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih peranan anda untuk mendapatkan maklumat perhubungan yang sesuai.
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pilih Peranan Anda</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedRole('hq')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedRole === 'hq'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
              }`}
            >
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-medium">Pentadbir HQ</p>
                <p className="text-sm text-gray-600">Ibu Pejabat</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('state')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedRole === 'state'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
              }`}
            >
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-medium">Pentadbir Negeri</p>
                <p className="text-sm text-gray-600">Negeri</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('district')}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedRole === 'district'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
              }`}
            >
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-medium">Pentadbir Daerah</p>
                <p className="text-sm text-gray-600">Daerah</p>
              </div>
            </button>
          </div>
        </div>

        {/* Contact Information */}
        {contactInfo && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{contactInfo.title}</h2>
            <p className="text-gray-600 mb-6">{contactInfo.description}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Maklumat Perhubungan
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Emel</p>
                      <p className="text-gray-600">{contactInfo.contact}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Telefon</p>
                      <p className="text-gray-600">{contactInfo.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Special Note for District Admins */}
                {selectedRole === 'district' && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Panduan untuk Pentadbir Daerah</h4>
                        <p className="text-sm text-blue-700">
                          Sebagai pentadbir daerah, sila hubungi pentadbir negeri anda terlebih dahulu. 
                          Mereka adalah orang yang paling sesuai untuk membantu anda kerana mereka yang 
                          mencipta akaun anda dan memahami konteks negeri anda.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* General Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Maklumat Umum
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Alamat Ibu Pejabat</p>
                      <p className="text-gray-600 text-sm">
                        Bahagian Pembangunan Komuniti (PKOM),<br />
                        Jabatan Kemajuan Masyarakat (KEMAS)<br />
                        Kementerian Kemajuan Desa dan Wilayah (KKDW)<br />
                        Aras 5-9, No 47, Persiaran Perdana,<br />
                        Presint 4, Pusat Pentadbiran Kerajaan Persekutuan,<br />
                        62100 Putrajaya
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Waktu Operasi</h4>
                    <p className="text-sm text-purple-700">
                      Isnin - Jumaat: 8:00 AM - 5:00 PM<br />
                      Sabtu: 8:00 AM - 1:00 PM<br />
                      Ahad: Tutup
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Masa Tindak Balas</h4>
                    <p className="text-sm text-green-700">
                      {contactInfo.note}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!selectedRole && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 text-center">
            <AlertCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Pilih Peranan Anda
            </h3>
            <p className="text-blue-700">
              Sila pilih peranan anda di atas untuk mendapatkan maklumat perhubungan yang sesuai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
