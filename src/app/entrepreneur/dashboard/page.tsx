'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Building2, LogOut, User, Mail, Phone, MapPin, Edit, Save, X, AlertCircle, Image, Video, Plus, Trash2, Link } from 'lucide-react';

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
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
}

export default function EntrepreneurDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entrepreneurId = searchParams.get('id');
  
  const [entrepreneurData, setEntrepreneurData] = useState<EntrepreneurData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    businessName: '',
    description: ''
  });

  // Image and Video management states
  const [newImage, setNewImage] = useState('');
  const [newVideo, setNewVideo] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [isAddingVideo, setIsAddingVideo] = useState(false);

  // Check authentication and load entrepreneur data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/entrepreneur/login');
        return;
      }

      if (!entrepreneurId) {
        console.error('No entrepreneur ID provided');
        router.push('/entrepreneur/login');
        return;
      }

      try {
        // Load entrepreneur data from Firestore
        const entrepreneurRef = doc(db, 'entrepreneurs', entrepreneurId);
        const entrepreneurSnap = await getDoc(entrepreneurRef);

        if (entrepreneurSnap.exists()) {
          const data = entrepreneurSnap.data();
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
            videos: data.videos || [],
            socialMedia: data.socialMedia || {}
          };

          setEntrepreneurData(entrepreneur);
          setEditForm({
            name: entrepreneur.name,
            phone: entrepreneur.phone,
            businessName: entrepreneur.businessName,
            description: entrepreneur.description || ''
          });
        } else {
          console.error('Entrepreneur not found');
          router.push('/entrepreneur/login');
        }
      } catch (error) {
        console.error('Error loading entrepreneur data:', error);
        router.push('/entrepreneur/login');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [entrepreneurId, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/entrepreneur/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSave = async () => {
    if (!entrepreneurData) return;

    try {
      const entrepreneurRef = doc(db, 'entrepreneurs', entrepreneurData.id);
      await updateDoc(entrepreneurRef, {
        name: editForm.name,
        phone: editForm.phone,
        businessName: editForm.businessName,
        description: editForm.description,
        updatedAt: new Date()
      });

      // Update local state
      setEntrepreneurData(prev => prev ? {
        ...prev,
        name: editForm.name,
        phone: editForm.phone,
        businessName: editForm.businessName,
        description: editForm.description
      } : null);

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating entrepreneur data:', error);
    }
  };

  // Add image function
  const handleAddImage = async () => {
    if (!entrepreneurData || !newImage.trim()) return;

    try {
      const entrepreneurRef = doc(db, 'entrepreneurs', entrepreneurData.id);
      const updatedImages = [...(entrepreneurData.images || []), newImage];
      
      await updateDoc(entrepreneurRef, {
        images: updatedImages,
        updatedAt: new Date()
      });

      // Update local state
      setEntrepreneurData(prev => prev ? {
        ...prev,
        images: updatedImages
      } : null);

      setNewImage('');
      setIsAddingImage(false);
    } catch (error) {
      console.error('Error adding image:', error);
    }
  };

  // Remove image function
  const handleRemoveImage = async (imageIndex: number) => {
    if (!entrepreneurData) return;

    try {
      const entrepreneurRef = doc(db, 'entrepreneurs', entrepreneurData.id);
      const updatedImages = entrepreneurData.images?.filter((_, index) => index !== imageIndex) || [];
      
      await updateDoc(entrepreneurRef, {
        images: updatedImages,
        updatedAt: new Date()
      });

      // Update local state
      setEntrepreneurData(prev => prev ? {
        ...prev,
        images: updatedImages
      } : null);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  // Add video function
  const handleAddVideo = async () => {
    if (!entrepreneurData || !newVideo.trim()) return;

    try {
      const entrepreneurRef = doc(db, 'entrepreneurs', entrepreneurData.id);
      const updatedVideos = [...(entrepreneurData.videos || []), newVideo];
      
      await updateDoc(entrepreneurRef, {
        videos: updatedVideos,
        updatedAt: new Date()
      });

      // Update local state
      setEntrepreneurData(prev => prev ? {
        ...prev,
        videos: updatedVideos
      } : null);

      setNewVideo('');
      setIsAddingVideo(false);
    } catch (error) {
      console.error('Error adding video:', error);
    }
  };

  // Remove video function
  const handleRemoveVideo = async (videoIndex: number) => {
    if (!entrepreneurData) return;

    try {
      const entrepreneurRef = doc(db, 'entrepreneurs', entrepreneurData.id);
      const updatedVideos = entrepreneurData.videos?.filter((_, index) => index !== videoIndex) || [];
      
      await updateDoc(entrepreneurRef, {
        videos: updatedVideos,
        updatedAt: new Date()
      });

      // Update local state
      setEntrepreneurData(prev => prev ? {
        ...prev,
        videos: updatedVideos
      } : null);
    } catch (error) {
      console.error('Error removing video:', error);
    }
  };

  // Extract YouTube video ID and get thumbnail
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat maklumat usahawan...</p>
        </div>
      </div>
    );
  }

  if (!entrepreneurData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Usahawan</h1>
                <p className="text-sm text-gray-600">{entrepreneurData.businessName}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'profile', name: 'Profil', icon: User },
              { id: 'images', name: 'Gambar', icon: Image },
              { id: 'videos', name: 'Video', icon: Video }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors duration-200`}
              >
                <tab.icon className="h-5 w-5 inline mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Maklumat Perniagaan</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Batal
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Maklumat Peribadi
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nama</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{entrepreneurData.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Emel</p>
                      <p className="text-gray-900">{entrepreneurData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefon</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{entrepreneurData.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Maklumat Perniagaan
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nama Perniagaan</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.businessName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, businessName: e.target.value }))}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{entrepreneurData.businessName}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Jenis Perniagaan</p>
                    <p className="text-gray-900">{entrepreneurData.businessType}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Alamat</p>
                    <p className="text-gray-900">{entrepreneurData.address}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Lokasi</p>
                    <p className="text-gray-900">{entrepreneurData.district}, {entrepreneurData.state}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      entrepreneurData.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : entrepreneurData.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entrepreneurData.status === 'approved' ? 'Diluluskan' : 
                       entrepreneurData.status === 'pending' ? 'Menunggu Kelulusan' : 'Ditolak'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Description - Add this section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Tentang Perniagaan</h3>
              {isEditing ? (
                <div>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ceritakan tentang perniagaan anda, produk atau perkhidmatan yang ditawarkan..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Penerangan ini akan dipaparkan kepada pelanggan yang melawat profil perniagaan anda.
                  </p>
                </div>
              ) : (
                <div>
                  {entrepreneurData.description ? (
                    <p className="text-gray-700 leading-relaxed">{entrepreneurData.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">Tiada penerangan perniagaan tersedia. Klik "Edit" untuk menambah penerangan.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Galeri Gambar</h2>
              <button
                onClick={() => setIsAddingImage(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Gambar
              </button>
            </div>

            {/* Add Image Modal */}
            {isAddingImage && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Tambah Gambar Baru</h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Masukkan URL gambar (contoh: https://example.com/image.jpg)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddImage}
                    disabled={!newImage.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Tambah
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingImage(false);
                      setNewImage('');
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* Images Grid */}
            {entrepreneurData.images && entrepreneurData.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {entrepreneurData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Gambar ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Tiada gambar ditambah.</p>
                <p className="text-sm">Klik "Tambah Gambar" untuk mula.</p>
              </div>
            )}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Galeri Video</h2>
              <button
                onClick={() => setIsAddingVideo(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Video
              </button>
            </div>

            {/* Add Video Modal */}
            {isAddingVideo && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Tambah Video Baru</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newVideo}
                    onChange={(e) => setNewVideo(e.target.value)}
                    placeholder="Masukkan URL YouTube (contoh: https://youtube.com/watch?v=...)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddVideo}
                      disabled={!newVideo.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Tambah
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingVideo(false);
                        setNewVideo('');
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Videos Grid */}
            {entrepreneurData.videos && entrepreneurData.videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                            {/* Video Modal Trigger */}
                            <button
                              onClick={() => {
                                // Open video in modal or new tab
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
                            <Link className="h-8 w-8 text-gray-400" />
                            <span className="ml-2 text-gray-500">Video Link</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Video Info */}
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 truncate">
                          Video {index + 1}
                        </p>
                        {videoId && (
                          <p className="text-xs text-gray-400">
                            YouTube ID: {videoId}
                          </p>
                        )}
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveVideo(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="Padam video"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Tiada video ditambah.</p>
                <p className="text-sm">Klik "Tambah Video" untuk mula.</p>
              </div>
            )}

            {/* Video Preview Modal */}
            {entrepreneurData.videos && entrepreneurData.videos.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Cara Tonton Video:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Klik pada thumbnail video untuk membuka video di tab baharu</li>
                  <li>• Video akan dibuka di YouTube dalam tab baharu</li>
                  <li>• Ini mengelakkan masalah sambungan dan lebih selamat</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Status Message */}
        {entrepreneurData.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-yellow-800">
                Akaun anda masih dalam proses kelulusan. Sila tunggu kelulusan daripada pentadbir daerah.
              </p>
            </div>
          </div>
        )}

        {entrepreneurData.status === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-800">
                Akaun anda telah ditolak. Sila hubungi pentadbir daerah untuk maklumat lanjut.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
