'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Building2, MapPin, Search, Filter } from 'lucide-react';

interface Entrepreneur {
  id: string;
  name: string;
  businessName: string;
  businessType: string;
  district: string;
  state: string;
  status: string;
  description?: string;
  createdAt: Date;
}

export default function SearchPage() {
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [filteredEntrepreneurs, setFilteredEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBusinessType, setSelectedBusinessType] = useState('');

  const statesAndDistricts: { [key: string]: string[] } = {
    'Johor': ['Batu Pahat', 'Johor Bahru', 'Kluang', 'Kota Tinggi', 'Kulai', 'Mersing', 'Muar', 'Pontian', 'Segamat'],
    'Kedah': ['Baling', 'Bandar Baharu', 'Kota Setar', 'Kuala Muda', 'Kubang Pasu', 'Kulim', 'Langkawi', 'Padang Terap', 'Pendang', 'Pokok Sena', 'Sik', 'Yan'],
    'Kelantan': ['Bachok', 'Gua Musang', 'Jeli', 'Kota Bharu', 'Kuala Krai', 'Machang', 'Pasir Mas', 'Pasir Puteh', 'Tanah Merah', 'Tumpat'],
    'Melaka': ['Alor Gajah', 'Jasin', 'Melaka Tengah'],
    'Negeri Sembilan': ['Jelebu', 'Jempol', 'Kuala Pilah', 'Port Dickson', 'Rembau', 'Seremban', 'Tampin'],
    'Pahang': ['Bentong', 'Bera', 'Cameron Highlands', 'Jerantut', 'Kuantan', 'Lipis', 'Maran', 'Pekan', 'Raub', 'Rompin', 'Temerloh'],
    'Perak': ['Batang Padang', 'Hilir Perak', 'Hulu Perak', 'Kampar', 'Kerian', 'Kinta', 'Kuala Kangsar', 'Larut, Matang dan Selama', 'Manjung', 'Muallim', 'Perak Tengah', 'Seberang Perak'],
    'Perlis': ['Arau', 'Kangar'],
    'Pulau Pinang': ['Barat Daya', 'Seberang Perai Selatan', 'Seberang Perai Tengah', 'Seberang Perai Utara', 'Timur Laut'],
    'Sabah': ['Beaufort', 'Beluran', 'Keningau', 'Kinabatangan', 'Kota Belud', 'Kota Kinabalu', 'Kota Marudu', 'Kuala Penyu', 'Kudat', 'Kunak', 'Lahad Datu', 'Nabawan', 'Papar', 'Penampang', 'Putatan', 'Ranau', 'Sandakan', 'Semporna', 'Sipitang', 'Tambunan', 'Tawau', 'Tenom', 'Tongod', 'Tuaran'],
    'Sarawak': ['Asajaya', 'Ba\'kelalan', 'Balingian', 'Baram', 'Batang Ai', 'Bau', 'Belaga', 'Belawai', 'Betong', 'Bintulu', 'Buchanan', 'Bukit Mabong', 'Dalat', 'Daro', 'Debak', 'Dudong', 'Engkilili', 'Julau', 'Kabong', 'Kanowit', 'Kapit', 'Kemena', 'Kota Samarahan', 'Lawas', 'Limbang', 'Lingga', 'Lubok Antu', 'Lundu', 'Machan', 'Marudi', 'Matu', 'Meradong', 'Miri', 'Mukah', 'Nanga Merit', 'Niah', 'Oya', 'Pakan', 'Pusa', 'Roban', 'Sadong Jaya', 'Samarahan', 'Saratok', 'Sebauh', 'Sebuyau', 'Selangau', 'Serian', 'Sibuti', 'Simunjan', 'Song', 'Spaoh', 'Sri Aman', 'Subis', 'Tanjong Manis', 'Tatau', 'Tebedu', 'Tinggi'],
    'Selangor': ['Gombak', 'Hulu Langat', 'Hulu Selangor', 'Klang', 'Kuala Langat', 'Kuala Selangor', 'Petaling', 'Sabak Bernam', 'Sepang'],
    'Terengganu': ['Besut', 'Dungun', 'Hulu Terengganu', 'Kemaman', 'Kuala Nerus', 'Kuala Terengganu', 'Marang', 'Setiu'],
    'W.P. Kuala Lumpur, Putrajaya & Labuan': ['Kuala Lumpur', 'Putrajaya', 'Labuan']
  };

  const businessTypes = [
    'Makanan & Minuman',
    'Fesyen & Pakaian',
    'Kesihatan & Kecantikan',
    'Teknologi & Digital',
    'Pertanian & Ternakan',
    'Kraftangan & Seni',
    'Perkhidmatan',
    'Lain-lain'
  ];

  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      try {
        console.log('Fetching entrepreneurs from Firestore...');
        const entrepreneursRef = collection(db, 'entrepreneurs');
        
        // Simplified query without orderBy to avoid index requirement
        const q = query(
          entrepreneursRef,
          where('status', '==', 'approved')
        );
        
        const querySnapshot = await getDocs(q);
        const entrepreneursList: Entrepreneur[] = [];
        
        console.log('Query snapshot size:', querySnapshot.size);
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Entrepreneur data:', data);
          
          entrepreneursList.push({
            id: doc.id,
            name: data.name || '',
            businessName: data.businessName || '',
            businessType: data.businessType || '',
            district: data.district || '',
            state: data.state || '',
            status: data.status || 'pending',
            description: data.description || '',
            createdAt: data.createdAt?.toDate() || new Date()
          });
        });
        
        console.log('Processed entrepreneurs list:', entrepreneursList);
        
        // Sort in JavaScript instead of Firestore
        entrepreneursList.sort((a, b) => {
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
        
        setEntrepreneurs(entrepreneursList);
        setFilteredEntrepreneurs(entrepreneursList);
      } catch (error) {
        console.error('Error fetching entrepreneurs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntrepreneurs();
  }, []);

  useEffect(() => {
    let filtered = entrepreneurs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(entrepreneur =>
        entrepreneur.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entrepreneur.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entrepreneur.businessType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entrepreneur.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entrepreneur.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by state
    if (selectedState) {
      filtered = filtered.filter(entrepreneur => entrepreneur.state === selectedState);
    }

    // Filter by district
    if (selectedDistrict) {
      filtered = filtered.filter(entrepreneur => entrepreneur.district === selectedDistrict);
    }

    // Filter by business type
    if (selectedBusinessType) {
      filtered = filtered.filter(entrepreneur => entrepreneur.businessType === selectedBusinessType);
    }

    setFilteredEntrepreneurs(filtered);
  }, [searchTerm, selectedState, selectedDistrict, selectedBusinessType, entrepreneurs]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedBusinessType('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cari Usahawan</h1>
          <p className="text-lg text-gray-600">Temui usahawan desa yang telah diluluskan</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama perniagaan, pemilik, atau lokasi..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Negeri</label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict(''); // Reset district when state changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Semua Negeri</option>
                {Object.keys(statesAndDistricts).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daerah</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedState}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Semua Daerah</option>
                {selectedState && statesAndDistricts[selectedState]?.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Business Type Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Perniagaan</label>
            <select
              value={selectedBusinessType}
              onChange={(e) => setSelectedBusinessType(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Semua Jenis</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedState || selectedDistrict || selectedBusinessType) && (
            <div className="mt-4">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                <Filter className="h-4 w-4 mr-2" />
                Kosongkan Penapis
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Hasil Carian ({filteredEntrepreneurs.length} usahawan)
            </h2>
          </div>

          {isLoading ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p>Memuat hasil carian...</p>
            </div>
          ) : filteredEntrepreneurs.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Tiada usahawan dijumpai.</p>
              <p className="text-sm">Cuba ubah penapis carian anda.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredEntrepreneurs.map((entrepreneur) => (
                <div key={entrepreneur.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{entrepreneur.businessName}</h3>
                          <p className="text-sm text-gray-500">{entrepreneur.businessType}</p>
                        </div>
                      </div>
                      
                      <div className="ml-13 space-y-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Pemilik:</span> {entrepreneur.name}
                        </p>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {entrepreneur.district}, {entrepreneur.state}
                        </div>
                        {entrepreneur.description && (
                          <p className="text-sm text-gray-600 mt-2">{entrepreneur.description}</p>
                        )}
                      </div>
                    </div>

                    <a
                      href={`/business/${entrepreneur.id}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-purple-600 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                    >
                      Lihat Profil
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Debug Info - Remove this after confirming it works */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Debug Info:</h3>
            <p className="text-sm text-gray-600">Total entrepreneurs: {entrepreneurs.length}</p>
            <p className="text-sm text-gray-600">Filtered entrepreneurs: {filteredEntrepreneurs.length}</p>
            <p className="text-sm text-gray-600">Loading: {isLoading ? 'Yes' : 'No'}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
