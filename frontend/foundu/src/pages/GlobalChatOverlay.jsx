import React, { useState, useEffect } from "react";
import Chatbox from "../pages/Chatbox";
import { FaCommentDots, FaTimes } from "react-icons/fa";
import api from "../utils/axiosConfig";
import { socket } from "../socket";
import { getUserId } from "../utils/authUtils";

const GlobalChatOverlay = ({ userId: propUserId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedChatUserId, setSelectedChatUserId] = useState(null);
  
  // Robust ID detection
  const currentUserId = propUserId || getUserId() || localStorage.getItem("user_id");

  // Fetch initial unread count
  useEffect(() => {
    const userIdToUse = currentUserId;
    if (!userIdToUse) return;

    const fetchUnread = async () => {
      try {
        const res = await api.get("/api/chat/total-unread");
        setUnreadCount(res.data.total || 0);
      } catch (err) {
        console.error("Error fetching unread count:", err);
      }
    };

    fetchUnread();
    
    // Poll every 10 seconds
    const interval = setInterval(fetchUnread, 10000);

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

  // Listen for open_chat event and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleOpenChat = (e) => {
      const { userId: targetId } = e.detail || {};
      if (targetId) {
        setSelectedChatUserId(targetId);
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open_chat", handleOpenChat);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open_chat", handleOpenChat);
    };
  }, []);

  return (
    <>
      {/* Floating Button (Bottom Left) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-[100] flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full shadow-[0_5px_15px_rgba(37,99,235,0.4)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.6)] hover:scale-110 transition-all duration-300"
          title="Open Messages"
        >
          <FaCommentDots className="text-white text-2xl" />
          {unreadCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-red-600 text-white font-bold text-[10px] w-6 h-6 border-2 border-gray-900 shadow-lg"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[90] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Overlay (Slides from left) */}
      <div 
        className={`fixed top-0 left-0 h-full w-full md:w-[45vw] bg-black shadow-2xl transition-all duration-500 ease-in-out transform z-[999] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } border-r border-white/10 flex flex-col`}
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
          {isOpen && <Chatbox targetUserId={selectedChatUserId} />}
        </div>
      </div>
    </>
  );
};

export default GlobalChatOverlay;
