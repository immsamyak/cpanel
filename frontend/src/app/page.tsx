import Link from 'next/link'
import { Server, Globe, Database, Rocket } from 'lucide-react'

export default function Home() {
    const stats = [
        { label: 'Servers', value: '∞', Icon: Server },
        { label: 'Domains', value: '∞', Icon: Globe },
        { label: 'Databases', value: '∞', Icon: Database },
        { label: 'Deployments', value: '∞', Icon: Rocket },
    ];

    return (
        <div className="min-h-screen gradient-mesh flex flex-col items-center justify-center px-4">
            <div className="text-center max-w-3xl animate-fade-in">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full glass text-sm text-primary-300 mb-8">
                    <span className="status-dot status-online mr-2"></span>
                    Platform Online
                </div>
                <h1 className="text-5xl md:text-7xl font-800 tracking-tight mb-6">
                    <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-purple-400 bg-clip-text text-transparent">
                        ServerPanel
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-dark-300 mb-10 leading-relaxed">
                    Modern server management made effortless. Manage domains, deploy apps,
                    configure databases, and monitor infrastructure — all from one dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/login"
                        className="px-8 py-3.5 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary-500/25 text-center"
                    >
                        Sign In to Dashboard
                    </Link>
                    <Link
                        href="/register"
                        className="px-8 py-3.5 glass text-dark-200 font-semibold rounded-xl hover:bg-dark-800/60 transition-all text-center"
                    >
                        Create Account
                    </Link>
                </div>
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {stats.map(stat => (
                        <div key={stat.label} className="glass rounded-xl p-4 card-hover">
                            <stat.Icon size={24} className="mx-auto mb-2 text-primary-400" />
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-dark-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
