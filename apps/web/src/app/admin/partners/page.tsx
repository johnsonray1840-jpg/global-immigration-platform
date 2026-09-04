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
  Handshake,
  ExternalLink,
  Globe,
  Save,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    name: '',
    logoUrl: '',
    website: '',
  });

  const fetchPartners = async () => {
    try {
      const res = await api.get('/admin/crud/partner?take=200');
      setPartners(res.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load partners:', err);
      toast.error('Failed to load partners');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const filtered = useMemo(() => {
    return partners.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.website || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [partners, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', logoUrl: '', website: '' });
    setShowForm(true);
  };

  const openEdit = (partner: any) => {
    setEditing(partner);
    setForm({
      name: partner.name,
      logoUrl: partner.logoUrl || '',
      website: partner.website || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Partner name is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        logoUrl: form.logoUrl.trim() || null,
        website: form.website.trim() || null,
      };
      if (editing) {
        await api.patch(`/admin/crud/partner/${editing.id}`, payload);
        toast.success('Partner updated');
      } else {
        await api.post('/admin/crud/partner', payload);
        toast.success('Partner created');
      }
      setShowForm(false);
      fetchPartners();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save partner';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this partner?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/crud/partner/${id}`);
      toast.success('Partner deleted');
      fetchPartners();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogoError = (id: string) => {
    setLogoErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <Handshake className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load partners.</p>
        <Button variant="outline" className="mt-4" onClick={fetchPartners}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">Partner Management</h2>
          <p className="mt-2 text-sm text-gray-500">Manage trusted partners and their logos.</p>
        </div>
        <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Partner
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or website..."
          className="pl-9 bg-white"
        />
      </div>

      {/* Partners Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Handshake className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No partners found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((partner) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      {partner.logoUrl && !logoErrors[partner.id] ? (
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="h-12 w-12 rounded-full object-cover"
                          loading="lazy"
                          onError={() => handleLogoError(partner.id)}
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B5D66]/10">
                          <Handshake className="h-6 w-6 text-[#0B5D66]" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-display text-lg font-semibold text-[#111827]">{partner.name}</h3>
                        {partner.website && (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-0.5 inline-flex items-center gap-1 text-xs text-[#0B5D66] hover:underline"
                          >
                            <Globe className="h-3 w-3" /> {partner.website.replace(/^https?:\/\//, '')}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(partner)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(partner.id)}
                        disabled={deletingId === partner.id}
                      >
                        {deletingId === partner.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
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
              {editing ? 'Edit Partner' : 'Add Partner'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editing ? 'Update partner details.' : 'Create a new partner.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#111827]">Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Partner name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Logo URL</label>
              <Input
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
              {form.logoUrl && (
                <div className="mt-2 h-16 w-16 overflow-hidden rounded-full bg-[#E8EEEE]">
                  <img
                    src={form.logoUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Website</label>
              <Input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://example.com"
                className="mt-1"
              />
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