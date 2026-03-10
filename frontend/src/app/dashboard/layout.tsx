'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, Server, Globe, Lock, Database, FolderOpen,
    Rocket, HardDrive, Activity, FileText, Shield, Users,
    PanelLeftClose, PanelLeftOpen, LogOut, User, Circle, ChevronDown
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Servers', href: '/dashboard/servers', icon: Server },
    { name: 'Domains', href: '/dashboard/domains', icon: Globe },
    { name: 'SSL', href: '/dashboard/ssl', icon: Lock },
    { name: 'Databases', href: '/dashboard/databases', icon: Database },
    { name: 'Files', href: '/dashboard/files', icon: FolderOpen },
    { name: 'Deployments', href: '/dashboard/deployments', icon: Rocket },
    { name: 'Backups', href: '/dashboard/backups', icon: HardDrive },
    { name: 'Monitoring', href: '/dashboard/monitoring', icon: Activity },
    { name: 'Logs', href: '/dashboard/logs', icon: FileText },
    { name: 'Security', href: '/dashboard/security', icon: Shield },
    { name: 'Users', href: '/dashboard/users', icon: Users },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const getUserName = () => {
        if (typeof window !== 'undefined') {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                return user.firstName ? `${user.firstName} ${user.lastName}` : 'User';
            } catch { return 'User'; }
        }
        return 'User';
    };

    return (
        <div className="flex h-screen overflow-hidden bg-dark-950">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 border-r border-dark-800 bg-dark-900/50 backdrop-blur-xl flex flex-col`}>
                {/* Logo */}
                <div className="h-16 flex items-center px-4 border-b border-dark-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">SP</div>
                        {sidebarOpen && <span className="text-lg font-bold text-white">ServerPanel</span>}
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                            <Link key={item.name} href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                                        : 'text-dark-400 hover:text-white hover:bg-dark-800/50'
                                    }`}>
                                <Icon size={18} className="flex-shrink-0" />
                                {sidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse */}
                <div className="p-3 border-t border-dark-800">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-dark-400 hover:text-white hover:bg-dark-800/50 transition text-sm">
                        {sidebarOpen ? <><PanelLeftClose size={16} /> Collapse</> : <PanelLeftOpen size={16} />}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="h-16 border-b border-dark-800 bg-dark-900/30 backdrop-blur-xl flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-white">
                            {navigation.find(n => pathname === n.href || (n.href !== '/dashboard' && pathname?.startsWith(n.href)))?.name || 'Dashboard'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Circle size={8} className="fill-green-400 text-green-400" />
                            <span className="text-dark-400">System Online</span>
                        </div>
                        <div className="relative">
                            <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-dark-800/50 transition text-sm">
                                <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {getUserName().charAt(0)}
                                </div>
                                {sidebarOpen && <span className="text-dark-300">{getUserName()}</span>}
                                <ChevronDown size={14} className="text-dark-500" />
                            </button>
                            {userMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl py-2 z-50">
                                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 transition">
                                        <User size={14} /> Profile
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition">
                                        <LogOut size={14} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 gradient-mesh">
                    {children}
                </main>
            </div>
        </div>
    );
}
