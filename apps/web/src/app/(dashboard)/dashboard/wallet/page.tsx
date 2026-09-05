'use client';

import { useState, useEffect, useCallback } from 'react';
import PaymentModal from '@/components/payments/PaymentModal';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSocket } from '@/components/providers/socket-provider';
import {
  Wallet,
  Plus,
  ArrowDownUp,
  Loader2,
  Copy,
  CheckCircle2,
  Clock,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  FAILED: 'bg-red-100 text-red-700 border-red-200',
  EXPIRED: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function WalletPage() {
  const socket = useSocket();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showDeposit, setShowDeposit] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [modalAmount, setModalAmount] = useState(0);
  const [depositAmount, setDepositAmount] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [depositing, setDepositing] = useState(false);
  const [copiedWalletId, setCopiedWalletId] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'DEPOSIT'>('ALL');

  const fetchWalletData = useCallback(() => {
    api.get('/wallet')
      .then((res) => setWallet(res.data))
      .catch(() => toast.error('Failed to load wallet'));

    api.get('/wallet/transactions')
      .then((res) => setTransactions(res.data))
      .catch(() => toast.error('Failed to load transactions'));
  }, []);

  useEffect(() => {
    fetchWalletData();
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [fetchWalletData]);

  useEffect(() => {
    if (socket) {
      socket.on('payment-updated', () => {
        fetchWalletData();
      });
      return () => {
        socket.off('payment-updated');
      };
    }
  }, [socket, fetchWalletData]);

  const handleOpenDeposit = async () => {
    const amount = Number(depositAmount);
    if (!depositAmount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid deposit amount');
      return;
    }

    setDepositing(true);
    try {
      const res = await api.post('/wallet/deposit', { amount,  paymentMethodType: 'CRYPTO', });
      setInvoiceId(res.data.invoice.id);
      setModalAmount(amount);
      setDepositAmount('');
      setShowDeposit(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate deposit');
    } finally {
      setDepositing(false);
    }
  };

  const handleCloseModal = () => {
    setShowDeposit(false);
    fetchWalletData();
  };

  const copyWalletId = () => {
    if (wallet?.id) {
      navigator.clipboard.writeText(wallet.id);
      setCopiedWalletId(true);
      setTimeout(() => setCopiedWalletId(false), 2000);
    }
  };

  const filteredTransactions = filter === 'DEPOSIT'
    ? transactions.filter((tx) => tx.type === 'DEPOSIT')
    : transactions;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-[#111827]">My Wallet</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your deposits and track payment history.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            type="number"
            min="1"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Amount (USD)"
            className="w-full sm:w-36 bg-white"
          />
          <Button
            onClick={handleOpenDeposit}
            disabled={depositing}
            className="w-full sm:w-auto bg-[#0B5D66] text-white hover:bg-[#0A4E56]"
          >
            {depositing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Initiating...</>
            ) : (
              <><Plus className="mr-2 h-4 w-4" /> Deposit</>
            )}
          </Button>
        </div>
      </div>

      {/* Balance Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#C9A96E]/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="mt-2 font-display text-3xl md:text-5xl font-semibold text-[#111827] break-all">
                ${wallet?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </p>
              <p className="mt-2 text-sm text-gray-500">Currency: {wallet?.currency || 'USD'}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs text-gray-500">Wallet ID</p>
              <div className="mt-1 flex items-center gap-2">
                <code className="rounded-md bg-[#E8EEEE] px-3 py-1 text-xs text-[#111827] break-all">
                  {wallet?.id ? `${wallet.id.slice(0, 8)}...${wallet.id.slice(-4)}` : '—'}
                </code>
                <Button variant="ghost" size="icon" onClick={copyWalletId} aria-label="Copy wallet ID">
                  {copiedWalletId ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            icon: ArrowDown,
            label: 'Total Deposits',
            value: `$${transactions.filter((t) => t.type === 'DEPOSIT' && t.status === 'COMPLETED').reduce((sum, t) => sum + (t.amount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            iconColor: 'text-[#0B5D66]',
            iconBg: 'bg-[#0B5D66]/10',
          },
          {
            icon: Clock,
            label: 'Pending Deposits',
            value: transactions.filter((t) => t.status === 'PENDING').length,
            iconColor: 'text-[#C9A96E]',
            iconBg: 'bg-[#C9A96E]/20',
          },
          {
            icon: ArrowDownUp,
            label: 'Transactions',
            value: transactions.length,
            iconColor: 'text-[#0B5D66]',
            iconBg: 'bg-[#0B5D66]/10',
          },
        ].map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', stat.iconBg)}>
                  <stat.icon className={cn('h-5 w-5', stat.iconColor)} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="font-display text-xl md:text-2xl font-semibold text-[#111827]">{stat.value}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Deposit History */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl md:text-2xl font-semibold text-[#111827]">Deposit History</h3>
          <div className="flex gap-2">
            {['ALL', 'DEPOSIT'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={cn(
                  'rounded-full px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium transition-colors',
                  filter === tab
                    ? 'bg-[#0B5D66] text-white'
                    : 'bg-[#E8EEEE] text-gray-600 hover:bg-[#C9A96E]/20'
                )}
              >
                {tab === 'ALL' ? 'All' : 'Deposits'}
              </button>
            ))}
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-10 text-center">
            <Wallet className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">No transactions found.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filteredTransactions.map((tx) => (
              <motion.div key={tx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 md:p-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5D66]/10">
                      {tx.type === 'DEPOSIT' ? <ArrowDown className="h-5 w-5 text-[#0B5D66]" /> : <ArrowUp className="h-5 w-5 text-[#0B5D66]" />}
                    </div>
                    <div>
                      <p className="font-medium text-[#111827]">
                        {tx.type} - ${tx.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                      {tx.reference && <p className="mt-1 text-xs text-gray-500">Ref: {tx.reference}</p>}
                    </div>
                  </div>
                  <Badge className={cn('border', statusColors[tx.status] || 'bg-gray-100 text-gray-700 border-gray-200')}>
                    {tx.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Payment Modal */}
      {showDeposit && (
        <PaymentModal
          open={showDeposit}
          onClose={handleCloseModal}
          invoiceId={invoiceId}
          amount={modalAmount}
        />
      )}
    </div>
  );
}