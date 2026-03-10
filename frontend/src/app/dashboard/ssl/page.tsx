'use client';
import { useState } from 'react';
import { Lock, Plus, RefreshCw, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const mockCerts = [
    { id: '1', domain: 'example.com', status: 'active', issuer: "Let's Encrypt", issuedAt: '2024-01-01', expiresAt: '2024-04-01', autoRenew: true, daysLeft: 68 },
    { id: '2', domain: 'staging.example.com', status: 'active', issuer: "Let's Encrypt", issuedAt: '2024-01-15', expiresAt: '2024-04-15', autoRenew: true, daysLeft: 82 },
    { id: '3', domain: 'api.example.com', status: 'active', issuer: "Let's Encrypt", issuedAt: '2023-12-01', expiresAt: '2024-03-01', autoRenew: true, daysLeft: 5 },
    { id: '4', domain: 'mysite.io', status: 'pending', issuer: "—", issuedAt: '—', expiresAt: '—', autoRenew: false, daysLeft: 0 },
];

export default function SslPage() {
    const [showModal, setShowModal] = useState(false);

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

            <div className="grid gap-4">
                {mockCerts.map((cert) => (
                    <div key={cert.id} className="glass rounded-2xl p-5 card-hover">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${cert.status === 'active' ? 'gradient-success' : 'gradient-warning'}`}>
                                    <Lock size={22} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{cert.domain}</h3>
                                    <p className="text-sm text-dark-400">Issued by {cert.issuer}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="text-center">
                                    <p className="text-dark-500 text-xs">Status</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${cert.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{cert.status}</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-dark-500 text-xs">Expires</p>
                                    <p className={`font-medium ${cert.daysLeft > 30 ? 'text-green-400' : cert.daysLeft > 7 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {cert.daysLeft > 0 ? `${cert.daysLeft} days` : '—'}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-dark-500 text-xs">Auto Renew</p>
                                    <p className="text-white font-medium">
                                        {cert.autoRenew ? <CheckCircle size={16} className="inline text-green-400" /> : <AlertTriangle size={16} className="inline text-dark-500" />}
                                    </p>
                                </div>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition text-xs">
                                    <RefreshCw size={12} /> Renew
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-in">
                        <h2 className="text-xl font-bold text-white mb-4">Request SSL Certificate</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Domain</label>
                                <input className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="example.com" />
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Server</label>
                                <select className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option>prod-server-01</option>
                                    <option>prod-server-02</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-2 text-sm text-dark-300">
                                <input type="checkbox" defaultChecked className="rounded" /> Enable auto-renewal
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-dark-800/50 text-dark-300 rounded-xl hover:bg-dark-700/50 transition">Cancel</button>
                            <button className="flex-1 py-2.5 gradient-primary text-white rounded-xl hover:opacity-90 transition">Request Certificate</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
