'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await authApi.login(email, password);
            if (data.requiresTwoFactor) {
                localStorage.setItem('2fa_userId', data.userId);
                router.push('/2fa');
            } else {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
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
                    <p className="text-dark-400 mt-2">Sign in to your account</p>
                </div>
                <div className="glass rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-1.5">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary-500/25"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="text-center text-dark-400 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-primary-400 hover:text-primary-300 transition">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
