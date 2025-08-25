'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Users, 
  MapPin, 
  Download, 
  Eye, 
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      name: 'Tambah Usahawan',
      description: 'Daftar usahawan baru',
      icon: Plus,
      color: 'bg-blue-500',
      href: '/admin/entrepreneurs/new',
      action: () => router.push('/admin/entrepreneurs/new')
    },
    {
      name: 'Lihat Permohonan',
      description: 'Semak permohonan yang menunggu',
      icon: Eye,
      color: 'bg-yellow-500',
      href: '/admin/entrepreneurs?status=pending',
      action: () => router.push('/admin/entrepreneurs?status=pending')
    },
    {
      name: 'Kelulusan Bulk',
      description: 'Lulus/tolak berbilang permohonan',
      icon: CheckCircle,
      color: 'bg-green-500',
      href: '/admin/entrepreneurs/bulk-approval',
      action: () => router.push('/admin/entrepreneurs/bulk-approval')
    },
    {
      name: 'Urus Negeri',
      description: 'Tambah/edit negeri dan daerah',
      icon: MapPin,
      color: 'bg-purple-500',
      href: '/admin/locations',
      action: () => router.push('/admin/locations')
    },
    {
      name: 'Eksport Data',
      description: 'Muat turun laporan dalam CSV/Excel',
      icon: Download,
      color: 'bg-indigo-500',
      href: '/admin/export',
      action: () => router.push('/admin/export')
    },
    {
      name: 'Tetapan Sistem',
      description: 'Konfigurasi sistem dan pengguna',
      icon: Settings,
      color: 'bg-gray-500',
      href: '/admin/settings',
      action: () => router.push('/admin/settings')
    }
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Tindakan Pantas</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.name}
              onClick={action.action}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left group"
            >
              <div className="flex items-center">
                <div className={`${action.color} rounded-lg p-3 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {action.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Additional Quick Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Permohonan Hari Ini</p>
              <p className="text-2xl font-bold">23</p>
            </div>
            <Users className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Diluluskan Hari Ini</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <CheckCircle className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Ditolak Hari Ini</p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <XCircle className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
}
