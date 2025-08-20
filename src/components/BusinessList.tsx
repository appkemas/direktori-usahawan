'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, MessageCircle, Star, ArrowRight } from 'lucide-react';

export default function BusinessList() {
  const router = useRouter();
  const [sortBy, setSortBy] = useState('newest');

  // Mock data - in real app, this would come from Firebase with filters applied
  const businesses = [
    {
      id: '1',
      businessName: 'Warung Mak Cik Aminah',
      category: 'Makanan',
      description: 'Makanan tradisional Melayu yang sedap dan berkualiti. Khasiat dan rasa yang tidak dapat ditandingi.',
      location: 'Kuala Lumpur, Kepong',
      rating: 4.8,
      reviewCount: 127,
      image: '/api/placeholder/300/200',
      phone: '+60123456789',
      whatsapp: '+60123456789',
      priceRange: 'RM 5 - RM 25',
      isVerified: true
    },
    {
      id: '2',
      businessName: 'Batik Craft Enterprise',
      category: 'Kraftangan',
      description: 'Batik tradisional dengan reka bentuk moden. Kualiti premium untuk semua majlis.',
      location: 'Kelantan, Kota Bharu',
      rating: 4.9,
      reviewCount: 89,
      image: '/api/placeholder/300/200',
      phone: '+60123456788',
      whatsapp: '+60123456788',
      priceRange: 'RM 50 - RM 500',
      isVerified: true
    },
    {
      id: '3',
      businessName: 'Tech Solutions Pro',
      category: 'Teknologi',
      description: 'Perkhidmatan IT dan pembangunan laman web. Penyelesaian digital untuk perniagaan anda.',
      location: 'Selangor, Petaling Jaya',
      rating: 4.7,
      reviewCount: 156,
      image: '/api/placeholder/300/200',
      phone: '+60123456787',
      whatsapp: '+60123456787',
      priceRange: 'RM 500 - RM 5000',
      isVerified: true
    },
    {
      id: '4',
      businessName: 'Fashion Boutique Sari',
      category: 'Fesyen',
      description: 'Pakaian tradisional dan moden untuk semua peringkat umur. Gaya yang elegan dan selesa.',
      location: 'Penang, George Town',
      rating: 4.6,
      reviewCount: 203,
      image: '/api/placeholder/300/200',
      phone: '+60123456786',
      whatsapp: '+60123456786',
      priceRange: 'RM 30 - RM 300',
      isVerified: true
    },
    {
      id: '5',
      businessName: 'Green Health Store',
      category: 'Kesihatan',
      description: 'Produk kesihatan semula jadi dan organik. Kesihatan yang optimum untuk keluarga anda.',
      location: 'Selangor, Shah Alam',
      rating: 4.5,
      reviewCount: 78,
      image: '/api/placeholder/300/200',
      phone: '+60123456785',
      whatsapp: '+60123456785',
      priceRange: 'RM 20 - RM 200',
      isVerified: false
    },
    {
      id: '6',
      businessName: 'Creative Learning Center',
      category: 'Pendidikan',
      description: 'Kelas seni dan kreativiti untuk kanak-kanak dan dewasa. Mengembangkan bakat dalam suasana yang menyeronokkan.',
      location: 'Kuala Lumpur, Wangsa Maju',
      rating: 4.9,
      reviewCount: 134,
      image: '/api/placeholder/300/200',
      phone: '+60123456784',
      whatsapp: '+60123456784',
      priceRange: 'RM 80 - RM 150',
      isVerified: true
    }
  ];

  const handleViewBusiness = (businessId: string) => {
    router.push(`/business/${businessId}`);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_blank');
  };

  const handleWhatsApp = (whatsapp: string) => {
    const message = 'Hai! Saya berminat dengan perniagaan anda.';
    const url = `https://wa.me/${whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div>
      {/* Header with sort options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {businesses.length} Perniagaan Dijumpai
          </h2>
          <p className="text-gray-600 text-sm">
            Urutkan mengikut pilihan anda
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Terbaru</option>
            <option value="rating">Penilaian Tertinggi</option>
            <option value="name">Nama A-Z</option>
            <option value="price-low">Harga Rendah</option>
            <option value="price-high">Harga Tinggi</option>
          </select>
        </div>
      </div>

      {/* Business Cards */}
      <div className="space-y-6">
        {businesses.map((business) => (
          <div
            key={business.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex flex-col md:flex-row">
              {/* Business Image */}
              <div className="md:w-48 h-48 md:h-auto bg-gray-200 flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">Gambar Perniagaan</span>
                </div>
              </div>

              {/* Business Info */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {business.businessName}
                      </h3>
                      {business.isVerified && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          ✓ Disahkan
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {business.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {business.priceRange}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {business.description}
                </p>

                {/* Location and Rating */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2 sm:mb-0">
                    <MapPin className="h-4 w-4 mr-1" />
                    {business.location}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(business.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {business.rating} ({business.reviewCount} ulasan)
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => handleCall(business.phone)}
                    className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Panggil
                  </button>
                  
                  <button
                    onClick={() => handleWhatsApp(business.whatsapp)}
                    className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </button>
                  
                  <button
                    onClick={() => handleViewBusiness(business.id)}
                    className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200"
                  >
                    Lihat Butiran
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Sebelumnya
          </button>
          <button className="px-3 py-2 text-sm text-white bg-blue-600 border border-blue-600 rounded-lg">
            1
          </button>
          <button className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Seterusnya
          </button>
        </nav>
      </div>
    </div>
  );
}
