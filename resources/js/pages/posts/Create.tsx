import axios from 'axios';
import React, { useState } from 'react';
import Layout from '@/components/Layout';

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

            window.location.href = '/';
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
        <Layout title="Create Post">
            <div className="bg-white dark:bg-[#161615] rounded-xl border border-gray-200 dark:border-[#3E3E3A] overflow-hidden shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-[#3E3E3A] pb-4">Create New Post</h2>

                <form onSubmit={submit} className="space-y-6">
                    {/* Media Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Photo (JPG, PNG, WEBP)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-[#3E3E3A] border-dashed rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer relative bg-gray-50 dark:bg-gray-800/50">
                            <div className="space-y-1 text-center w-full">
                                {previewUrl ? (
                                    <img src={previewUrl || undefined} alt="Preview" className="mx-auto max-h-64 object-contain rounded-md" />
                                ) : (
                                    <>
                                        <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center mt-2">
                                            <label htmlFor="media" className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input id="media" name="media" type="file" accept="image/jpeg, image/png, image/webp" className="sr-only" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG, WEBP up to 2MB</p>
                                    </>
                                )}
                            </div>
                            {previewUrl && (
                                <label htmlFor="media-replace" className="absolute inset-0 cursor-pointer opacity-0 text-[0px]">Replace
                                    <input id="media-replace" name="media" type="file" accept="image/jpeg, image/png, image/webp" className="sr-only" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>
                        {errors.media && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.media}</p>}
                    </div>

                    {/* Caption */}
                    <div>
                        <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Caption</label>
                        <div className="mt-1">
                            <textarea
                                id="caption"
                                name="caption"
                                rows={3}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-[#3E3E3A] rounded-md p-3 border bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="Write a caption..."
                                value={data.caption}
                                onChange={e => setData({ ...data, caption: e.target.value })}
                            ></textarea>
                        </div>
                        {errors.caption && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.caption}</p>}
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 bg-linear-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white font-semibold rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                'Post'
                            )}
                        </button>
                    </div>

                    {progress > 0 && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4 overflow-hidden">
                            <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}
                </form>
            </div>
        </Layout>
    );
}
