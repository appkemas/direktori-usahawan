'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Tag, X } from 'lucide-react';

export default function SearchFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [districts, setDistricts] = useState<Array<{ id: string; name: string }>>([]);

  // Mock data - in real app, this would come from Firebase
  const states = [
    { id: 'johor', name: 'Johor' },
    { id: 'kedah', name: 'Kedah' },
    { id: 'kelantan', name: 'Kelantan' },
    { id: 'melaka', name: 'Melaka' },
    { id: 'negeri-sembilan', name: 'Negeri Sembilan' },
    { id: 'pahang', name: 'Pahang' },
    { id: 'perak', name: 'Perak' },
    { id: 'perlis', name: 'Perlis' },
    { id: 'pulau-pinang', name: 'Pulau Pinang' },
    { id: 'sabah', name: 'Sabah' },
    { id: 'sarawak', name: 'Sarawak' },
    { id: 'selangor', name: 'Selangor' },
    { id: 'terengganu', name: 'Terengganu' },
    { id: 'kuala-lumpur', name: 'Kuala Lumpur' },
    { id: 'labuan', name: 'Labuan' },
    { id: 'putrajaya', name: 'Putrajaya' },
  ];

  const categories = [
    { id: 'food', name: 'Makanan' },
    { id: 'fashion', name: 'Fesyen' },
    { id: 'services', name: 'Perkhidmatan' },
    { id: 'handicraft', name: 'Kraftangan' },
    { id: 'technology', name: 'Teknologi' },
    { id: 'health', name: 'Kesihatan' },
    { id: 'education', name: 'Pendidikan' },
    { id: 'beauty', name: 'Kecantikan' },
  ];

  // Mock districts data - in real app, this would be fetched based on selected state
  const mockDistricts = {
    'selangor': [
      { id: 'petaling', name: 'Petaling Jaya' },
      { id: 'shah-alam', name: 'Shah Alam' },
      { id: 'subang-jaya', name: 'Subang Jaya' },
      { id: 'klang', name: 'Klang' },
    ],
    'kuala-lumpur': [
      { id: 'kepong', name: 'Kepong' },
      { id: 'wangsa-maju', name: 'Wangsa Maju' },
      { id: 'setapak', name: 'Setapak' },
      { id: 'batu', name: 'Batu' },
    ],
    'penang': [
      { id: 'george-town', name: 'George Town' },
      { id: 'butterworth', name: 'Butterworth' },
      { id: 'bukit-mertajam', name: 'Bukit Mertajam' },
      { id: 'bayan-lepas', name: 'Bayan Lepas' },
    ],
  };

  useEffect(() => {
    if (selectedState && mockDistricts[selectedState as keyof typeof mockDistricts]) {
      setDistricts(mockDistricts[selectedState as keyof typeof mockDistricts]);
      setSelectedDistrict(''); // Reset district when state changes
    } else {
      setDistricts([]);
      setSelectedDistrict('');
    }
  }, [selectedState]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedCategory('');
  };

  const hasActiveFilters = searchQuery || selectedState || selectedDistrict || selectedCategory;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Penapis</h3>
        
        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200 mb-4"
          >
            <X className="h-4 w-4 mr-2" />
            Kosongkan Penapis
          </button>
        )}
      </div>

      {/* Search Query */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kata Kunci
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Cari perniagaan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* State Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Negeri
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Negeri</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* District Filter */}
      {districts.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daerah
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Daerah</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategori
        </label>
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Penapis Aktif:</h4>
          <div className="space-y-2">
            {searchQuery && (
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Kata kunci: {searchQuery}
              </span>
            )}
            {selectedState && (
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Negeri: {states.find(s => s.id === selectedState)?.name}
              </span>
            )}
            {selectedDistrict && (
              <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Daerah: {districts.find(d => d.id === selectedDistrict)?.name}
              </span>
            )}
            {selectedCategory && (
              <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                Kategori: {categories.find(c => c.id === selectedCategory)?.name}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
