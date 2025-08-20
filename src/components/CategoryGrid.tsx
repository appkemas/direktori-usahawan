'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Utensils, 
  ShoppingBag, 
  Wrench, 
  Palette, 
  Monitor, 
  Heart, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';

export default function CategoryGrid() {
  const router = useRouter();

  const categories = [
    {
      id: 'food',
      name: 'Makanan',
      nameEn: 'Food',
      icon: Utensils,
      color: 'from-orange-500 to-red-500',
      description: 'Restoran, katering, makanan tradisional'
    },
    {
      id: 'fashion',
      name: 'Fesyen',
      nameEn: 'Fashion',
      icon: ShoppingBag,
s: 'from-pink-500 to-rose-500',
      description: 'P Tendang, aksesori, kasut'
    },
    {
      id: 'services',
      name: 'Perkhidmatan',
      nameEn: 'Services',
      icon: Wrench,
      color: 'from-blue-500 to-indigo-500',
      description: 'Pembaikan, pembersihan, konsultasi'
    },
    {
      id: 'handicraft',
      name: 'Kraftangan',
      nameEn: 'Handicraft',
      icon: Palette,
      color: 'from-yellow-500 to-amber-500',
      description: 'Barangan tangan, seni tradisional'
    },
    {
      id: 'technology',
      name: 'Teknologi',
      nameEn: 'Technology',
      icon: Monitor,
      color: 'from-purple-500 to-violet-500',
      description: 'Perisian, perkhidmatan IT'
    },
    {
      id: 'health',
      name: 'Kesihatan',
      nameEn: 'Health',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      description: 'Produk kesihatan, kecergasan'
    },
    {
      id: 'education',
      name: 'Pendidikan',
      nameEn: 'Education',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
      description: 'Kelas, tutorial, bahan pembelajaran'
    },
    {
      id: 'beauty',
      name: 'Kecantikan',
      nameEn: 'Beauty',
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-500',
      description: 'Kosmetik, rawatan kecantikan'
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/search?category=${categoryId}`);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Kategori Perniagaan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Temui perniagaan mengikut kategori yang anda minati
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200 overflow-hidden relative"
              >
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative z-10 text-center">
                  <div className={`bg-gradient-to-br ${category.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg group-hover:text-gray-700 transition-colors duration-200">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-200">
                    {category.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => router.push('/search')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
          >
            Lihat Semua Kategori
          </button>
        </div>
      </div>
    </section>
  );
}
