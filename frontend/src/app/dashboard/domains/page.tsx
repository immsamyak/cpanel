'use client';
import { useState } from 'react';
import { Globe, Plus, Pencil, Trash2, Lock } from 'lucide-react';

const mockDomains = [
    { id: '1', name: 'example.com', type: 'primary', status: 'active', sslEnabled: true, server: 'prod-server-01', documentRoot: '/var/www/example.com/public' },
    { id: '2', name: 'staging.example.com', type: 'subdomain', status: 'active', sslEnabled: true, server: 'staging-server', documentRoot: '/var/www/staging.example.com/public' },
    { id: '3', name: 'api.example.com', type: 'subdomain', status: 'active', sslEnabled: true, server: 'prod-server-02', documentRoot: null, isReverseProxy: true },
    { id: '4', name: 'mysite.io', type: 'primary', status: 'inactive', sslEnabled: false, server: 'prod-server-01', documentRoot: '/var/www/mysite.io/public' },
    { id: '5', name: 'blog.mysite.io', type: 'subdomain', status: 'pending', sslEnabled: false, server: 'prod-server-01', documentRoot: '/var/www/blog.mysite.io/public' },
];

export default function DomainsPage() {
    const [showModal, setShowModal] = useState(false);

    const getStatusBadge = (status: string) => {
        const styles: any = {
            active: 'bg-green-500/10 text-green-400',
            inactive: 'bg-red-500/10 text-red-400',
            pending: 'bg-yellow-500/10 text-yellow-400',
        };
        return styles[status] || styles.pending;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Domains</h1>
                    <p className="text-dark-400 text-sm mt-1">Manage domains and virtual hosts</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/25">
                    <Plus size={16} /> Add Domain
                </button>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-dark-700/50">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Domain</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Type</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Status</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">SSL</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Server</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-800/50">
                        {mockDomains.map((domain) => (
                            <tr key={domain.id} className="hover:bg-dark-800/30 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Globe size={16} className="text-primary-400" />
                                        <span className="text-white font-medium">{domain.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs px-2 py-1 rounded-lg bg-dark-800/50 text-dark-300">{domain.type}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(domain.status)}`}>{domain.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {domain.sslEnabled ? (
                                        <span className="flex items-center gap-1 text-green-400 text-sm"><Lock size={13} /> Active</span>
                                    ) : (
                                        <span className="text-dark-500">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-dark-400 text-sm">{domain.server}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-dark-800/50 text-dark-300 rounded-lg hover:bg-dark-700/50 transition mr-2">
                                        <Pencil size={12} /> Edit
                                    </button>
                                    <button className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition">
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-in">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Domain</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Domain Name</label>
                                <input className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="example.com" />
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Server</label>
                                <select className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option>prod-server-01</option>
                                    <option>prod-server-02</option>
                                    <option>staging-server</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Document Root</label>
                                <input className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="/var/www/example.com/public" />
                            </div>
                            <label className="flex items-center gap-2 text-sm text-dark-300">
                                <input type="checkbox" className="rounded" /> Use as Reverse Proxy
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-dark-800/50 text-dark-300 rounded-xl hover:bg-dark-700/50 transition">Cancel</button>
                            <button className="flex-1 py-2.5 gradient-primary text-white rounded-xl hover:opacity-90 transition">Add Domain</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
