'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Search,
  Trash2,
  UserCheck,
  UserX,
  Users,
  ShieldCheck,
  Loader2,
  Mail,
  Send,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const roles = [
  'SUPER_ADMIN',
  'ADMIN',
  'COMPLIANCE',
  'CONSULTANT',
  'FINANCE',
  'SUPPORT',
  'CONTENT_EDITOR',
  'DOCUMENT_VERIFIER',
  'CLIENT',
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Quick email modal state
  const [emailModalUser, setEmailModalUser] = useState<any | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailBadge, setEmailBadge] = useState('Official Notice');
  const [sendingEmail, setSendingEmail] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/crud/user?take=1000');
      setUsers(res.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load users:', err);
      toast.error('Failed to load users');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !roleFilter || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const updateRole = async (userId: string, role: string) => {
    setUpdatingId(userId);
    try {
      await api.patch(`/admin/crud/user/${userId}`, { role });
      toast.success('User role updated');
      fetchUsers();
    } catch {
      toast.error('Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleEmailVerified = async (userId: string, current: boolean) => {
    setUpdatingId(userId);
    try {
      await api.patch(`/admin/crud/user/${userId}`, { isEmailVerified: !current });
      toast.success('Verification updated');
      fetchUsers();
    } catch {
      toast.error('Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Delete this user?')) return;
    setDeletingId(userId);
    try {
      await api.delete(`/admin/crud/user/${userId}`);
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const openEmailModal = (user: any) => {
    setEmailModalUser(user);
    setEmailSubject('Update Regarding Your Global Citizen Solutions Portfolio');
    setEmailMessage(`Dear Client,\n\nWe are writing to update you on your active file with Global Citizen Solutions. Please review your dashboard for details.\n\nBest regards,\nGlobal Citizen Solutions Team`);
    setEmailBadge('Official Notice');
  };

  const sendQuickEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalUser || !emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    setSendingEmail(true);
    try {
      const res = await api.post('/admin/emails/send', {
        recipientEmail: emailModalUser.email,
        subject: emailSubject.trim(),
        message: emailMessage.trim(),
        badge: emailBadge.trim(),
        ctaText: 'Access Client Portal',
        ctaLink: 'https://www.gcsworldwide.org/dashboard',
      });
      toast.success(res.data?.message || `Email successfully dispatched to ${emailModalUser.email}`);
      setEmailModalUser(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to dispatch email');
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Failed to load users.</p>
        <Button variant="outline" className="mt-4" onClick={fetchUsers}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-foreground">User Management</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage user accounts, roles, verification status, and dispatch official communications.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email or role..."
              className="pl-9 bg-card sm:w-64 border-border"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="p-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Role</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Verified</th>
                <th className="p-4 text-sm font-medium text-muted-foreground">Joined</th>
                <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="p-4 text-sm font-medium text-foreground">{user.email}</td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        disabled={updatingId === user.id}
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleEmailVerified(user.id, user.isEmailVerified)}
                        disabled={updatingId === user.id}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                          user.isEmailVerified
                            ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300',
                          updatingId === user.id && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {updatingId === user.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : user.isEmailVerified ? (
                          <UserCheck className="h-3 w-3" />
                        ) : (
                          <UserX className="h-3 w-3" />
                        )}
                        {user.isEmailVerified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Direct Email Action Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEmailModal(user)}
                          className="text-primary hover:bg-primary/10 flex items-center gap-1 text-xs"
                          title="Send custom email to this user"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Send Email</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteUser(user.id)}
                          disabled={deletingId === user.id}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          {deletingId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Email Modal */}
      {emailModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Mail className="h-5 w-5 text-primary" />
                <span>Send Official Email to {emailModalUser.email}</span>
              </div>
              <button
                onClick={() => setEmailModalUser(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={sendQuickEmail} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Recipient
                </label>
                <Input
                  value={emailModalUser.email}
                  disabled
                  className="bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Category Badge
                </label>
                <Input
                  value={emailBadge}
                  onChange={(e) => setEmailBadge(e.target.value)}
                  placeholder="e.g. Official Notice, Document Request"
                  className="bg-background"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Subject Line <span className="text-red-500">*</span>
                </label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject"
                  required
                  className="bg-background"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Message Body <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={6}
                  placeholder="Enter custom message to client..."
                  required
                  className="bg-background text-sm leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEmailModalUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={sendingEmail}
                  className="bg-primary text-white gap-1.5"
                >
                  {sendingEmail ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Dispatch Email
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}