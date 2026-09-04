'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Search,
  ShieldCheck,
  UserCog,
  Users,
  Briefcase,
  CreditCard,
  FileText,
  Globe2,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const roleMeta: Record<string, { description: string; icon: any }> = {
  SUPER_ADMIN: { description: 'Full system access and configuration', icon: ShieldCheck },
  ADMIN: { description: 'Administrative management of all modules', icon: UserCog },
  COMPLIANCE: { description: 'Oversight of regulatory and legal compliance', icon: FileText },
  CONSULTANT: { description: 'Client case management and consultations', icon: Briefcase },
  FINANCE: { description: 'Payment approvals and financial operations', icon: CreditCard },
  SUPPORT: { description: 'Customer support and inquiry handling', icon: Users },
  CONTENT_EDITOR: { description: 'Manage website content and publications', icon: Globe2 },
  DOCUMENT_VERIFIER: { description: 'Verify client documents and credentials', icon: FileText },
  CLIENT: { description: 'Standard client portal access', icon: Activity },
};

export default function AdminRolesPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/crud/user?take=2000');
        setUsers(res.data);
        setLoading(false);
        setError(false);
      } catch (err) {
        console.error('Failed to load users:', err);
        toast.error('Failed to load role data');
        setError(true);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const roleStats = useMemo(() => {
    const countMap = users.reduce((acc: Record<string, number>, user: any) => {
      const role = user.role || 'CLIENT';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(countMap).map(([role, count]) => ({
      role,
      count,
      ...(roleMeta[role] || { description: 'Custom role', icon: Users }),
    }));
  }, [users]);

  const filteredRoles = roleStats.filter((r) =>
    r.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load role data.</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">Role Permissions</h2>
          <p className="mt-2 text-sm text-gray-500">View available roles and their access levels.</p>
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles..."
            className="pl-9 bg-white"
          />
        </div>
      </div>

      {/* Roles Grid */}
      {filteredRoles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No roles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredRoles.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5D66]/10">
                        <Icon className="h-5 w-5 text-[#0B5D66]" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-[#111827]">{item.role.replace(/_/g, ' ')}</h3>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-sm text-gray-600">Users</span>
                      <span className="rounded-full bg-[#C9A96E]/20 px-3 py-1 text-sm font-semibold text-[#111827]">
                        {item.count}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}