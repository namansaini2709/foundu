import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import { getFullName } from "../utils/authUtils";
import { Send, Zap, Plus, Trash2, Menu, X, ChevronLeft, MessageSquare } from "lucide-react";

// Lightweight markdown renderer (no extra deps)
const SimpleMarkdown = ({ children }) => {
  const lines = children.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith("### ")) return <h3 key={i} className="font-black text-white mt-3">{line.slice(4)}</h3>;
        if (line.startsWith("## ")) return <h2 key={i} className="font-black text-white text-lg mt-3">{line.slice(3)}</h2>;
        if (line.startsWith("# ")) return <h1 key={i} className="font-black text-white text-xl mt-3">{line.slice(2)}</h1>;
        if (line.startsWith("- ") || line.startsWith("* ")) return <div key={i} className="flex gap-2"><span className="text-blue-400 shrink-0">•</span><span>{line.slice(2)}</span></div>;
        if (/^\d+\. /.test(line)) {
          const num = line.match(/^(\d+)\. /)[1];
          return <div key={i} className="flex gap-2"><span className="text-blue-400 shrink-0 font-bold">{num}.</span><span>{line.replace(/^\d+\. /, "")}</span></div>;
        }
        if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-bold text-white">{line.slice(2, -2)}</p>;
        if (line === "") return <div key={i} className="h-1" />;
        // Inline bold
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i}>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j} className="text-white font-bold">{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      })}
    </div>
  );
};

const STARTERS = [
  "How do I validate my startup idea without spending money?",
  "What's the fastest way to find a technical co-founder?",
  "Help me design a go-to-market strategy for India.",
  "What should my MVP include?",
  "How do I price my SaaS product?",
  "What investors look for in a pre-seed startup?",
];

const FounderAI = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("founder_ai_chats");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeChatId, setActiveChatId] = useState(() => {
    return localStorage.getItem("founder_ai_active_chat_id") || "";
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const userName = (() => {
    const full = getFullName();
    if (full) return full.split(" ")[0];
    const cached = localStorage.getItem("user_name");
    return cached ? cached.split(" ")[0] : "Founder";
  })();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  // Lock body scroll on mount to prevent double scrollbars
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.setAttribute("data-lenis-prevent", "true");
    
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.removeAttribute("data-lenis-prevent");
    };
  }, []);

  // Ensure there is at least one active chat session on load
  useEffect(() => {
    if (chats.length === 0) {
      const newId = Date.now().toString();
      const newChat = {
        id: newId,
        title: "New Chat",
        messages: [],
      };
      setChats([newChat]);
      setActiveChatId(newId);
    } else if (!activeChatId || !chats.some((c) => c.id === activeChatId)) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("founder_ai_chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("founder_ai_active_chat_id", activeChatId);
  }, [activeChatId]);

  // Auto-scroll on new messages
  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];
  const messages = activeChat ? activeChat.messages : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newChat = {
      id: newId,
      title: "New Chat",
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newId);
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleDeleteChat = (id, e) => {
    e.stopPropagation();
    const updatedChats = chats.filter((c) => c.id !== id);
    setChats(updatedChats);
    
    if (activeChatId === id) {
      if (updatedChats.length > 0) {
        setActiveChatId(updatedChats[0].id);
      } else {
        // Will trigger auto-creation on next render cycle
        setActiveChatId("");
      }
    }
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    // 1. Append user message and auto-update title if it's new
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          const updatedMessages = [...c.messages, { role: "user", content: userText }];
          const isDefaultTitle = c.title === "New Chat" || c.title.trim() === "";
          const newTitle = isDefaultTitle
            ? userText.length > 24
              ? userText.slice(0, 24) + "..."
              : userText
            : c.title;
          return { ...c, title: newTitle, messages: updatedMessages };
        }
        return c;
      })
    );
    setInput("");
    setLoading(true);

    try {
      // Build history payload for Gemini context
      const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));
      
      const res = await api.post("/api/founder-ai/chat", {
        message: userText,
        history: historyPayload,
      });

      if (res.data.success) {
        setChats((prev) =>
          prev.map((c) => {
            if (c.id === activeChatId) {
              return {
                ...c,
                messages: [...c.messages, { role: "assistant", content: res.data.reply }],
              };
            }
            return c;
          })
        );
      } else {
        throw new Error(res.data.error || "Unknown error");
      }
    } catch (err) {
      setChats((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId) {
            return {
              ...c,
              messages: [
                ...c.messages,
                {
                  role: "assistant",
                  content: "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
                  isError: true,
                },
              ],
            };
          }
          return c;
        })
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="h-screen bg-[#020024] text-white flex pt-[80px] overflow-hidden relative">
      {/* Ambient BG effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/5 rounded-full blur-[130px]" />
        <div className="absolute top-[30%] right-[-5%] w-[35%] h-[35%] bg-purple-600/5 rounded-full blur-[110px]" />
        <div className="absolute bottom-0 left-[30%] w-[30%] h-[30%] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar Overlay (Mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden mt-[80px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static top-[80px] bottom-0 left-0 z-40 w-64 bg-[#04022a]/95 lg:bg-[#04022a]/50 border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* New Chat Button */}
        <div className="p-4 shrink-0">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 hover:border-blue-500/30 hover:bg-white/5 transition-all text-sm font-bold text-white shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4 text-blue-400" />
            New Chat
          </button>
        </div>

        {/* Scrollable Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar pb-4" data-lenis-prevent>
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-3 mb-3">
            Conversations
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id);
                setSidebarOpen(false);
              }}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                chat.id === activeChatId
                  ? "bg-white/10 text-white font-semibold shadow-inner border border-white/5"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <MessageSquare className={`w-4 h-4 shrink-0 ${chat.id === activeChatId ? "text-blue-400" : "text-gray-600 group-hover:text-gray-400"}`} />
                <span className="truncate">{chat.title}</span>
              </div>
              <button
                onClick={(e) => handleDeleteChat(chat.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-all active:scale-90 ml-1"
                title="Delete chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Link */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <button
            onClick={() => navigate("/startup-dashboard")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm font-bold active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            Exit Dashboard
          </button>
        </div>
      </aside>

      {/* Main Chat Workspace */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-transparent z-10">
        
        {/* Mobile Header Bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#020024]/80 backdrop-blur-md shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all active:scale-95"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="text-sm font-black tracking-tight text-white uppercase">FounderAI</div>
          <button
            onClick={handleNewChat}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 text-blue-400" />
          </button>
        </div>

        {/* Scrollable Conversation Content Area */}
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar" data-lenis-prevent>
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 space-y-6 pb-24">
            {isEmpty ? (
              // Empty State (GPT Landing Style)
              <div className="flex flex-col items-center justify-center min-h-[65vh] text-center pt-8">
                <p className="text-blue-400 font-black tracking-tight text-lg mb-2 uppercase animate-pulse">
                  {getGreeting()}, {userName} 👋
                </p>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                  What would you like<br />
                  <span className="text-blue-500">to build today?</span>
                </h1>
                <p className="text-gray-500 text-sm mb-12 max-w-sm">
                  Your AI advisor for validation, scoping MVPs, hiring advice, and GTM strategy.
                </p>

                {/* Starter Prompts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {STARTERS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s)}
                      className="text-left px-5 py-4 bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/30 rounded-2xl text-sm text-gray-300 hover:text-white transition-all font-medium group shadow-sm"
                    >
                      <span className="text-blue-500 mr-2 group-hover:text-blue-400 transition-colors">→</span>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Active Conversation Bubbles
              <div className="flex flex-col gap-6 pb-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-3xl px-5 py-4 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-lg font-medium shadow-md shadow-blue-500/10"
                          : msg.isError
                          ? "bg-red-500/10 border border-red-500/20 text-red-300"
                          : "bg-white/5 border border-white/5 text-gray-200 rounded-bl-lg shadow-sm"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="text-gray-200">
                          <SimpleMarkdown>{msg.content}</SimpleMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-1 font-black text-xs text-white">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading Typing Indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-3xl rounded-bl-lg px-5 py-4 flex items-center gap-2 shadow-sm">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Dock */}
        <div className="w-full border-t border-white/5 bg-[#020024]/40 backdrop-blur-xl shrink-0">
          <div className="max-w-3xl mx-auto px-4 md:px-8 pb-8 pt-4">
            <div className="flex items-end gap-3 bg-white/5 border border-white/10 focus-within:border-blue-500/40 rounded-2xl p-3 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your startup..."
                rows={1}
                className="flex-1 bg-transparent text-white placeholder:text-gray-600 text-sm resize-none outline-none px-2 py-1 max-h-40 overflow-y-auto"
                style={{ minHeight: "36px" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all shrink-0 shadow-lg shadow-blue-500/20 active:scale-95"
              >
                {loading ? (
                  <Zap className="w-4 h-4 text-gray-400 animate-pulse" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-600 mt-3 font-medium">
              FounderGPT can make mistakes. Use critical thinking before acting on advice.
            </p>
          </div>
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `,
        }}
      />
    </div>
  );
};

export default FounderAI;
