'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { 
  MapPin, Building2, Shield, BarChart3,
  CheckCircle, AlertCircle, X, Eye, Edit, Trash2, UserPlus, AlertTriangle
} from 'lucide-react';

// Define entrepreneur type
interface Entrepreneur {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  status: string;
  createdAt: Date;
  district: string;
  state: string;
}

export default function DistrictAdminDashboard() {
  const router = useRouter();
  const { adminUser, logout } = useAdminAuth();
  
  // All state declarations must come first
  const [activeTab, setActiveTab] = useState('overview');
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [isLoadingEntrepreneurs, setIsLoadingEntrepreneurs] = useState(false);

  // Authentication check
  useEffect(() => {
    if (adminUser && adminUser.role !== 'district') {
      router.push('/admin/login');
    } else if (!adminUser) {
      router.push('/admin/login');
    }
  }, [adminUser, router]);

  // Add function to fetch entrepreneurs for this district
  const fetchEntrepreneurs = async () => {
    if (!adminUser?.district || !adminUser?.state) return;

    try {
      setIsLoadingEntrepreneurs(true);
      console.log('Fetching entrepreneurs for district:', adminUser.district, 'state:', adminUser.state);
      
      const entrepreneursRef = collection(db, 'entrepreneurs');
      
      // Simplified query without orderBy to avoid index requirement
      const q = query(
        entrepreneursRef,
        where('district', '==', adminUser.district),
        where('state', '==', adminUser.state)
      );
      
      const querySnapshot = await getDocs(q);
      const entrepreneursList: Entrepreneur[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        entrepreneursList.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          businessName: data.businessName || '',
          businessType: data.businessType || '',
          status: data.status || 'pending',
          district: data.district || '',
          state: data.state || '',
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });
      
      // Sort in JavaScript instead of Firestore
      entrepreneursList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      console.log('Found entrepreneurs:', entrepreneursList);
      setEntrepreneurs(entrepreneursList);
    } catch (error) {
      console.error('Error fetching entrepreneurs:', error);
    } finally {
      setIsLoadingEntrepreneurs(false);
    }
  };

  // Fetch entrepreneurs when component loads
  useEffect(() => {
    if (adminUser?.role === 'district') {
      fetchEntrepreneurs();
    }
  }, [adminUser]);

  // Handle approve entrepreneur
  const handleApproveEntrepreneur = async (entrepreneurId: string) => {
    try {
      const entrepreneurRef = doc(db, 'entrepreneurs', entrepreneurId);
      await updateDoc(entrepreneurRef, {
        status: 'approved',
        updatedAt: new Date(),
        approvedBy: adminUser?.email,
        approvedAt: new Date()
      });
      
      // Refresh the entrepreneurs list
      await fetchEntrepreneurs();
      
      console.log('Entrepreneur approved successfully');
    } catch (error) {
      console.error('Error approving entrepreneur:', error);
    }
  };

  // Handle reject entrepreneur
  const handleRejectEntrepreneur = async (entrepreneurId: string) => {
    try {
      const entrepreneurRef = doc(db, 'entrepreneurs', entrepreneurId);
      await updateDoc(entrepreneurRef, {
        status: 'rejected',
        updatedAt: new Date(),
        rejectedBy: adminUser?.email,
        rejectedAt: new Date()
      });
      
      // Refresh the entrepreneurs list
      await fetchEntrepreneurs();
      
      console.log('Entrepreneur rejected successfully');
    } catch (error) {
      console.error('Error rejecting entrepreneur:', error);
    }
  };

  // Handle logout properly
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      router.push('/admin/login');
    }
  };

  // Early return check
  if (!adminUser || adminUser.role !== 'district') {
    return null;
  }

  // Get current district info
  const currentDistrict = adminUser.district || 'Daerah';
  const currentState = adminUser.state || 'Negeri';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Pentadbir Daerah</h1>
                <p className="text-sm text-gray-600">{currentDistrict}, {currentState}</p>
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
              { id: 'overview', name: 'Gambaran Keseluruhan', icon: Eye },
              { id: 'entrepreneurs', name: 'Usahawan', icon: Building2 },
              { id: 'reports', name: 'Laporan', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Gambaran Keseluruhan Daerah</h2>
            
            {/* Quick Actions */}
            <div className="flex justify-center">
              <button 
                onClick={() => setActiveTab('entrepreneurs')}
                className="flex items-center p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <CheckCircle className="h-6 w-6 text-blue-600 mr-3" />
                <span className="text-base font-medium text-gray-900">Urus Kelulusan</span>
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Usahawan</p>
                    <p className="text-2xl font-bold text-gray-900">{entrepreneurs.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Diluluskan</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {entrepreneurs.filter(e => e.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Menunggu</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {entrepreneurs.filter(e => e.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'entrepreneurs' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Senarai Usahawan</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Usahawan di {adminUser?.district}, {adminUser?.state}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {entrepreneurs.length} usahawan dijumpai
                </p>
              </div>
              
              {isLoadingEntrepreneurs ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>Memuat senarai usahawan...</p>
                </div>
              ) : entrepreneurs.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Tiada usahawan dijumpai.</p>
                  <p className="text-sm">Usahawan akan muncul di sini selepas mereka mendaftar.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Perniagaan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Emel
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Telefon
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarikh Daftar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tindakan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {entrepreneurs.map((entrepreneur) => (
                        <tr key={entrepreneur.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{entrepreneur.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{entrepreneur.businessName}</div>
                            <div className="text-xs text-gray-500">{entrepreneur.businessType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{entrepreneur.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{entrepreneur.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              entrepreneur.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : entrepreneur.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {entrepreneur.status === 'approved' ? 'Diluluskan' : 
                               entrepreneur.status === 'pending' ? 'Menunggu' : 'Ditolak'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {entrepreneur.createdAt.toLocaleDateString('ms-MY')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {entrepreneur.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveEntrepreneur(entrepreneur.id)}
                                    className="text-green-600 hover:text-green-900 transition-colors duration-200"
                                    title="Luluskan"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleRejectEntrepreneur(entrepreneur.id)}
                                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                    title="Tolak"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Laporan Daerah</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Entrepreneur Report */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Laporan Usahawan</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Muat turun senarai usahawan dalam daerah ini dalam format CSV.
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Muat Turun CSV
                </button>
              </div>

              {/* Statistics Report */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Laporan Statistik</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Muat turun statistik daerah dalam format CSV.
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Muat Turun CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
