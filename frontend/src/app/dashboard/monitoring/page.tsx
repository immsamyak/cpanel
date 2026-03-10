'use client';
import { useState, useEffect } from 'react';

// Generate mock time series data
function generateMetrics(hours: number) {
    const data = [];
    const now = Date.now();
    for (let i = hours; i >= 0; i--) {
        data.push({
            time: new Date(now - i * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cpu: Math.random() * 60 + 10 + Math.sin(i / 3) * 15,
            memory: Math.random() * 30 + 40 + Math.cos(i / 4) * 10,
            disk: 45 + Math.random() * 5,
            netIn: Math.random() * 800 + 200,
            netOut: Math.random() * 500 + 100,
        });
    }
    return data;
}

export default function MonitoringPage() {
    const [metrics, setMetrics] = useState<any[]>([]);
    const [selectedServer, setSelectedServer] = useState('prod-server-01');

    useEffect(() => {
        setMetrics(generateMetrics(24));
    }, [selectedServer]);

    const latestMetric = metrics[metrics.length - 1] || {};

    const MetricCard = ({ title, value, unit, color, icon }: any) => (
        <div className="glass rounded-2xl p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{icon}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${color}`}>Live</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{typeof value === 'number' ? value.toFixed(1) : value}{unit}</div>
            <p className="text-sm text-dark-400">{title}</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Monitoring</h1>
                    <p className="text-dark-400 text-sm mt-1">Real-time server performance metrics</p>
                </div>
                <select value={selectedServer} onChange={(e) => setSelectedServer(e.target.value)}
                    className="px-4 py-2 bg-dark-800/50 border border-dark-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="prod-server-01">prod-server-01</option>
                    <option value="prod-server-02">prod-server-02</option>
                    <option value="staging-server">staging-server</option>
                </select>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                <MetricCard title="CPU Usage" value={latestMetric.cpu} unit="%" color="bg-blue-500/10 text-blue-400" icon="⚡" />
                <MetricCard title="Memory Usage" value={latestMetric.memory} unit="%" color="bg-purple-500/10 text-purple-400" icon="🧠" />
                <MetricCard title="Disk Usage" value={latestMetric.disk} unit="%" color="bg-green-500/10 text-green-400" icon="💿" />
                <MetricCard title="Network In" value={latestMetric.netIn} unit=" KB/s" color="bg-cyan-500/10 text-cyan-400" icon="📥" />
                <MetricCard title="Network Out" value={latestMetric.netOut} unit=" KB/s" color="bg-orange-500/10 text-orange-400" icon="📤" />
            </div>

            {/* Charts (CSS-based since we can't use Recharts without running npm install) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">CPU Usage (24h)</h3>
                    <div className="flex items-end gap-[2px] h-48">
                        {metrics.slice(-48).map((m, i) => (
                            <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80"
                                style={{
                                    height: `${m.cpu}%`,
                                    background: m.cpu > 70 ? 'linear-gradient(to top, #ef4444, #f97316)' : m.cpu > 50 ? 'linear-gradient(to top, #f59e0b, #fbbf24)' : 'linear-gradient(to top, #6366f1, #818cf8)',
                                }}
                                title={`${m.time}: ${m.cpu.toFixed(1)}%`}>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-dark-500 mt-2">
                        <span>24h ago</span><span>12h ago</span><span>Now</span>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Memory Usage (24h)</h3>
                    <div className="flex items-end gap-[2px] h-48">
                        {metrics.slice(-48).map((m, i) => (
                            <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80"
                                style={{
                                    height: `${m.memory}%`,
                                    background: m.memory > 80 ? 'linear-gradient(to top, #ef4444, #f97316)' : m.memory > 60 ? 'linear-gradient(to top, #a855f7, #c084fc)' : 'linear-gradient(to top, #8b5cf6, #a78bfa)',
                                }}
                                title={`${m.time}: ${m.memory.toFixed(1)}%`}>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-dark-500 mt-2">
                        <span>24h ago</span><span>12h ago</span><span>Now</span>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Network Traffic (24h)</h3>
                    <div className="flex items-end gap-[2px] h-48">
                        {metrics.slice(-48).map((m, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end gap-[1px]">
                                <div className="rounded-t" style={{ height: `${(m.netIn / 1000) * 100}%`, background: 'linear-gradient(to top, #06b6d4, #22d3ee)' }}></div>
                                <div className="rounded-b" style={{ height: `${(m.netOut / 1000) * 100}%`, background: 'linear-gradient(to top, #f97316, #fb923c)', opacity: 0.7 }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-dark-500 mt-2">
                        <span>24h ago</span>
                        <div className="flex gap-4">
                            <span className="text-cyan-400">● In</span>
                            <span className="text-orange-400">● Out</span>
                        </div>
                        <span>Now</span>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">System Info</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Hostname', value: selectedServer },
                            { label: 'OS', value: 'Ubuntu 22.04 LTS' },
                            { label: 'Kernel', value: '5.15.0-91-generic' },
                            { label: 'CPU', value: '8 cores / AMD EPYC' },
                            { label: 'Memory', value: '16 GB DDR4' },
                            { label: 'Disk', value: '500 GB NVMe SSD' },
                            { label: 'Uptime', value: '42 days, 7 hours' },
                            { label: 'Load Avg', value: '1.24  0.89  0.72' },
                        ].map(info => (
                            <div key={info.label} className="flex items-center justify-between">
                                <span className="text-sm text-dark-400">{info.label}</span>
                                <span className="text-sm text-white font-medium">{info.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
