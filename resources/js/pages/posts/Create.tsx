import { Head } from '@inertiajs/react';
import axios from 'axios';
import React, { useState } from 'react';

export default function Create() {
    const [data, setData] = useState({
        caption: '',
        media: null as File | null,
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ caption?: string, media?: string }>({});
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const submit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setProgress(0);

        const formData = new FormData();
        formData.append('caption', data.caption);
        if (data.media) {
            formData.append('media', data.media);
        }

        try {
            // Get CSRF cookie first for Sanctum if needed
            // await axios.get('/sanctum/csrf-cookie');

            await axios.post('/api/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 100));
                    setProgress(percentCompleted);
                }
            });

            // Redirect or show success
            window.location.href = '/'; // Or wherever feed is
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.errors) {
                const apiErrors = error.response.data.errors;
                setErrors({
                    caption: apiErrors.caption?.[0],
                    media: apiErrors.media?.[0]
                });
            }
        } finally {
            setProcessing(false);
            setProgress(0);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData({ ...data, media: e.target.files[0] });
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <>
            <Head title="Create Post" />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create New Post</h2>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Media Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Photo (JPG, PNG)
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors cursor-pointer relative">
                                <div className="space-y-1 text-center">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="mx-auto h-32 object-cover rounded-md" />
                                    ) : (
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="media" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                            <span>Upload a file</span>
                                            <input id="media" name="media" type="file" accept="image/jpeg, image/png, image/webp" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 2MB</p>
                                </div>
                            </div>
                            {errors.media && <p className="mt-2 text-sm text-red-600">{errors.media}</p>}
                        </div>

                        {/* Caption */}
                        <div>
                            <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Caption</label>
                            <div className="mt-1">
                                <textarea id="caption" name="caption" rows={3} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" placeholder="Write a caption..." value={data.caption} onChange={e => setData({ ...data, caption: e.target.value })}></textarea>
                            </div>
                            {errors.caption && <p className="mt-2 text-sm text-red-600">{errors.caption}</p>}
                        </div>

                        {/* Submit */}
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {processing ? 'Uploading...' : 'Post'}
                            </button>
                        </div>

                        {progress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
