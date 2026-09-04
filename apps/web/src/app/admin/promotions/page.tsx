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
  Tag,
  Calendar,
  Save,
  X,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: '',
    description: '',
    discountPct: '',
    validUntil: '',
    isActive: true,
  });

  const fetchPromotions = async () => {
    try {
      const res = await api.get('/admin/crud/promotion?take=200');
      setPromotions(res.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load promotions:', err);
      toast.error('Failed to load promotions');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const filtered = useMemo(() => {
    return promotions.filter(
      (p) =>
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [promotions, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ code: '', description: '', discountPct: '', validUntil: '', isActive: true });
    setShowForm(true);
  };

  const openEdit = (promo: any) => {
    setEditing(promo);
    setForm({
      code: promo.code,
      description: promo.description || '',
      discountPct: promo.discountPct ?? '',
      validUntil: promo.validUntil ? promo.validUntil.slice(0, 10) : '',
      isActive: promo.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) {
      toast.error('Promo code is required');
      return;
    }
    if (form.discountPct === '' || Number(form.discountPct) < 0 || Number(form.discountPct) > 100) {
      toast.error('Discount percentage must be between 0 and 100');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        description: form.description.trim() || null,
        discountPct: Number(form.discountPct),
        validUntil: form.validUntil ? new Date(form.validUntil).toISOString() : null,
        isActive: form.isActive,
      };
      if (editing) {
        await api.patch(`/admin/crud/promotion/${editing.id}`, payload);
        toast.success('Promotion updated');
      } else {
        await api.post('/admin/crud/promotion', payload);
        toast.success('Promotion created');
      }
      setShowForm(false);
      fetchPromotions();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save promotion';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this promotion?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/crud/promotion/${id}`);
      toast.success('Promotion deleted');
      fetchPromotions();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (promo: any) => {
    try {
      await api.patch(`/admin/crud/promotion/${promo.id}`, { isActive: !promo.isActive });
      toast.success(`Promotion ${promo.isActive ? 'deactivated' : 'activated'}`);
      fetchPromotions();
    } catch {
      toast.error('Toggle failed');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="space-y-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <Tag className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load promotions.</p>
        <Button variant="outline" className="mt-4" onClick={fetchPromotions}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">Promotions / Coupons</h2>
          <p className="mt-2 text-sm text-gray-500">Create and manage discount codes for clients.</p>
        </div>
        <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Promotion
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or description..."
          className="pl-9 bg-white"
        />
      </div>

      {/* Promotions List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Tag className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No promotions found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((promo) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-[#0B5D66]/10 px-3 py-1 font-mono text-sm font-semibold text-[#0B5D66]">
                          {promo.code}
                        </span>
                        <span className={cn(
                          'rounded-full px-3 py-1 text-xs font-medium',
                          promo.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        )}>
                          {promo.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {promo.description || 'No description'}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" /> Discount: {promo.discountPct}%
                        </span>
                        {promo.validUntil && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Expires: {new Date(promo.validUntil).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(promo)}
                        title={promo.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {promo.isActive ? <XCircle className="h-4 w-4 text-red-500" /> : <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(promo)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(promo.id)}
                        disabled={deletingId === promo.id}
                      >
                        {deletingId === promo.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
                      </Button>
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
              {editing ? 'Edit Promotion' : 'Add Promotion'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editing ? 'Update promotion details.' : 'Create a new discount code.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#111827]">Code</label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g., WELCOME10"
                className="mt-1 uppercase"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Description</label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Discount Percentage (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.discountPct}
                onChange={(e) => setForm({ ...form, discountPct: e.target.value })}
                placeholder="10"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Valid Until</label>
              <Input
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="promoActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#0B5D66] focus:ring-[#0B5D66]"
              />
              <label htmlFor="promoActive" className="text-sm font-medium text-[#111827]">Active</label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="text-gray-600">Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {editing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}