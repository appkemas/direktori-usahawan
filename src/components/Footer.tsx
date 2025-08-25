'use client';

import React from 'react';
import { Mail, Phone, MapPin, Printer } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* KEMAS Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              {/* KEMAS Logo */}
              <div className="mr-4">
                <Image
                  src="/kemas-logo.png"
                  alt="KEMAS Logo"
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">KEMAS</h3>
                <p className="text-sm text-gray-400">Jabatan Kemajuan Masyarakat</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Platform direktori digital untuk usahawan KEMAS Malaysia yang membolehkan pengguna mencari dan menghubungi perniagaan tempatan.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:info@kemas.gov.my" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Mail className="h-5 w-5" />
              </a>
              <a href="tel:+603-8891 2682" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Phone className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <MapPin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Pautan Pantas</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">Laman Utama</a></li>
              <li><a href="/search" className="text-gray-300 hover:text-white transition-colors duration-200">Cari Perniagaan</a></li>
              <li><a href="/admin" className="text-gray-300 hover:text-white transition-colors duration-200">Pentadbir</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
            <div className="space-y-3 text-gray-300 text-sm">
              <p className="font-medium">Bahagian Pembangunan Komuniti (PKOM),<br />
              Jabatan Kemajuan Masyarakat (KEMAS)</p>
              <p className="font-medium">Kementerian Kemajuan Desa dan Wilayah (KKDW)</p>
              <p>Aras 5-9, No 47, Persiaran Perdana,<br />
              Presint 4, Pusat Pentadbiran Kerajaan Persekutuan,<br />
              62100 Putrajaya.</p>
              <div className="pt-2 space-y-1">
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-purple-400" />
                  <span>+603-8891 2682</span>
                </p>
                <p className="flex items-center">
                  <Printer className="h-4 w-4 mr-2 text-purple-400" />
                  <span>+603-8888 2312</span>
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-purple-400" />
                  <span>info@kemas.gov.my</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025: Bahagian Pembangunan Komuniti (PKOM), KEMAS Ibu Pejabat. Hak cipta terpelihara.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Dasar Privasi
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Terma Penggunaan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
