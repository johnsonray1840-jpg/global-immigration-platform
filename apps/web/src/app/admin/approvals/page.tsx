'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-green-100 text-green-700 border-green-200',
  DECLINED: 'bg-red-100 text-red-700 border-red-200',
  EXPIRED: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function AdminApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchApprovals = async () => {
    try {
      const res = await api.get('/admin/approvals');
      setApprovals(res.data);
      setLoading(false);
    } catch {
      toast.error('Failed to load approvals');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const review = async (id: string, status: 'CONFIRMED' | 'DECLINED') => {
    const action = status === 'CONFIRMED' ? 'approve' : 'decline';
    if (!confirm(`Are you sure you want to ${action} this payment?`)) return;

    setProcessingId(id);
    try {
      await api.patch(`/admin/approvals/${id}/review`, { status });
      toast.success(`Payment ${status.toLowerCase()}`);
      fetchApprovals();
    } catch {
      toast.error('Action failed');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = approvals.filter(a => a.status === 'PENDING').length;
  const confirmedCount = approvals.filter(a => a.status === 'CONFIRMED').length;
  const declinedCount = approvals.filter(a => a.status === 'DECLINED').length;

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <div className="space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-semibold text-[#111827]">Payment Approvals</h2>
        <p className="mt-2 text-sm text-gray-500">Review and manage pending payment requests.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
          { label: 'Confirmed', value: confirmedCount, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Declined', value: declinedCount, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
        ].map((stat, idx) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }}>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', stat.bg)}>
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="font-display text-2xl font-semibold text-[#111827]">{stat.value}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        <AnimatePresence>
          {approvals.map((a) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-[#111827]">Invoice: {a.invoiceId}</p>
                      <Badge className={cn('border', statusStyles[a.status] || 'bg-gray-100 text-gray-700 border-gray-200')}>
                        {a.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">User: {a.invoice?.user?.email || 'N/A'}</p>
                    <p className="text-sm text-gray-500">
                      Amount: ${a.invoice?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                    </p>
                    <p className="text-xs text-gray-400">
                      Requested: {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {a.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => review(a.id, 'CONFIRMED')}
                        disabled={processingId === a.id}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        {processingId === a.id ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                        )}
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => review(a.id, 'DECLINED')}
                        disabled={processingId === a.id}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        {processingId === a.id ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-1 h-4 w-4" />
                        )}
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {approvals.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">No payment approvals found.</p>
          </div>
        )}
      </div>
    </div>
  );
}