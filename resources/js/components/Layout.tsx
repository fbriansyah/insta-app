import { Head, Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import React from 'react';

interface LayoutProps {
    title?: string;
    children: ReactNode;
}

export default function Layout({ title = 'InstaApp', children }: LayoutProps) {
    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
    };

    return (
        <>
            <Head title={title} />
            <div className="relative min-h-screen bg-slate-900 text-slate-100">
                {/* Background Gradients */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-rose-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-1/4 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* Responsive Navbar */}
                    <nav className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50">
                        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex items-center">
                                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-rose-400 font-sans tracking-tight">
                                        InstaApp
                                    </Link>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href="/posts/create"
                                        className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
                                        title="Create Post"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm font-medium text-slate-300 hover:text-rose-400 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Main Content Area */}
                    <main className="grow max-w-lg w-full mx-auto pt-8 pb-20 px-4 sm:px-0">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
