'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await authApi.register(form);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-mesh flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                        ServerPanel
                    </h1>
                    <p className="text-dark-400 mt-2">Create your account</p>
                </div>
                <div className="glass rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-1.5">First Name</label>
                                <input id="register-firstname" type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                    placeholder="John" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-300 mb-1.5">Last Name</label>
                                <input id="register-lastname" type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                    className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                    placeholder="Doe" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
                            <input id="register-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                placeholder="you@example.com" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
                            <input id="register-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                                placeholder="Minimum 8 characters" required minLength={8} />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/25">
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>
                    <p className="text-center text-dark-400 text-sm mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary-400 hover:text-primary-300 transition">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
