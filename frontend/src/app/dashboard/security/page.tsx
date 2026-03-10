'use client';
import { useState } from 'react';

const mockRules = [
    { id: '1', name: 'Allow SSH', action: 'allow', sourceIp: '0.0.0.0/0', port: 22, protocol: 'tcp', isActive: true },
    { id: '2', name: 'Allow HTTP', action: 'allow', sourceIp: '0.0.0.0/0', port: 80, protocol: 'tcp', isActive: true },
    { id: '3', name: 'Allow HTTPS', action: 'allow', sourceIp: '0.0.0.0/0', port: 443, protocol: 'tcp', isActive: true },
    { id: '4', name: 'Block Scanner', action: 'deny', sourceIp: '10.0.0.50', port: null, protocol: 'any', isActive: true },
    { id: '5', name: 'Allow DB Local', action: 'allow', sourceIp: '192.168.1.0/24', port: 5432, protocol: 'tcp', isActive: true },
    { id: '6', name: 'Block Brute Force', action: 'deny', sourceIp: '172.16.0.22', port: 22, protocol: 'tcp', isActive: false },
];

const mockFail2ban = {
    jails: [
        { name: 'sshd', currentlyBanned: 3, totalBanned: 47, bannedIps: ['192.168.1.100', '10.0.0.50', '172.16.0.22'] },
        { name: 'nginx-http-auth', currentlyBanned: 1, totalBanned: 12, bannedIps: ['192.168.1.200'] },
        { name: 'nginx-botsearch', currentlyBanned: 5, totalBanned: 89, bannedIps: ['10.0.0.1', '10.0.0.2', '10.0.0.3', '10.0.0.4', '10.0.0.5'] },
    ],
};

export default function SecurityPage() {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'firewall' | 'fail2ban'>('firewall');

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Security</h1>
                    <p className="text-dark-400 text-sm mt-1">Firewall rules and intrusion prevention</p>
                </div>
                {activeTab === 'firewall' && (
                    <button onClick={() => setShowModal(true)} className="px-4 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/25">
                        + Add Rule
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <button onClick={() => setActiveTab('firewall')}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'firewall' ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-dark-800/30 text-dark-400 hover:text-white'}`}>
                    🛡️ Firewall Rules
                </button>
                <button onClick={() => setActiveTab('fail2ban')}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'fail2ban' ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-dark-800/30 text-dark-400 hover:text-white'}`}>
                    🚫 Fail2Ban
                </button>
            </div>

            {activeTab === 'firewall' && (
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
                            {mockRules.map((rule) => (
                                <tr key={rule.id} className="hover:bg-dark-800/30 transition">
                                    <td className="px-6 py-4 text-white font-medium text-sm">{rule.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${rule.action === 'allow' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {rule.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-dark-300 text-sm font-mono">{rule.sourceIp}</td>
                                    <td className="px-6 py-4 text-dark-300 text-sm">{rule.port || 'Any'}</td>
                                    <td className="px-6 py-4 text-dark-300 text-sm">{rule.protocol}</td>
                                    <td className="px-6 py-4">
                                        <button className={`w-10 h-5 rounded-full transition-colors relative ${rule.isActive ? 'bg-primary-500' : 'bg-dark-700'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${rule.isActive ? 'right-0.5' : 'left-0.5'}`}></div>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-xs px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'fail2ban' && (
                <div className="grid gap-4">
                    {mockFail2ban.jails.map((jail) => (
                        <div key={jail.name} className="glass rounded-2xl p-5 card-hover">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 gradient-danger rounded-xl flex items-center justify-center text-lg">🚫</div>
                                    <div>
                                        <h3 className="font-semibold text-white">{jail.name}</h3>
                                        <p className="text-xs text-dark-400">Total banned: {jail.totalBanned} IPs</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-red-400">{jail.currentlyBanned}</p>
                                    <p className="text-xs text-dark-400">Currently banned</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {jail.bannedIps.map(ip => (
                                    <span key={ip} className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded-lg font-mono">{ip}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-in">
                        <h2 className="text-xl font-bold text-white mb-4">Add Firewall Rule</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Rule Name</label>
                                <input className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="My Rule" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Action</label>
                                    <select className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option value="allow">Allow</option>
                                        <option value="deny">Deny</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Protocol</label>
                                    <select className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                        <option>tcp</option>
                                        <option>udp</option>
                                        <option>any</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Source IP</label>
                                    <input className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="0.0.0.0/0" />
                                </div>
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Port</label>
                                    <input type="number" className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="80" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-dark-800/50 text-dark-300 rounded-xl hover:bg-dark-700/50 transition">Cancel</button>
                            <button className="flex-1 py-2.5 gradient-primary text-white rounded-xl hover:opacity-90 transition">Add Rule</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
