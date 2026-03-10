'use client';
import { useState, useEffect } from 'react';
import { HardDrive, Plus, RotateCcw, Trash2, Clock, Loader2 } from 'lucide-react';
import { backupsApi, serversApi } from '@/lib/api';

const statusColors: any = { completed: 'bg-green-500/10 text-green-400', in_progress: 'bg-yellow-500/10 text-yellow-400', failed: 'bg-red-500/10 text-red-400', pending: 'bg-blue-500/10 text-blue-400' };

export default function BackupsPage() {
    const [backups, setBackups] = useState<any[]>([]);
    const [servers, setServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', serverId: '', storage: 'local' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [bkRes, srvRes] = await Promise.allSettled([backupsApi.list(), serversApi.list()]);
            if (bkRes.status === 'fulfilled') setBackups(Array.isArray(bkRes.value.data) ? bkRes.value.data : []);
            if (srvRes.status === 'fulfilled') setServers(Array.isArray(srvRes.value.data) ? srvRes.value.data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCreating(true);
        try {
            await backupsApi.create(form);
            setShowModal(false);
            setForm({ name: '', serverId: '', storage: 'local' });
            await loadData();
        } catch (err: any) { setError(err.response?.data?.message || 'Failed to create backup'); }
        finally { setCreating(false); }
    };

    const handleRestore = async (id: string) => {
        if (!confirm('Are you sure you want to restore this backup?')) return;
        try { await backupsApi.restore(id); await loadData(); } catch (err) { console.error(err); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this backup?')) return;
        try { await backupsApi.delete(id); await loadData(); } catch (err) { console.error(err); }
    };

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-primary-400" /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Backups</h1>
                    <p className="text-dark-400 text-sm mt-1">Create and manage server backups</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/25">
                    <Plus size={16} /> Create Backup
                </button>
            </div>

            {backups.length === 0 ? (
                <div className="glass rounded-2xl p-16 text-center">
                    <HardDrive size={48} className="mx-auto mb-4 text-dark-500" />
                    <h3 className="text-lg font-semibold text-white mb-2">No backups yet</h3>
                    <p className="text-dark-400 mb-4">Create your first backup to protect your data</p>
                    <button onClick={() => setShowModal(true)} className="px-6 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition">Create Backup</button>
                </div>
            ) : (
                <div className="glass rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-700/50">
                                <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Backup</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Size</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Storage</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Created</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-800/50">
                            {backups.map((backup: any) => (
                                <tr key={backup.id} className="hover:bg-dark-800/30 transition">
                                    <td className="px-6 py-4 text-white font-medium text-sm">{backup.name || `Backup ${backup.id.slice(0, 8)}`}</td>
                                    <td className="px-6 py-4"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[backup.status] || 'bg-dark-800 text-dark-300'}`}>{backup.status}</span></td>
                                    <td className="px-6 py-4 text-dark-300 text-sm">{backup.size || '-'}</td>
                                    <td className="px-6 py-4"><span className="text-xs px-2 py-0.5 rounded-lg bg-dark-800/50 text-dark-300">{backup.storage || 'local'}</span></td>
                                    <td className="px-6 py-4 text-dark-400 text-sm">{backup.createdAt ? new Date(backup.createdAt).toLocaleDateString() : '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleRestore(backup.id)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition mr-2">
                                            <RotateCcw size={12} /> Restore
                                        </button>
                                        <button onClick={() => handleDelete(backup.id)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition">
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
                        <h2 className="text-xl font-bold text-white mb-4">Create Backup</h2>
                        {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Backup Name</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                    className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="My Backup" />
                            </div>
                            {servers.length > 0 && (
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Server</label>
                                    <select value={form.serverId} onChange={(e) => setForm({ ...form, serverId: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="">Select a server</option>
                                        {servers.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Storage</label>
                                <select value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option value="local">Local Disk</option><option value="s3">S3 Compatible</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-dark-800/50 text-dark-300 rounded-xl hover:bg-dark-700/50 transition">Cancel</button>
                            <button type="submit" disabled={creating} className="flex-1 py-2.5 gradient-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50">
                                {creating ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
