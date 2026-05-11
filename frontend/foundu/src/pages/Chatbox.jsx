import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import api from "../utils/axiosConfig";
import { getUserId } from "../utils/authUtils";
import { socket } from "../socket";
import {
  FaPaperPlane,
  FaSearch,
  FaCircle,
  FaCheckDouble,
  FaArrowLeft,
} from "react-icons/fa";
import { getImageUrl } from "../utils/imageUtils";

const API_URL = `/api/chat`;

const Chatbox = ({ targetUserId: propUserId }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const targetUserId = propUserId || queryParams.get("userId");
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedUserId = getUserId();
    if (storedUserId) setCurrentUserId(parseInt(storedUserId));
    fetchChats();
  }, []);

  // Handle URL parameters for direct messaging
  useEffect(() => {
    if (loading || !targetUserId) return;

    const targetIdNum = parseInt(targetUserId);
    
    // If we are already chatting with this user, do nothing
    if (activeChat && activeChat.other_user_id === targetIdNum) return;
    
    const existingChat = chats.find(c => c.other_user_id === targetIdNum);
    
    if (existingChat) {
      setActiveChat(existingChat);
    } else {
      handleStartChat(targetIdNum);
    }
  }, [chats, targetUserId, loading]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.chat_id);
      handleMarkAsSeen(activeChat.chat_id);

      socket.emit("join_room", activeChat.chat_id);
      
      const interval = setInterval(
        () => fetchMessages(activeChat.chat_id),
        3000,
      );
      return () => {
        clearInterval(interval);
        socket.emit("leave_room", activeChat.chat_id);
      };
    }
  }, [activeChat]);

  const handleMarkAsSeen = async (chatId) => {
    try {
      const chat = chats.find(c => c.chat_id === chatId);
      const clearedCount = chat?.unread_count || 0;

      await api.patch(`${API_URL}/${chatId}/seen`);
      setChats(prev => prev.map(c => c.chat_id === chatId ? { ...c, unread_count: 0 } : c));

      if (clearedCount > 0) {
        window.dispatchEvent(new CustomEvent("messages_seen", { detail: { clearedCount } }));
      }
    } catch (err) {
      console.error("Error marking as seen:", err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChats = async () => {
    try {
      const res = await api.get(`${API_URL}/my-chats`);
      setChats(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await api.get(`${API_URL}/${chatId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;
    try {
      await api.post(`${API_URL}/message`, {
        chatId: activeChat.chat_id,
        content: newMessage,
      });
      setNewMessage("");
      fetchMessages(activeChat.chat_id); 
      fetchChats(); 
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const handleStartChat = async (otherUserId) => {
    try {
      await api.post(`${API_URL}/create`, { otherUserId });
      setSearchQuery("");
      setSearchResults([]);
      await fetchChats(); 
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  };

  // Search Global Users
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await api.get(`/api/users`);
        const filtered = res.data.filter(
          (u) =>
            u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            u.id !== currentUserId,
        );
        setSearchResults(filtered);
      } catch (err) {
        console.error("Error searching users:", err);
      }
    };
    const delayDebounceFn = setTimeout(() => {
      searchUsers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentUserId]);

  return (
    <div className="flex w-full h-screen bg-black text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full md:w-[50%] lg:w-[45%] bg-gray-900 border-r border-gray-800 flex-col ${activeChat ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 pt-20 border-b border-gray-800">
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Messages
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all text-white"
            />
            <FaSearch className="w-4 h-4 absolute left-4 top-2.5 text-gray-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Global Search Results Overlay */}
          {searchQuery && (
            <div className="absolute top-0 left-0 w-full bg-gray-900 min-h-full z-20">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No users found</div>
              ) : (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleStartChat(user.id)}
                    className="flex items-center p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                      {user.profile_picture_url ? (
                        <img src={getImageUrl(user.profile_picture_url)} alt={user.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {user.full_name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-base font-semibold text-white">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{user.user_type}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Normal Chats List */}
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading chats...
            </div>
          ) : chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No chats found</div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.chat_id}
                onClick={() => setActiveChat(chat)}
                className={`flex items-center p-4 cursor-pointer transition-colors hover:bg-gray-800 ${activeChat?.chat_id === chat.chat_id ? "bg-gray-800 border-l-4 border-purple-500" : ""}`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                    {chat.profile_picture_url ? (
                      <img src={getImageUrl(chat.profile_picture_url)} alt={chat.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {chat.full_name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-base truncate pr-2">{chat.full_name}</h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {chat.last_message_time
                        ? new Date(chat.last_message_time).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-400 truncate w-40">
                      {chat.last_message || "No messages yet"}
                    </p>
                    {chat.unread_count > 0 && (
                      <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg shadow-purple-500/30">
                        {chat.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex-col bg-black ${!activeChat ? "hidden md:flex" : "flex"}`}>
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center bg-gray-900/50 backdrop-blur-md pt-20 md:pt-4 sticky top-0 z-10">
              <button 
                onClick={() => setActiveChat(null)}
                className="md:hidden mr-4 p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-md">
                {activeChat.profile_picture_url ? (
                  <img src={getImageUrl(activeChat.profile_picture_url)} alt={activeChat.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {activeChat.full_name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h2 className="font-bold text-lg leading-tight">{activeChat.full_name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 capitalize">{activeChat.user_type || 'User'}</span>
                  <span className="text-[10px] text-green-400 flex items-center gap-1">
                    <FaCircle className="w-1.5 h-1.5" /> Online
                  </span>
                </div>
              </div>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar scroll-smooth">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-2">
                    <FaPaperPlane className="w-6 h-6 text-gray-600" />
                  </div>
                  <p>Start the conversation with {activeChat.full_name}!</p>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-md ${msg.sender_id === currentUserId ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none" : "bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-none"}`}
                  >
                    <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                    <div
                      className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 font-medium ${msg.sender_id === currentUserId ? "text-indigo-200" : "text-gray-500"}`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {msg.sender_id === currentUserId && (
                        <span>
                          {msg.is_seen ? (
                            <FaCheckDouble className="text-blue-300 ml-0.5" />
                          ) : (
                            <FaCheckDouble className="text-indigo-300 opacity-70 ml-0.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} className="h-2" />
            </div>
            {/* Input Area */}
            <div className="p-3 md:p-4 bg-gray-900 border-t border-gray-800 pb-safe">
              <div className="flex items-center gap-2 bg-black border border-gray-700 rounded-full pl-4 pr-1 py-1 focus-within:border-indigo-500 transition-colors shadow-inner">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-[15px] py-2 focus:outline-none text-white placeholder-gray-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`rounded-full p-3 transition-all duration-300 transform ${newMessage.trim() ? "bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105 shadow-lg shadow-indigo-500/30" : "bg-gray-800 text-gray-500 cursor-not-allowed"}`}
                >
                  <FaPaperPlane className="w-4 h-4 ml-[-2px] mt-[1px]" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <div className="w-24 h-24 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-6 shadow-2xl">
              <FaPaperPlane className="w-8 h-8 text-gray-700 ml-[-4px] mt-[4px]" />
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">Your Messages</h3>
            <p className="text-sm">Select a chat from the sidebar to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbox;
