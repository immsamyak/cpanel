'use client';
import { useState, useEffect } from 'react';
import { Circle, CheckCircle, AlertTriangle, Trash2, UserX, Loader2, Users } from 'lucide-react';
import { usersApi } from '@/lib/api';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try {
            const { data } = await usersApi.list();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) { console.error('Failed to load users:', err); }
        finally { setLoading(false); }
    };

    const handleToggleActive = async (id: string) => {
        try { await usersApi.toggleActive(id); await loadUsers(); } catch (err) { console.error(err); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try { await usersApi.delete(id); await loadUsers(); } catch (err) { console.error(err); }
    };

    const handleRoleChange = async (id: string, role: string) => {
        try { await usersApi.changeRole(id, role); await loadUsers(); } catch (err) { console.error(err); }
    };

    if (loading) return <div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-primary-400" /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-dark-400 text-sm mt-1">Manage platform users and roles</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-dark-400">{users.length} users</span>
                    <span className="text-dark-600">·</span>
                    <span className="text-green-400">{users.filter((u: any) => u.isActive).length} active</span>
                </div>
            </div>

            {users.length === 0 ? (
                <div className="glass rounded-2xl p-16 text-center">
                    <Users size={48} className="mx-auto mb-4 text-dark-500" />
                    <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
                    <p className="text-dark-400">Users will appear here after registration</p>
                </div>
            ) : (
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
                            {users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-dark-800/30 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${user.role === 'admin' ? 'gradient-primary' : 'gradient-info'}`}>
                                                {(user.firstName || '?')[0]}{(user.lastName || '?')[0]}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{user.firstName} {user.lastName}</p>
                                                <p className="text-dark-500 text-xs">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className={`text-xs px-2 py-0.5 rounded-full border-none cursor-pointer ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Circle size={8} className={`${user.isActive ? 'fill-green-400 text-green-400' : 'fill-red-400 text-red-400'}`} />
                                            <span className={`text-xs ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>{user.isActive ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isTwoFactorEnabled ? <CheckCircle size={16} className="text-green-400" /> : <AlertTriangle size={16} className="text-dark-500" />}
                                    </td>
                                    <td className="px-6 py-4 text-dark-400 text-sm">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}</td>
                                    <td className="px-6 py-4 text-dark-400 text-sm">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleToggleActive(user.id)}
                                            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-dark-800/50 text-dark-300 rounded-lg hover:bg-dark-700/50 transition mr-2">
                                            <UserX size={12} /> {user.isActive ? 'Disable' : 'Enable'}
                                        </button>
                                        <button onClick={() => handleDelete(user.id)}
                                            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition">
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
