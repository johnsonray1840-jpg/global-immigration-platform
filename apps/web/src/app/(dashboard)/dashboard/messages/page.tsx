'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { useSocket } from '@/components/providers/socket-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Send,
  User,
  Paperclip,
  ArrowLeft,
  MessageCircle,
  Search,
  X,
  Shield,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [chatList, setChatList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  useEffect(() => {
    api.get('/messages/chat-list')
      .then((res) => {
        setChatList(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      api.get(`/messages/conversation/${selectedUser.id}`)
        .then((res) => setMessages(res.data))
        .catch(() => {});
    }
  }, [selectedUser]);

  useEffect(() => {
    if (socket) {
      socket.on('new-message', (msg) => {
        if (selectedUser && (msg.senderId === selectedUser.id || msg.receiverId === selectedUser.id)) {
          setMessages((prev) => [...prev, msg]);
        }
      });
      return () => {
        socket.off('new-message');
      };
    }
  }, [socket, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredChatList = useMemo(() => {
    return chatList.filter((user) =>
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.profile?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      user.profile?.lastName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [chatList, search]);

  const send = async () => {
    if (!input.trim() || !selectedUser) return;
    try {
      await api.post('/messages', { receiverId: selectedUser.id, content: input });
      setInput('');
    } catch (error) {}
  };

  const selectUser = (user: any) => {
    setSelectedUser(user);
    setMobileView('chat');
  };

  const goBack = () => {
    setSelectedUser(null);
    setMobileView('list');
  };

  const groupMessagesByDate = () => {
    const groups: Record<string, any[]> = {};
    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' });
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return Object.entries(groups);
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-6">
      {/* Chat list */}
      <div
        className={cn(
          'w-full flex-shrink-0 space-y-4 overflow-y-auto md:w-80 rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-4 backdrop-blur-xl shadow-xl flex flex-col',
          mobileView === 'list' ? 'flex' : 'hidden md:flex'
        )}
      >
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-sky-400" /> Secure Legal Wire
            </h3>
            <p className="text-[11px] text-slate-400">Direct encrypted counsel communication</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search counsel or clients..."
            className="pl-9 bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl text-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl bg-slate-800" />
            ))}
          </div>
        ) : filteredChatList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-sky-500/20 bg-sky-500/[0.02] p-8 text-center my-auto">
            <User className="mx-auto h-8 w-8 text-slate-500" />
            <p className="mt-2 text-xs font-medium text-slate-400">
              {search ? 'No matching contacts' : 'No active legal channels'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            <AnimatePresence>
              {filteredChatList.map((user) => {
                const isSelected = selectedUser?.id === user.id;
                const displayName = user.profile?.firstName
                  ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim()
                  : user.email;

                return (
                  <motion.button
                    key={user.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => selectUser(user)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all',
                      isSelected
                        ? 'bg-gradient-to-r from-sky-500/20 to-sky-400/10 border border-sky-500/50 shadow-md shadow-sky-500/10'
                        : 'border border-transparent bg-[#030D1A]/50 hover:bg-[#071E38] hover:border-sky-500/20 text-slate-300'
                    )}
                  >
                    <div className="relative">
                      <div className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
                        isSelected
                          ? 'border-sky-400/50 bg-sky-500/20 text-sky-300'
                          : 'border-sky-500/20 bg-[#0A1F38] text-sky-400'
                      )}>
                        <User className="h-5 w-5" />
                      </div>
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0A1F38]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className={cn('block truncate text-sm font-semibold', isSelected ? 'text-white' : 'text-slate-200')}>
                        {displayName}
                      </span>
                      {user.lastMessage ? (
                        <span className="block truncate text-xs text-slate-400 mt-0.5">
                          {user.lastMessage}
                        </span>
                      ) : (
                        <span className="block truncate text-xs text-slate-500 mt-0.5">
                          Assigned Legal Counsel
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div
        className={cn(
          'flex flex-1 flex-col rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 backdrop-blur-xl shadow-xl overflow-hidden',
          mobileView === 'chat' ? 'flex' : 'hidden md:flex'
        )}
      >
        {selectedUser ? (
          <div className="flex flex-1 flex-col h-full p-4 md:p-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-sky-500/10 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={goBack}
                  className="rounded-xl p-2 hover:bg-white/5 md:hidden text-slate-400 hover:text-white"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base md:text-lg font-bold text-white flex items-center gap-2">
                    {selectedUser.profile?.firstName
                      ? `${selectedUser.profile.firstName} ${selectedUser.profile.lastName || ''}`.trim()
                      : selectedUser.email}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active Case Counsel</span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1 text-sky-400">
                      <Lock className="h-3 w-3" /> End-to-end Encrypted
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-400 mb-3">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-white">Direct Channel Established</p>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    Send a message to your assigned senior immigration attorney or case manager.
                  </p>
                </div>
              ) : (
                groupMessagesByDate().map(([date, msgs]) => (
                  <div key={date} className="space-y-3">
                    <div className="text-center my-3">
                      <span className="rounded-full border border-sky-500/20 bg-[#030D1A]/80 px-3 py-1 text-[11px] font-medium text-slate-400">
                        {date}
                      </span>
                    </div>
                    {msgs.map((msg) => {
                      const isMe = msg.senderId !== selectedUser.id;
                      return (
                        <div
                          key={msg.id}
                          className={cn('flex', isMe ? 'justify-end' : 'justify-start')}
                        >
                          <div
                            className={cn(
                              'max-w-[80%] md:max-w-[70%] rounded-2xl p-4 text-sm shadow-md transition-all',
                              isMe
                                ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-br-none border border-sky-400/30'
                                : 'bg-[#030D1A]/90 text-slate-200 rounded-bl-none border border-sky-500/20'
                            )}
                          >
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            <div className={cn(
                              'mt-2 flex items-center justify-end gap-1 text-[10px]',
                              isMe ? 'text-sky-200' : 'text-slate-400'
                            )}>
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Toolbar */}
            <div className="mt-4 flex items-center gap-2 border-t border-sky-500/10 pt-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Type your confidential message to counsel..."
                className="flex-1 bg-[#030D1A] border-sky-500/30 text-white placeholder:text-slate-500 rounded-xl text-xs py-5"
              />
              <Button
                onClick={send}
                disabled={!input.trim()}
                className="bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold hover:from-sky-400 hover:to-sky-500 border border-sky-400/30 rounded-xl px-5 shadow-lg shadow-sky-500/20"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-400 mb-4 shadow-lg shadow-sky-500/10">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">Private Counsel Dispatch</h3>
            <p className="mt-2 text-xs md:text-sm text-slate-400 max-w-sm">
              Select an attorney or dossier specialist from the left panel to begin your encrypted consultation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}