'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { HelpCircle, Users, FileText, Phone } from 'lucide-react';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold mb-4">
                FAQ – Usahawan Bimbingan KEMAS
              </h1>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                Soalan Lazim mengenai Program Usahawan Bimbingan KEMAS
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8">
            
            {/* Question 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    1. Apa itu Usahawan Bimbingan KEMAS?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Usahawan Bimbingan KEMAS ialah individu atau kumpulan dari masyarakat desa B40 yang telah menerima bimbingan serta latihan keusahawanan melalui Program Pembangunan Usahawan KEMAS. Mereka dibimbing untuk mengembangkan perniagaan dan meningkatkan taraf hidup.
                  </p>
                </div>
              </div>
            </div>

            {/* Question 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    2. Siapa yang layak menjadi Usahawan Bimbingan KEMAS?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Pemohon perlu memenuhi syarat-syarat berikut:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-purple-600 font-semibold mr-2">•</span>
                      Warganegara Malaysia, berumur 18 tahun ke atas.
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 font-semibold mr-2">•</span>
                      Usahawan baharu, Pico atau Nano.
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 font-semibold mr-2">•</span>
                      <span className="text-gray-700">
                        Telah mengikuti program kemahiran seperti Quickwin dan merupakan bekas pelajar KEMAS; <strong>atau</strong> telah mengikuti kursus wajib (Siri 1 & Siri 2) di bawah Pakej Latihan Keusahawanan / Coaching & Mentoring.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 font-semibold mr-2">•</span>
                      Telah berdaftar melalui Borang Pendaftaran Usahawan KEMAS
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 font-semibold mr-2">•</span>
                      Mempunyai perniagaan beroperasi sekurang-kurangnya 6 bulan.
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 font-semibold mr-2">•</span>
                      Perniagaan telah didaftarkan dengan Suruhanjaya Syarikat Malaysia (SSM).
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Question 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    3. Bagaimana cara untuk memohon menjadi Usahawan Bimbingan KEMAS?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Permohonan boleh dibuat dengan <strong>menghubungi Pejabat KEMAS di daerah masing-masing</strong>. Pegawai KEMAS akan membantu anda dengan proses pendaftaran dan maklumat lanjut mengenai latihan serta bimbingan yang ditawarkan.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
