'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { addDoc, collection, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/firebase/config';
import { 
  Users, MapPin, Settings, Plus, LogOut, Building2, Shield, BarChart3,
  CheckCircle, AlertCircle, X, Eye, Edit, Trash2, UserPlus, AlertTriangle
} from 'lucide-react';

export default function StateAdminDashboard() {
  const router = useRouter();
  const { adminUser, logout } = useAdminAuth();
  
  // All state declarations must come first, before any conditional logic
  const [activeTab, setActiveTab] = useState('overview');
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [districtFormData, setDistrictFormData] = useState({
    name: '', email: '', phone: '', district: '', password: '', confirmPassword: ''
  });
  const [editingAdmin, setEditingAdmin] = useState<{
    id: string; name: string; email: string; phone: string; district: string; status: string;
  } | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '', email: '', phone: '', district: '', status: 'active'
  });
  const [deletingAdmin, setDeletingAdmin] = useState<{
    id: string; name: string; email: string; district: string;
  } | null>(null);
  
  const [districtAdmins, setDistrictAdmins] = useState<Array<{
    id: string; name: string; email: string; phone: string; district: string; status: string; createdAt: Date;
  }>>([]);
  
  const [isLoadingDistrictForm, setIsLoadingDistrictForm] = useState(false);
  const [isLoadingDistrictAdmins, setIsLoadingDistrictAdmins] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Type definitions
  type StateName = 'Johor' | 'Kedah' | 'Kelantan' | 'Melaka' | 'Negeri Sembilan' | 'Pahang' | 'Perak' | 'Perlis' | 'Pulau Pinang' | 'Sabah' | 'Sarawak' | 'Selangor' | 'Terengganu' | 'W.P. Kuala Lumpur, Putrajaya & Labuan';

  const statesAndDistricts: Record<StateName, string[]> = {
    'Johor': ['Batu Pahat', 'Johor Bahru', 'Kluang', 'Kota Tinggi', 'Kulai', 'Mersing', 'Muar', 'Pontian', 'Segamat'],
    'Kedah': ['Baling', 'Bandar Baharu', 'Kota Setar', 'Kuala Muda', 'Kubang Pasu', 'Kulim', 'Langkawi', 'Padang Terap', 'Pendang', 'Pokok Sena', 'Sik', 'Yan'],
    'Kelantan': ['Bachok', 'Gua Musang', 'Jeli', 'Kota Bharu', 'Kuala Krai', 'Machang', 'Pasir Mas', 'Pasir Puteh', 'Tanah Merah', 'Tumpat'],
    'Melaka': ['Alor Gajah', 'Jasin', 'Melaka Tengah'],
    'Negeri Sembilan': ['Jelebu', 'Jempol', 'Kuala Pilah', 'Port Dickson', 'Rembau', 'Seremban', 'Tampin'],
    'Pahang': ['Bentong', 'Bera', 'Cameron Highlands', 'Jerantut', 'Kuantan', 'Lipis', 'Maran', 'Pekan', 'Raub', 'Rompin', 'Temerloh'],
    'Perak': ['Batang Padang', 'Hilir Perak', 'Hulu Perak', 'Kampar', 'Kerian', 'Kinta', 'Kuala Kangsar', 'Larut, Matang dan Selama', 'Manjung', 'Muallim', 'Perak Tengah', 'Seberang Perak'],
    'Perlis': ['Arau', 'Kangar'],
    'Pulau Pinang': ['Barat Daya', 'Seberang Perai Selatan', 'Seberang Perai Tengah', 'Seberang Perai Utara', 'Timur Laut'],
    'Sabah': ['Beaufort', 'Beluran', 'Keningau', 'Kinabatangan', 'Kota Belud', 'Kota Kinabalu', 'Kota Marudu', 'Kuala Penyu', 'Kudat', 'Kunak', 'Lahad Datu', 'Nabawan', 'Papar', 'Penampang', 'Putatan', 'Ranau', 'Sandakan', 'Semporna', 'Sipitang', 'Tambunan', 'Tawau', 'Tenom', 'Tongod', 'Tuaran'],
    'Sarawak': ['Asajaya', 'Ba\'kelalan', 'Balingian', 'Baram', 'Batang Ai', 'Bau', 'Belaga', 'Belawai', 'Betong', 'Bintulu', 'Buchanan', 'Bukit Mabong', 'Dalat', 'Daro', 'Debak', 'Dudong', 'Engkilili', 'Julau', 'Kabong', 'Kanowit', 'Kapit', 'Kemena', 'Kota Samarahan', 'Lawas', 'Limbang', 'Lingga', 'Lubok Antu', 'Lundu', 'Machan', 'Marudi', 'Matu', 'Meradong', 'Miri', 'Mukah', 'Nanga Merit', 'Niah', 'Oya', 'Pakan', 'Pusa', 'Roban', 'Sadong Jaya', 'Samarahan', 'Saratok', 'Sebauh', 'Sebuyau', 'Selangau', 'Serian', 'Sibuti', 'Simunjan', 'Song', 'Spaoh', 'Sri Aman', 'Subis', 'Tanjong Manis', 'Tatau', 'Tebedu', 'Tinggi'],
    'Selangor': ['Gombak', 'Hulu Langat', 'Hulu Selangor', 'Klang', 'Kuala Langat', 'Kuala Selangor', 'Petaling', 'Sabak Bernam', 'Sepang'],
    'Terengganu': ['Besut', 'Dungun', 'Hulu Terengganu', 'Kemaman', 'Kuala Nerus', 'Kuala Terengganu', 'Marang', 'Setiu'],
    'W.P. Kuala Lumpur, Putrajaya & Labuan': ['Kuala Lumpur', 'Putrajaya', 'Labuan']
  };

  const currentState = adminUser?.state || 'Negeri';

  // All useEffect hooks must come after state declarations
  useEffect(() => {
    if (adminUser && adminUser.role !== 'state') {
      router.push('/admin/login');
    } else if (!adminUser) {
      router.push('/admin/login');
    }
  }, [adminUser, router]);

  const fetchDistrictAdmins = useCallback(async () => {
    try {
      setIsLoadingDistrictAdmins(true);
      console.log('Fetching district admins for state:', currentState);
      
      const adminsRef = collection(db, 'admins');
      const q = query(
        adminsRef, 
        where('role', '==', 'district'),
        where('state', '==', currentState)
      );
      const querySnapshot = await getDocs(q);
      
      const admins: Array<{
        id: string; name: string; email: string; phone: string; district: string; status: string; createdAt: Date;
      }> = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        admins.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          district: data.district || '',
          status: data.status || 'active',
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });
      
      console.log('Found district admins:', admins);
      setDistrictAdmins(admins);
    } catch (error) {
      console.error('Error fetching district admins:', error);
      setError('Gagal memuat senarai pentadbir daerah.');
    } finally {
      setIsLoadingDistrictAdmins(false);
    }
  }, [currentState]);

  useEffect(() => {
    fetchDistrictAdmins();
  }, [fetchDistrictAdmins]);

  // All function declarations
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login
      router.push('/admin/login');
    }
  };

  const handleDistrictInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDistrictFormData(prev => ({ ...prev, [name]: value }));
  };

  // Update handleDistrictSubmit to preserve State Admin session
  const handleDistrictSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingDistrictForm(true);
    setError('');
    setSuccess('');

    if (districtFormData.password !== districtFormData.confirmPassword) {
      setError('Kata laluan tidak sepadan.');
      setIsLoadingDistrictForm(false);
      return;
    }

    try {
      // Store current State Admin email for later restoration
      const currentStateAdminEmail = adminUser?.email;
      if (!currentStateAdminEmail) {
        setError('Sesi anda telah tamat. Sila log masuk semula.');
        return;
      }

      // Step 1: Create Firebase Auth user account
      console.log('Creating Firebase Auth account for:', districtFormData.email);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        districtFormData.email,
        districtFormData.password
      );
      
      console.log('Firebase Auth account created successfully:', userCredential.user.uid);

      // Step 2: Save admin data to Firestore
      const adminData = {
        uid: userCredential.user.uid,
        email: districtFormData.email,
        name: districtFormData.name,
        phone: districtFormData.phone,
        role: 'district',
        state: currentState,
        district: districtFormData.district,
        createdAt: new Date(),
        status: 'active',
        tempPassword: districtFormData.password,
        createdBy: currentStateAdminEmail
      };

      console.log('Saving admin data to Firestore:', adminData);
      await addDoc(collection(db, 'admins'), adminData);

      // Step 3: Sign out the District Admin account
      await signOut(auth);
      console.log('Signed out District Admin account');

      // Step 4: Show success message and redirect to login
      setSuccess(`Pentadbir Daerah untuk ${districtFormData.district} berjaya dicipta! Sila log masuk semula sebagai Pentadbir Negeri.`);
      
      // Reset form
      setDistrictFormData({
        name: '', email: '', phone: '', district: '', password: '', confirmPassword: ''
      });

      // Refresh the district admins list
      await fetchDistrictAdmins();

      // Close modal
      setIsDistrictModalOpen(false);

      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);

    } catch (error: any) {
      console.error('Error creating district admin:', error);
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/email-already-in-use') {
        setError('Emel ini sudah digunakan oleh akaun lain. Sila gunakan emel yang berbeza.');
      } else if (error.code === 'auth/weak-password') {
        setError('Kata laluan terlalu lemah. Sila gunakan kata laluan yang lebih kuat (minimum 6 aksara).');
      } else if (error.code === 'auth/invalid-email') {
        setError('Format emel tidak sah. Sila masukkan emel yang betul.');
      } else {
        setError(`Penciptaan akaun gagal: ${error.message}. Sila cuba lagi.`);
      }
    } finally {
      setIsLoadingDistrictForm(false);
    }
  };

  const handleEditAdmin = (admin: any) => {
    setEditingAdmin(admin);
    setEditFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      district: admin.district,
      status: admin.status
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    setIsLoadingEdit(true);
    setError('');
    setSuccess('');

    try {
      const adminRef = doc(db, 'admins', editingAdmin.id);
      await updateDoc(adminRef, {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        district: editFormData.district,
        status: editFormData.status,
        updatedAt: new Date(),
        updatedBy: adminUser?.email
      });

      setSuccess(`Maklumat Pentadbir Daerah berjaya dikemas kini!`);
      
      await fetchDistrictAdmins();

      setTimeout(() => {
        setIsEditModalOpen(false);
        setSuccess('');
        setEditingAdmin(null);
      }, 3000);

    } catch (error: any) {
      console.error('Error updating district admin:', error);
      setError('Kemaskini maklumat gagal. Sila cuba lagi.');
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAdmin(null);
    setEditFormData({
      name: '', email: '', phone: '', district: '', status: 'active'
    });
    setError('');
    setSuccess('');
  };

  const handleDeleteAdmin = (admin: any) => {
    setDeletingAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!deletingAdmin) return;

    setIsLoadingDelete(true);
    setError('');
    setSuccess('');

    try {
      const adminRef = doc(db, 'admins', deletingAdmin.id);
      await deleteDoc(adminRef);

      setSuccess(`Akaun Pentadbir Daerah ${deletingAdmin.name} berjaya dipadam!`);
      
      await fetchDistrictAdmins();

      setTimeout(() => {
        setIsDeleteModalOpen(false);
        setSuccess('');
        setDeletingAdmin(null);
      }, 3000);

    } catch (error: any) {
      console.error('Error deleting district admin:', error);
      setError('Pemadaman akaun gagal. Sila cuba lagi.');
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingAdmin(null);
    setError('');
    setSuccess('');
  };

  // Early return check - must come after ALL hooks
  if (!adminUser || adminUser.role !== 'state') {
    return null;
  }

  // Rest of your component JSX...
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Pentadbir Negeri</h1>
                <p className="text-sm text-gray-600">{currentState}</p>
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
              { id: 'district-admins', name: 'Pentadbir Daerah', icon: Users },
              { id: 'reports', name: 'Laporan', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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
            <h2 className="text-2xl font-bold text-gray-900">Gambaran Keseluruhan Negeri</h2>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pentadbir Daerah</p>
                    <p className="text-2xl font-bold text-gray-900">{districtAdmins.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Usahawan</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Daerah</p>
                    <p className="text-2xl font-bold text-gray-900">{statesAndDistricts[currentState as StateName]?.length || 0}</p>
                  </div>
                </div>
              </div>
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
                <Plus className="h-5 w-5 mr-2" />
                Tambah Pentadbir Daerah
              </button>
            </div>

            {/* District Admins List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Senarai Pentadbir Daerah ({currentState}) - {districtAdmins.length} orang
                </h3>
              </div>
              
              {isLoadingDistrictAdmins ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p>Memuat senarai pentadbir daerah...</p>
                </div>
              ) : districtAdmins.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
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
                          Daerah
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarikh Dicipta
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {admin.createdAt.toLocaleDateString('ms-MY')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEditAdmin(admin)}
                                className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200 p-1 rounded hover:bg-indigo-50"
                                title="Kemaskini maklumat"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteAdmin(admin)}
                                className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                                title="Padam akaun"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Laporan Negeri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Entrepreneur Report */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Laporan Usahawan</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Muat turun senarai usahawan dalam negeri ini dalam format CSV.
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
                  Muat turun statistik negeri dalam format CSV.
                </p>
                <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Muat Turun CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add District Admin Modal */}
        {isDistrictModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Tambah Pentadbir Daerah</h3>
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Penuh
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={districtFormData.name}
                    onChange={handleDistrictInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Emel
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={districtFormData.email}
                    onChange={handleDistrictInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombor Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={districtFormData.phone}
                    onChange={handleDistrictInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* District Field */}
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                    Daerah
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={districtFormData.district}
                    onChange={handleDistrictInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Pilih Daerah</option>
                    {statesAndDistricts[currentState as StateName]?.map((district: string) => (
                      <option key={district} value={district}>
                        {district}
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
                    type="password"
                    id="password"
                    name="password"
                    value={districtFormData.password}
                    onChange={handleDistrictInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Sahkan Kata Laluan
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={districtFormData.confirmPassword}
                    onChange={handleDistrictInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-600">{success}</p>
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

        {/* Edit District Admin Modal */}
        {isEditModalOpen && editingAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  Kemaskini Pentadbir Daerah
                </h3>
                <button 
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Penuh
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Emel
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombor Telefon
                  </label>
                  <input
                    type="tel"
                    id="edit-phone"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* District Field */}
                <div>
                  <label htmlFor="edit-district" className="block text-sm font-medium text-gray-700 mb-2">
                    Daerah
                  </label>
                  <select
                    id="edit-district"
                    name="district"
                    value={editFormData.district}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Pilih Daerah</option>
                    {statesAndDistricts[currentState as StateName]?.map((district: string) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Field */}
                <div>
                  <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="edit-status"
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoadingEdit}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoadingEdit ? 'Memproses...' : 'Kemaskini Maklumat'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && deletingAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-red-600">
                  Padam Akaun Pentadbir Daerah
                </h3>
                <button 
                  onClick={closeDeleteModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Warning Message */}
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-medium text-gray-900">
                      Awas! Tindakan ini tidak boleh dibatalkan
                    </h4>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <p>Anda akan memadam akaun untuk:</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p><strong>Nama:</strong> {deletingAdmin.name}</p>
                    <p><strong>Emel:</strong> {deletingAdmin.email}</p>
                    <p><strong>Daerah:</strong> {deletingAdmin.district}</p>
                  </div>
                  <p className="text-red-600 font-medium">
                    Selepas pemadaman, pentadbir ini tidak akan dapat log masuk lagi.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteSubmit}
                  disabled={isLoadingDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoadingDelete ? 'Memproses...' : 'Padam Akaun'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
