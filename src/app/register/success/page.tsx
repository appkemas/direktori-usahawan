import React from 'react';
import Link from 'next/link';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';

export default function RegistrationSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Pendaftaran Berjaya!
          </h2>
          <p className="text-gray-600 mb-8">
            Akaun anda telah berjaya didaftarkan
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 text-center">
          <div className="mb-6">
            <Mail className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Semak Emel Anda
            </h3>
            <p className="text-gray-600">
              Kami telah menghantar pautan pengesahan ke emel anda. Sila klik pautan tersebut untuk mengaktifkan akaun.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/entrepreneur/login"
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              Log Masuk Sekarang
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            <Link
              href="/"
              className="w-full flex justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Kembali ke Laman Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
