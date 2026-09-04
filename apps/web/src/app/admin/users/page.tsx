'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load users.</p>
        <Button variant="outline" className="mt-4" onClick={fetchUsers}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">User Management</h2>
          <p className="mt-2 text-sm text-gray-500">Manage user accounts, roles, and verification status.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email or role..."
              className="pl-9 bg-white sm:w-64"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8FAFA]">
                <th className="p-4 text-sm font-medium text-gray-500">Email</th>
                <th className="p-4 text-sm font-medium text-gray-500">Role</th>
                <th className="p-4 text-sm font-medium text-gray-500">Verified</th>
                <th className="p-4 text-sm font-medium text-gray-500">Joined</th>
                <th className="p-4 text-sm font-medium text-gray-500 text-right">Actions</th>
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
                    className="border-b border-gray-100 last:border-0 hover:bg-[#F8FAFA]"
                  >
                    <td className="p-4 text-sm font-medium text-[#111827]">{user.email}</td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        disabled={updatingId === user.id}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30 disabled:opacity-50"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
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
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
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
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteUser(user.id)}
                          disabled={deletingId === user.id}
                          className="text-red-500 hover:bg-red-50"
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
    </div>
  );
}