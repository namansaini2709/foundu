import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import api from "../../utils/axiosConfig";
import { toast } from "react-toastify";

const AdminQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const res = await api.get("/api/queries/list");
            if (res.data.success) {
                setQueries(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching queries:", error);
            toast.error("Failed to load queries.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Contact Queries</h1>
                        <p className="text-gray-400 text-sm">Review and manage user inquiries</p>
                    </div>
                    <button
                        onClick={fetchQueries}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : queries.length === 0 ? (
                    <div className="bg-gray-800/50 rounded-xl p-10 text-center border border-white/5">
                        <p className="text-gray-400">No queries found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-gray-800/20 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 text-xs font-bold text-blue-400 uppercase tracking-wider">Date</th>
                                    <th className="p-4 text-xs font-bold text-blue-400 uppercase tracking-wider">Name</th>
                                    <th className="p-4 text-xs font-bold text-blue-400 uppercase tracking-wider">Contact Info</th>
                                    <th className="p-4 text-xs font-bold text-blue-400 uppercase tracking-wider">Subject</th>
                                    <th className="p-4 text-xs font-bold text-blue-400 uppercase tracking-wider">Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queries.map((q) => (
                                    <tr key={q.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4">
                                            <p className="text-white text-sm font-medium">
                                                {new Date(q.created_at).toLocaleDateString()}
                                            </p>
                                            <p className="text-gray-500 text-[10px]">
                                                {new Date(q.created_at).toLocaleTimeString()}
                                            </p>
                                        </td>
                                        <td className="p-4 font-semibold text-white">
                                            {q.name}
                                        </td>
                                        <td className="p-4">
                                            <p className="text-gray-300 text-sm">{q.email}</p>
                                            <p className="text-gray-500 text-xs">{q.phone || 'N/A'}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                                                {q.subject}
                                            </span>
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <p className="text-gray-400 text-sm italic line-clamp-2 hover:line-clamp-none transition-all cursor-pointer">
                                                "{q.message}"
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminQueries;
