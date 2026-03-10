'use client';
import { useState } from 'react';

const generateLogs = (source: string) => {
    const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const messages: any = {
        system: [
            'System startup completed successfully',
            'Service nginx restarted via systemctl',
            'Cron job executed: /etc/cron.daily/backup',
            'User login: admin from 192.168.1.1',
            'Package update available: nginx 1.25.4-1ubuntu1',
            'Disk usage at 75% on /dev/sda1',
            'SSH connection established from 10.0.0.5',
            'Memory usage normalized after OOM cleanup',
            'Firewall rule updated: allow port 443',
            'Certificate renewal check started',
        ],
        nginx: [
            '192.168.1.100 - - "GET /api/health HTTP/1.1" 200 52 "-" "curl/7.81.0"',
            '10.0.0.1 - - "POST /api/auth/login HTTP/1.1" 200 340 "http://localhost" "Mozilla/5.0"',
            '172.16.0.1 - - "GET /dashboard HTTP/1.1" 200 8423 "-" "Mozilla/5.0"',
            '192.168.1.50 - - "GET /static/css/app.css HTTP/1.1" 304 0 "http://localhost" "Mozilla/5.0"',
            '10.0.0.5 - - "PUT /api/servers/1 HTTP/1.1" 200 892 "http://localhost" "Mozilla/5.0"',
            '10.0.0.2 - - "GET /favicon.ico HTTP/1.1" 404 162 "-" "Mozilla/5.0"',
        ],
        application: [
            'Application started successfully on port 3001',
            'Database connection pool established (max: 20)',
            'Request processed: GET /api/servers in 245ms',
            'Cache cleared for key: user_sessions',
            'Background job completed: email_notifications',
            'WebSocket connection established: client_42',
            'Rate limit exceeded for IP: 192.168.1.55',
            'JWT token validated for user: admin@example.com',
        ],
    };

    const sourceMessages = messages[source] || messages.system;
    return Array.from({ length: 50 }, (_, i) => {
        const date = new Date();
        date.setSeconds(date.getSeconds() - (50 - i) * 3);
        return {
            timestamp: date.toISOString().replace('T', ' ').slice(0, 19),
            level: levels[Math.floor(Math.random() * levels.length)],
            message: sourceMessages[Math.floor(Math.random() * sourceMessages.length)],
        };
    });
};

const levelColors: any = {
    INFO: 'log-info',
    WARN: 'log-warn',
    ERROR: 'log-error',
    DEBUG: 'log-debug',
};

export default function LogsPage() {
    const [logSource, setLogSource] = useState('system');
    const [logs, setLogs] = useState(generateLogs('system'));
    const [autoScroll, setAutoScroll] = useState(true);

    const switchSource = (source: string) => {
        setLogSource(source);
        setLogs(generateLogs(source));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Logs Viewer</h1>
                    <p className="text-dark-400 text-sm mt-1">View system and application logs</p>
                </div>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm text-dark-300">
                        <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} className="rounded" />
                        Auto-scroll
                    </label>
                    <button onClick={() => setLogs(generateLogs(logSource))} className="px-4 py-2 bg-dark-800/50 text-dark-300 text-sm rounded-xl hover:bg-dark-700/50 transition">
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Source Tabs */}
            <div className="flex gap-2">
                {[
                    { key: 'system', label: 'System Logs', icon: '🖥️' },
                    { key: 'nginx', label: 'Nginx Logs', icon: '🌐' },
                    { key: 'application', label: 'App Logs', icon: '📦' },
                ].map(tab => (
                    <button key={tab.key} onClick={() => switchSource(tab.key)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${logSource === tab.key ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-dark-800/30 text-dark-400 hover:text-white hover:bg-dark-800/50'
                            }`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Terminal Viewer */}
            <div className="terminal h-[600px] overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-dark-800">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-dark-500 text-xs ml-2">logs — {logSource} — {logs.length} entries</span>
                </div>
                {logs.map((log, i) => (
                    <div key={i} className="flex gap-2 hover:bg-white/5 px-2 py-0.5 rounded">
                        <span className="text-dark-600 text-xs whitespace-nowrap">{log.timestamp}</span>
                        <span className={`text-xs font-semibold w-12 text-right ${levelColors[log.level]}`}>[{log.level}]</span>
                        <span className={`text-xs ${log.level === 'ERROR' ? 'text-red-300' : 'text-dark-300'}`}>{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
