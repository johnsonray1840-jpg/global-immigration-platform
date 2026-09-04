'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { useSocket } from '@/components/providers/socket-provider';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { Input } from '@/components/ui/input';
import {
  Send,
  User,
  Paperclip,
  ArrowLeft,
  MessageCircle,
  Search,
  X,
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
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Chat list */}
      <div
        className={cn(
          'w-full flex-shrink-0 space-y-4 overflow-y-auto md:w-72',
          mobileView === 'list' ? 'block' : 'hidden md:block'
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-foreground">
            Conversations
          </h3>
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : filteredChatList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <User className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              {search ? 'No matching conversations' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filteredChatList.map((user) => (
                <motion.button
                  key={user.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => selectUser(user)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors',
                    selectedUser?.id === user.id
                      ? 'bg-primary text-white'
                      : 'bg-card text-foreground hover:bg-muted'
                  )}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User className={cn('h-4 w-4', selectedUser?.id === user.id ? 'text-white' : 'text-primary')} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {user.profile?.firstName || user.email}
                    </span>
                    {user.lastMessage && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {user.lastMessage}
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Chat area */}
      <div
        className={cn(
          'flex flex-1 flex-col',
          mobileView === 'chat' ? 'block' : 'hidden md:flex'
        )}
      >
        {selectedUser ? (
          <>
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
              <button
                onClick={goBack}
                className="rounded-md p-1 hover:bg-muted md:hidden"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                {selectedUser.profile?.firstName || selectedUser.email}
              </h3>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No messages yet. Say hello!
                </div>
              ) : (
                groupMessagesByDate().map(([date, msgs]) => (
                  <div key={date}>
                    <div className="mb-2 text-center">
                      <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                        {date}
                      </span>
                    </div>
                    {msgs.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex',
                          msg.senderId === selectedUser.id ? 'justify-start' : 'justify-end'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[75%] rounded-lg px-4 py-2 text-sm shadow-sm',
                            msg.senderId === selectedUser.id
                              ? 'bg-muted text-foreground'
                              : 'bg-primary text-primary-foreground'
                          )}
                        >
                          <p>{msg.content}</p>
                          <p className={cn(
                            'mt-1 text-xs',
                            msg.senderId === selectedUser.id ? 'text-muted-foreground' : 'text-primary-foreground/70'
                          )}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                className="rounded-md border border-border px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Attach file"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button onClick={send} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}