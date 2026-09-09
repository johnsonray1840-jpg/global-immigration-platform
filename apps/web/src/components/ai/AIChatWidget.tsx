'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageCircle,
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/i18n/LanguageContext';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const quickPrompts = [
  { icon: Compass, label: '🧭 Guide me / Where to start', text: 'I am a new visitor. Can you guide me on how to navigate this platform and where to start?' },
  { icon: GraduationCap, label: '🎓 Global Scholarships', text: 'What ongoing scholarships are available and how do I apply?' },
  { icon: FileCheck2, label: '🔍 Check Visa Eligibility', text: 'How do I check my eligibility and calculate points for immigration?' },
  { icon: Sparkles, label: '🍁 Canada Express Entry / PR', text: 'Tell me about Canada Express Entry requirements, CRS points, and PR pathways.' },
  { icon: Calendar, label: '📅 Book Consultation', text: 'How can I book a 1-on-1 consultation with a licensed immigration consultant?' },
];

/**
 * Basic markdown renderer that transforms [Link Text](/url) into clickable navigation links,
 * and handles bolding **text** and bullet points.
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
            className="inline-flex items-center gap-0.5 font-semibold text-[#0B5D66] dark:text-[#C9A96E] hover:underline bg-[#0B5D66]/10 dark:bg-[#C9A96E]/20 px-1.5 py-0.5 rounded text-xs transition-colors"
          >
            {linkText}
            <ExternalLink className="h-3 w-3 ml-0.5 inline-block opacity-70" />
          </Link>
        );
      } else {
        parts.push(
          <a
            key={match.index}
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 font-semibold text-[#0B5D66] dark:text-[#C9A96E] hover:underline bg-[#0B5D66]/10 px-1.5 py-0.5 rounded text-xs"
          >
            {linkText}
            <ExternalLink className="h-3 w-3 ml-0.5 inline-block" />
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
        <strong key={bMatch.index} className="font-semibold text-[#111827] dark:text-white">
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
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-display text-sm font-bold text-[#111827] dark:text-white mt-2 mb-1">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1.5">
              <span className="text-[#0B5D66] dark:text-[#C9A96E] font-bold">•</span>
              <div>{renderParagraph(trimmed.replace(/^[-*]\s+/, ''))}</div>
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

    try {
      const response = await fetch(`${apiUrl}/ai/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          language: language || 'en',
        }),
      });

      if (!response.ok || !response.body) {
        // Fallback to standard chat endpoint
        const fallbackRes = await fetch(`${apiUrl}/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend,
            history: messages,
            language: language || 'en',
          }),
        });
        const data = await fallbackRes.json();
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || 'I am here to assist with your immigration queries.' }]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.word !== undefined) {
                assistantText += (assistantText ? ' ' : '') + parsed.word;
                setStreamingMessage(assistantText);
              }
            } catch {}
          }
        }
      }

      if (assistantText) {
        setMessages((prev) => [...prev, { role: 'assistant', content: assistantText }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'I am your AI Immigration Navigator. How can I assist you with your visa, scholarships, or platform navigation?' },
        ]);
      }
      setStreamingMessage('');
    } catch (error) {
      console.warn('AI chat error, using local reply:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I am ready to help you navigate our platform! You can [Check Your Visa Eligibility](/eligibility), [Explore 10+ Global Scholarships](/scholarships), or [Book a 1-on-1 Consultation](/consultation).',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setStreamingMessage('');
    setInput('');
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#0B5D66] to-[#0A4E56] text-white shadow-2xl hover:shadow-cyan-900/30 transition-shadow focus:outline-none"
        aria-label="Toggle AI Immigration Assistant"
      >
        <div className="relative flex items-center justify-center">
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <MessageCircle className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A96E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C9A96E]"></span>
              </span>
            </>
          )}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 flex h-[580px] max-h-[calc(100vh-7rem)] w-[400px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white dark:bg-[#111827] shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-[#0B5D66] to-[#0A4E56] p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-[#C9A96E] shadow-inner">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-bold text-white">
                      AI Immigration Guide
                    </h3>
                    <span className="rounded-full bg-[#C9A96E]/20 px-2 py-0.5 text-[10px] font-semibold text-[#C9A96E] uppercase tracking-wider border border-[#C9A96E]/30">
                      Expert
                    </span>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-white/80">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Always Available • Site Navigator
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={resetChat}
                  title="Reset Conversation"
                  className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 bg-gray-50/50 dark:bg-gray-900/40">
              {messages.length === 0 && !streamingMessage && (
                <div className="space-y-4 py-2">
                  <div className="rounded-2xl border border-gray-200/80 bg-white dark:bg-gray-800 p-4 shadow-xs">
                    <div className="flex items-center gap-2 text-[#0B5D66] dark:text-[#C9A96E] font-semibold text-xs uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5" />
                      Welcome to Global Immigration
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      I am your 24/7 AI Navigator. I can answer complex visa questions, explain PR pathways, show available scholarships, and guide you anywhere across our platform.
                    </p>
                  </div>

                  {/* Suggested Prompts */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-2 px-1">
                      Quick Assistance:
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {quickPrompts.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(item.text)}
                          className="flex items-center gap-2 rounded-xl border border-gray-200/90 bg-white dark:bg-gray-800/90 px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-200 hover:border-[#0B5D66] hover:bg-[#0B5D66]/5 dark:hover:bg-gray-700 transition-all shadow-xs"
                        >
                          <item.icon className="h-3.5 w-3.5 text-[#0B5D66] dark:text-[#C9A96E] shrink-0" />
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
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B5D66]/10 text-[#0B5D66] dark:bg-gray-800 dark:text-[#C9A96E] mt-0.5">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl p-3.5 shadow-xs',
                      m.role === 'user'
                        ? 'bg-[#0B5D66] text-white rounded-br-xs'
                        : 'bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-bl-xs'
                    )}
                  >
                    {m.role === 'user' ? (
                      <p className="text-xs sm:text-sm">{m.content}</p>
                    ) : (
                      <FormattedMessage content={m.content} />
                    )}
                  </div>
                  {m.role === 'user' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B5D66] text-white text-xs mt-0.5">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {streamingMessage && (
                <div className="flex gap-2.5 justify-start">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0B5D66]/10 text-[#0B5D66] dark:bg-gray-800 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 p-3.5 shadow-xs rounded-bl-xs">
                    <FormattedMessage content={streamingMessage} />
                    <span className="inline-block w-1.5 h-3.5 bg-[#0B5D66] animate-pulse ml-1" />
                  </div>
                </div>
              )}

              {loading && !streamingMessage && (
                <div className="flex items-center gap-2 text-xs text-gray-500 pl-9">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0B5D66]" />
                  <span>Consulting immigration database...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-3">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask any visa, scholarship, or site question..."
                  className="flex-1 h-10 text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  disabled={loading}
                />
                <Button
                  onClick={() => handleSend()}
                  size="icon"
                  className="h-10 w-10 bg-[#0B5D66] text-white hover:bg-[#0A4E56] shadow-sm shrink-0"
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