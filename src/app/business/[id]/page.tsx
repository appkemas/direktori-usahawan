'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Building2, MapPin, Phone, Mail, Calendar, User, Play, ExternalLink } from 'lucide-react';

interface EntrepreneurData {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  address: string;
  state: string;
  district: string;
  status: string;
  createdAt: Date;
  description?: string;
  products?: string[];
  images?: string[];
  videos?: string[];
}

export default function BusinessProfile() {
  const params = useParams();
  const businessId = params.id as string;
  
  const [entrepreneurData, setEntrepreneurData] = useState<EntrepreneurData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // YouTube helper functions
  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const entrepreneurRef = doc(db, 'entrepreneurs', businessId);
        const entrepreneurSnap = await getDoc(entrepreneurRef);

        if (entrepreneurSnap.exists()) {
          const data = entrepreneurSnap.data();
          
          // Only show approved entrepreneurs
          if (data.status !== 'approved') {
            setError('Profil perniagaan ini tidak tersedia.');
            setIsLoading(false);
            return;
          }

          const entrepreneur: EntrepreneurData = {
            id: entrepreneurSnap.id,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            businessName: data.businessName || '',
            businessType: data.businessType || '',
            address: data.address || '',
            state: data.state || '',
            district: data.district || '',
            status: data.status || 'pending',
            createdAt: data.createdAt?.toDate() || new Date(),
            description: data.description || '',
            products: data.products || [],
            images: data.images || [],
            videos: data.videos || []
          };

          setEntrepreneurData(entrepreneur);
        } else {
          setError('Profil perniagaan tidak dijumpai.');
        }
      } catch (error) {
        console.error('Error fetching business profile:', error);
        setError('Ralat memuat profil perniagaan.');
      } finally {
        setIsLoading(false);
      }
    };

    if (businessId) {
      fetchBusinessProfile();
    }
  }, [businessId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat profil perniagaan...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !entrepreneurData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800">{error || 'Profil perniagaan tidak tersedia.'}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Business Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{entrepreneurData.businessName}</h1>
              <p className="text-lg text-gray-600 mb-4">{entrepreneurData.businessType}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{entrepreneurData.address}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{entrepreneurData.district}, {entrepreneurData.state}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tentang Perniagaan</h2>
              {entrepreneurData.description ? (
                <p className="text-gray-700 leading-relaxed">{entrepreneurData.description}</p>
              ) : (
                <p className="text-gray-500 italic">Tiada penerangan perniagaan tersedia.</p>
              )}
            </div>

            {/* Products Section */}
            {entrepreneurData.products && entrepreneurData.products.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Produk & Perkhidmatan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entrepreneurData.products.map((product, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{product}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images Section */}
            {entrepreneurData.images && entrepreneurData.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Galeri Gambar</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {entrepreneurData.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Gambar ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section - Updated with Thumbnails */}
            {entrepreneurData.videos && entrepreneurData.videos.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Video Perniagaan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {entrepreneurData.videos.map((video, index) => {
                    const videoId = extractYouTubeId(video);
                    const thumbnail = getYouTubeThumbnail(video);
                    const embedUrl = getYouTubeEmbedUrl(video);
                    
                    return (
                      <div key={index} className="relative group">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          {videoId ? (
                            <div className="relative">
                              {/* Thumbnail with Play Button */}
                              <img
                                src={thumbnail}
                                alt={`Video ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {/* Play Button Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-200">
                                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200">
                                  <Play className="w-8 h-8 text-white ml-1" />
                                </div>
                              </div>
                              {/* Video Modal Trigger */}
                              <button
                                onClick={() => {
                                  // Open video in new tab
                                  if (embedUrl) {
                                    window.open(embedUrl, '_blank');
                                  }
                                }}
                                className="absolute inset-0 w-full h-full cursor-pointer"
                                title="Klik untuk tonton video"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ExternalLink className="h-8 w-8 text-gray-400" />
                              <span className="ml-2 text-gray-500">Video Link</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Video Info */}
                        <div className="mt-2 text-center">
                          <p className="text-sm text-gray-600">
                            Video {index + 1}
                          </p>
                          <p className="text-xs text-gray-400">
                            Klik untuk tonton di YouTube
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Video Instructions */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 text-center">
                    💡 Klik pada thumbnail video untuk membuka video di tab baharu YouTube
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Maklumat Perhubungan</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-3" />
                  <span>{entrepreneurData.name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>{entrepreneurData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-3" />
                  <span>{entrepreneurData.phone}</span>
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Maklumat Perniagaan</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>Daftar: {entrepreneurData.createdAt.toLocaleDateString('ms-MY')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{entrepreneurData.district}, {entrepreneurData.state}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
