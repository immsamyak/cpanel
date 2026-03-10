'use client';
import { useState } from 'react';

const mockDatabases = [
    { id: '1', name: 'app_production', type: 'postgresql', server: 'db-server-01', size: '245 MB', user: 'app_user', host: 'localhost', port: 5432 },
    { id: '2', name: 'app_staging', type: 'postgresql', server: 'staging-server', size: '128 MB', user: 'staging_user', host: 'localhost', port: 5432 },
    { id: '3', name: 'analytics_db', type: 'mysql', server: 'db-server-01', size: '1.2 GB', user: 'analytics', host: 'localhost', port: 3306 },
    { id: '4', name: 'wordpress_db', type: 'mysql', server: 'prod-server-01', size: '85 MB', user: 'wp_user', host: 'localhost', port: 3306 },
];

export default function DatabasesPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Databases</h1>
                    <p className="text-dark-400 text-sm mt-1">Manage MySQL and PostgreSQL databases</p>
                </div>
                <button onClick={() => setShowModal(true)} className="px-4 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/25">
                    + Create Database
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {mockDatabases.map((db) => (
                    <div key={db.id} className="glass rounded-2xl p-5 card-hover">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${db.type === 'postgresql' ? 'gradient-info' : 'gradient-warning'}`}>
                                    🗄️
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{db.name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${db.type === 'postgresql' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                        {db.type}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-2 py-1 text-xs bg-dark-800/50 text-dark-300 rounded-lg hover:bg-dark-700/50 transition">Backup</button>
                                <button className="px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition">Delete</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-dark-500">Server:</span> <span className="text-dark-200 ml-1">{db.server}</span></div>
                            <div><span className="text-dark-500">Size:</span> <span className="text-dark-200 ml-1">{db.size}</span></div>
                            <div><span className="text-dark-500">User:</span> <span className="text-dark-200 ml-1">{db.user}</span></div>
                            <div><span className="text-dark-500">Port:</span> <span className="text-dark-200 ml-1">{db.port}</span></div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-in">
                        <h2 className="text-xl font-bold text-white mb-4">Create Database</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Database Name</label>
                                <input className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="my_database" />
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Type</label>
                                <select className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option value="postgresql">PostgreSQL</option>
                                    <option value="mysql">MySQL</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Server</label>
                                <select className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option>db-server-01</option>
                                    <option>prod-server-01</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Username</label>
                                    <input className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="db_user" />
                                </div>
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Password</label>
                                    <input type="password" className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="••••••••" />
                                </div>
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
