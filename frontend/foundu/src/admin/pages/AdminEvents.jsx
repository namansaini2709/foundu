import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import api from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { Search, Download, RefreshCw, Calendar, Sparkles } from "lucide-react";

const AdminEvents = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/admin/event-registrations");
            if (res.data.success) {
                setRegistrations(res.data.registrations || []);
            } else {
                toast.error("Failed to load event registrations.");
            }
        } catch (error) {
            console.error("Error fetching event registrations:", error);
            toast.error("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    };

    // Filter registrations based on search query
    const filteredRegistrations = registrations.filter((reg) => {
        const query = searchQuery.toLowerCase();
        return (
            (reg.event_name && reg.event_name.toLowerCase().includes(query)) ||
            (reg.user_name && reg.user_name.toLowerCase().includes(query)) ||
            (reg.email_id && reg.email_id.toLowerCase().includes(query)) ||
            (reg.phone_number && reg.phone_number.includes(query)) ||
            (reg.role && reg.role.toLowerCase().includes(query)) ||
            (reg.startup_name && reg.startup_name.toLowerCase().includes(query))
        );
    });

    // Export registrations to CSV
    const exportToCSV = () => {
        if (filteredRegistrations.length === 0) {
            toast.warn("No data available to export.");
            return;
        }

        const headers = [
            "ID",
            "Event Name",
            "Event Date",
            "Attendee Name",
            "Email ID",
            "Phone Number",
            "Role",
            "Startup Name",
            "Startup Stage",
            "UPI ID",
            "Amount Paid",
            "Razorpay Order ID",
            "Razorpay Payment ID",
            "Payment Status",
            "Registered At"
        ];

        const csvRows = [
            headers.join(","), // header row
            ...filteredRegistrations.map((reg) => {
                const formattedDate = new Date(reg.created_at).toLocaleString();
                const eventDate = reg.event_date ? new Date(reg.event_date).toLocaleDateString() : "";
                
                return [
                    reg.id,
                    `"${(reg.event_name || '').replace(/"/g, '""')}"`,
                    `"${eventDate}"`,
                    `"${(reg.user_name || '').replace(/"/g, '""')}"`,
                    `"${reg.email_id || ''}"`,
                    `"${reg.phone_number || ''}"`,
                    `"${reg.role || ''}"`,
                    `"${(reg.startup_name || 'N/A').replace(/"/g, '""')}"`,
                    `"${reg.startup_stage || 'N/A'}"`,
                    `"${reg.upi_id || ''}"`,
                    reg.amount || "200.00",
                    `"${reg.razorpay_order_id || ''}"`,
                    `"${reg.razorpay_payment_id || ''}"`,
                    `"${reg.payment_status || ''}"`,
                    `"${formattedDate}"`
                ].join(",");
            })
        ];

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `foundu_event_registrations_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV file exported successfully!");
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                
                {/* Heading / Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-white flex items-center gap-2">
                            🎟️ Event Registrations <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Manage event tickets, attendees, payment statuses, and UPI IDs for venue refunds.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={exportToCSV}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs uppercase tracking-widest px-4 py-3 rounded-lg transition-all flex items-center gap-2.5 shadow-lg shadow-purple-500/10 active:scale-[0.98]"
                        >
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                        <button
                            onClick={fetchRegistrations}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-white/10 px-3 py-3 rounded-lg transition-all active:scale-[0.98]"
                            title="Refresh List"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filters / Search Bar */}
                <div className="relative group max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-4.5 h-4.5 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by attendee, event, email, role, or startup..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-800/30 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-purple-500 transition-all font-medium text-sm"
                    />
                </div>

                {/* Table Data */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Fetching attendee sheets...</p>
                    </div>
                ) : filteredRegistrations.length === 0 ? (
                    <div className="bg-gray-800/20 backdrop-blur-sm border border-white/10 rounded-2xl p-16 text-center">
                        <p className="text-gray-400 font-medium text-sm">
                            {searchQuery ? "No registrations match your search criteria." : "No successful registrations recorded yet."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-gray-800/10 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 text-xs font-black text-purple-400 uppercase tracking-widest">Event</th>
                                    <th className="p-4 text-xs font-black text-purple-400 uppercase tracking-widest">Attendee</th>
                                    <th className="p-4 text-xs font-black text-purple-400 uppercase tracking-widest">Contact details</th>
                                    <th className="p-4 text-xs font-black text-purple-400 uppercase tracking-widest">Profile</th>
                                    <th className="p-4 text-xs font-black text-purple-400 uppercase tracking-widest">UPI ID (Refund)</th>
                                    <th className="p-4 text-xs font-black text-purple-400 uppercase tracking-widest">Order Intel</th>
                                    <th className="p-4 text-xs font-black text-purple-400 uppercase tracking-widest">Reg Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredRegistrations.map((reg) => {
                                    const regDate = new Date(reg.created_at);
                                    const eventDate = reg.event_date ? new Date(reg.event_date).toLocaleDateString("en-IN", {
                                        month: "short", day: "numeric"
                                    }) : "TBA";

                                    return (
                                        <tr key={reg.id} className="hover:bg-white/[0.02] transition-all">
                                            
                                            {/* Event Info */}
                                            <td className="p-4 max-w-[200px]">
                                                <p className="text-white text-sm font-black truncate" title={reg.event_name}>
                                                    {reg.event_name}
                                                </p>
                                                <p className="text-gray-500 text-[10px] uppercase font-black tracking-wider flex items-center gap-1 mt-0.5">
                                                    <Calendar className="w-3 h-3" /> {eventDate}
                                                </p>
                                            </td>

                                            {/* Attendee Name */}
                                            <td className="p-4 font-bold text-white text-sm">
                                                {reg.user_name}
                                            </td>

                                            {/* Contact details */}
                                            <td className="p-4">
                                                <p className="text-gray-300 text-sm">{reg.email_id}</p>
                                                <p className="text-gray-500 text-xs mt-0.5">{reg.phone_number}</p>
                                            </td>

                                            {/* Role & Startup info */}
                                            <td className="p-4">
                                                <span className="inline-block bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-purple-400">
                                                    {reg.role}
                                                </span>
                                                {reg.startup_name && (
                                                    <p className="text-gray-400 text-xs font-bold mt-1">
                                                        {reg.startup_name} <span className="text-gray-600 font-medium">({reg.startup_stage})</span>
                                                    </p>
                                                )}
                                            </td>

                                            {/* UPI ID */}
                                            <td className="p-4">
                                                <span className="bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl text-xs font-bold text-green-400 uppercase tracking-wide">
                                                    {reg.upi_id}
                                                </span>
                                            </td>

                                            {/* Payment details */}
                                            <td className="p-4">
                                                <p className="text-gray-300 text-xs font-medium">₹{reg.amount}</p>
                                                <p className="text-gray-500 text-[10px] truncate max-w-[180px] mt-0.5" title={reg.razorpay_payment_id}>
                                                    Pay ID: {reg.razorpay_payment_id || "N/A"}
                                                </p>
                                            </td>

                                            {/* Registration date */}
                                            <td className="p-4">
                                                <p className="text-white text-sm font-medium">
                                                    {regDate.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                                                </p>
                                                <p className="text-gray-500 text-[10px] mt-0.5">
                                                    {regDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
};

export default AdminEvents;
