'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { 
  Users, 
  MapPin, 
  Settings, 
  Plus, 
  LogOut,
  Building2,
  Shield,
  BarChart3,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  Edit,
  Trash2,
  UserPlus
} from 'lucide-react';
import { db } from '@/firebase/config';
import { addDoc, collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

interface StateAdmin {
  id: string;
  email: string;
  name: string;
  phone: string; // Add phone field
  role: string;
  state: string;
  district: string;
  createdAt: Date;
  status: string;
}

interface DistrictAdmin {
  id: string;
  email: string;
  name: string;
  phone: string; // Add phone field
  role: string;
  state: string;
  district: string;
  createdAt: Date;
  status: string;
}

export default function HQAdminDashboard() {
  const router = useRouter();
  const { adminUser, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [stateAdmins, setStateAdmins] = useState<StateAdmin[]>([]);
  const [districtAdmins, setDistrictAdmins] = useState<DistrictAdmin[]>([]); // Add this
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalEntrepreneurs: 0,
    totalStateAdmins: 0,
    totalDistrictAdmins: 0, // Add this
    totalStates: 0,
    totalCategories: 8
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '', // Add phone field
    state: '',
    password: '',
    confirmPassword: ''
  });

  const [districtFormData, setDistrictFormData] = useState({
    name: '',
    email: '',
    phone: '', // Add phone field
    state: '',
    district: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoadingDistrictForm, setIsLoadingDistrictForm] = useState(false); // Add this
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const states = [
    'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 
    'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 
    'Sarawak', 'Selangor', 'Terengganu',
    'W.P. Kuala Lumpur, Putrajaya & Labuan'
  ];

  // Fetch data when component mounts
  useEffect(() => {
    if (adminUser?.role === 'hq') {
      fetchStateAdmins();
      fetchDistrictAdmins(); // Add this
      fetchStats();
    }
  }, [adminUser]);

  // Fetch State Admin accounts
  const fetchStateAdmins = async () => {
    try {
      console.log('Fetching state admins...');
      const adminsRef = collection(db, 'admins');
      const q = query(adminsRef, where('role', '==', 'state'));
      const querySnapshot = await getDocs(q);
      
      const admins: StateAdmin[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        admins.push({
          id: doc.id,
          email: data.email,
          name: data.name,
          phone: data.phone || '', // Add phone field
          role: data.role,
          state: data.state,
          district: data.district,
          createdAt: data.createdAt?.toDate() || new Date(),
          status: data.status
        });
      });
      
      console.log('Found state admins:', admins);
      setStateAdmins(admins);
      setStats(prev => ({ ...prev, totalStateAdmins: admins.length }));
    } catch (error) {
      console.error('Error fetching state admins:', error);
    }
  };

  // Fetch District Admin accounts - Add this function
  const fetchDistrictAdmins = async () => {
    try {
      console.log('Fetching district admins...');
      const adminsRef = collection(db, 'admins');
      const q = query(adminsRef, where('role', '==', 'district'));
      const querySnapshot = await getDocs(q);
      
      const admins: DistrictAdmin[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        admins.push({
          id: doc.id,
          email: data.email,
          name: data.name,
          phone: data.phone || '', // Add phone field
          role: data.role,
          state: data.state,
          district: data.district,
          createdAt: data.createdAt?.toDate() || new Date(),
          status: data.status
        });
      });
      
      console.log('Found district admins:', admins);
      setDistrictAdmins(admins);
      setStats(prev => ({ ...prev, totalDistrictAdmins: admins.length }));
    } catch (error) {
      console.error('Error fetching district admins:', error);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      // Fetch entrepreneurs count
      const entrepreneursRef = collection(db, 'entrepreneurs');
      const entrepreneursSnapshot = await getDocs(entrepreneursRef);
      const entrepreneursCount = entrepreneursSnapshot.size;
      
      setStats(prev => ({ 
        ...prev, 
        totalEntrepreneurs: entrepreneursCount,
        totalStates: 15 // 14 states + 1 federal territory
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    console.log('HQ Dashboard - Current admin user:', adminUser);
    console.log('Admin role:', adminUser?.role);
    
    // Verify this is actually an HQ admin
    if (adminUser && adminUser.role !== 'hq') {
      console.log('Not HQ admin, redirecting...');
      router.push('/admin/login');
    }
  }, [adminUser, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingForm(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Kata laluan tidak sepadan.');
      setIsLoadingForm(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata laluan mesti sekurang-kurangnya 6 aksara.');
      setIsLoadingForm(false);
      return;
    }

    // Phone validation (optional but recommended)
    if (formData.phone && !/^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/.test(formData.phone.replace(/\s/g, ''))) {
      setError('Format nombor telefon tidak sah. Gunakan format: +60123456789 atau 0123456789');
      setIsLoadingForm(false);
      return;
    }

    try {
      // Save admin data to Firestore
      const adminData = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone, // Include phone
        role: 'state',
        state: formData.state,
        district: '',
        createdAt: new Date(),
        status: 'active',
        tempPassword: formData.password
      };

      await addDoc(collection(db, 'admins'), adminData);

      // Success
      setSuccess(`Pentadbir Negeri untuk ${formData.state} berjaya dicipta! Mereka boleh log masuk dengan emel: ${formData.email} dan kata laluan: ${formData.password}`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '', // Reset phone
        state: '',
        password: '',
        confirmPassword: ''
      });

      // Refresh the state admins list
      await fetchStateAdmins();

      // Close modal after 5 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess('');
      }, 5000);

    } catch (error: any) {
      console.error('Error creating admin:', error);
      setError('Penciptaan akaun gagal. Sila cuba lagi.');
    } finally {
      setIsLoadingForm(false);
    }
  };

  // Add District Admin submit function
  const handleDistrictSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingDistrictForm(true);
    setError('');
    setSuccess('');

    // Validation
    if (districtFormData.password !== districtFormData.confirmPassword) {
      setError('Kata laluan tidak sepadan.');
      setIsLoadingDistrictForm(false);
      return;
    }

    if (districtFormData.password.length < 6) {
      setError('Kata laluan mesti sekurang-kurangnya 6 aksara.');
      setIsLoadingDistrictForm(false);
      return;
    }

    try {
      // Save admin data to Firestore
      const adminData = {
        email: districtFormData.email,
        name: districtFormData.name,
        phone: districtFormData.phone, // Include phone
        role: 'district',
        state: districtFormData.state,
        district: districtFormData.district,
        createdAt: new Date(),
        status: 'active',
        tempPassword: districtFormData.password
      };

      await addDoc(collection(db, 'admins'), adminData);

      // Success
      setSuccess(`Pentadbir Daerah untuk ${districtFormData.district}, ${districtFormData.state} berjaya dicipta! Mereka boleh log masuk dengan emel: ${districtFormData.email} dan kata laluan: ${districtFormData.password}`);
      
      // Reset form
      setDistrictFormData({
        name: '',
        email: '',
        phone: '', // Reset phone
        state: '',
        district: '',
        password: '',
        confirmPassword: ''
      });

      // Refresh the district admins list
      await fetchDistrictAdmins();

      // Close modal after 5 seconds
      setTimeout(() => {
        setIsDistrictModalOpen(false);
        setSuccess('');
      }, 5000);

    } catch (error: any) {
      console.error('Error creating district admin:', error);
      setError('Penciptaan akaun gagal. Sila cuba lagi.');
    } finally {
      setIsLoadingDistrictForm(false);
    }
  };

  // Add District Admin input change handler
  const handleDistrictInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDistrictFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add delete District Admin function
  const handleDeleteDistrictAdmin = async (adminId: string, adminName: string) => {
    if (confirm(`Adakah anda pasti mahu memadamkan ${adminName}?`)) {
      try {
        await deleteDoc(doc(db, 'admins', adminId));
        setSuccess(`${adminName} berjaya dipadamkan.`);
        await fetchDistrictAdmins(); // Refresh the list
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Gagal memadamkan pentadbir.');
      }
    }
  };

  // Delete State Admin
  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (confirm(`Adakah anda pasti mahu memadamkan ${adminName}?`)) {
      try {
        await deleteDoc(doc(db, 'admins', adminId));
        setSuccess(`${adminName} berjaya dipadamkan.`);
        await fetchStateAdmins(); // Refresh the list
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Gagal memadamkan pentadbir.');
      }
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  // Fix 1: Update the closeModal function to include phone field
  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setSuccess('');
    setFormData({
      name: '',
      email: '',
      phone: '', // Add missing phone field
      state: '',
      password: '',
      confirmPassword: ''
    });
  };

  // Role verification
  if (adminUser?.role !== 'hq') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Akses Tidak Sah</h1>
          <p className="text-gray-600 mb-6">
            Anda tidak mempunyai kebenaran untuk mengakses Dashboard HQ.
          </p>
          <p className="text-sm text-gray-500">
            Role anda: {adminUser?.role} | Negeri: {adminUser?.state}
          </p>
        </div>
      </div>
    );
  }

  // Fix 2: Add proper typing for entrepreneurs array
  const generateEntrepreneurReport = async () => {
    try {
      // Fetch entrepreneurs data from Firestore
      const entrepreneursRef = collection(db, 'entrepreneurs');
      const entrepreneursSnapshot = await getDocs(entrepreneursRef);
      
      const entrepreneurs: Array<{
        id: string;
        businessName: string;
        ownerName: string;
        email: string;
        phone: string;
        category: string;
        state: string;
        district: string;
        status: string;
        registrationDate: string;
        address: string;
      }> = [];
      
      entrepreneursSnapshot.forEach((doc) => {
        const data = doc.data();
        entrepreneurs.push({
          id: doc.id,
          businessName: data.businessName || '',
          ownerName: data.ownerName || '',
          email: data.email || '',
          phone: data.phone || '',
          category: data.category || '',
          state: data.state || '',
          district: data.district || '',
          status: data.status || '',
          registrationDate: data.createdAt?.toDate?.() || data.registrationDate || '',
          address: data.address || ''
        });
      });

      // Create CSV content
      const headers = [
        'ID', 'Nama Perniagaan', 'Nama Pemilik', 'Emel', 'Telefon', 
        'Kategori', 'Negeri', 'Daerah', 'Status', 'Tarikh Daftar', 'Alamat'
      ];
      
      const csvData = entrepreneurs.map(entrepreneur => [
        entrepreneur.id,
        entrepreneur.businessName,
        entrepreneur.ownerName,
        entrepreneur.email,
        entrepreneur.phone,
        entrepreneur.category,
        entrepreneur.state,
        entrepreneur.district,
        entrepreneur.status,
        entrepreneur.registrationDate,
        entrepreneur.address
      ]);
      
      // Create CSV content
      const csvContent = [headers, ...csvData]
        .map(row => row.map(cell => `"${cell || ''}"`).join(','))
        .join('\n');
      
      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `laporan-usahawan-kebangsaan-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess('Laporan usahawan berjaya dijana dan dimuat turun! / Entrepreneur report successfully generated and downloaded!');
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (error) {
      console.error('Error generating entrepreneur report:', error);
      setError('Gagal menjana laporan. Sila cuba lagi. / Failed to generate report. Please try again.');
    }
  };

  // Fix 3: Add proper typing for statsData
  const generateStatisticsReport = async () => {
    try {
      // Fetch data for statistics
      const entrepreneursRef = collection(db, 'entrepreneurs');
      const adminsRef = collection(db, 'admins');
      
      const [entrepreneursSnapshot, adminsSnapshot] = await Promise.all([
        getDocs(entrepreneursRef),
        getDocs(adminsRef)
      ]);
      
      const entrepreneurs = entrepreneursSnapshot.size;
      const stateAdmins = adminsSnapshot.docs.filter(doc => doc.data().role === 'state').length;
      const districtAdmins = adminsSnapshot.docs.filter(doc => doc.data().role === 'district').length;
      
      // Create statistics data with proper typing
      const statsData: Array<[string, string | number, string]> = [
        ['Metrik / Metric', 'Nilai / Value', 'Tarikh / Date'],
        ['Jumlah Usahawan / Total Entrepreneurs', entrepreneurs, new Date().toISOString().split('T')[0]],
        ['Pentadbir Negeri / State Admins', stateAdmins, new Date().toISOString().split('T')[0]],
        ['Pentadbir Daerah / District Admins', districtAdmins, new Date().toISOString().split('T')[0]],
        ['Negeri Aktif / Active States', stats.totalStates, new Date().toISOString().split('T')[0]],
        ['Kategori Perniagaan / Business Categories', stats.totalCategories, new Date().toISOString().split('T')[0]]
      ];
      
      // Create CSV content
      const csvContent = statsData
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `laporan-statistik-kebangsaan-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess('Laporan statistik berjaya dijana dan dimuat turun! / Statistics report successfully generated and downloaded!');
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (error) {
      console.error('Error generating statistics report:', error);
      setError('Gagal menjana laporan. Sila cuba lagi. / Failed to generate report. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">HQ Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Gambaran Keseluruhan', icon: BarChart3 },
              { id: 'state-admins', name: 'Pentadbir Negeri', icon: Users },
              { id: 'district-admins', name: 'Pentadbir Daerah', icon: UserPlus },
              { id: 'reports', name: 'Laporan', icon: BarChart3 }, // Changed from 'settings' to 'reports'
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Gambaran Keseluruhan Sistem</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Jumlah Usahawan</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEntrepreneurs}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pentadbir Negeri</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalStateAdmins}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Negeri Aktif</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalStates}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Kategori</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tindakan Pantas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={openModal}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Tambah Pentadbir Negeri</span>
                </button>
                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200">
                  <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Urus Negeri & Daerah</span>
                </button>
                <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200">
                  <Settings className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Laporan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'state-admins' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pentadbir Negeri</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Tambah Pentadbir Negeri
              </button>
            </div>

            {/* State Admins List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Senarai Pentadbir Negeri ({stateAdmins.length})
                </h3>
              </div>
              
              {stateAdmins.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Tiada pentadbir negeri dijumpai.</p>
                  <p className="text-sm">Klik "Tambah Pentadbir Negeri" untuk mula.</p>
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
                          Emel
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Telefon
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Negeri
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tindakan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stateAdmins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{admin.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{admin.phone || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{admin.state}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              admin.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {admin.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
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

        {activeTab === 'district-admins' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pentadbir Daerah</h2>
              <button 
                onClick={() => setIsDistrictModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Tambah Pentadbir Daerah
              </button>
            </div>

            {/* District Admins List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Senarai Pentadbir Daerah ({districtAdmins.length})
                </h3>
              </div>
              
              {districtAdmins.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Tiada pentadbir daerah dijumpai.</p>
                  <p className="text-sm">Klik "Tambah Pentadbir Daerah" untuk mula.</p>
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
                          Emel
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Telefon
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Negeri
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Daerah
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tindakan
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {districtAdmins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{admin.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{admin.phone || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{admin.state}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{admin.district}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              admin.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {admin.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteDistrictAdmin(admin.id, admin.name)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Laporan Kebangsaan / National Reports</h2>
            
            {/* Report Generation Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Entrepreneur Report */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Laporan Usahawan / Entrepreneur Report
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Jana laporan senarai usahawan di seluruh negara / Generate nationwide entrepreneur list report
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format Laporan / Report Format
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="csv">CSV (.csv)</option>
                        <option value="excel">Excel (.xlsx)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Negeri / State
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="all">Semua Negeri / All States</option>
                        {states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status Usahawan / Entrepreneur Status
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="all">Semua Status / All Status</option>
                        <option value="active">Aktif / Active</option>
                        <option value="pending">Menunggu Kelulusan / Pending Approval</option>
                        <option value="suspended">Digantung / Suspended</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori Perniagaan / Business Category
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="all">Semua Kategori / All Categories</option>
                        <option value="food">Makanan / Food</option>
                        <option value="craft">Kraftangan / Handicraft</option>
                        <option value="agriculture">Pertanian / Agriculture</option>
                        <option value="services">Perkhidmatan / Services</option>
                        <option value="retail">Runcit / Retail</option>
                        <option value="manufacturing">Pembuatan / Manufacturing</option>
                        <option value="technology">Teknologi / Technology</option>
                        <option value="other">Lain-lain / Others</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => generateEntrepreneurReport()}
                      className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center font-medium"
                    >
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Jana Laporan Usahawan / Generate Entrepreneur Report
                    </button>
                  </div>
                </div>

                {/* Statistics Report */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Laporan Statistik / Statistics Report
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Jana laporan statistik keseluruhan sistem / Generate comprehensive system statistics report
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tempoh / Period
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="current">Bulan Semasa / Current Month</option>
                        <option value="quarter">Suku Tahun / Quarter</option>
                        <option value="year">Tahun Semasa / Current Year</option>
                        <option value="custom">Tempoh Tertentu / Custom Period</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format Laporan / Report Format
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="csv">CSV (.csv)</option>
                        <option value="excel">Excel (.xlsx)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jenis Statistik / Statistics Type
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="comprehensive">Lengkap / Comprehensive</option>
                        <option value="entrepreneur-growth">Pertumbuhan Usahawan / Entrepreneur Growth</option>
                        <option value="state-comparison">Perbandingan Negeri / State Comparison</option>
                        <option value="category-analysis">Analisis Kategori / Category Analysis</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => generateStatisticsReport()}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-medium"
                    >
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Jana Laporan Statistik / Generate Statistics Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Reports */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Laporan Terkini / Recent Reports
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    Tiada laporan dijana lagi. / No reports generated yet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add State Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Tambah Pentadbir Negeri
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Penuh
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Masukkan nama penuh"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Emel
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="emel@contoh.com"
                />
              </div>

              {/* Phone Field - NEW */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombor Telefon
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="+60123456789 atau 0123456789"
                />
                <p className="text-xs text-gray-500 mt-1">Format: +60123456789 atau 0123456789</p>
              </div>

              {/* State Field */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  Negeri
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">Pilih Negeri</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Kata Laluan
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Sahkan Kata Laluan
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="••••••••"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center space-x-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span>{success}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoadingForm}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoadingForm ? 'Memproses...' : 'Cipta Akaun'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add District Admin Modal */}
      {isDistrictModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Tambah Pentadbir Daerah
              </h3>
              <button
                onClick={() => setIsDistrictModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleDistrictSubmit} className="p-6 space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="districtName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Penuh
                </label>
                <input
                  id="districtName"
                  name="name"
                  type="text"
                  required
                  value={districtFormData.name}
                  onChange={handleDistrictInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Masukkan nama penuh"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="districtEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Emel
                </label>
                <input
                  id="districtEmail"
                  name="email"
                  type="email"
                  required
                  value={districtFormData.email}
                  onChange={handleDistrictInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="emel@contoh.com"
                />
              </div>

              {/* Phone Field - NEW */}
              <div>
                <label htmlFor="districtPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombor Telefon
                </label>
                <input
                  id="districtPhone"
                  name="phone"
                  type="tel"
                  value={districtFormData.phone}
                  onChange={handleDistrictInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="+60123456789 atau 0123456789"
                />
                <p className="text-xs text-gray-500 mt-1">Format: +60123456789 atau 0123456789</p>
              </div>

              {/* State Field */}
              <div>
                <label htmlFor="districtState" className="block text-sm font-medium text-gray-700 mb-2">
                  Negeri
                </label>
                <select
                  id="districtState"
                  name="state"
                  required
                  value={districtFormData.state}
                  onChange={handleDistrictInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">Pilih Negeri</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Field */}
              <div>
                <label htmlFor="districtDistrict" className="block text-sm font-medium text-gray-700 mb-2">
                  Daerah
                </label>
                <input
                  id="districtDistrict"
                  name="district"
                  type="text"
                  required
                  value={districtFormData.district}
                  onChange={handleDistrictInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Masukkan nama daerah"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="districtPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Kata Laluan
                </label>
                <input
                  id="districtPassword"
                  name="password"
                  type="password"
                  required
                  value={districtFormData.password}
                  onChange={handleDistrictInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="districtConfirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Sahkan Kata Laluan
                </label>
                <input
                  id="districtConfirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={districtFormData.confirmPassword}
                  onChange={handleDistrictInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="••••••••"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center space-x-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span>{success}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoadingDistrictForm}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoadingDistrictForm ? 'Memproses...' : 'Cipta Akaun'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
