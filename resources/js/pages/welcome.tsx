import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import type { Post } from '@/types/post';

export default function Welcome() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async (pageNumber: number) => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(`/api/posts?page=${pageNumber}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (pageNumber === 1) {
                setPosts(response.data.data);
            } else {
                setPosts(prev => [...prev, ...response.data.data]);
            }

            // Laravel pagination includes meta data
            if (response.data.meta) {
                setHasMore(response.data.meta.current_page < response.data.meta.last_page);
            } else {
                // Determine hasMore based on array length if no meta is provided (less robust)
                setHasMore(response.data.data.length === 10); // Assuming 10 per page
            }
        } catch (error) {
            console.error("Failed to load posts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        fetchPosts(1);
    }, []);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
    };

    return (
        <>
            <Head title="InstaApp Feed" />
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">

                {/* Navbar Placeholder */}
                <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-[#161615] dark:border-[#3E3E3A]">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-rose-500">
                                    InstaApp
                                </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/posts/create"
                                    className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"
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

                {/* Main Feed Container */}
                <main className="max-w-lg mx-auto pt-8 pb-20 px-4 sm:px-0">

                    {loading && page === 1 ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-[#161615] rounded-xl border border-gray-200 dark:border-[#3E3E3A]">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No posts yet</h3>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Be the first to share something!</p>
                            <Link
                                href="/posts/create"
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Create Post
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {posts.map((post) => (
                                <article key={post.id} className="bg-white dark:bg-[#161615] rounded-xl border border-gray-200 dark:border-[#3E3E3A] overflow-hidden shadow-sm">
                                    {/* Post Header */}
                                    <div className="flex items-center px-4 py-3">
                                        {post.author.avatar_url ? (
                                            <img src={post.author.avatar_url} alt={post.author.username} className="h-8 w-8 rounded-full object-cover" />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-rose-400 flex items-center justify-center text-white font-bold text-xs uppercase">
                                                {post.author.username.charAt(0)}
                                            </div>
                                        )}
                                        <div className="ml-3 flex-1">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{post.author.username}</span>
                                        </div>
                                    </div>

                                    {/* Post Image */}
                                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center w-full overflow-hidden">
                                        <img
                                            src={post.media_url}
                                            alt={post.caption || 'Post image'}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Post Actions (Placeholder) */}
                                    <div className="px-4 pt-3 pb-1">
                                        <div className="flex space-x-4">
                                            <button className="text-gray-900 dark:text-white hover:text-rose-500 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Post Caption & Meta */}
                                    <div className="px-4 pb-4">
                                        {post.caption && (
                                            <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                                <span className="font-semibold mr-2">{post.author.username}</span>
                                                {post.caption}
                                            </div>
                                        )}
                                        <div className="mt-1 text-[10px] text-gray-500 uppercase tracking-wide">
                                            {formatDate(post.created_at)}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Load More Button */}
                    {!loading && hasMore && posts.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={loadMore}
                                className="px-6 py-2 bg-gray-100 dark:bg-[#161615] text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#3E3E3A] transition-colors"
                            >
                                Load More
                            </button>
                        </div>
                    )}

                </main>
            </div>
        </>
    );
}
