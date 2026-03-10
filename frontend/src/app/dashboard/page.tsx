'use client';
import { useEffect, useState } from 'react';
import {
    Server, Globe, Rocket, Lock, Plus, HardDrive, FileText,
    Activity, Circle, Loader2
} from 'lucide-react';
import { serversApi, domainsApi, deploymentsApi, sslApi } from '@/lib/api';

export default function DashboardPage() {
    const [servers, setServers] = useState<any[]>([]);
    const [domains, setDomains] = useState<any[]>([]);
    const [deployments, setDeployments] = useState<any[]>([]);
    const [certificates, setCertificates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [srvRes, domRes, depRes, sslRes] = await Promise.allSettled([
                serversApi.list(),
                domainsApi.list(),
                deploymentsApi.list(),
                sslApi.list(),
            ]);
            if (srvRes.status === 'fulfilled') setServers(srvRes.value.data || []);
            if (domRes.status === 'fulfilled') setDomains(domRes.value.data || []);
            if (depRes.status === 'fulfilled') setDeployments(depRes.value.data || []);
            if (sslRes.status === 'fulfilled') setCertificates(sslRes.value.data || []);
        } catch (err) {
            console.error('Dashboard load error:', err);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        { title: 'Total Servers', value: servers.length, change: `${servers.filter(s => s.status === 'online').length} online`, Icon: Server, gradient: 'gradient-primary' },
        { title: 'Active Domains', value: domains.length, change: `${domains.filter(d => d.status === 'active').length} active`, Icon: Globe, gradient: 'gradient-success' },
        { title: 'Deployments', value: deployments.length, change: `${deployments.filter(d => d.status === 'running').length} running`, Icon: Rocket, gradient: 'gradient-info' },
        { title: 'SSL Certificates', value: certificates.length, change: `${certificates.filter(c => c.status === 'active').length} active`, Icon: Lock, gradient: 'gradient-warning' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 size={32} className="animate-spin text-primary-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {statsCards.map((card) => (
                    <div key={card.title} className="glass rounded-2xl p-5 card-hover">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 ${card.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                <card.Icon size={22} className="text-white" />
                            </div>
                            <span className="text-xs text-dark-400 bg-dark-800/50 px-2 py-1 rounded-lg">{card.change}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{card.value}</h3>
                        <p className="text-sm text-dark-400">{card.title}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-semibold text-white">Servers</h3>
                        <span className="text-xs text-dark-400 bg-dark-800/50 px-3 py-1 rounded-lg">
                            {servers.length} total
                        </span>
                    </div>
                    {servers.length === 0 ? (
                        <div className="text-center py-12 text-dark-400">
                            <Server size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No servers added yet</p>
                            <a href="/dashboard/servers" className="text-primary-400 text-sm mt-2 inline-block">Add your first server</a>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {servers.slice(0, 5).map((server: any) => (
                                <div key={server.id} className="flex items-center gap-4 p-3 rounded-xl bg-dark-800/30 hover:bg-dark-800/50 transition">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <Circle size={8} className={`flex-shrink-0 ${server.status === 'online' ? 'fill-green-400 text-green-400' : 'fill-yellow-400 text-yellow-400'}`} />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{server.name}</p>
                                            <p className="text-xs text-dark-500">{server.ipAddress}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${server.status === 'online' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                        {server.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-5">Recent Domains</h3>
                    {domains.length === 0 ? (
                        <div className="text-center py-12 text-dark-400">
                            <Globe size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No domains configured</p>
                            <a href="/dashboard/domains" className="text-primary-400 text-sm mt-2 inline-block">Add a domain</a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {domains.slice(0, 6).map((domain: any) => (
                                <div key={domain.id} className="flex items-start gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-primary-400 flex-shrink-0"></div>
                                    <div className="min-w-0">
                                        <p className="text-sm text-dark-200">{domain.name}</p>
                                        <p className="text-xs text-dark-500 mt-0.5">{domain.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {[
                        { label: 'Add Server', Icon: Plus, href: '/dashboard/servers' },
                        { label: 'Add Domain', Icon: Globe, href: '/dashboard/domains' },
                        { label: 'Deploy App', Icon: Rocket, href: '/dashboard/deployments' },
                        { label: 'Create Backup', Icon: HardDrive, href: '/dashboard/backups' },
                        { label: 'View Logs', Icon: FileText, href: '/dashboard/logs' },
                        { label: 'SSL Cert', Icon: Lock, href: '/dashboard/ssl' },
                    ].map((action) => (
                        <a key={action.label} href={action.href}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-dark-800/30 hover:bg-dark-800/50 transition-all hover:scale-105 cursor-pointer">
                            <action.Icon size={22} className="text-primary-400" />
                            <span className="text-xs text-dark-300 font-medium">{action.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
