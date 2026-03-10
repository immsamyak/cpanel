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
                router.push(`/verify-2fa?userId=${data.userId}`);
                return;
            }
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-mesh flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center text-white font-bold">SP</div>
                        <span className="text-2xl font-bold text-white">ServerPanel</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Welcome back</h1>
                    <p className="text-dark-400 mt-1">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
                    {error && (
                        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm text-dark-300 mb-1 font-medium">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm text-dark-300 mb-1 font-medium">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-primary-500/25">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    <p className="text-center text-sm text-dark-400">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium">Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
