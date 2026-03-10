'use client';
import { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Ban, Loader2 } from 'lucide-react';
import { securityApi, serversApi } from '@/lib/api';

export default function SecurityPage() {
    const [rules, setRules] = useState<any[]>([]);
    const [servers, setServers] = useState<any[]>([]);
    const [selectedServer, setSelectedServer] = useState('');
    const [fail2banData, setFail2banData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'firewall' | 'fail2ban'>('firewall');
    const [form, setForm] = useState({ name: '', action: 'allow', sourceIp: '', port: 80, protocol: 'tcp', serverId: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const srvRes = await serversApi.list();
            const srvList = Array.isArray(srvRes.data) ? srvRes.data : [];
            setServers(srvList);
            if (srvList.length > 0 && !selectedServer) {
                setSelectedServer(srvList[0].id);
                await loadFirewall(srvList[0].id);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const loadFirewall = async (serverId: string) => {
        try {
            const { data } = await securityApi.firewallRules(serverId);
            setRules(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); setRules([]); }
    };

    const loadFail2ban = async (serverId: string) => {
        try {
            const { data } = await securityApi.fail2ban(serverId);
            setFail2banData(data);
        } catch (err) { console.error(err); setFail2banData(null); }
    };

    const handleServerChange = async (serverId: string) => {
        setSelectedServer(serverId);
        if (activeTab === 'firewall') await loadFirewall(serverId);
        else await loadFail2ban(serverId);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCreating(true);
        try {
            await securityApi.createRule({ ...form, serverId: selectedServer });
            setShowModal(false);
            setForm({ name: '', action: 'allow', sourceIp: '', port: 80, protocol: 'tcp', serverId: '' });
            await loadFirewall(selectedServer);
        } catch (err: any) { setError(err.response?.data?.message || 'Failed to create rule'); }
        finally { setCreating(false); }
    };

    const handleToggle = async (id: string) => {
        try { await securityApi.toggleRule(id); await loadFirewall(selectedServer); } catch (err) { console.error(err); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this firewall rule?')) return;
        try { await securityApi.deleteRule(id); await loadFirewall(selectedServer); } catch (err) { console.error(err); }
    };

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-primary-400" /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Security</h1>
                    <p className="text-dark-400 text-sm mt-1">Firewall rules and intrusion prevention</p>
                </div>
                <div className="flex items-center gap-3">
                    {servers.length > 0 && (
                        <select value={selectedServer} onChange={(e) => handleServerChange(e.target.value)}
                            className="px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-primary-500">
                            {servers.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    )}
                    {activeTab === 'firewall' && (
                        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/25">
                            <Plus size={16} /> Add Rule
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-2">
                <button onClick={() => { setActiveTab('firewall'); if (selectedServer) loadFirewall(selectedServer); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'firewall' ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-dark-800/30 text-dark-400 hover:text-white'}`}>
                    <Shield size={14} /> Firewall Rules
                </button>
                <button onClick={() => { setActiveTab('fail2ban'); if (selectedServer) loadFail2ban(selectedServer); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'fail2ban' ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-dark-800/30 text-dark-400 hover:text-white'}`}>
                    <Ban size={14} /> Fail2Ban
                </button>
            </div>

            {servers.length === 0 ? (
                <div className="glass rounded-2xl p-16 text-center">
                    <Shield size={48} className="mx-auto mb-4 text-dark-500" />
                    <h3 className="text-lg font-semibold text-white mb-2">No servers available</h3>
                    <p className="text-dark-400">Add a server first to manage security rules</p>
                </div>
            ) : activeTab === 'firewall' ? (
                rules.length === 0 ? (
                    <div className="glass rounded-2xl p-16 text-center">
                        <Shield size={48} className="mx-auto mb-4 text-dark-500" />
                        <h3 className="text-lg font-semibold text-white mb-2">No firewall rules</h3>
                        <p className="text-dark-400 mb-4">Add rules to control network access</p>
                        <button onClick={() => setShowModal(true)} className="px-6 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition">Add Rule</button>
                    </div>
                ) : (
                    <div className="glass rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dark-700/50">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase">Rule</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase">Action</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase">Source IP</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase">Port</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase">Protocol</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase">Status</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-dark-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-800/50">
                                {rules.map((rule: any) => (
                                    <tr key={rule.id} className="hover:bg-dark-800/30 transition">
                                        <td className="px-6 py-4 text-white font-medium text-sm">{rule.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${rule.action === 'allow' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{rule.action}</span>
                                        </td>
                                        <td className="px-6 py-4 text-dark-300 text-sm font-mono">{rule.sourceIp}</td>
                                        <td className="px-6 py-4 text-dark-300 text-sm">{rule.port || 'Any'}</td>
                                        <td className="px-6 py-4 text-dark-300 text-sm">{rule.protocol}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleToggle(rule.id)} className={`w-10 h-5 rounded-full transition-colors relative ${rule.isActive ? 'bg-primary-500' : 'bg-dark-700'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${rule.isActive ? 'right-0.5' : 'left-0.5'}`}></div>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDelete(rule.id)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition">
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            ) : (
                <div className="glass rounded-2xl p-6 text-center">
                    <Ban size={48} className="mx-auto mb-4 text-dark-500" />
                    <h3 className="text-lg font-semibold text-white mb-2">Fail2Ban Status</h3>
                    <p className="text-dark-400">{fail2banData ? JSON.stringify(fail2banData) : 'Connect the server agent to view Fail2Ban status'}</p>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <form onSubmit={handleCreate} className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-in">
                        <h2 className="text-xl font-bold text-white mb-4">Add Firewall Rule</h2>
                        {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Rule Name</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                    className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="My Rule" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Action</label>
                                    <select value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="allow">Allow</option><option value="deny">Deny</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Protocol</label>
                                    <select value={form.protocol} onChange={(e) => setForm({ ...form, protocol: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option>tcp</option><option>udp</option><option>any</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Source IP</label>
                                    <input value={form.sourceIp} onChange={(e) => setForm({ ...form, sourceIp: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="0.0.0.0/0" />
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
                                {creating ? 'Adding...' : 'Add Rule'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
