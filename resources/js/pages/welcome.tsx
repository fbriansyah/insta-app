import { Link } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Layout from '@/components/Layout';
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

    const handleLike = async (postId: number) => {
        try {
            const token = localStorage.getItem('auth_token');
            const res = await axios.post(`/api/posts/${postId}/like`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Update local state
            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    return { ...post, is_liked: res.data.is_liked, likes_count: res.data.likes_count };
                }
                return post;
            }));
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const handleComment = async (e: React.FormEvent<HTMLFormElement>, postId: number, content: string) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');
            const res = await axios.post(`/api/posts/${postId}/comments`, { content }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const newComment = res.data.comment;
            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: [...(post.comments || []), newComment],
                        comments_count: post.comments_count + 1
                    };
                }
                return post;
            }));
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    };

    const handleDeleteComment = async (postId: number, commentId: number) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`/api/comments/${commentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: post.comments.filter(c => c.id !== commentId),
                        comments_count: post.comments_count - 1
                    };
                }
                return post;
            }));
        } catch (error) {
            console.error("Failed to delete comment", error);
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            const token = localStorage.getItem('auth_token');
            await axios.delete(`/api/posts/${postId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Remove post from local state
            setPosts(prev => prev.filter(post => post.id !== postId));
        } catch (error) {
            console.error("Failed to delete post", error);
        }
    };

    return (
        <Layout title="InstaApp Feed">
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
                            <div className="flex justify-between items-center px-4 py-3">
                                <div className="flex items-center">
                                    {post.author.avatar_url ? (
                                        <img src={post.author.avatar_url} alt={post.author.username} className="h-8 w-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-400 to-rose-400 flex items-center justify-center text-white font-bold text-xs uppercase">
                                            {post.author.username.charAt(0)}
                                        </div>
                                    )}
                                    <div className="ml-3 flex-1">
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{post.author.username}</span>
                                    </div>
                                </div>

                                {post.can_delete && (
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="text-gray-400 hover:text-rose-500 transition-colors"
                                        title="Delete post"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
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

                            {/* Post Actions */}
                            <div className="px-4 pt-3 pb-1">
                                <div className="flex space-x-4 items-center">
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        className={`${post.is_liked ? 'text-rose-500' : 'text-gray-900 dark:text-white'} hover:text-rose-500 transition-colors focus:outline-hidden flex items-center gap-1`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`${post.is_liked ? 'fill-current' : 'fill-none'} h-7 w-7`} viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        {post.likes_count > 0 && <span className="font-semibold text-sm">{post.likes_count}</span>}
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

                                {/* Comments Display */}
                                {post.comments && post.comments.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                        {post.comments.slice(-3).map(comment => (
                                            <div key={comment.id} className="text-sm text-gray-900 dark:text-gray-100 flex justify-between group">
                                                <div>
                                                    <span className="font-semibold mr-2">{comment.author.username}</span>
                                                    <span className="text-gray-800 dark:text-gray-200">{comment.content}</span>
                                                </div>
                                                {comment.can_delete && (
                                                    <button
                                                        onClick={() => handleDeleteComment(post.id, comment.id)}
                                                        className="text-xs text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Delete comment"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {post.comments_count > 3 && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 cursor-pointer">
                                                View all {post.comments_count} comments
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-1 text-[10px] text-gray-500 uppercase tracking-wide">
                                    {formatDate(post.created_at)}
                                </div>

                                {/* Add Comment Input */}
                                <form
                                    className="mt-3 flex items-center border-t border-gray-100 dark:border-[#3E3E3A] pt-3"
                                    onSubmit={(e) => {
                                        const input = e.currentTarget.elements.namedItem('content') as HTMLInputElement;
                                        if (input.value.trim()) {
                                            handleComment(e, post.id, input.value);
                                            input.value = '';
                                        }
                                    }}
                                >
                                    <input
                                        type="text"
                                        name="content"
                                        placeholder="Add a comment..."
                                        className="flex-1 bg-transparent text-sm focus:outline-hidden dark:text-gray-100 placeholder-gray-400"
                                        autoComplete="off"
                                    />
                                    <button type="submit" className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:text-indigo-800 disabled:opacity-50 ml-2">Add Comment</button>
                                </form>
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
        </Layout>
    );
}
