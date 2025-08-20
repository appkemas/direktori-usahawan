'use client';

import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Plus, 
  Edit, 
  Clock,
  User,
  MapPin
} from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'approval',
      action: 'Permohonan diluluskan',
      target: 'Warung Mak Cik Aminah',
      user: 'Admin Selangor',
      time: '2 minit yang lalu',
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      id: 2,
      type: 'rejection',
      action: 'Permohonan ditolak',
      target: 'Tech Solutions Pro',
      user: 'Admin KL',
      time: '15 minit yang lalu',
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    {
      id: 3,
      type: 'new',
      action: 'Usahawan baru didaftar',
      target: 'Batik Craft Enterprise',
      user: 'Admin Kelantan',
      time: '1 jam yang lalu',
      icon: Plus,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      id: 4,
      type: 'edit',
      action: 'Maklumat usahawan dikemas kini',
      target: 'Fashion Boutique Sari',
      user: 'Admin Penang',
      time: '2 jam yang lalu',
      icon: Edit,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 5,
      type: 'pending',
      action: 'Permohonan baru diterima',
      target: 'Green Health Store',
      user: 'Admin Selangor',
      time: '3 jam yang lalu',
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    },
    {
      id: 6,
      type: 'location',
      action: 'Daerah baru ditambah',
      target: 'Taman Subang Jaya',
      user: 'Admin HQ',
      time: '4 jam yang lalu',
      icon: MapPin,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return CheckCircle;
      case 'rejection':
        return XCircle;
      case 'new':
        return Plus;
      case 'edit':
        return Edit;
      case 'pending':
        return Clock;
      case 'location':
        return MapPin;
      default:
        return User;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'approval':
        return 'text-green-500 bg-green-100';
      case 'rejection':
        return 'text-red-500 bg-red-100';
      case 'new':
        return 'text-blue-500 bg-blue-100';
      case 'edit':
        return 'text-yellow-500 bg-yellow-100';
      case 'pending':
        return 'text-orange-500 bg-orange-100';
      case 'location':
        return 'text-purple-500 bg-purple-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Aktiviti Terkini</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Lihat Semua
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flow-root">
          <ul className="divide-y divide-gray-200">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <li key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">
                          oleh {activity.user}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded">
                        <span className="sr-only">Lihat butiran</span>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Diluluskan</p>
              <p className="text-lg font-semibold text-green-600">18</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Ditolak</p>
              <p className="text-lg font-semibold text-red-600">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Baru</p>
              <p className="text-lg font-semibold text-blue-600">23</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Menunggu</p>
              <p className="text-lg font-semibold text-orange-600">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
