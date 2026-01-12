import Link from 'next/link';
import {
    Users,
    LayoutDashboard,
    Stethoscope,
    Package,
    Receipt,
    Settings,
    UserCircle
} from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/' },
        { label: 'Patients', icon: <Users size={20} />, href: '/patients' },
        { label: 'Treatments', icon: <Stethoscope size={20} />, href: '/treatments' },
        { label: 'Inventory', icon: <Package size={20} />, href: '/inventory' },
        { label: 'Sales', icon: <Receipt size={20} />, href: '/sales' },
        { label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 text-2xl font-bold border-b border-slate-800 tracking-tight">
                Dent<span className="text-blue-500">Flow</span>
            </div>

            <nav className="flex-1 mt-6 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white group"
                    >
                        <span className="group-hover:text-blue-400">{item.icon}</span>
                        <span className="font-medium text-sm">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                    BD
                </div>
                <div>
                    <div className="text-sm font-semibold truncate w-32">Bayon Dental</div>
                    <div className="text-xs text-slate-500 capitalize">Admin</div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
