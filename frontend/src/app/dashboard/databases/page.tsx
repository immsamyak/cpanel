'use client';
import { useState, useEffect } from 'react';
import { Database, Plus, HardDrive, Trash2, Loader2 } from 'lucide-react';
import { databasesApi, serversApi } from '@/lib/api';

export default function DatabasesPage() {
    const [databases, setDatabases] = useState<any[]>([]);
    const [servers, setServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', type: 'postgresql', serverId: '', username: '', password: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [dbRes, srvRes] = await Promise.allSettled([databasesApi.list(), serversApi.list()]);
            if (dbRes.status === 'fulfilled') setDatabases(Array.isArray(dbRes.value.data) ? dbRes.value.data : []);
            if (srvRes.status === 'fulfilled') setServers(Array.isArray(srvRes.value.data) ? srvRes.value.data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCreating(true);
        try {
            await databasesApi.create(form);
            setShowModal(false);
            setForm({ name: '', type: 'postgresql', serverId: '', username: '', password: '' });
            await loadData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create database');
        } finally { setCreating(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this database? This action cannot be undone.')) return;
        try { await databasesApi.delete(id); await loadData(); } catch (err) { console.error(err); }
    };

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-primary-400" /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Databases</h1>
                    <p className="text-dark-400 text-sm mt-1">Manage MySQL and PostgreSQL databases</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/25">
                    <Plus size={16} /> Create Database
                </button>
            </div>

            {databases.length === 0 ? (
                <div className="glass rounded-2xl p-16 text-center">
                    <Database size={48} className="mx-auto mb-4 text-dark-500" />
                    <h3 className="text-lg font-semibold text-white mb-2">No databases yet</h3>
                    <p className="text-dark-400 mb-4">Create your first database</p>
                    <button onClick={() => setShowModal(true)} className="px-6 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition">Create Database</button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {databases.map((db: any) => (
                        <div key={db.id} className="glass rounded-2xl p-5 card-hover">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${db.type === 'postgresql' ? 'gradient-info' : 'gradient-warning'}`}>
                                        <Database size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{db.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${db.type === 'postgresql' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                            {db.type}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(db.id)} className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition">
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div><span className="text-dark-500">User:</span> <span className="text-dark-200 ml-1">{db.username || '-'}</span></div>
                                <div><span className="text-dark-500">Host:</span> <span className="text-dark-200 ml-1">{db.host || 'localhost'}</span></div>
                                <div><span className="text-dark-500">Port:</span> <span className="text-dark-200 ml-1">{db.port || (db.type === 'postgresql' ? 5432 : 3306)}</span></div>
                                <div><span className="text-dark-500">Created:</span> <span className="text-dark-200 ml-1">{db.createdAt ? new Date(db.createdAt).toLocaleDateString() : '-'}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <form onSubmit={handleCreate} className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-in">
                        <h2 className="text-xl font-bold text-white mb-4">Create Database</h2>
                        {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Database Name</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                    className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="my_database" />
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Type</label>
                                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option value="postgresql">PostgreSQL</option>
                                    <option value="mysql">MySQL</option>
                                </select>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Username</label>
                                    <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="db_user" />
                                </div>
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Password</label>
                                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="secret" />
                                </div>
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
