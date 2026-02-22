import { Head, Link, router } from '@inertiajs/react';
import { useState, SubmitEvent } from 'react';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Save token
                localStorage.setItem('auth_token', data.access_token);
                // Redirect to root
                router.visit('/');
            } else {
                if (data.errors) {
                    setError(Object.values(data.errors).flat().join('\n'));
                } else if (data.message) {
                    setError(data.message);
                } else {
                    setError('Registration failed. Please check your data.');
                }
            }
        } catch (err) {
            setError('An error occurred while communicating with the server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 py-12 px-4">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-1/4 right-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            <Head title="Create Account - InstaApp" />

            <div className="relative z-10 w-full max-w-md p-8 bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-indigo-400 font-sans tracking-tight">Join InstaApp</h2>
                    <p className="text-slate-400 mt-2 text-sm">Create an account to connect with friends.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm whitespace-pre-line">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-slate-100 placeholder-slate-500 transition-all outline-none"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-slate-100 placeholder-slate-500 transition-all outline-none"
                            placeholder="johndoe123"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-slate-100 placeholder-slate-500 transition-all outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-slate-100 placeholder-slate-500 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                            minLength={8}
                            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-slate-100 placeholder-slate-500 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-rose-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
