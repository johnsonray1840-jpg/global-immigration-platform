'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { useSocket } from '@/components/providers/socket-provider';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { Send, User } from 'lucide-react';

export default function ConsultantMessagesPage() {
  const [chatList, setChatList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const socket = useSocket();

  useEffect(() => {
    api.get('/messages/chat-list').then((res) => setChatList(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedUser) {
      api.get(`/messages/conversation/${selectedUser.id}`).then((res) => setMessages(res.data)).catch(() => {});
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

  const send = async () => {
    if (!input.trim() || !selectedUser) return;
    try {
      await api.post('/messages', { receiverId: selectedUser.id, content: input });
      setInput('');
    } catch (error) {}
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Chat list */}
      <div className="w-64 flex-shrink-0 space-y-4 overflow-y-auto">
        <h3 className="font-serif text-xl font-semibold text-charcoal dark:text-white">Conversations</h3>
        {chatList.length === 0 ? (
          <p className="text-sm text-ash-dark">No conversations yet.</p>
        ) : (
          chatList.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full rounded-lg p-3 text-left transition-colors ${
                selectedUser?.id === user.id
                  ? 'bg-charcoal text-white'
                  : 'bg-white hover:bg-ash-light dark:bg-charcoal dark:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        {selectedUser ? (
          <>
            <div className="mb-4 border-b border-silver pb-2">
              <h3 className="font-serif text-xl font-semibold text-charcoal dark:text-white">
                {selectedUser.email}
              </h3>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === selectedUser.id ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${
                      msg.senderId === selectedUser.id
                        ? 'bg-ash-light text-charcoal dark:bg-ash-dark dark:text-white'
                        : 'bg-charcoal text-white'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Type a message..."
                className="flex-1 rounded-md border border-silver px-4 py-2 text-sm dark:bg-charcoal dark:text-white"
              />
              <Button onClick={send} className="bg-charcoal text-white dark:bg-white dark:text-charcoal">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-ash-dark">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
