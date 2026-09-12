'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Compass,
  GraduationCap,
  FileCheck2,
  Calendar,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Globe,
  Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';
import { getToken } from '@/lib/auth';
import api from '@/lib/api-client';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const quickPrompts = [
  {
    icon: Compass,
    label: 'How to Sign In',
    text: 'How can I sign in to my account?',
  },
  {
    icon: User,
    label: 'How to Register',
    text: 'How do I create a new account?',
  },
  {
    icon: FileCheck2,
    label: 'Upload Documents',
    text: 'How do I upload documents for AI OCR verification?',
  },
  {
    icon: Briefcase,
    label: 'Deposit & Payments',
    text: 'How do I deposit funds or make a payment?',
  },
  {
    icon: Globe,
    label: 'Track Investment Costs',
    text: 'How can I calculate and track investment program costs?',
  },
  {
    icon: GraduationCap,
    label: 'Global Scholarships',
    text: 'What ongoing scholarships are available and how do I apply?',
  },
];

/**
 * Basic markdown renderer that transforms [Link Text](/url) into clickable navigation links,
 * and handles bolding **text** and bullet points without emojis.
 */
function FormattedMessage({ content, onLinkClick }: { content: string; onLinkClick?: () => void }) {
  const renderParagraph = (text: string) => {
    // Convert markdown links [Label](url) into elements
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(renderBoldText(text.substring(lastIndex, match.index)));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      const isInternal = linkUrl.startsWith('/');

      if (isInternal) {
        parts.push(
          <Link
            key={match.index}
            href={linkUrl}
            onClick={onLinkClick}
            className="inline-flex items-center gap-1 font-semibold text-primary dark:text-accent hover:underline bg-primary/10 dark:bg-accent/20 px-2 py-0.5 rounded text-xs transition-colors my-0.5"
          >
            {linkText}
            <ExternalLink className="h-3 w-3 inline-block opacity-70" />
          </Link>
        );
      } else {
        parts.push(
          <a
            key={match.index}
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-primary dark:text-accent hover:underline bg-primary/10 px-2 py-0.5 rounded text-xs my-0.5"
          >
            {linkText}
            <ExternalLink className="h-3 w-3 inline-block" />
          </a>
        );
      }
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(renderBoldText(text.substring(lastIndex)));
    }

    return parts;
  };

  const renderBoldText = (str: string) => {
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const segments: React.ReactNode[] = [];
    let lastIdx = 0;
    let bMatch;

    while ((bMatch = boldRegex.exec(str)) !== null) {
      if (bMatch.index > lastIdx) {
        segments.push(str.substring(lastIdx, bMatch.index));
      }
      segments.push(
        <strong key={bMatch.index} className="font-semibold text-foreground">
          {bMatch[1]}
        </strong>
      );
      lastIdx = boldRegex.lastIndex;
    }

    if (lastIdx < str.length) {
      segments.push(str.substring(lastIdx));
    }

    return segments;
  };

  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-foreground">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-display text-sm font-bold text-foreground mt-3 mb-1">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5">
              <span className="text-primary dark:text-accent font-bold mt-0.5">•</span>
              <div className="flex-1">{renderParagraph(trimmed.replace(/^[-*]\s+/, ''))}</div>
            </div>
          );
        }

        return <p key={idx}>{renderParagraph(line)}</p>;
      })}
    </div>
  );
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id?: string; name?: string; email?: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Initialize or restore persistent sessionId
  useEffect(() => {
    let sid = sessionStorage.getItem('gcs_ai_session_id');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      sessionStorage.setItem('gcs_ai_session_id', sid);
    }
    setSessionId(sid);

    // Fetch user profile if logged in
    const token = getToken();
    if (token) {
      api.get('/users/me')
        .then((res) => {
          if (res.data) {
            setCurrentUser({
              id: res.data.id,
              email: res.data.email,
              name: res.data.profile ? `${res.data.profile.firstName || ''} ${res.data.profile.lastName || ''}`.trim() : res.data.email,
            });
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage, open]);

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setStreamingMessage('');

    const payload = {
      message: textToSend,
      history: messages.slice(-6),
      language: language || 'en',
      sessionId: sessionId || 'guest-session',
      userId: currentUser?.id,
      userName: currentUser?.name || 'Guest Visitor',
      userEmail: currentUser?.email,
    };

    try {
      const response = await fetch(`${apiUrl}/ai/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Streaming failed, fallback to standard');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.word) {
                  accumulated += (accumulated ? ' ' : '') + parsed.word;
                  setStreamingMessage(accumulated);
                }
              } catch {
                // non-json stream line
              }
            }
          }
        }
      }

      if (accumulated) {
        setMessages((prev) => [...prev, { role: 'assistant', content: accumulated }]);
        setStreamingMessage('');
      } else {
        // Fallback standard call
        await fallbackStandardChat(payload);
      }
    } catch {
      await fallbackStandardChat(payload);
    } finally {
      setLoading(false);
    }
  };

  const fallbackStandardChat = async (payload: any) => {
    try {
      const res = await fetch(`${apiUrl}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.reply ||
            'I am currently experiencing higher than usual traffic. Please explore our [Eligibility Calculator](/eligibility) or [Book a Consultation](/consultation).',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Our immigration assistance engine is momentarily busy. You can immediately access our [Eligibility Assessment](/eligibility) or [Browse Scholarships](/scholarships).',
        },
      ]);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setStreamingMessage('');
    const newSid = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    sessionStorage.setItem('gcs_ai_session_id', newSid);
    setSessionId(newSid);
  };

  return (
    <>
      {/* Floating Action Button - Middle Right of the Screen */}
      <div className="fixed top-1/2 -translate-y-1/2 right-3 sm:right-5 z-40 flex items-center gap-2.5">
        <motion.button
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Open Global Immigration Concierge"
          className={cn(
            'group relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full transition-all duration-300 shadow-2xl',
            open
              ? 'bg-[#030D1A] border border-sky-400/50 text-white shadow-sky-500/20'
              : 'bg-gradient-to-tr from-sky-600 via-sky-500 to-sky-400 border border-sky-300/40 text-white hover:shadow-sky-500/30'
          )}
        >
          {/* Subtle pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-sky-500/20 blur-md group-hover:bg-sky-400/40 transition-all" />

          {open ? (
            <X className="relative h-6 w-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Bot className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-[#030D1A]" />
              </span>
            </div>
          )}
        </motion.button>
      </div>

      {/* Chat Window Modal - Middle Right */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: '-50%', x: 20 }}
            animate={{ opacity: 1, scale: 1, y: '-50%', x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: '-50%', x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 right-3 sm:right-6 z-50 flex h-[580px] max-h-[85vh] w-[92vw] sm:w-[420px] flex-col overflow-hidden rounded-2xl border border-sky-500/20 bg-[#0A1F38]/95 backdrop-blur-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/20 bg-gradient-to-r from-deep-navy to-atlantic p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/20">
                  <Bot className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
                      Global Immigration Concierge
                    </h3>
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[9px] font-semibold text-accent uppercase tracking-wider border border-accent/30">
                      GCS
                    </span>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-white/80 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Always Available • Professional & Trustworthy
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={resetChat}
                  title="New Conversation"
                  className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  title="Minimize"
                  className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 bg-background/50">
              {messages.length === 0 && !streamingMessage && (
                <div className="space-y-4 py-2">
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
                    <div className="flex items-center gap-2 text-primary dark:text-accent font-semibold text-xs uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5" />
                      Global Immigration Concierge
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Welcome to Global Citizens Solution. I am your dedicated Global Immigration Concierge. I can assist you with visa programs, eligibility criteria, document requirements, global scholarships, and portal navigation.
                    </p>
                  </div>

                  {/* Suggested Quick Prompts */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                      Quick Assistance:
                    </p>
                    <div className="flex flex-col gap-2">
                      {quickPrompts.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(item.text)}
                          className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-left text-xs font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-all shadow-xs group cursor-pointer"
                        >
                          <item.icon className="h-4 w-4 text-primary dark:text-accent shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex gap-2.5',
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {m.role === 'assistant' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-accent mt-0.5 border border-border">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl p-3.5 shadow-xs',
                      m.role === 'user'
                        ? 'bg-atlantic text-white rounded-br-xs'
                        : 'bg-card border border-border text-foreground rounded-bl-xs'
                    )}
                  >
                    {m.role === 'user' ? (
                      <p className="text-xs sm:text-sm leading-relaxed">{m.content}</p>
                    ) : (
                      <FormattedMessage content={m.content} />
                    )}
                  </div>
                  {m.role === 'user' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-atlantic text-white text-xs mt-0.5 shadow-xs">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {streamingMessage && (
                <div className="flex gap-2.5 justify-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-accent mt-0.5 border border-border">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl bg-card border border-border text-foreground p-3.5 shadow-xs rounded-bl-xs">
                    <FormattedMessage content={streamingMessage} />
                    <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse ml-1" />
                  </div>
                </div>
              )}

              {loading && !streamingMessage && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pl-9">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  <span>Consulting immigration knowledge base...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-border bg-card p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your question (e.g. visa eligibility, scholarships)..."
                  className="flex-1 h-11 px-4 text-xs sm:text-sm bg-background text-foreground placeholder:text-muted-foreground border border-input rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  disabled={loading}
                  autoComplete="off"
                />
                <Button
                  onClick={() => handleSend()}
                  size="icon"
                  className="h-11 w-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs shrink-0 rounded-xl disabled:opacity-50"
                  disabled={loading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}