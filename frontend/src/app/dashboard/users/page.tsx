'use client';

const mockUsers = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'admin', isActive: true, isTwoFactorEnabled: true, lastLoginAt: '2024-01-15 14:30', createdAt: '2023-06-01' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'user', isActive: true, isTwoFactorEnabled: false, lastLoginAt: '2024-01-15 12:15', createdAt: '2023-07-15' },
    { id: '3', firstName: 'Bob', lastName: 'Wilson', email: 'bob@example.com', role: 'user', isActive: true, isTwoFactorEnabled: true, lastLoginAt: '2024-01-14 09:45', createdAt: '2023-09-20' },
    { id: '4', firstName: 'Alice', lastName: 'Brown', email: 'alice@example.com', role: 'user', isActive: false, isTwoFactorEnabled: false, lastLoginAt: '2023-12-01 16:30', createdAt: '2023-10-10' },
    { id: '5', firstName: 'Charlie', lastName: 'Davis', email: 'charlie@example.com', role: 'user', isActive: true, isTwoFactorEnabled: false, lastLoginAt: '2024-01-13 11:20', createdAt: '2023-11-05' },
];

export default function UsersPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-dark-400 text-sm mt-1">Manage platform users and roles</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-dark-400">{mockUsers.length} users</span>
                    <span className="text-dark-600">•</span>
                    <span className="text-green-400">{mockUsers.filter(u => u.isActive).length} active</span>
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-dark-700/50">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">User</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Role</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Status</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">2FA</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Last Login</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Created</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-800/50">
                        {mockUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-dark-800/30 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${user.role === 'admin' ? 'gradient-primary' : 'gradient-info'}`}>
                                            {user.firstName[0]}{user.lastName[0]}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{user.firstName} {user.lastName}</p>
                                            <p className="text-dark-500 text-xs">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`status-dot ${user.isActive ? 'status-online' : 'status-offline'}`}></span>
                                        <span className={`text-xs ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>{user.isActive ? 'Active' : 'Inactive'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm ${user.isTwoFactorEnabled ? 'text-green-400' : 'text-dark-500'}`}>
                                        {user.isTwoFactorEnabled ? '✅ Enabled' : '—'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-dark-400 text-sm">{user.lastLoginAt}</td>
                                <td className="px-6 py-4 text-dark-400 text-sm">{user.createdAt}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-xs px-3 py-1.5 bg-dark-800/50 text-dark-300 rounded-lg hover:bg-dark-700/50 transition mr-2">
                                        {user.isActive ? 'Disable' : 'Enable'}
                                    </button>
                                    <button className="text-xs px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
