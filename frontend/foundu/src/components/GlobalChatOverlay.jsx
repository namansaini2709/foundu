import React, { useState, useEffect } from "react";
import Chatbox from "../pages/Chatbox";
import { FaCommentDots, FaTimes } from "react-icons/fa";
import api from "../utils/axiosConfig";
import { socket } from "../socket";
import { getUserId } from "../utils/authUtils";

const GlobalChatOverlay = ({ userId: propUserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const currentUserId = propUserId || getUserId() || localStorage.getItem("user_id");

  // Fetch initial unread count
  useEffect(() => {
    console.log("[Overlay] User ID detected:", currentUserId);
    if (!currentUserId) return;

    const fetchUnread = async () => {
      try {
        const uid = localStorage.getItem("user_id");
        if (!uid) {
          console.warn("[Overlay] No User ID in localStorage yet.");
          return;
        }
        const res = await api.get("/api/chat/total-unread");
        console.log(`[Overlay] API: /api/chat/total-unread | Result: ${res.data.total}`);
        setUnreadCount(res.data.total || 0);
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    fetchUnread();
    setUnreadCount(99); // FORCE SHOW FOR TESTING
    
    // Poll every 5 seconds for aggressive update
    const interval = setInterval(fetchUnread, 5000);

    // Socket listener for live updates
    const handleNewMessage = () => {
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new_message_global", handleNewMessage);

    // Custom event to reset count when messages are seen in Chatbox
    const handleSeen = (e) => {
      const { clearedCount } = e.detail || { clearedCount: 0 };
      setUnreadCount(prev => Math.max(0, prev - (clearedCount || 1)));
    };
    window.addEventListener("messages_seen", handleSeen);

    return () => {
      clearInterval(interval);
      socket.off("new_message_global", handleNewMessage);
      window.removeEventListener("messages_seen", handleSeen);
    };
  }, [currentUserId]);

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-[100] relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:scale-110 transition-all duration-300"
          title="Open Messages"
        >
          <FaCommentDots className="text-white text-2xl" />
          <span 
            className="absolute flex items-center justify-center rounded-full bg-red-600 text-white font-bold shadow-[0_0_10px_rgba(255,0,0,0.8)] z-[200]"
            style={{ 
              top: '-5px', 
              right: '-5px', 
              width: '24px', 
              height: '24px', 
              fontSize: '12px',
              border: '2px solid white'
            }}
          >
            {unreadCount}
          </span>
        </button>
      )}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[90] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[90vw] md:w-[45vw] bg-black z-[100] shadow-[10px_0_30px_rgba(0,0,0,0.5)] border-r border-gray-800 transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Floating Close Button */}
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-[110] p-2 bg-gray-800/90 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-all shadow-lg border border-gray-700/50"
            title="Close"
          >
            <FaTimes className="text-xl" />
          </button>
        )}

        {/* Chatbox Wrapper */}
        <div className="w-full h-full relative overflow-hidden">
          {isOpen && <Chatbox />}
        </div>
      </div>
    </>
  );
};

export default GlobalChatOverlay;
