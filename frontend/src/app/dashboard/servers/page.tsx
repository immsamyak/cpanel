'use client';
import { useState, useEffect } from 'react';
import { Server, Circle, Plus, Settings, Loader2, Trash2 } from 'lucide-react';
import { serversApi } from '@/lib/api';

export default function ServersPage() {
    const [servers, setServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', ipAddress: '', sshPort: 22, agentPort: 3002 });

    useEffect(() => { loadServers(); }, []);

    const loadServers = async () => {
        try {
            const { data } = await serversApi.list();
            setServers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load servers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCreating(true);
        try {
            await serversApi.create(form);
            setShowModal(false);
            setForm({ name: '', ipAddress: '', sshPort: 22, agentPort: 3002 });
            await loadServers();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add server');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this server?')) return;
        try {
            await serversApi.delete(id);
            await loadServers();
        } catch (err) {
            console.error('Failed to delete server:', err);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-primary-400" /></div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Servers</h1>
                    <p className="text-dark-400 text-sm mt-1">Manage your connected servers</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/25">
                    <Plus size={16} /> Add Server
                </button>
            </div>

            {servers.length === 0 ? (
                <div className="glass rounded-2xl p-16 text-center">
                    <Server size={48} className="mx-auto mb-4 text-dark-500" />
                    <h3 className="text-lg font-semibold text-white mb-2">No servers yet</h3>
                    <p className="text-dark-400 mb-4">Add your first server to start managing it</p>
                    <button onClick={() => setShowModal(true)} className="px-6 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition">Add Server</button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {servers.map((server) => (
                        <div key={server.id} className="glass rounded-2xl p-5 card-hover">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                                        <Server size={22} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                                            <Circle size={8} className={`${server.status === 'online' ? 'fill-green-400 text-green-400' : 'fill-yellow-400 text-yellow-400'}`} />
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${server.status === 'online' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                {server.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-dark-400">{server.ipAddress} · {server.os || 'Unknown OS'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <div className="text-center">
                                        <p className="text-dark-500 text-xs">CPU</p>
                                        <p className="text-white font-medium">{server.cpuCores || '—'} cores</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-dark-500 text-xs">RAM</p>
                                        <p className="text-white font-medium">{server.totalMemory ? `${(server.totalMemory / 1024).toFixed(0)} GB` : '—'}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-dark-500 text-xs">Disk</p>
                                        <p className="text-white font-medium">{server.totalDisk ? `${server.totalDisk} GB` : '—'}</p>
                                    </div>
                                    <button onClick={() => handleDelete(server.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition text-xs">
                                        <Trash2 size={13} /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <form onSubmit={handleCreate} className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-in">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Server</h2>
                        {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Server Name</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                    className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="my-server" />
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">IP Address</label>
                                <input value={form.ipAddress} onChange={(e) => setForm({ ...form, ipAddress: e.target.value })} required
                                    className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="192.168.1.100" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">SSH Port</label>
                                    <input type="number" value={form.sshPort} onChange={(e) => setForm({ ...form, sshPort: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Agent Port</label>
                                    <input type="number" value={form.agentPort} onChange={(e) => setForm({ ...form, agentPort: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-dark-800/50 text-dark-300 rounded-xl hover:bg-dark-700/50 transition">Cancel</button>
                            <button type="submit" disabled={creating} className="flex-1 py-2.5 gradient-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50">
                                {creating ? 'Adding...' : 'Add Server'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
