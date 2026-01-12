import prisma from '@/lib/prisma';
import { Users, TrendingUp, Calendar, AlertCircle, ArrowUpRight, Package } from 'lucide-react';

export default async function DashboardPage() {
  const clinic = await prisma.clinic.findFirst({
    where: { name: 'Bayon Dental Clinic' }
  });

  if (!clinic) return <div>Initializing Clinic...</div>;

  const stats = [
    { label: 'Total Patients', value: '0', icon: <Users size={24} />, color: 'bg-blue-500' },
    { label: 'Monthly Revenue', value: '$0.00', icon: <TrendingUp size={24} />, color: 'bg-green-500' },
    { label: 'Active Treatments', value: '0', icon: <Calendar size={24} />, color: 'bg-orange-500' },
    { label: 'Low Stock Items', value: '0', icon: <AlertCircle size={24} />, color: 'bg-red-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome to DentFlow</h1>
        <p className="text-slate-500 mt-1">Here is a summary of {clinic.name} across all branches.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-slate-900">Recent Activity</h2>
            <button className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline">
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Calendar size={24} />
            </div>
            <p className="text-slate-500 font-medium">No recent activity</p>
            <p className="text-slate-400 text-sm mt-1">Recent appointments and sales will appear here.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-slate-900">Inventory Status</h2>
            <button className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:underline">
              Manage Stock <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Package size={24} />
            </div>
            <p className="text-slate-500 font-medium">Stock levels healthy</p>
            <p className="text-slate-400 text-sm mt-1">Daily dispensing levels are currently within limits.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
