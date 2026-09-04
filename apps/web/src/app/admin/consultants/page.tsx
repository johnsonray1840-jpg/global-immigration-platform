'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  User,
  Briefcase,
  Globe2,
  Star,
  X,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminConsultantsPage() {
  const [consultants, setConsultants] = useState<any[]>([]);
  const [offices, setOffices] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [officeFilter, setOfficeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    userId: '',
    bio: '',
    specialities: '',
    officeId: '',
    calendarEmail: '',
  });

  const fetchData = async () => {
    try {
      const [consultantsRes, officesRes, usersRes] = await Promise.all([
        api.get('/admin/crud/consultantProfile?take=200'),
        api.get('/admin/crud/office?take=200'),
        api.get('/admin/crud/user?take=200'),
      ]);
      setConsultants(consultantsRes.data);
      setOffices(officesRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load consultants');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return consultants.filter((c) => {
      const user = users.find((u) => u.id === c.userId);
      const matchesSearch =
        (user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.bio || '').toLowerCase().includes(search.toLowerCase()) ||
        (c.specialities || []).join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesOffice = !officeFilter || c.officeId === officeFilter;
      return matchesSearch && matchesOffice;
    });
  }, [consultants, users, search, officeFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ userId: '', bio: '', specialities: '', officeId: '', calendarEmail: '' });
    setShowForm(true);
  };

  const openEdit = (consultant: any) => {
    setEditing(consultant);
    setForm({
      userId: consultant.userId || '',
      bio: consultant.bio || '',
      specialities: (consultant.specialities || []).join(', '),
      officeId: consultant.officeId || '',
      calendarEmail: consultant.calendarEmail || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        specialities: form.specialities
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        officeId: form.officeId || null,
      };

      if (editing) {
        await api.patch(`/admin/crud/consultantProfile/${editing.id}`, payload);
        toast.success('Consultant updated');
      } else {
        await api.post('/admin/crud/consultantProfile', payload);
        toast.success('Consultant created');
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to save consultant');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this consultant profile?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/crud/consultantProfile/${id}`);
      toast.success('Consultant deleted');
      fetchData();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-3">
          {[1,2,3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load consultants.</p>
        <Button variant="outline" className="mt-4" onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">Consultant Management</h2>
          <p className="mt-2 text-sm text-gray-500">Manage consultant profiles and specialties.</p>
        </div>
        <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Consultant
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, bio, or specialty..."
            className="pl-9 bg-white"
          />
        </div>
        <select
          value={officeFilter}
          onChange={(e) => setOfficeFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30 sm:w-48"
        >
          <option value="">All Offices</option>
          {offices.map((office) => (
            <option key={office.id} value={office.id}>
              {office.country?.name || office.address || office.id}
            </option>
          ))}
        </select>
      </div>

      {/* Consultants List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No consultants found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filtered.map((consultant) => {
              const user = users.find((u) => u.id === consultant.userId);
              return (
                <motion.div
                  key={consultant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5D66]/10">
                          <User className="h-5 w-5 text-[#0B5D66]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#111827]">{user?.email || 'Unknown User'}</p>
                          <p className="text-xs text-gray-500">User ID: {consultant.userId.slice(0, 8)}...</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(consultant)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(consultant.id)}
                          disabled={deletingId === consultant.id}
                        >
                          {deletingId === consultant.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-500" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {consultant.bio && (
                      <p className="mt-3 text-sm text-gray-600 line-clamp-2">{consultant.bio}</p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(consultant.specialities || []).map((spec: string) => (
                        <span key={spec} className="rounded-full bg-[#E8EEEE] px-3 py-1 text-xs font-medium text-[#0B5D66]">
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Globe2 className="h-3.5 w-3.5" /> {consultant.officeId || 'No office'}
                      </span>
                      {consultant.calendarEmail && (
                        <span className="text-xs text-gray-400">{consultant.calendarEmail}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold text-[#111827]">
              {editing ? 'Edit Consultant' : 'New Consultant'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editing ? 'Update consultant profile details.' : 'Create a new consultant profile.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#111827]">User</label>
              <select
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
                required
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.email}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Bio</label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Specialities (comma separated)</label>
              <Input
                value={form.specialities}
                onChange={(e) => setForm({ ...form, specialities: e.target.value })}
                placeholder="e.g., Family, Investment, Student"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Office</label>
              <select
                value={form.officeId}
                onChange={(e) => setForm({ ...form, officeId: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
              >
                <option value="">No office</option>
                {offices.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.country?.name || office.address || office.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Calendar Email</label>
              <Input
                type="email"
                value={form.calendarEmail}
                onChange={(e) => setForm({ ...form, calendarEmail: e.target.value })}
                placeholder="consultant@example.com"
                className="mt-1"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="text-gray-600">
                Cancel
              </Button>
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