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
  Plus,
  Pencil,
  Trash2,
  Landmark,
  UserPlus,
  Save,
  X,
  Loader2,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminWireAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [editingAccount, setEditingAccount] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [assigningUser, setAssigningUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    countryId: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    swiftCode: '',
    routingNumber: '',
    iban: '',
    address: '',
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accountsRes, countriesRes, usersRes] = await Promise.all([
        api.get('/admin/wire-accounts'),
        api.get('/countries'),
        api.get('/admin/crud/user?take=200'),
      ]);
      setAccounts(accountsRes.data);
      setCountries(countriesRes.data);
      setUsers(usersRes.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load wire accounts:', err);
      toast.error('Failed to load wire accounts');
      setError(true);
      setLoading(false);
    }
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter(
      (acc) =>
        acc.bankName.toLowerCase().includes(search.toLowerCase()) ||
        acc.accountName.toLowerCase().includes(search.toLowerCase()) ||
        acc.accountNumber.toLowerCase().includes(search.toLowerCase()) ||
        (acc.country?.name || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [accounts, search]);

  const openCreate = () => {
    setEditingAccount(null);
    resetForm();
    setShowForm(true);
  };

  const openEdit = (account: any) => {
    setEditingAccount(account);
    setForm({
      countryId: account.countryId,
      bankName: account.bankName,
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      swiftCode: account.swiftCode,
      routingNumber: account.routingNumber || '',
      iban: account.iban || '',
      address: account.address || '',
      isActive: account.isActive,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      countryId: '',
      bankName: '',
      accountName: '',
      accountNumber: '',
      swiftCode: '',
      routingNumber: '',
      iban: '',
      address: '',
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.countryId || !form.bankName.trim() || !form.accountName.trim() || !form.accountNumber.trim() || !form.swiftCode.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      if (editingAccount) {
        await api.put(`/admin/wire-accounts/${editingAccount.id}`, form);
        toast.success('Wire account updated');
      } else {
        await api.post('/admin/wire-accounts', form);
        toast.success('Wire account created');
      }
      setShowForm(false);
      setEditingAccount(null);
      resetForm();
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Operation failed';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this wire account?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/wire-accounts/${id}`);
      toast.success('Wire account deleted');
      fetchData();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAssignUser = async (accountId: string, userId: string) => {
    if (!userId) return;
    try {
      await api.post('/admin/wire-accounts/assign-user', { userId, wireAccountId: accountId });
      toast.success('Wire account assigned to user');
      setAssigningUser(null);
    } catch {
      toast.error('Assignment failed');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-56 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <Landmark className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load wire accounts.</p>
        <Button variant="outline" className="mt-4" onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">Wire Transfer Accounts</h2>
          <p className="mt-2 text-sm text-gray-500">Manage bank accounts per country and assign specific accounts to users.</p>
        </div>
        <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Account
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by bank, account, or country..."
          className="pl-9 bg-white"
        />
      </div>

      {/* Accounts Grid */}
      {filteredAccounts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Landmark className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No wire accounts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AnimatePresence>
            {filteredAccounts.map((account) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5D66]/10">
                        <Landmark className="h-5 w-5 text-[#0B5D66]" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-semibold text-[#111827]">{account.bankName}</h3>
                        <p className="text-sm text-gray-500">
                          {account.country?.name} • {account.accountNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(account)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(account.id)}
                        disabled={deletingId === account.id}
                      >
                        {deletingId === account.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Account Name:</span> {account.accountName}</p>
                    <p><span className="font-medium">SWIFT:</span> {account.swiftCode}</p>
                    {account.routingNumber && <p><span className="font-medium">Routing:</span> {account.routingNumber}</p>}
                    {account.iban && <p><span className="font-medium">IBAN:</span> {account.iban}</p>}
                    {account.address && <p><span className="font-medium">Address:</span> {account.address}</p>}
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => setAssigningUser(assigningUser === account.id ? null : account.id)}
                      className="flex items-center text-sm font-medium text-[#0B5D66] hover:text-[#0A4E56]"
                    >
                      <UserPlus className="mr-1 h-4 w-4" /> Assign to User
                    </button>
                    {assigningUser === account.id && (
                      <div className="mt-2 flex gap-2">
                        <select
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
                          onChange={(e) => handleAssignUser(account.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Select user</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.id}>{u.email}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold text-[#111827]">
              {editingAccount ? 'Edit Account' : 'Add Account'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editingAccount ? 'Update wire account details.' : 'Create a new wire transfer account.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#111827]">Country</label>
              <select
                value={form.countryId}
                onChange={(e) => setForm({ ...form, countryId: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
                required
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#111827]">Bank Name</label>
                <Input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">Account Name</label>
                <Input value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#111827]">Account Number</label>
                <Input value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">SWIFT Code</label>
                <Input value={form.swiftCode} onChange={(e) => setForm({ ...form, swiftCode: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#111827]">Routing Number (optional)</label>
                <Input value={form.routingNumber} onChange={(e) => setForm({ ...form, routingNumber: e.target.value })} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">IBAN (optional)</label>
                <Input value={form.iban} onChange={(e) => setForm({ ...form, iban: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Bank Address (optional)</label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="wireActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#0B5D66] focus:ring-[#0B5D66]"
              />
              <label htmlFor="wireActive" className="text-sm font-medium text-[#111827]">Active</label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="text-gray-600">Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {editingAccount ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}