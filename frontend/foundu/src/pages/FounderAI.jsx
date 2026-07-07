import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import { getFullName } from "../utils/authUtils";
import {
  ArrowUp,
  Plus,
  Trash2,
  Menu,
  X,
  ChevronLeft,
  MessageSquare,
  Search,
  PenLine,
  Rocket,
  Sparkles,
} from "lucide-react";

// Lightweight markdown renderer (no extra deps)
const SimpleMarkdown = ({ children }) => {
  const lines = children.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith("### ")) return <h3 key={i} className="font-semibold text-white mt-3">{line.slice(4)}</h3>;
        if (line.startsWith("## ")) return <h2 key={i} className="font-semibold text-white text-lg mt-3">{line.slice(3)}</h2>;
        if (line.startsWith("# ")) return <h1 key={i} className="font-semibold text-white text-xl mt-3">{line.slice(2)}</h1>;
        if (line.startsWith("- ") || line.startsWith("* ")) return <div key={i} className="flex gap-2"><span className="text-gray-500 shrink-0">•</span><span>{line.slice(2)}</span></div>;
        if (/^\d+\. /.test(line)) {
          const num = line.match(/^(\d+)\. /)[1];
          return <div key={i} className="flex gap-2"><span className="text-gray-400 shrink-0 font-semibold">{num}.</span><span>{line.replace(/^\d+\. /, "")}</span></div>;
        }
        if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold text-white">{line.slice(2, -2)}</p>;
        if (line === "") return <div key={i} className="h-1" />;
        // Inline bold
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i}>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      })}
    </div>
  );
};

const STARTERS = [
  { icon: Sparkles, label: "Validate my idea", prompt: "How do I validate my startup idea without spending money?" },
  { icon: Rocket, label: "Scope my MVP", prompt: "What should my MVP include and what should I cut?" },
  { icon: PenLine, label: "GTM strategy", prompt: "Help me design a go-to-market strategy for India." },
  { icon: Search, label: "What investors want", prompt: "What do investors look for in a pre-seed startup?" },
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
    } catch {
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

  // Reusable ChatGPT-style composer — rendered centered when empty, docked when active
  const Composer = ({ compact }) => (
    <div className={`w-full ${compact ? "max-w-3xl mx-auto" : "max-w-2xl"}`}>
      <div className="flex items-end gap-2 bg-[#2f2f2f] border border-white/10 focus-within:border-white/20 rounded-[26px] px-2.5 py-2 shadow-lg shadow-black/30 transition-all">
        <button
          type="button"
          className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-gray-300 hover:bg-white/10 transition-all active:scale-95"
          title="New chat"
          onClick={handleNewChat}
        >
          <Plus className="w-5 h-5" />
        </button>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your startup"
          rows={1}
          className="flex-1 bg-transparent text-white placeholder:text-gray-500 text-[15px] resize-none outline-none px-1 py-2 max-h-44 overflow-y-auto custom-scrollbar"
          style={{ minHeight: "24px" }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 176) + "px";
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="w-9 h-9 shrink-0 bg-white text-black hover:bg-gray-200 disabled:bg-white/20 disabled:text-white/40 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all active:scale-95"
          title="Send"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#212121] text-white flex pt-[80px] overflow-hidden relative">
      {/* Sidebar Overlay (Mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden mt-[80px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static top-[80px] bottom-0 left-0 z-40 w-64 bg-[#171717] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* New Chat Button */}
        <div className="p-3 shrink-0">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all text-sm font-medium text-white active:scale-[0.98]"
          >
            <PenLine className="w-4 h-4 text-gray-300" />
            New chat
          </button>
        </div>

        {/* Scrollable Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar pb-4" data-lenis-prevent>
          <div className="text-[11px] font-medium text-gray-500 px-3 mb-2 mt-2">
            Chats
          </div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id);
                setSidebarOpen(false);
              }}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                chat.id === activeChatId
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <MessageSquare className={`w-4 h-4 shrink-0 ${chat.id === activeChatId ? "text-gray-300" : "text-gray-600 group-hover:text-gray-400"}`} />
                <span className="truncate">{chat.title}</span>
              </div>
              <button
                onClick={(e) => handleDeleteChat(chat.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 rounded-md hover:bg-white/5 transition-all active:scale-90 ml-1"
                title="Delete chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Link */}
        <div className="p-2 border-t border-white/5 shrink-0">
          <button
            onClick={() => navigate("/startup-dashboard")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm font-medium active:scale-[0.98]"
          >
            <ChevronLeft className="w-4 h-4" />
            Exit to dashboard
          </button>
        </div>
      </aside>

      {/* Main Chat Workspace */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#212121] z-10">

        {/* Mobile Header Bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#212121] shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all active:scale-95"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="text-sm font-semibold tracking-tight text-white">FounderGPT</div>
          <button
            onClick={handleNewChat}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all active:scale-95"
          >
            <PenLine className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {isEmpty ? (
          // Empty State — centered composer (ChatGPT landing)
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-10">
            <h1 className="text-2xl md:text-[32px] font-semibold text-white tracking-tight mb-8 text-center">
              What are we building, {userName}?
            </h1>

            <Composer />

            {/* Starter action chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5 max-w-2xl">
              {STARTERS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={i}
                    onClick={() => sendMessage(s.prompt)}
                    className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-white/5 border border-white/15 rounded-full text-sm text-gray-300 hover:text-white transition-all"
                  >
                    <Icon className="w-4 h-4 text-gray-400" />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          // Active Conversation
          <>
            <div className="flex-1 overflow-y-auto w-full custom-scrollbar" data-lenis-prevent>
              <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6 pb-10">
                <div className="flex flex-col gap-6">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "user" ? (
                        <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl px-5 py-2.5 text-[15px] leading-relaxed bg-[#2f2f2f] text-white">
                          {msg.content}
                        </div>
                      ) : (
                        <div
                          className={`max-w-full text-[15px] leading-relaxed ${
                            msg.isError ? "text-red-300" : "text-gray-100"
                          }`}
                        >
                          <SimpleMarkdown>{msg.content}</SimpleMarkdown>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading Typing Indicator */}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-1.5 py-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>

            {/* Docked Composer */}
            <div className="w-full bg-[#212121] shrink-0">
              <div className="px-4 md:px-6 pb-4 pt-2">
                <Composer compact />
                <p className="text-center text-[11px] text-gray-500 mt-2">
                  FounderGPT can make mistakes. Use critical thinking before acting on advice.
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `,
        }}
      />
    </div>
  );
};

export default FounderAI;
