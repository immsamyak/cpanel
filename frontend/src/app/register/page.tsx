'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const updateField = (field: string, value: string) => setForm({ ...form, [field]: value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        setLoading(true);
        try {
            const { data } = await authApi.register({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
            });
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                    <h1 className="text-2xl font-bold text-white">Create account</h1>
                    <p className="text-dark-400 mt-1">Get started with ServerPanel</p>
                </div>

                <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-4">
                    {error && (
                        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-dark-300 mb-1 font-medium">First Name</label>
                            <input type="text" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} required
                                className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                placeholder="John" />
                        </div>
                        <div>
                            <label className="block text-sm text-dark-300 mb-1 font-medium">Last Name</label>
                            <input type="text" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} required
                                className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                                placeholder="Doe" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-dark-300 mb-1 font-medium">Email</label>
                        <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required
                            className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm text-dark-300 mb-1 font-medium">Password</label>
                        <input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} required
                            className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            placeholder="Min 8 characters" />
                    </div>
                    <div>
                        <label className="block text-sm text-dark-300 mb-1 font-medium">Confirm Password</label>
                        <input type="password" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} required
                            className="w-full px-4 py-3 bg-dark-900/50 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            placeholder="Repeat password" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-primary-500/25">
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                    <p className="text-center text-sm text-dark-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
