'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  User,
  Activity,
  Globe2,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 20;

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const buildWhere = useCallback(() => {
    const conditions: any[] = [];
    if (search.trim()) {
      conditions.push({
        OR: [
          { action: { contains: search.trim(), mode: 'insensitive' } },
          { entity: { contains: search.trim(), mode: 'insensitive' } },
          { entityId: { contains: search.trim(), mode: 'insensitive' } },
          { ipAddress: { contains: search.trim(), mode: 'insensitive' } },
        ],
      });
    }
    if (actionFilter) conditions.push({ action: actionFilter });
    if (entityFilter) conditions.push({ entity: entityFilter });

    if (conditions.length === 1) return conditions[0];
    if (conditions.length > 1) return { AND: conditions };
    return {};
  }, [search, actionFilter, entityFilter]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get('/admin/crud/auditLog', {
        params: {
          skip: page * PAGE_SIZE,
          take: PAGE_SIZE,
          orderBy: JSON.stringify({ createdAt: 'desc' }),
          where: JSON.stringify(buildWhere()),
        },
      });
      const data = res.data;
      setLogs(data);
      setHasMore(data.length === PAGE_SIZE);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      toast.error('Failed to load audit logs');
      setError(true);
      setLoading(false);
    }
  }, [page, buildWhere]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    setPage(0);
  }, [search, actionFilter, entityFilter]);

  const uniqueActions = useMemo(() => {
    const set = new Set(logs.map((log) => log.action).filter(Boolean));
    return Array.from(set);
  }, [logs]);

  const uniqueEntities = useMemo(() => {
    const set = new Set(logs.map((log) => log.entity).filter(Boolean));
    return Array.from(set);
  }, [logs]);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  if (loading && logs.length === 0) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="flex flex-col gap-4 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-3">
          {[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <Activity className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load audit logs. Please try again.</p>
        <Button variant="outline" className="mt-4" onClick={fetchLogs}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-semibold text-[#111827]">Audit Logs</h2>
        <p className="mt-2 text-sm text-gray-500">Track all administrative actions and system events.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, entity, ID, IP..."
            className="pl-9 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
          >
            <option value="">All Actions</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
          >
            <option value="">All Entities</option>
            {uniqueEntities.map((entity) => (
              <option key={entity} value={entity}>{entity}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {logs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <ScrollText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No audit logs found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8FAFA]">
                <th className="p-4 text-sm font-medium text-gray-500">Time</th>
                <th className="p-4 text-sm font-medium text-gray-500">User</th>
                <th className="p-4 text-sm font-medium text-gray-500">Action</th>
                <th className="p-4 text-sm font-medium text-gray-500">Entity</th>
                <th className="p-4 text-sm font-medium text-gray-500">Entity ID</th>
                <th className="p-4 text-sm font-medium text-gray-500">IP Address</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-gray-100 last:border-0 hover:bg-[#F8FAFA]"
                  >
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {log.userId || 'System'}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-[#0B5D66]/10 px-3 py-1 text-xs font-medium text-[#0B5D66]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{log.entity}</td>
                    <td className="p-4 text-sm text-gray-600">{log.entityId || '—'}</td>
                    <td className="p-4 text-sm text-gray-500">{log.ipAddress || '—'}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Page {page + 1}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={page === 0}
            className="text-[#0B5D66]"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!hasMore}
            className="text-[#0B5D66]"
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}