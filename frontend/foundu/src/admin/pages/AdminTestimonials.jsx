import { useEffect, useState } from "react";
import { getUserId } from "../../utils/authUtils";
import api from "../../utils/axiosConfig";
import AdminLayout from "../AdminLayout";
import { Trash2, Edit2, Plus, X, Check, Eye, EyeOff } from "lucide-react";

const API = "/api";

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const adminId = getUserId();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        affiliation: "",
        rating: 5,
        review: "",
        tagline: "",
        is_active: true,
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await api.get(`${API}/admin/testimonials`);
            setTestimonials(res.data.testimonials);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`${API}/admin/testimonials/${editingId}`, formData);
            } else {
                await api.post(`${API}/admin/testimonials`, formData);
            }
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ name: "", affiliation: "", rating: 5, review: "", tagline: "", is_active: true });
            fetchTestimonials();
        } catch (err) {
            alert("Error saving testimonial");
        }
    };

    const handleEdit = (t) => {
        setFormData({
            name: t.name,
            affiliation: t.affiliation,
            rating: t.rating,
            review: t.review,
            tagline: t.tagline,
            is_active: !!t.is_active,
        });
        setEditingId(t.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
        try {
            await api.delete(`${API}/admin/testimonials/${id}`);
            fetchTestimonials();
        } catch (err) {
            alert("Error deleting");
        }
    };

    const toggleActive = async (t) => {
        try {
            await api.put(`${API}/admin/testimonials/${t.id}`, { ...t, is_active: !t.is_active });
            fetchTestimonials();
        } catch (err) {
            alert("Error toggling status");
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-white">Manage Testimonials</h1>
                    <p className="text-gray-400 text-sm mt-1">Add or edit testimonials shown on the homepage</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ name: "", affiliation: "", rating: 5, review: "", tagline: "", is_active: true });
                        setIsModalOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                >
                    <Plus size={18} /> Add Testimonial
                </button>
            </div>

            {loading ? (
                <div className="text-blue-300 animate-pulse">Loading testimonials...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div key={t.id} className={`bg-gray-800/40 backdrop-blur-sm border rounded-xl p-5 relative group transition-all ${t.is_active ? 'border-blue-900/30' : 'border-red-900/30 opacity-60'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-1 text-yellow-400">
                                    {[...Array(t.rating)].map((_, i) => <Check key={i} size={12} fill="currentColor" />)}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => toggleActive(t)} title={t.is_active ? "Hide" : "Show"} className="text-gray-400 hover:text-white transition-colors">
                                        {t.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                    <button onClick={() => handleEdit(t)} className="text-blue-400 hover:text-blue-300 transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-white font-bold text-lg">{t.name}</p>
                            <p className="text-blue-300 text-xs mb-3 italic">{t.affiliation} — {t.tagline}</p>
                            <p className="text-gray-300 text-sm line-clamp-3">{t.review}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-blue-900/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                            <X size={20} />
                        </button>
                        <h2 className="text-white text-xl font-black mb-6">{editingId ? "Edit Testimonial" : "New Testimonial"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-400 text-xs block mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-400 text-xs block mb-1">Affiliation</label>
                                    <input
                                        type="text"
                                        value={formData.affiliation}
                                        onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-400 text-xs block mb-1">Tagline</label>
                                <input
                                    type="text"
                                    value={formData.tagline}
                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                                    placeholder="e.g. Future belongs to builders 🚀"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-400 text-xs block mb-1">Rating (1-5)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 text-white cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-700"
                                        />
                                        <span className="text-sm">Is Active / Visible</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-400 text-xs block mb-1">Review Text</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.review}
                                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                            >
                                {editingId ? "Update Testimonial" : "Save Testimonial"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
