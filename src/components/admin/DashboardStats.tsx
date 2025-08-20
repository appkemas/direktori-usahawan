'use client';

import React from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  MapPin 
} from 'lucide-react';

export default function DashboardStats() {
  const stats = [
    {
      name: 'Jumlah Usahawan',
      value: '1,247',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-blue-500',
      description: 'Dari bulan lepas'
    },
    {
      name: 'Menunggu Kelulusan',
      value: '23',
      change: '+5',
      changeType: 'increase',
      icon: Clock,
      color: 'bg-yellow-500',
      description: 'Permohonan baru'
    },
    {
      name: 'Diluluskan',
      value: '1,198',
      change: '+8%',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Tahun ini'
    },
    {
      name: 'Ditolak',
      value: '26',
      change: '-3',
      changeType: 'decrease',
      icon: XCircle,
      color: 'bg-red-500',
      description: 'Bulan ini'
    },
    {
      name: 'Negeri Aktif',
      value: '14',
      change: '100%',
      changeType: 'neutral',
      icon: MapPin,
      color: 'bg-purple-500',
      description: 'Semua negeri'
    },
    {
      name: 'Pertumbuhan',
      value: '15.2%',
      change: '+2.1%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      description: 'Bulan ini'
    }
  ];

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600 bg-green-100';
      case 'decrease':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return '↗';
      case 'decrease':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Statistik Keseluruhan</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${getChangeColor(stat.changeType)} px-2 py-1 rounded-full`}>
                          <span className="mr-1">{getChangeIcon(stat.changeType)}</span>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Summary */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Aktiviti Terkini</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Permohonan baru hari ini</span>
              <span className="text-sm font-medium text-gray-900">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Diluluskan hari ini</span>
              <span className="text-sm font-medium text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ditolak hari ini</span>
              <span className="text-sm font-medium text-gray-900">2</span>
            </div>
          </div>
        </div>

        {/* Top States */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Negeri Teratas</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Selangor</span>
              <span className="text-sm font-medium text-gray-900">234 usahawan</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Kuala Lumpur</span>
              <span className="text-sm font-medium text-gray-900">198 usahawan</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Johor</span>
              <span className="text-sm font-medium text-gray-900">156 usahawan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
