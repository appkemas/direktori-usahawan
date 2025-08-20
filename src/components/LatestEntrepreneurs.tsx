'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Building2, MapPin, Eye } from 'lucide-react';

interface Entrepreneur {
  id: string;
  name: string;
  businessName: string;
  businessType: string;
  district: string;
  state: string;
  status: string;
  createdAt: Date;
}

export default function LatestEntrepreneurs() {
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestEntrepreneurs = async () => {
      try {
        const entrepreneursRef = collection(db, 'entrepreneurs');
        
        // Simplified query without orderBy to avoid index requirement
        const q = query(
          entrepreneursRef,
          where('status', '==', 'approved')
        );
        
        const querySnapshot = await getDocs(q);
        const entrepreneursList: Entrepreneur[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          entrepreneursList.push({
            id: doc.id,
            name: data.name || '',
            businessName: data.businessName || '',
            businessType: data.businessType || '',
            district: data.district || '',
            state: data.state || '',
            status: data.status || 'pending',
            createdAt: data.createdAt?.toDate() || new Date()
          });
        });
        
        // Sort in JavaScript instead of Firestore
        entrepreneursList.sort((a, b) => {
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
        
        // Limit to 6 most recent
        setEntrepreneurs(entrepreneursList.slice(0, 6));
      } catch (error) {
        console.error('Error fetching latest entrepreneurs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestEntrepreneurs();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat usahawan terkini...</p>
          </div>
        </div>
      </section>
    );
  }

  if (entrepreneurs.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Usahawan Terkini</h2>
            <p className="text-gray-600">Belum ada usahawan yang diluluskan. Sila daftar untuk menjadi yang pertama!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Usahawan Terkini</h2>
          <p className="text-lg text-gray-600">Temui usahawan desa yang telah berjaya</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entrepreneurs.map((entrepreneur) => (
            <div key={entrepreneur.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{entrepreneur.businessName}</h3>
                  <p className="text-sm text-gray-500">{entrepreneur.businessType}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Pemilik:</span> {entrepreneur.name}
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {entrepreneur.district}, {entrepreneur.state}
                </div>
              </div>

              <a
                href={`/business/${entrepreneur.id}`}
                className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
              >
                <Eye className="h-4 w-4 mr-1" />
                Lihat Profil
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
