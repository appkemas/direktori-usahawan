'use client';

import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const states = [
    'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 
    'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 
    'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic
    console.log('Search:', searchQuery, 'State:', selectedState);
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background with modern gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Simple dot pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* KEMAS Logo above the title */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
            <Image
              src="/kemas-logo.png"
              alt="KEMAS Logo"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Main heading with modern typography */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            Direktori Usahawan
          </span>
          <br />
          <span className="text-white">KEMAS</span>
        </h1>
        
        {/* Subtitle with better contrast */}
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed">
          Usahawan desa bimbingan KEMAS – memperkasa komuniti luar bandar melalui perniagaan.
        </p>

        {/* Enhanced search form */}
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari perniagaan, kategori atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-lg placeholder-gray-500 transition-all duration-300"
              />
            </div>

            {/* State Selector */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="pl-12 pr-8 py-4 bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-lg appearance-none cursor-pointer transition-all duration-300 min-w-[200px]"
              >
                <option value="">Semua Negeri</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              Cari
            </button>
          </div>
        </form>

        {/* Quick stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">1,247</div>
            <div className="text-gray-300">Usahawan Berdaftar</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">14</div>
            <div className="text-gray-300">Negeri</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">8</div>
            <div className="text-gray-300">Kategori Perniagaan</div>
          </div>
        </div>
      </div>
    </div>
  );
}
