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
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">

                {/* Responsive Navbar */}
                <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-[#161615] dark:border-[#3E3E3A]">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-rose-500">
                                    InstaApp
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/posts/create"
                                    className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"
                                    title="Create Post"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-rose-500 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="max-w-lg mx-auto pt-8 pb-20 px-4 sm:px-0">
                    {children}
                </main>

            </div>
        </>
    );
}
