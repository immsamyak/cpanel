'use client';
import { useState } from 'react';

const mockFiles = [
    { name: '..', type: 'directory', size: '', permissions: '', modified: '' },
    { name: 'css', type: 'directory', size: '—', permissions: 'drwxr-xr-x', modified: 'Jan 15, 14:30' },
    { name: 'js', type: 'directory', size: '—', permissions: 'drwxr-xr-x', modified: 'Jan 15, 14:30' },
    { name: 'images', type: 'directory', size: '—', permissions: 'drwxr-xr-x', modified: 'Jan 14, 09:15' },
    { name: 'uploads', type: 'directory', size: '—', permissions: 'drwxrwxr-x', modified: 'Jan 15, 16:42' },
    { name: 'index.html', type: 'file', size: '4.2 KB', permissions: '-rw-r--r--', modified: 'Jan 15, 14:30' },
    { name: 'style.css', type: 'file', size: '12.8 KB', permissions: '-rw-r--r--', modified: 'Jan 15, 14:30' },
    { name: 'app.js', type: 'file', size: '28.5 KB', permissions: '-rw-r--r--', modified: 'Jan 15, 14:30' },
    { name: '.htaccess', type: 'file', size: '412 B', permissions: '-rw-r--r--', modified: 'Jan 10, 08:00' },
    { name: 'config.json', type: 'file', size: '1.1 KB', permissions: '-rw-r--r--', modified: 'Jan 12, 11:20' },
    { name: 'robots.txt', type: 'file', size: '128 B', permissions: '-rw-r--r--', modified: 'Jan 05, 10:00' },
];

export default function FilesPage() {
    const [currentPath, setCurrentPath] = useState('/var/www/example.com/public');
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">File Manager</h1>
                    <p className="text-dark-400 text-sm mt-1">Browse and manage server files</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-dark-800/50 text-dark-300 text-sm rounded-xl hover:bg-dark-700/50 transition">📤 Upload</button>
                    <button className="px-4 py-2 bg-dark-800/50 text-dark-300 text-sm rounded-xl hover:bg-dark-700/50 transition">📁 New Folder</button>
                    <button className="px-4 py-2 bg-dark-800/50 text-dark-300 text-sm rounded-xl hover:bg-dark-700/50 transition">📄 New File</button>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm">
                <span className="text-dark-400">📂</span>
                {currentPath.split('/').filter(Boolean).map((part, i, arr) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="text-dark-500">/</span>
                        <button className={`${i === arr.length - 1 ? 'text-primary-400' : 'text-dark-300 hover:text-white'} transition`}>{part}</button>
                    </div>
                ))}
            </div>

            {/* File List */}
            <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-dark-700/50">
                            <th className="text-left px-6 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">Name</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">Size</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">Permissions</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">Modified</th>
                            <th className="text-right px-6 py-3 text-xs font-semibold text-dark-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-800/50">
                        {mockFiles.map((file, i) => (
                            <tr key={i} className={`hover:bg-dark-800/30 transition cursor-pointer ${selectedFile === file.name ? 'bg-primary-500/5' : ''}`}
                                onClick={() => setSelectedFile(file.name)}>
                                <td className="px-6 py-3">
                                    <div className="flex items-center gap-2">
                                        <span>{file.type === 'directory' ? '📁' : '📄'}</span>
                                        <span className={`text-sm ${file.type === 'directory' ? 'text-primary-400 font-medium' : 'text-dark-200'}`}>{file.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-dark-400 text-sm">{file.size}</td>
                                <td className="px-6 py-3 font-mono text-dark-500 text-xs">{file.permissions}</td>
                                <td className="px-6 py-3 text-dark-400 text-sm">{file.modified}</td>
                                <td className="px-6 py-3 text-right">
                                    {file.name !== '..' && (
                                        <div className="flex justify-end gap-1">
                                            {file.type === 'file' && <button className="p-1.5 hover:bg-dark-700/50 rounded-lg text-xs text-dark-400 hover:text-white transition">✏️</button>}
                                            <button className="p-1.5 hover:bg-dark-700/50 rounded-lg text-xs text-dark-400 hover:text-white transition">📋</button>
                                            <button className="p-1.5 hover:bg-red-500/10 rounded-lg text-xs text-dark-400 hover:text-red-400 transition">🗑️</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
