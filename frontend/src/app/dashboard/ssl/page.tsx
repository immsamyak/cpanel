'use client';
import { useState, useEffect } from 'react';
import { Lock, Plus, RefreshCw, CheckCircle, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { sslApi, serversApi } from '@/lib/api';

export default function SslPage() {
    const [certs, setCerts] = useState<any[]>([]);
    const [servers, setServers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ domain: '', serverId: '', autoRenew: true });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [sslRes, srvRes] = await Promise.allSettled([sslApi.list(), serversApi.list()]);
            if (sslRes.status === 'fulfilled') setCerts(Array.isArray(sslRes.value.data) ? sslRes.value.data : []);
            if (srvRes.status === 'fulfilled') setServers(Array.isArray(srvRes.value.data) ? srvRes.value.data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCreating(true);
        try {
            await sslApi.request(form);
            setShowModal(false);
            setForm({ domain: '', serverId: '', autoRenew: true });
            await loadData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to request certificate');
        } finally { setCreating(false); }
    };

    const handleRenew = async (id: string) => {
        try { await sslApi.renew(id); await loadData(); } catch (err) { console.error(err); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this certificate?')) return;
        try { await sslApi.delete(id); await loadData(); } catch (err) { console.error(err); }
    };

    const getDaysUntilExpiry = (expiresAt: string) => {
        if (!expiresAt) return 0;
        return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000));
    };

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-primary-400" /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">SSL Certificates</h1>
                    <p className="text-dark-400 text-sm mt-1">Manage SSL/TLS certificates for your domains</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/25">
                    <Plus size={16} /> Request Certificate
                </button>
            </div>

            {certs.length === 0 ? (
                <div className="glass rounded-2xl p-16 text-center">
                    <Lock size={48} className="mx-auto mb-4 text-dark-500" />
                    <h3 className="text-lg font-semibold text-white mb-2">No certificates yet</h3>
                    <p className="text-dark-400 mb-4">Request an SSL certificate for your domain</p>
                    <button onClick={() => setShowModal(true)} className="px-6 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition">Request Certificate</button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {certs.map((cert: any) => {
                        const daysLeft = getDaysUntilExpiry(cert.expiresAt);
                        return (
                            <div key={cert.id} className="glass rounded-2xl p-5 card-hover">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${cert.status === 'active' ? 'gradient-success' : 'gradient-warning'}`}>
                                            <Lock size={22} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{cert.domain}</h3>
                                            <p className="text-sm text-dark-400">Issued by {cert.issuer || "Let's Encrypt"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <p className="text-dark-500 text-xs">Status</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${cert.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{cert.status}</span>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-dark-500 text-xs">Expires</p>
                                            <p className={`font-medium ${daysLeft > 30 ? 'text-green-400' : daysLeft > 7 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {cert.expiresAt ? `${daysLeft} days` : '-'}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-dark-500 text-xs">Auto Renew</p>
                                            {cert.autoRenew ? <CheckCircle size={16} className="inline text-green-400" /> : <AlertTriangle size={16} className="inline text-dark-500" />}
                                        </div>
                                        <button onClick={() => handleRenew(cert.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition text-xs">
                                            <RefreshCw size={12} /> Renew
                                        </button>
                                        <button onClick={() => handleDelete(cert.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition text-xs">
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
                    <form onSubmit={handleRequest} className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-in">
                        <h2 className="text-xl font-bold text-white mb-4">Request SSL Certificate</h2>
                        {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Domain</label>
                                <input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} required
                                    className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="example.com" />
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
                            <label className="flex items-center gap-2 text-sm text-dark-300">
                                <input type="checkbox" checked={form.autoRenew} onChange={(e) => setForm({ ...form, autoRenew: e.target.checked })} className="rounded" /> Enable auto-renewal
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-dark-800/50 text-dark-300 rounded-xl hover:bg-dark-700/50 transition">Cancel</button>
                            <button type="submit" disabled={creating} className="flex-1 py-2.5 gradient-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-50">
                                {creating ? 'Requesting...' : 'Request Certificate'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
