import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaPaperPlane,
  FaSearch,
  FaCircle,
  FaCheckDouble,
} from "react-icons/fa";

const API_URL = "http://localhost:4000/api/chat";

const Chatbox = () => {
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
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) setCurrentUserId(parseInt(storedUserId));
    fetchChats();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.chat_id);
      // Optional: Poll for messages every 3 seconds
      const interval = setInterval(
        () => fetchMessages(activeChat.chat_id),
        3000,
      );
      return () => clearInterval(interval);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API_URL}/my-chats`, {
        withCredentials: true,
      });
      setChats(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching chats:", err);
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await axios.get(`${API_URL}/${chatId}/messages`, {
        withCredentials: true,
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    try {
      await axios.post(
        `${API_URL}/message`,
        {
          chatId: activeChat.chat_id,
          content: newMessage,
        },
        { withCredentials: true },
      );

      setNewMessage("");
      fetchMessages(activeChat.chat_id); // Refresh messages immediately
      fetchChats(); // Update last message in sidebar
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  // Search Users
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await axios.get("http://localhost:4000/api/users", { withCredentials: true });
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

  // Start new chat
  const handleStartChat = async (otherUserId) => {
    try {
      const res = await axios.post(
        `${API_URL}/create`,
        { otherUserId },
        { withCredentials: true },
      );
      const { chatId } = res.data;

      setSearchQuery(""); // Clear search
      setSearchResults([]);
      await fetchChats(); // Refresh list to show new chat

      // Select the new chat (we need to find it in the updated list users)
      // For now, let's just refresh functionality.
      // Ideally we would set activeChat here but we need the full chat object.
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  };

  return (
    <div className="flex h-screen bg-black text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-[30%] sm:w-[240px] bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Messages
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <FaSearch className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading chats...
            </div>
          ) : chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No chats yet</div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.chat_id}
                onClick={() => setActiveChat(chat)}
                className={`flex items-center p-4 cursor-pointer transition-colors hover:bg-gray-800 ${activeChat?.chat_id === chat.chat_id ? "bg-gray-800 border-l-4 border-purple-500" : ""}`}
              >
                <div className="relative">
                  {/* Placeholder Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {chat.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-sm">{chat.full_name}</h3>
                    <span className="text-xs text-gray-500">
                      {chat.last_message_time
                        ? new Date(chat.last_message_time).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-400 truncate w-32">
                      {chat.last_message || "No messages yet"}
                    </p>
                    {chat.unread_count > 0 && (
                      <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {chat.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Search Results Overlay or List */}
          {searchQuery && (
            <div className="absolute top-20 left-4 w-64 bg-gray-800 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="p-3 text-gray-400 text-sm">No users found</div>
              ) : (
                searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleStartChat(user.id)}
                    className="flex items-center p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-white">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-gray-400">{user.user_type}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-black">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {activeChat.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h2 className="font-bold">{activeChat.full_name}</h2>
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <FaCircle className="w-2 h-2" /> Online
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                  Start the conversation!
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-md ${msg.sender_id === currentUserId ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none" : "bg-gray-800 text-gray-200 rounded-bl-none"}`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div
                      className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${msg.sender_id === currentUserId ? "text-purple-200" : "text-gray-400"}`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {msg.sender_id === currentUserId && (
                        <span>
                          {msg.is_seen ? (
                            <FaCheckDouble className="text-blue-300" />
                          ) : (
                            <FaCheckDouble className="text-gray-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
              <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm focus:outline-none text-white placeholder-gray-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition-transform hover:scale-105"
                >
                  <FaPaperPlane className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbox;
