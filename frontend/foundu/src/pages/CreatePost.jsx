import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserId } from '../utils/authUtils';
import api from '../utils/axiosConfig';
import { 
    Image, 
    Type, 
    Send, 
    ChevronLeft, 
    Upload, 
    CheckCircle2,
    X
} from 'lucide-react';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

const CreatePost = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePost = async () => {
        const userId = getUserId();
        if (!userId) {
            toast.error("Please login to post");
            return;
        }

        if (!image) {
            toast.error("Please select an image");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('image', image);
        formData.append('caption', caption);

        try {
            const response = await api.post(`/api/posts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                toast.success("Content posted successfully! 🚀");
                setTimeout(() => navigate('/live-feed'), 1500);
            }
        } catch (error) {
            console.error("Post creation error:", error);
            toast.error(error.response?.data?.message || "Failed to post content");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020024] text-white flex flex-col font-sans overflow-x-hidden">

            <main className="flex-grow pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back
                        </button>
                        <h1 className="text-2xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            Create New Post
                        </h1>
                        <div className="hidden md:block w-24"></div> {/* Spacer */}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Upload Section */}
                        <div className="space-y-6">
                            <div 
                                className={`relative aspect-square rounded-3xl md:rounded-[3rem] border-2 border-dashed transition-all duration-500 overflow-hidden group
                                    ${preview ? 'border-transparent shadow-2xl shadow-blue-500/20' : 'border-white/10 hover:border-blue-500/50 bg-white/5'}
                                `}
                            >
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <button 
                                            onClick={() => {setImage(null); setPreview(null);}}
                                            className="absolute top-6 right-6 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-red-500 transition-all shadow-xl"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </>
                                ) : (
                                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-8 text-center group">
                                        <div className="w-24 h-24 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
                                            <Upload className="w-10 h-10 text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Upload Visual Magic</h3>
                                        <p className="text-gray-500 text-sm max-w-[200px] leading-relaxed mb-6 font-medium">
                                            Showcase your ideas, projects, or moments in high resolution.
                                        </p>
                                        <div className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                            Select File
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-3xl md:rounded-[3rem] p-6 md:p-10 backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10 animate-pulse"></div>

                            <div className="mb-8">
                                <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-400 mb-4">
                                    <Type className="w-4 h-4" />
                                    Your Caption
                                </label>
                                <textarea 
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="Write a compelling story about this post..." 
                                    className="w-full h-32 md:h-48 bg-black/40 border border-white/5 rounded-3xl p-6 text-white text-base md:text-lg placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all resize-none leading-relaxed font-medium"
                                />
                            </div>

                            <div className="mt-auto space-y-4">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-500 italic">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    Your post will be visible across the FoundU network instantly.
                                </div>
                                <button 
                                    onClick={handlePost}
                                    disabled={loading || !image}
                                    className={`w-full py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-2xl shadow-blue-600/20
                                        ${loading || !image 
                                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed grayscale' 
                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
                                        }
                                    `}
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            Post to Live Feed
                                            <Send className="w-6 h-6" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CreatePost;
