'use client';
import { useState, useEffect } from 'react';
import { Rocket, Plus, Square, Play, RefreshCw, Trash2, Loader2, Box, FileCode, Globe2, Container } from 'lucide-react';
import { deploymentsApi, serversApi } from '@/lib/api';

const typeIcons: any = { nodejs: Box, laravel: FileCode, static: Globe2, docker: Container };
const typeColors: any = { nodejs: 'bg-green-500/10 text-green-400', laravel: 'bg-red-500/10 text-red-400', static: 'bg-blue-500/10 text-blue-400', docker: 'bg-cyan-500/10 text-cyan-400' };
const statusColors: any = { running: 'bg-green-500/10 text-green-400', deploying: 'bg-yellow-500/10 text-yellow-400', stopped: 'bg-red-500/10 text-red-400', failed: 'bg-red-500/10 text-red-400' };

export default function DeploymentsPage() {
    const [deployments, setDeployments] = useState<any[]>([]);
    const [servers, setServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', type: 'nodejs', serverId: '', repositoryUrl: '', branch: 'main', port: 3000 });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [depRes, srvRes] = await Promise.allSettled([deploymentsApi.list(), serversApi.list()]);
            if (depRes.status === 'fulfilled') setDeployments(Array.isArray(depRes.value.data) ? depRes.value.data : []);
            if (srvRes.status === 'fulfilled') setServers(Array.isArray(srvRes.value.data) ? srvRes.value.data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCreating(true);
        try {
            await deploymentsApi.create(form);
            setShowModal(false);
            setForm({ name: '', type: 'nodejs', serverId: '', repositoryUrl: '', branch: 'main', port: 3000 });
            await loadData();
        } catch (err: any) { setError(err.response?.data?.message || 'Failed to create deployment'); }
        finally { setCreating(false); }
    };

    const handleStop = async (id: string) => { try { await deploymentsApi.stop(id); await loadData(); } catch (err) { console.error(err); } };
    const handleRestart = async (id: string) => { try { await deploymentsApi.restart(id); await loadData(); } catch (err) { console.error(err); } };
    const handleDelete = async (id: string) => { if (!confirm('Delete this deployment?')) return; try { await deploymentsApi.delete(id); await loadData(); } catch (err) { console.error(err); } };

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-primary-400" /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Deployments</h1>
                    <p className="text-dark-400 text-sm mt-1">Deploy and manage applications</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/25">
                    <Plus size={16} /> New Deployment
                </button>
            </div>

            {deployments.length === 0 ? (
                <div className="glass rounded-2xl p-16 text-center">
                    <Rocket size={48} className="mx-auto mb-4 text-dark-500" />
                    <h3 className="text-lg font-semibold text-white mb-2">No deployments yet</h3>
                    <p className="text-dark-400 mb-4">Deploy your first application</p>
                    <button onClick={() => setShowModal(true)} className="px-6 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition">New Deployment</button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {deployments.map((dep: any) => {
                        const TypeIcon = typeIcons[dep.type] || Box;
                        return (
                            <div key={dep.id} className="glass rounded-2xl p-5 card-hover">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 gradient-info rounded-xl flex items-center justify-center shadow-lg">
                                            <TypeIcon size={22} className="text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-semibold text-white">{dep.name}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[dep.type] || 'bg-dark-800 text-dark-300'}`}>{dep.type}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[dep.status] || 'bg-dark-800 text-dark-300'}`}>{dep.status}</span>
                                            </div>
                                            <p className="text-sm text-dark-400">Port {dep.port || '-'} · Branch: {dep.branch || 'main'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {dep.status === 'running' && (
                                            <button onClick={() => handleStop(dep.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition text-xs">
                                                <Square size={12} /> Stop
                                            </button>
                                        )}
                                        <button onClick={() => handleRestart(dep.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition text-xs">
                                            <RefreshCw size={12} /> Restart
                                        </button>
                                        <button onClick={() => handleDelete(dep.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition text-xs">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <form onSubmit={handleCreate} className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-in">
                        <h2 className="text-xl font-bold text-white mb-4">New Deployment</h2>
                        {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Application Name</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                    className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="my-app" />
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Type</label>
                                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option value="nodejs">Node.js</option><option value="laravel">Laravel</option>
                                    <option value="static">Static Website</option><option value="docker">Docker Container</option>
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
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Repository URL</label>
                                <input value={form.repositoryUrl} onChange={(e) => setForm({ ...form, repositoryUrl: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="https://github.com/user/repo" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Branch</label>
                                    <input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Port</label>
                                    <input type="number" value={form.port} onChange={(e) => setForm({ ...form, port: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-dark-800/50 text-dark-300 rounded-xl hover:bg-dark-700/50 transition">Cancel</button>
                            <button type="submit" disabled={creating} className="flex-1 py-2.5 gradient-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50">
                                {creating ? 'Deploying...' : 'Deploy'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
