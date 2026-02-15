import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  Send,
  Menu,
  Lightbulb,
  Settings,
  Plus,
  LogOut,
  ChevronDown,
  Copy,
  Bot,
  Pencil,
  Trash2,
  Search,
  ArrowDown,
  MoreHorizontal,
  Check,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  intent?: string;
  confidence?: number;
  timestamp?: string;
  createdAt?: string;
}

interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export default function Chat() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm here to help. I understand what you're trying to accomplish and respond accordingly. What can I help you with?",
      intent: "greeting",
      confidence: 0.98,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [conversationSearch, setConversationSearch] = useState("");
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
        setError(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Failed to load conversations");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error loading conversations";
      setError(message);
      console.error("Failed to load conversations:", err);
    }
  };

  const defaultChatTitles = [
    "Starlight dialogue",
    "Evening thoughts",
    "Quick exchange",
    "New beginning",
    "Spark of ideas",
    "Quiet corner",
    "Mind garden",
    "Thought stream",
    "Curious mind",
    "Fresh start",
    "Morning brew",
    "Night owl",
    "Brainstorm",
    "Idea lab",
    "Open book",
    "Clear sky",
    "Warm welcome",
    "Friendly chat",
  ];

  const pickRandomTitle = () =>
    defaultChatTitles[Math.floor(Math.random() * defaultChatTitles.length)];

  const handleNewChat = async () => {
    try {
      setError(null);
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pickRandomTitle(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentConversationId(data.conversation._id);
        setMessages([
          {
            id: "1",
            role: "assistant",
            content:
              "Hello! I'm here to help. I understand what you're trying to accomplish and respond accordingly. What can I help you with?",
            intent: "greeting",
            confidence: 0.98,
            timestamp: new Date().toISOString(),
          },
        ]);
        await loadConversations();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Failed to create new chat");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error creating chat";
      setError(message);
      console.error("Failed to create new conversation:", err);
    }
  };

  const handleLoadConversation = async (conversationId: string) => {
    setEditingConversationId(null);
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch(`/api/conversations/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentConversationId(conversationId);
        // Ensure messages is an array with the loaded messages
        const loadedMessages = data.conversation?.messages || [];
        setMessages(loadedMessages.length > 0 ? loadedMessages : [
          {
            id: "1",
            role: "assistant",
            content: "Hello! I'm here to help. What can I assist you with?",
            intent: "greeting",
            confidence: 0.98,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Failed to load conversation");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error loading conversation";
      setError(message);
      console.error("Failed to load conversation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    toast.success("Your chats are saved. Log in again anytime to continue.");
    await logout();
    navigate("/login");
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, { method: "DELETE" });
      if (response.ok) {
        if (currentConversationId === conversationId) {
          setCurrentConversationId(null);
          setMessages([
            {
              id: "1",
              role: "assistant",
              content: "Hello! I'm here to help. What can I assist you with?",
              intent: "greeting",
              confidence: 0.98,
              timestamp: new Date().toISOString(),
            },
          ]);
        }
        await loadConversations();
        toast.success("Chat deleted");
      } else {
        toast.error("Failed to delete chat");
      }
    } catch {
      toast.error("Failed to delete chat");
    }
  };

  const handleRenameConversation = async (conversationId: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setEditingConversationId(null);
      return;
    }
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      });
      if (response.ok) {
        setConversations((prev) =>
          prev.map((c) => (c._id === conversationId ? { ...c, title: trimmed } : c))
        );
        setEditingConversationId(null);
        toast.success("Chat renamed");
      } else {
        toast.error("Failed to rename chat");
      }
    } catch {
      toast.error("Failed to rename chat");
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollToBottom(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredConversations = conversationSearch.trim()
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(conversationSearch.toLowerCase())
      )
    : conversations;

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const check = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowScrollToBottom(scrollHeight - scrollTop - clientHeight > 120);
    };
    el.addEventListener("scroll", check);
    check();
    return () => el.removeEventListener("scroll", check);
  }, [messages]);

  const mockIntents = {
    greeting: { name: "Greeting", color: "bg-blue-100 text-blue-700" },
    question: { name: "Question", color: "bg-purple-100 text-purple-700" },
    request: { name: "Request", color: "bg-pink-100 text-pink-700" },
    feedback: { name: "Feedback", color: "bg-green-100 text-green-700" },
    help: { name: "Help", color: "bg-orange-100 text-orange-700" },
  };

  const detectIntent = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("hey")
    ) {
      return "greeting";
    }
    if (
      message.includes("?") ||
      message.includes("what") ||
      message.includes("how") ||
      message.includes("why") ||
      message.includes("when")
    ) {
      return "question";
    }
    if (
      message.includes("can you") ||
      message.includes("could you") ||
      message.includes("please") ||
      message.includes("help me")
    ) {
      return "request";
    }
    if (
      message.includes("thank") ||
      message.includes("great") ||
      message.includes("good") ||
      message.includes("love")
    ) {
      return "feedback";
    }
    return "help";
  };

  const generateResponse = (intent: string): string => {
    const responses: Record<string, string[]> = {
      greeting: [
        "Great to see you! How can I assist you today?",
        "Hi there! What would you like to know?",
        "Hello! I'm ready to help. What do you need?",
      ],
      question: [
        "That's a great question! I'd be happy to help explain that.",
        "I understand your curiosity. Let me provide some insights.",
        "That's something I can definitely help clarify.",
      ],
      request: [
        "I'll be glad to help you with that. Let me process your request.",
        "Understood! I'm working on fulfilling your request.",
        "You got it! Let me take care of that for you.",
      ],
      feedback: [
        "Thank you so much for the positive feedback! It means a lot.",
        "I'm delighted to hear that! Your support keeps me improving.",
        "Your kind words motivate me to serve you better!",
      ],
      help: [
        "I'm here to help! Tell me more about what you need.",
        "I understand you need assistance. How can I support you?",
        "Let me help you with that. What specific area do you need support with?",
      ],
    };

    const intentResponses =
      responses[intent as keyof typeof responses] || responses.help;
    return intentResponses[Math.floor(Math.random() * intentResponses.length)];
  };

  const handleSendMessage = async (e?: React.FormEvent, suggestion?: string) => {
    e?.preventDefault();
    const text = (suggestion ?? input).trim();
    if (!text) return;

    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Save user message to API if in a conversation
    if (currentConversationId) {
      try {
        const response = await fetch(`/api/conversations/${currentConversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            content: userMessage.content,
            role: "user",
          }),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.warn("Failed to save user message:", errorData.message);
        }
      } catch (error) {
        console.warn("Network error saving user message:", error);
      }
    }

    // Simulate API delay
    setTimeout(async () => {
      try {
        const intent = detectIntent(userMessage.content);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generateResponse(intent),
          intent,
          confidence: 0.85 + Math.random() * 0.14,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);

        // Save assistant message to API if in a conversation
        if (currentConversationId) {
          try {
            const response = await fetch(`/api/conversations/${currentConversationId}/messages`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                content: assistantMessage.content,
                role: "assistant",
                intent: assistantMessage.intent,
                confidence: assistantMessage.confidence,
              }),
            });
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              console.warn("Failed to save assistant message:", errorData.message);
            }
          } catch (err) {
            console.warn("Network error saving assistant message:", err);
          }
        }
      } catch (err) {
        setError("Failed to generate response. Please try again.");
        setIsLoading(false);
        console.error("Message processing error:", err);
      }
    }, 500);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen h-[100dvh] max-h-[100dvh] bg-background dark:bg-slate-950 flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-background dark:bg-slate-900 border-r border-border/50 dark:border-slate-800/50 flex flex-col transition-all duration-300 overflow-hidden flex-shrink-0`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border dark:border-slate-800">
          <button onClick={handleNewChat} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 bg-primary/5 text-primary font-medium transition active:bg-primary/15 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-border dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <input
              type="text"
              value={conversationSearch}
              onChange={(e) => setConversationSearch(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 text-foreground placeholder-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
          <p className="text-xs text-foreground/50 uppercase font-semibold px-3 mb-3 mt-2">
            Recent
          </p>
          {filteredConversations.length === 0 ? (
            <p className="text-sm text-foreground/50 px-3">
              {conversations.length === 0 ? "No previous chats" : "No matching chats"}
            </p>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  className={`group flex items-center gap-1 rounded-lg ${
                    currentConversationId === conversation._id
                      ? "bg-primary/20 text-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {editingConversationId === conversation._id ? (
                    <div className="flex-1 flex gap-1 px-2 py-1.5 min-w-0">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenameConversation(conversation._id, editingTitle);
                          if (e.key === "Escape") setEditingConversationId(null);
                        }}
                        className="flex-1 min-w-0 px-2 py-1 rounded border border-border dark:border-slate-700 bg-background dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleRenameConversation(conversation._id, editingTitle)}
                        className="p-1.5 rounded hover:bg-primary/20 text-primary shrink-0 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setOpenMenuId(null);
                          handleLoadConversation(conversation._id);
                        }}
                        className="flex-1 text-left px-3 py-2 rounded-lg transition text-sm truncate font-medium"
                        title={conversation.title}
                      >
                        {conversation.title}
                      </button>
                      <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingConversationId(null);
                            setOpenMenuId(openMenuId === conversation._id ? null : conversation._id);
                          }}
                          className="p-1.5 rounded hover:bg-muted/80 text-foreground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMenuId === conversation._id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-0 top-full mt-1 py-1 rounded-lg border border-border dark:border-slate-700 bg-background dark:bg-slate-800 shadow-lg z-50 min-w-[100px]">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTitle(conversation.title);
                                  setEditingConversationId(conversation._id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50"
                              >
                                <Pencil className="w-3.5 h-3.5" /> Rename
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleDeleteConversation(conversation._id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Footer - User Menu */}
        <div className="border-t border-border dark:border-slate-800 p-3">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition group"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center group-hover:bg-primary/30 flex-shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-foreground/60 truncate">
                  {user?.email}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-foreground/50 flex-shrink-0 transition ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-background dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-background dark:bg-slate-900 border-b border-border/50 dark:border-slate-800/50 flex-shrink-0">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-muted/50 rounded-lg transition text-foreground/70 hover:text-foreground flex-shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-foreground truncate">
                {currentConversationId
                  ? (conversations.find((c) => c._id === currentConversationId)?.title ?? "New chat")
                  : "New chat"}
              </span>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-sm font-medium text-foreground/70 hidden sm:inline">
                {user?.name}
              </span>
              <button
                onClick={() => navigate("/settings")}
                className="p-2 hover:bg-muted/50 rounded-lg transition text-foreground/70 hover:text-foreground"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="px-4 md:px-6 py-3 bg-destructive/10 border-b border-destructive/20 flex items-center justify-between">
            <p className="text-sm text-destructive font-medium">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-destructive/60 hover:text-destructive transition text-lg leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Chat Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 py-8 bg-background dark:bg-slate-950 relative"
        >
          {showScrollToBottom && (
            <button
              type="button"
              onClick={scrollToBottom}
              className="absolute bottom-6 right-4 md:right-8 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-10"
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          )}
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Empty state: suggestion chips when only the initial greeting is shown */}
            {messages.length <= 1 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center animate-fade-in">
                <p className="text-sm text-foreground/60 mb-4">
                  Ask anything — I&apos;ll detect your intent and respond.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Say hello", "Ask a question", "Request help"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleSendMessage(undefined, label)}
                      className="px-4 py-2 rounded-full border border-border dark:border-slate-700 bg-background dark:bg-slate-800/80 text-foreground/80 text-sm font-medium hover:bg-muted/50 hover:border-primary/30 hover:text-foreground transition"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-slide-up`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`flex flex-col max-w-[85%] ${
                    message.role === "user"
                      ? "chat-bubble-user max-w-md items-end"
                      : "chat-bubble-assistant max-w-2xl"
                  }`}
                >
                  <p className="leading-relaxed text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                  {(message.timestamp || message.createdAt) && (
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] opacity-60">
                        {formatDistanceToNow(new Date(message.timestamp ?? message.createdAt!), { addSuffix: true })}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyMessage(message.content)}
                        className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition focus:outline-none focus:ring-2 focus:ring-primary/50"
                        aria-label="Copy message"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  {message.intent && message.role === "assistant" && (
                    <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 flex-wrap cursor-help">
                            <Lightbulb className="w-3 h-3 opacity-70 flex-shrink-0" />
                            <span
                              className={`text-xs px-2 py-0.5 rounded ${
                                mockIntents[
                                  message.intent as keyof typeof mockIntents
                                ]?.color || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                              }`}
                            >
                              {mockIntents[
                                message.intent as keyof typeof mockIntents
                              ]?.name || "Unknown"}
                            </span>
                            <span className="text-xs opacity-70">
                              {(message.confidence! * 100).toFixed(0)}%
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="font-medium">Intent & confidence</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            The bot classifies your message into an intent (e.g. greeting, question). The percentage is how confident it is about that classification.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1 ring-1 ring-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">
                      {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                  )
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start gap-2 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl px-5 py-3.5">
                  <p className="text-sm text-foreground/70 mb-2">Detecting intent…</p>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed at Bottom */}
        <div className="border-t border-border/50 dark:border-slate-800/50 bg-background dark:bg-slate-900 flex-shrink-0">
          <div className="max-w-3xl mx-auto w-full px-4 md:px-6 py-5">
            <form onSubmit={(e) => handleSendMessage(e)} className="flex gap-3 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Message... (Shift+Enter for new line)"
                rows={1}
                className="flex-1 min-h-[44px] max-h-32 px-4 py-3 rounded-lg border border-border bg-background dark:bg-slate-800 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm md:text-base resize-y"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 active:bg-primary/95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
