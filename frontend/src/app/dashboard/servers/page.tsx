'use client';
import { useState } from 'react';

const mockServers = [
    { id: '1', name: 'prod-server-01', ipAddress: '192.168.1.10', status: 'online', os: 'Ubuntu 22.04', cpuCores: 8, totalMemory: 16384, totalDisk: 500, uptime: '42d 7h', lastHeartbeat: '30s ago' },
    { id: '2', name: 'prod-server-02', ipAddress: '192.168.1.11', status: 'online', os: 'Ubuntu 22.04', cpuCores: 16, totalMemory: 32768, totalDisk: 1000, uptime: '15d 3h', lastHeartbeat: '15s ago' },
    { id: '3', name: 'staging-server', ipAddress: '192.168.1.20', status: 'online', os: 'Ubuntu 24.04', cpuCores: 4, totalMemory: 8192, totalDisk: 250, uptime: '7d 12h', lastHeartbeat: '45s ago' },
    { id: '4', name: 'db-server-01', ipAddress: '192.168.1.30', status: 'maintenance', os: 'Ubuntu 22.04', cpuCores: 8, totalMemory: 65536, totalDisk: 2000, uptime: '—', lastHeartbeat: '2h ago' },
];

export default function ServersPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Servers</h1>
                    <p className="text-dark-400 text-sm mt-1">Manage your connected servers</p>
                </div>
                <button onClick={() => setShowModal(true)} className="px-4 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/25">
                    + Add Server
                </button>
            </div>

            <div className="grid gap-4">
                {mockServers.map((server) => (
                    <div key={server.id} className="glass rounded-2xl p-5 card-hover">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white text-xl">🖥️</div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                                        <span className={`status-dot ${server.status === 'online' ? 'status-online' : 'status-pending'}`}></span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${server.status === 'online' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                            {server.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-dark-400">{server.ipAddress} • {server.os}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="text-center">
                                    <p className="text-dark-500 text-xs">CPU</p>
                                    <p className="text-white font-medium">{server.cpuCores} cores</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-dark-500 text-xs">RAM</p>
                                    <p className="text-white font-medium">{(server.totalMemory / 1024).toFixed(0)} GB</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-dark-500 text-xs">Disk</p>
                                    <p className="text-white font-medium">{server.totalDisk} GB</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-dark-500 text-xs">Uptime</p>
                                    <p className="text-white font-medium">{server.uptime}</p>
                                </div>
                                <button className="px-3 py-1.5 bg-dark-800/50 text-dark-300 rounded-lg hover:bg-dark-700/50 transition text-xs">
                                    Manage →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Server Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-in">
                        <h2 className="text-xl font-bold text-white mb-4">Add New Server</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Server Name</label>
                                <input className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="my-server" />
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">IP Address</label>
                                <input className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="192.168.1.100" />
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">SSH Port</label>
                                <input type="number" className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" defaultValue="22" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-dark-800/50 text-dark-300 rounded-xl hover:bg-dark-700/50 transition">Cancel</button>
                            <button className="flex-1 py-2.5 gradient-primary text-white rounded-xl hover:opacity-90 transition">Add Server</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
