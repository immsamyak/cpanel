'use client';
import { useState, useEffect } from 'react';
import { Globe, Plus, Pencil, Trash2, Lock, Loader2 } from 'lucide-react';
import { domainsApi, serversApi } from '@/lib/api';

export default function DomainsPage() {
    const [domains, setDomains] = useState<any[]>([]);
    const [servers, setServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', serverId: '', documentRoot: '', type: 'primary' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [domRes, srvRes] = await Promise.allSettled([domainsApi.list(), serversApi.list()]);
            if (domRes.status === 'fulfilled') setDomains(Array.isArray(domRes.value.data) ? domRes.value.data : []);
            if (srvRes.status === 'fulfilled') setServers(Array.isArray(srvRes.value.data) ? srvRes.value.data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCreating(true);
        try {
            await domainsApi.create(form);
            setShowModal(false);
            setForm({ name: '', serverId: '', documentRoot: '', type: 'primary' });
            await loadData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create domain');
        } finally { setCreating(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this domain?')) return;
        try { await domainsApi.delete(id); await loadData(); } catch (err) { console.error(err); }
    };

    const handleToggle = async (id: string) => {
        try { await domainsApi.toggle(id); await loadData(); } catch (err) { console.error(err); }
    };

    const getStatusBadge = (status: string) => {
        const styles: any = { active: 'bg-green-500/10 text-green-400', inactive: 'bg-red-500/10 text-red-400', pending: 'bg-yellow-500/10 text-yellow-400' };
        return styles[status] || styles.pending;
    };

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-primary-400" /></div>;

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

            {domains.length === 0 ? (
                <div className="glass rounded-2xl p-16 text-center">
                    <Globe size={48} className="mx-auto mb-4 text-dark-500" />
                    <h3 className="text-lg font-semibold text-white mb-2">No domains yet</h3>
                    <p className="text-dark-400 mb-4">Add your first domain to get started</p>
                    <button onClick={() => setShowModal(true)} className="px-6 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition">Add Domain</button>
                </div>
            ) : (
                <div className="glass rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-700/50">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Domain</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Type</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">SSL</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-800/50">
                            {domains.map((domain: any) => (
                                <tr key={domain.id} className="hover:bg-dark-800/30 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Globe size={16} className="text-primary-400" />
                                            <span className="text-white font-medium">{domain.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-xs px-2 py-1 rounded-lg bg-dark-800/50 text-dark-300">{domain.type}</span></td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleToggle(domain.id)} className={`text-xs px-2 py-1 rounded-full cursor-pointer ${getStatusBadge(domain.status)}`}>{domain.status}</button>
                                    </td>
                                    <td className="px-6 py-4">
                                        {domain.sslEnabled ? <span className="flex items-center gap-1 text-green-400 text-sm"><Lock size={13} /> Active</span> : <span className="text-dark-500">-</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(domain.id)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition">
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <form onSubmit={handleCreate} className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-in">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Domain</h2>
                        {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Domain Name</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                    className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="example.com" />
                            </div>
                            {servers.length > 0 && (
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Server</label>
                                    <select value={form.serverId} onChange={(e) => setForm({ ...form, serverId: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="">Select a server</option>
                                        {servers.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.ipAddress})</option>)}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Document Root</label>
                                <input value={form.documentRoot} onChange={(e) => setForm({ ...form, documentRoot: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="/var/www/example.com/public" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-dark-800/50 text-dark-300 rounded-xl hover:bg-dark-700/50 transition">Cancel</button>
                            <button type="submit" disabled={creating} className="flex-1 py-2.5 gradient-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50">
                                {creating ? 'Adding...' : 'Add Domain'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
