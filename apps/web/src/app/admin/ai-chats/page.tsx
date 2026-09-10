'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { SectionHeading } from '@/components/shared/section-heading';
import {
  Bot,
  User,
  Search,
  MessageSquare,
  Clock,
  Sparkles,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Globe2,
  Calendar,
  X,
  RefreshCw,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ChatSession {
  sessionId: string;
  userId: string | null;
  userName: string;
  userEmail: string | null;
  messageCount: number;
  lastQuestion: string;
  lastResponse: string;
  lastActive: string;
}

interface ChatLogMessage {
  id: string;
  sessionId: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  question: string;
  response: string;
  intent: string | null;
  ipAddress: string | null;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

export default function AdminAiChatsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [stats, setStats] = useState<{
    totalMessages: number;
    registeredCount: number;
    guestCount: number;
    todayCount: number;
  }>({ totalMessages: 0, registeredCount: 0, guestCount: 0, todayCount: 0 });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<ChatLogMessage[]>([]);
  const [loadingTranscript, setLoadingTranscript] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const [sessionsRes, statsRes] = await Promise.all([
        api.get(`/ai/admin/sessions?search=${encodeURIComponent(search)}`),
        api.get('/ai/admin/stats'),
      ]);
      setSessions(sessionsRes.data.sessions || []);
      setStats(statsRes.data || { totalMessages: 0, registeredCount: 0, guestCount: 0, todayCount: 0 });
    } catch (err: any) {
      toast.error('Failed to load AI conversation sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [search]);

  const viewSessionHistory = async (sessionId: string) => {
    setSelectedSession(sessionId);
    setLoadingTranscript(true);
    try {
      const res = await api.get(`/ai/admin/sessions/${sessionId}`);
      setSessionMessages(res.data || []);
    } catch {
      toast.error('Failed to load conversation transcript');
    } finally {
      setLoadingTranscript(false);
    }
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this conversation session?')) return;
    try {
      await api.delete(`/ai/admin/sessions/${sessionId}`);
      toast.success('Conversation session deleted');
      if (selectedSession === sessionId) {
        setSelectedSession(null);
      }
      fetchSessions();
    } catch {
      toast.error('Failed to delete session');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-xl bg-[#0B5D66]/10 dark:bg-[#0B5D66]/20 text-[#0B5D66] dark:text-[#C9A96E]">
              <Bot className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
              AI Inquiries & Conversations
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor real-time conversations between guests, registered clients, and the AI immigration assistant.
          </p>
        </div>

        <Button
          onClick={fetchSessions}
          variant="outline"
          className="gap-2 border-slate-300 dark:border-slate-700 self-start md:self-auto"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Inquiries
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-display font-bold text-slate-900 dark:text-white">
            {stats.totalMessages}
          </p>
          <span className="text-xs text-slate-500">Across all website sessions</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Guest Inquiries
            </span>
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
              <Globe2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-display font-bold text-slate-900 dark:text-white">
            {stats.guestCount}
          </p>
          <span className="text-xs text-slate-500">First-time / unregistered visitors</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Client Inquiries
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-display font-bold text-slate-900 dark:text-white">
            {stats.registeredCount}
          </p>
          <span className="text-xs text-slate-500">From logged-in client portals</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today&apos;s Activity
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-display font-bold text-slate-900 dark:text-white">
            {stats.todayCount}
          </p>
          <span className="text-xs text-slate-500">Interactions in last 24h</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user name, email, session ID, or question..."
            className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
          />
        </div>
      </div>

      {/* Main Table / Sessions List */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <RefreshCw className="h-6 w-6 animate-spin mr-2 text-[#0B5D66]" />
            Loading conversation records...
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <Bot className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <p className="font-semibold text-slate-800 dark:text-slate-200">No conversation sessions found</p>
            <p className="text-xs text-slate-400 mt-1">AI interactions from visitors and clients will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-4 px-6">User / Visitor</th>
                  <th className="py-4 px-6">Session ID</th>
                  <th className="py-4 px-6">Messages</th>
                  <th className="py-4 px-6">Latest Question Preview</th>
                  <th className="py-4 px-6">Last Active</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sessions.map((sess) => (
                  <tr
                    key={sess.sessionId}
                    onClick={() => viewSessionHistory(sess.sessionId)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                            sess.userId
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {sess.userId ? <User className="h-4 w-4" /> : <Globe2 className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {sess.userName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {sess.userEmail || (sess.userId ? 'Registered Client' : 'Public Guest')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-500">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {sess.sessionId.length > 18 ? sess.sessionId.substring(0, 18) + '...' : sess.sessionId}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0B5D66]/10 text-[#0B5D66] dark:text-[#C9A96E]">
                        {sess.messageCount} {sess.messageCount === 1 ? 'msg' : 'msgs'}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="truncate text-xs text-slate-700 dark:text-slate-300">
                        {sess.lastQuestion}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(sess.lastActive).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewSessionHistory(sess.sessionId);
                          }}
                          className="h-8 px-2.5 text-slate-700 dark:text-slate-300 hover:bg-[#0B5D66]/10 hover:text-[#0B5D66]"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => deleteSession(sess.sessionId, e)}
                          className="h-8 px-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Transcript Drawer / Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative flex h-[700px] max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B5D66] text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white">
                    Conversation Transcript
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Session: {selectedSession}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSession(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content - Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/40">
              {loadingTranscript ? (
                <div className="flex items-center justify-center py-20 text-slate-400">
                  <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                  Loading transcript...
                </div>
              ) : sessionMessages.length === 0 ? (
                <div className="py-20 text-center text-slate-400">
                  No messages recorded in this session.
                </div>
              ) : (
                sessionMessages.map((item) => (
                  <div key={item.id} className="space-y-3">
                    {/* User Message */}
                    <div className="flex justify-end gap-3">
                      <div className="max-w-[80%] rounded-2xl bg-[#0B5D66] p-4 text-white shadow-xs">
                        <div className="flex items-center justify-between gap-4 mb-1 text-[11px] text-white/70">
                          <span className="font-semibold">{item.userName || 'User'}</span>
                          <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-sm leading-relaxed">{item.question}</p>
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B5D66] text-white text-xs mt-1">
                        <User className="h-4 w-4" />
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex justify-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-[#0B5D66] dark:text-[#C9A96E] text-xs mt-1">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="max-w-[85%] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-slate-800 dark:text-slate-100 shadow-xs">
                        <div className="flex items-center justify-between gap-4 mb-2 text-[11px] text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-1">
                          <span className="font-semibold text-[#0B5D66] dark:text-[#C9A96E]">
                            AI Immigration Advisor {item.intent && `• Intent: ${item.intent}`}
                          </span>
                          <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                          {item.response}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <div className="text-xs text-slate-500">
                Total Interactions: {sessionMessages.length}
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedSession(null)}
                className="border-slate-300 dark:border-slate-700"
              >
                Close Transcript
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

