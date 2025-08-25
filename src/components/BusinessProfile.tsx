'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Star, 
  Clock, 
  Globe, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BusinessProfileProps {
  businessId: string;
}

export default function BusinessProfile({ businessId }: BusinessProfileProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - in real app, this would come from Firebase
  const business = {
    id: businessId,
    businessName: 'Warung Mak Cik Aminah',
    category: 'Makanan',
    description: 'Warung Mak Cik Aminah adalah perniagaan makanan tradisional Melayu yang telah beroperasi selama lebih 20 tahun. Kami mengkhususkan dalam masakan Melayu tradisional yang menggunakan bahan-bahan segar dan berkualiti tinggi. Setiap hidangan disediakan dengan penuh kasih sayang dan mengikut resipi turun-temurun yang telah diwarisi dari generasi ke generasi.',
    longDescription: `Warung Mak Cik Aminah bermula sebagai perniagaan kecil di rumah pada tahun 2003. Dengan sokongan keluarga dan jiran tetangga, perniagaan ini berkembang pesat sehingga membuka premis tetap di kawasan ini.

Kami terkenal dengan nasi lemak, rendang daging, ayam goreng berempah, dan pelbagai kuih tradisional. Setiap hidangan disediakan segar setiap hari menggunakan bahan-bahan tempatan yang berkualiti.

Selain makanan utama, kami juga menyediakan perkhidmatan katering untuk majlis-majlis khas seperti majlis perkahwinan, hari jadi, dan majlis korporat.`,
    location: {
      address: 'No. 123, Jalan Kepong, Taman Kepong Indah',
      city: 'Kuala Lumpur',
      state: 'Kuala Lumpur',
      postalCode: '52100',
      coordinates: { lat: 3.1390, lng: 101.6869 }
    },
    contact: {
      phone: '+60123456789',
      whatsapp: '+60123456789',
      email: 'makcikaminah@gmail.com'
    },
    businessHours: {
      monday: '7:00 AM - 10:00 PM',
      tuesday: '7:00 AM - 10:00 PM',
      wednesday: '7:00 AM - 10:00 PM',
      thursday: '7:00 AM - 10:00 PM',
      friday: '7:00 AM - 11:00 PM',
      saturday: '7:00 AM - 11:00 PM',
      sunday: '7:00 AM - 9:00 PM'
    },
    rating: 4.8,
    reviewCount: 127,
    priceRange: 'RM 5 - RM 25',
    isVerified: true,
    images: [
      '/api/placeholder/800/400',
      '/api/placeholder/800/400',
      '/api/placeholder/800/400',
      '/api/placeholder/800/400'
    ],
    youtubeVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    googleMapsLink: 'https://maps.google.com/?q=3.1390,101.6869',
    specialties: [
      'Nasi Lemak',
      'Rendang Daging',
      'Ayam Goreng Berempah',
      'Kuih Tradisional',
      'Katering Majlis'
    ],
    awards: [
      'Anugerah Usahawan Terbaik KEMAS 2022',
      'Sijil Halal JAKIM',
      'Anugerah Kualiti Makanan 2021'
    ]
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === business.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? business.images.length - 1 : prev - 1
    );
  };

  const handleCall = () => {
    window.open(`tel:${business.contact.phone}`, '_blank');
  };

  const handleWhatsApp = () => {
    const message = `Hai! Saya berminat dengan perniagaan ${business.businessName}. Boleh saya dapatkan maklumat lanjut?`;
    const url = `https://wa.me/${business.contact.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Kembali
      </button>

      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-200 rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
              {business.category}
            </span>
            {business.isVerified && (
              <span className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                ✓ Disahkan
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            {business.businessName}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {renderStars(business.rating)}
              <span className="ml-2 text-lg">{business.rating}</span>
            </div>
            <span className="text-lg">({business.reviewCount} ulasan)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Business Description */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang Perniagaan</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{business.description}</p>
            <p className="text-gray-700 leading-relaxed">{business.longDescription}</p>
          </div>

          {/* Product Gallery */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Galeri Produk</h2>
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-200">
                <div className="w-full h-64 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-gray-600">Gambar {currentImageIndex + 1}</span>
                </div>
              </div>
              
              {/* Gallery Navigation */}
              <button
                onClick={previousImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
              
              {/* Image Indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {business.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* YouTube Video */}
          {business.youtubeVideo && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Perniagaan</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src={business.youtubeVideo}
                  title="Business Video"
                  className="w-full h-64"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Google Maps */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lokasi</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-200">
              <div className="w-full h-64 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Peta Google Maps</p>
                  <a
                    href={business.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Buka di Google Maps
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Alamat:</h3>
              <p className="text-gray-700">
                {business.location.address}<br />
                {business.location.city}, {business.location.state} {business.location.postalCode}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Hubungi Kami</h3>
            
            <div className="space-y-4">
              <button
                onClick={handleCall}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Phone className="h-5 w-5 mr-2" />
                Panggil Sekarang
              </button>
              
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-3" />
                <span>{business.contact.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MessageCircle className="h-4 w-4 mr-3" />
                <span>{business.contact.whatsapp}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Globe className="h-4 w-4 mr-3" />
                <span>{business.contact.email}</span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Waktu Operasi</h3>
            <div className="space-y-2">
              {Object.entries(business.businessHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="text-gray-600 capitalize">{day}</span>
                  <span className="text-gray-900 font-medium">{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Khasiat</h3>
            <div className="space-y-2">
              {business.specialties.map((specialty, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                  <span className="text-gray-700">{specialty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Anugerah & Pengiktirafan</h3>
            <div className="space-y-2">
              {business.awards.map((award, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3" />
                  <span className="text-gray-700 text-sm">{award}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
