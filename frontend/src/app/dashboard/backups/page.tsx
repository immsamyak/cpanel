'use client';
import { useState } from 'react';

const mockBackups = [
    { id: '1', name: 'Full Backup - Jan 15', server: 'prod-server-01', status: 'completed', size: '2.4 GB', storage: 'local', createdAt: '2024-01-15 10:00', scheduled: false },
    { id: '2', name: 'Daily Backup', server: 'prod-server-01', status: 'completed', size: '2.1 GB', storage: 's3', createdAt: '2024-01-14 06:00', scheduled: true },
    { id: '3', name: 'Database Backup', server: 'db-server-01', status: 'completed', size: '450 MB', storage: 's3', createdAt: '2024-01-14 03:00', scheduled: true },
    { id: '4', name: 'Pre-deploy Backup', server: 'prod-server-02', status: 'in_progress', size: '—', storage: 'local', createdAt: '2024-01-15 14:00', scheduled: false },
];

const statusColors: any = { completed: 'bg-green-500/10 text-green-400', in_progress: 'bg-yellow-500/10 text-yellow-400', failed: 'bg-red-500/10 text-red-400', pending: 'bg-blue-500/10 text-blue-400' };

export default function BackupsPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Backups</h1>
                    <p className="text-dark-400 text-sm mt-1">Create and manage server backups</p>
                </div>
                <button onClick={() => setShowModal(true)} className="px-4 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/25">
                    + Create Backup
                </button>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-dark-700/50">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Backup</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Server</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Status</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Size</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Storage</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Created</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-800/50">
                        {mockBackups.map((backup) => (
                            <tr key={backup.id} className="hover:bg-dark-800/30 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium">{backup.name}</span>
                                        {backup.scheduled && <span className="text-xs px-1.5 py-0.5 bg-primary-500/10 text-primary-400 rounded">auto</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-dark-400 text-sm">{backup.server}</td>
                                <td className="px-6 py-4"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[backup.status]}`}>{backup.status.replace('_', ' ')}</span></td>
                                <td className="px-6 py-4 text-dark-300 text-sm">{backup.size}</td>
                                <td className="px-6 py-4"><span className="text-xs px-2 py-0.5 rounded-lg bg-dark-800/50 text-dark-300">{backup.storage}</span></td>
                                <td className="px-6 py-4 text-dark-400 text-sm">{backup.createdAt}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-xs px-3 py-1.5 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition mr-2">Restore</button>
                                    <button className="text-xs px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-in">
                        <h2 className="text-xl font-bold text-white mb-4">Create Backup</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Backup Name</label>
                                <input className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="My Backup" />
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Server</label>
                                <select className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option>prod-server-01</option>
                                    <option>prod-server-02</option>
                                    <option>db-server-01</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Storage</label>
                                <select className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option value="local">Local Disk</option>
                                    <option value="s3">S3 Compatible</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-dark-800/50 text-dark-300 rounded-xl hover:bg-dark-700/50 transition">Cancel</button>
                            <button className="flex-1 py-2.5 gradient-primary text-white rounded-xl hover:opacity-90 transition">Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
