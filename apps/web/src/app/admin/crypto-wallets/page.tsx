'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Copy,
  CheckCircle2,
  XCircle,
  Coins,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const supportedCurrencies = ['BTC', 'USDT', 'ETH', 'XRP', 'LTC', 'XLM', 'BNB', 'DOGE'];

export default function AdminCryptoWalletsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [showAddress, setShowAddress] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    currency: 'BTC',
    address: '',
    isActive: true,
  });

  const fetchWallets = async () => {
    try {
      const res = await api.get('/admin/crud/cryptoWallet?take=200');
      setWallets(res.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load crypto wallets:', err);
      toast.error('Failed to load crypto wallets');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const filtered = useMemo(() => {
    return wallets.filter(
      (w) =>
        w.currency.toLowerCase().includes(search.toLowerCase()) ||
        w.address.toLowerCase().includes(search.toLowerCase())
    );
  }, [wallets, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ currency: 'BTC', address: '', isActive: true });
    setShowForm(true);
  };

  const openEdit = (wallet: any) => {
    setEditing(wallet);
    setForm({
      currency: wallet.currency,
      address: wallet.address,
      isActive: wallet.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.address.trim()) {
      toast.error('Wallet address is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        currency: form.currency,
        address: form.address.trim(),
        isActive: form.isActive,
      };
      if (editing) {
        await api.patch(`/admin/crud/cryptoWallet/${editing.id}`, payload);
        toast.success('Wallet updated');
      } else {
        await api.post('/admin/crud/cryptoWallet', payload);
        toast.success('Wallet created');
      }
      setShowForm(false);
      fetchWallets();
    } catch (err) {
      toast.error('Failed to save wallet');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this wallet?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/crud/cryptoWallet/${id}`);
      toast.success('Wallet deleted');
      fetchWallets();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (wallet: any) => {
    try {
      await api.patch(`/admin/crud/cryptoWallet/${wallet.id}`, {
        isActive: !wallet.isActive,
      });
      toast.success(`Wallet ${wallet.isActive ? 'deactivated' : 'activated'}`);
      fetchWallets();
    } catch {
      toast.error('Toggle failed');
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <Coins className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load crypto wallets.</p>
        <Button variant="outline" className="mt-4" onClick={fetchWallets}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">Crypto Wallet Management</h2>
          <p className="mt-2 text-sm text-gray-500">Manage wallet addresses for cryptocurrency payments.</p>
        </div>
        <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Wallet
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by currency or address..."
          className="pl-9 bg-white"
        />
      </div>

      {/* Wallets Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Coins className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No crypto wallets found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((wallet) => (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full',
                        wallet.isActive ? 'bg-[#0B5D66]/10' : 'bg-gray-100'
                      )}>
                        <Coins className={cn('h-5 w-5', wallet.isActive ? 'text-[#0B5D66]' : 'text-gray-400')} />
                      </div>
                      <div>
                        <p className="font-display text-lg font-semibold text-[#111827]">{wallet.currency}</p>
                        <p className="text-xs text-gray-500">{wallet.isActive ? 'Active' : 'Inactive'}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleToggleActive(wallet)} title={wallet.isActive ? 'Deactivate' : 'Activate'}>
                        {wallet.isActive ? <XCircle className="h-4 w-4 text-red-500" /> : <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(wallet)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(wallet.id)}
                        disabled={deletingId === wallet.id}
                      >
                        {deletingId === wallet.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-lg bg-[#F8FAFA] p-3">
                    <code className="flex-1 truncate text-sm text-[#111827]">
                      {showAddress[wallet.id] ? wallet.address : '••••••••••••••••••••'}
                    </code>
                    <div className="flex gap-1">
                      <button onClick={() => setShowAddress(prev => ({ ...prev, [wallet.id]: !prev[wallet.id] }))} className="p-1 text-gray-400 hover:text-[#0B5D66]">
                        {showAddress[wallet.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button onClick={() => copyAddress(wallet.address)} className="p-1 text-gray-400 hover:text-[#0B5D66]">
                        {copiedAddress === wallet.address ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold text-[#111827]">
              {editing ? 'Edit Wallet' : 'Add Wallet'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editing ? 'Update wallet address and status.' : 'Add a new cryptocurrency wallet address.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#111827]">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
              >
                {supportedCurrencies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Wallet Address</label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Enter wallet address"
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#0B5D66] focus:ring-[#0B5D66]"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-[#111827]">Active</label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="text-gray-600">Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}