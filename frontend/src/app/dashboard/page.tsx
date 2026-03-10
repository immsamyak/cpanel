'use client';

const statsCards = [
    { title: 'Total Servers', value: '12', change: '+2 this month', icon: '🖥️', gradient: 'gradient-primary' },
    { title: 'Active Domains', value: '47', change: '+5 this month', icon: '🌐', gradient: 'gradient-success' },
    { title: 'Deployments', value: '23', change: '3 running', icon: '🚀', gradient: 'gradient-info' },
    { title: 'SSL Certificates', value: '41', change: '2 expiring soon', icon: '🔒', gradient: 'gradient-warning' },
];

const recentActivity = [
    { action: 'SSL certificate renewed', target: 'example.com', time: '5 min ago', type: 'ssl' },
    { action: 'Deployment completed', target: 'api-service', time: '12 min ago', type: 'deploy' },
    { action: 'Server added', target: 'prod-server-03', time: '1 hour ago', type: 'server' },
    { action: 'Database backup completed', target: 'app_production', time: '2 hours ago', type: 'backup' },
    { action: 'Domain configured', target: 'staging.example.com', time: '3 hours ago', type: 'domain' },
    { action: 'Firewall rule updated', target: 'Block IP 10.0.0.5', time: '5 hours ago', type: 'security' },
];

const serverOverview = [
    { name: 'prod-server-01', ip: '192.168.1.10', status: 'online', cpu: 34, memory: 62, disk: 45 },
    { name: 'prod-server-02', ip: '192.168.1.11', status: 'online', cpu: 78, memory: 85, disk: 72 },
    { name: 'staging-server', ip: '192.168.1.20', status: 'online', cpu: 12, memory: 35, disk: 28 },
    { name: 'db-server-01', ip: '192.168.1.30', status: 'maintenance', cpu: 0, memory: 0, disk: 89 },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {statsCards.map((card) => (
                    <div key={card.title} className="glass rounded-2xl p-5 card-hover">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 ${card.gradient} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                                {card.icon}
                            </div>
                            <span className="text-xs text-dark-400 bg-dark-800/50 px-2 py-1 rounded-lg">{card.change}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{card.value}</h3>
                        <p className="text-sm text-dark-400">{card.title}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Server Overview */}
                <div className="lg:col-span-2 glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-semibold text-white">Server Overview</h3>
                        <span className="text-xs text-dark-400 bg-dark-800/50 px-3 py-1 rounded-lg">
                            {serverOverview.filter(s => s.status === 'online').length} / {serverOverview.length} online
                        </span>
                    </div>
                    <div className="space-y-3">
                        {serverOverview.map((server) => (
                            <div key={server.name} className="flex items-center gap-4 p-3 rounded-xl bg-dark-800/30 hover:bg-dark-800/50 transition">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className={`status-dot ${server.status === 'online' ? 'status-online' : 'status-pending'}`}></span>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{server.name}</p>
                                        <p className="text-xs text-dark-500">{server.ip}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="text-center">
                                        <div className="text-dark-400 mb-1">CPU</div>
                                        <div className={`font-semibold ${server.cpu > 70 ? 'text-red-400' : server.cpu > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                                            {server.cpu}%
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-dark-400 mb-1">RAM</div>
                                        <div className={`font-semibold ${server.memory > 80 ? 'text-red-400' : server.memory > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                                            {server.memory}%
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-dark-400 mb-1">Disk</div>
                                        <div className={`font-semibold ${server.disk > 80 ? 'text-red-400' : server.disk > 60 ? 'text-yellow-400' : 'text-green-400'}`}>
                                            {server.disk}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-5">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-2 h-2 mt-2 rounded-full bg-primary-400 flex-shrink-0"></div>
                                <div className="min-w-0">
                                    <p className="text-sm text-dark-200">{item.action}</p>
                                    <p className="text-xs text-primary-400 font-medium">{item.target}</p>
                                    <p className="text-xs text-dark-500 mt-0.5">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {[
                        { label: 'Add Server', icon: '➕', href: '/dashboard/servers' },
                        { label: 'Add Domain', icon: '🌐', href: '/dashboard/domains' },
                        { label: 'Deploy App', icon: '🚀', href: '/dashboard/deployments' },
                        { label: 'Create Backup', icon: '💾', href: '/dashboard/backups' },
                        { label: 'View Logs', icon: '📋', href: '/dashboard/logs' },
                        { label: 'SSL Cert', icon: '🔒', href: '/dashboard/ssl' },
                    ].map((action) => (
                        <a key={action.label} href={action.href}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-dark-800/30 hover:bg-dark-800/50 transition-all hover:scale-105 cursor-pointer">
                            <span className="text-2xl">{action.icon}</span>
                            <span className="text-xs text-dark-300 font-medium">{action.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
