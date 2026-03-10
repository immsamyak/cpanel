'use client';
import { useState } from 'react';

const mockDeployments = [
    { id: '1', name: 'api-service', type: 'nodejs', status: 'running', server: 'prod-server-01', port: 3001, branch: 'main', uptime: '12d 5h' },
    { id: '2', name: 'web-frontend', type: 'static', status: 'running', server: 'prod-server-01', port: 80, branch: 'main', uptime: '12d 5h' },
    { id: '3', name: 'blog-app', type: 'laravel', status: 'running', server: 'prod-server-02', port: 8080, branch: 'production', uptime: '3d 14h' },
    { id: '4', name: 'microservice-auth', type: 'docker', status: 'deploying', server: 'prod-server-02', port: 4000, branch: 'main', uptime: '—' },
    { id: '5', name: 'analytics-worker', type: 'nodejs', status: 'stopped', server: 'staging-server', port: 5000, branch: 'develop', uptime: '—' },
];

const typeIcons: any = { nodejs: '⬢', laravel: '🔺', static: '📄', docker: '🐳' };
const typeColors: any = { nodejs: 'bg-green-500/10 text-green-400', laravel: 'bg-red-500/10 text-red-400', static: 'bg-blue-500/10 text-blue-400', docker: 'bg-cyan-500/10 text-cyan-400' };
const statusColors: any = { running: 'bg-green-500/10 text-green-400', deploying: 'bg-yellow-500/10 text-yellow-400', stopped: 'bg-red-500/10 text-red-400', failed: 'bg-red-500/10 text-red-400' };

export default function DeploymentsPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Deployments</h1>
                    <p className="text-dark-400 text-sm mt-1">Deploy and manage applications</p>
                </div>
                <button onClick={() => setShowModal(true)} className="px-4 py-2.5 gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition shadow-lg shadow-primary-500/25">
                    + New Deployment
                </button>
            </div>

            <div className="grid gap-4">
                {mockDeployments.map((dep) => (
                    <div key={dep.id} className="glass rounded-2xl p-5 card-hover">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 gradient-info rounded-xl flex items-center justify-center text-xl shadow-lg">
                                    {typeIcons[dep.type]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-white">{dep.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[dep.type]}`}>{dep.type}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[dep.status]}`}>{dep.status}</span>
                                    </div>
                                    <p className="text-sm text-dark-400">{dep.server} • Port {dep.port} • Branch: {dep.branch}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {dep.status === 'running' && (
                                    <button className="px-3 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition text-xs">Stop</button>
                                )}
                                {dep.status === 'stopped' && (
                                    <button className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition text-xs">Start</button>
                                )}
                                <button className="px-3 py-1.5 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition text-xs">Restart</button>
                                <button className="px-3 py-1.5 bg-dark-800/50 text-dark-300 rounded-lg hover:bg-dark-700/50 transition text-xs">Logs</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass rounded-2xl p-6 w-full max-w-lg animate-slide-in">
                        <h2 className="text-xl font-bold text-white mb-4">New Deployment</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Application Name</label>
                                <input className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="my-app" />
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Type</label>
                                <select className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option value="nodejs">Node.js</option>
                                    <option value="laravel">Laravel</option>
                                    <option value="static">Static Website</option>
                                    <option value="docker">Docker Container</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Server</label>
                                <select className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option>prod-server-01</option>
                                    <option>prod-server-02</option>
                                    <option>staging-server</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-dark-300 mb-1">Repository URL</label>
                                <input className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" placeholder="https://github.com/user/repo" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Branch</label>
                                    <input className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" defaultValue="main" />
                                </div>
                                <div>
                                    <label className="block text-sm text-dark-300 mb-1">Port</label>
                                    <input type="number" className="w-full px-4 py-2.5 bg-dark-900/50 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" defaultValue="3000" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-dark-800/50 text-dark-300 rounded-xl hover:bg-dark-700/50 transition">Cancel</button>
                            <button className="flex-1 py-2.5 gradient-primary text-white rounded-xl hover:opacity-90 transition">Deploy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
