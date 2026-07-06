import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import { getFullName } from "../utils/authUtils";
import { Send, Zap } from "lucide-react";
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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const userMsg = { role: "user", content: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Build history excluding the message we just added
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await api.post("/api/founder-ai/chat", {
        message: userText,
        history,
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.data.reply },
        ]);
      } else {
        throw new Error(res.data.error || "Unknown error");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
          isError: true,
        },
      ]);
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

  const clearChat = () => {
    setMessages([]);
    inputRef.current?.focus();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="min-h-screen bg-[#020024] text-white flex flex-col">
      {/* Ambient BG */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/8 rounded-full blur-[130px]" />
        <div className="absolute top-[30%] right-[-5%] w-[35%] h-[35%] bg-purple-600/8 rounded-full blur-[110px]" />
        <div className="absolute bottom-0 left-[30%] w-[30%] h-[30%] bg-indigo-600/8 rounded-full blur-[120px]" />
      </div>



      {/* Chat Area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 md:px-8 pt-24 pb-6 max-w-4xl mx-auto w-full">
        {isEmpty ? (
          // Empty state
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">

            <p className="text-blue-400 font-black tracking-tight text-lg mb-2 uppercase">
              {getGreeting()}, {userName} 👋
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-3">
              What would you like<br />
              <span className="text-blue-500">to build today?</span>
            </h1>
            <p className="text-gray-500 text-sm mb-12 max-w-sm">
              Your AI startup advisor. Ask me anything about building, hiring, fundraising, or scaling your startup.
            </p>

            {/* Starter prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {STARTERS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-left px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 rounded-2xl text-sm text-gray-300 hover:text-white transition-all font-medium group"
                >
                  <span className="text-blue-500 mr-2 group-hover:text-blue-400">→</span>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Messages
          <div className="flex flex-col gap-6 pb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}
              >


                <div
                  className={`max-w-[80%] rounded-3xl px-5 py-4 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-lg font-medium"
                      : msg.isError
                      ? "bg-red-500/10 border border-red-500/20 text-red-300"
                      : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-lg"
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
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-1 font-black text-xs text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-3xl rounded-bl-lg px-5 py-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input */}
      <div className="relative z-10 px-4 md:px-8 pb-8 pt-4 border-t border-white/5 max-w-4xl mx-auto w-full">
        <div className="flex items-end gap-3 bg-white/5 border border-white/10 focus-within:border-blue-500/40 rounded-2xl p-3 transition-all backdrop-blur-xl">
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
            className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all shrink-0 shadow-lg shadow-blue-500/20"
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
  );
};

export default FounderAI;
