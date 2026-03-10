import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'ServerPanel — Modern Server Management',
    description: 'A powerful server management platform for managing domains, databases, deployments, and infrastructure.',
    keywords: 'server management, hosting panel, cpanel alternative, server dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-dark-950 text-dark-50 antialiased">
                {children}
            </body>
        </html>
    )
}
