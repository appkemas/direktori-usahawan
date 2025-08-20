import AdminLayout from '@/components/admin/AdminLayout';
import DashboardStats from '@/components/admin/DashboardStats';
import QuickActions from '@/components/admin/QuickActions';
import RecentActivity from '@/components/admin/RecentActivity';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Papan Pemuka</h1>
          <p className="text-gray-600">Selamat datang ke panel pentadbir KEMAS</p>
        </div>

        <DashboardStats />
        <QuickActions />
        <RecentActivity />
      </div>
    </AdminLayout>
  );
}
