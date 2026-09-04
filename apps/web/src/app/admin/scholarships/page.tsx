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
  GraduationCap,
  Save,
  X,
  Banknote,
  CalendarDays,
  Globe2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    universityId: '',
    countryId: '',
    name: '',
    description: '',
    fundingAmount: '',
    deadline: '',
    eligibilityJson: '',
    link: '',
  });

  const fetchData = async () => {
    try {
      const [scholarshipsRes, universitiesRes, countriesRes] = await Promise.all([
        api.get('/admin/crud/scholarship?take=500'),
        api.get('/admin/crud/university?take=200'),
        api.get('/admin/crud/country?take=200'),
      ]);
      setScholarships(scholarshipsRes.data);
      setUniversities(universitiesRes.data);
      setCountries(countriesRes.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load scholarships:', err);
      toast.error('Failed to load scholarships');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return scholarships.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.description || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [scholarships, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      universityId: '',
      countryId: '',
      name: '',
      description: '',
      fundingAmount: '',
      deadline: '',
      eligibilityJson: '',
      link: '',
    });
    setShowForm(true);
  };

  const openEdit = (scholarship: any) => {
    setEditing(scholarship);
    setForm({
      universityId: scholarship.universityId || '',
      countryId: scholarship.countryId || '',
      name: scholarship.name,
      description: scholarship.description || '',
      fundingAmount: scholarship.fundingAmount ?? '',
      deadline: scholarship.deadline ? scholarship.deadline.slice(0, 10) : '',
      eligibilityJson: scholarship.eligibilityJson
        ? typeof scholarship.eligibilityJson === 'string'
          ? scholarship.eligibilityJson
          : JSON.stringify(scholarship.eligibilityJson, null, 2)
        : '',
      link: scholarship.link || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.universityId || !form.countryId) {
      toast.error('Name, university, and country are required');
      return;
    }
    if (form.eligibilityJson) {
      try {
        JSON.parse(form.eligibilityJson);
      } catch {
        toast.error('Eligibility must be valid JSON');
        return;
      }
    }
    setSaving(true);
    try {
      const payload = {
        universityId: form.universityId,
        countryId: form.countryId,
        name: form.name.trim(),
        description: form.description.trim() || null,
        fundingAmount: form.fundingAmount === '' ? null : Number(form.fundingAmount),
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
        eligibilityJson: form.eligibilityJson ? JSON.parse(form.eligibilityJson) : null,
        link: form.link.trim() || null,
      };
      if (editing) {
        await api.patch(`/admin/crud/scholarship/${editing.id}`, payload);
        toast.success('Scholarship updated');
      } else {
        await api.post('/admin/crud/scholarship', payload);
        toast.success('Scholarship created');
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save scholarship';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this scholarship?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/crud/scholarship/${id}`);
      toast.success('Scholarship deleted');
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
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-56 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load scholarships.</p>
        <Button variant="outline" className="mt-4" onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">Scholarship Management</h2>
          <p className="mt-2 text-sm text-gray-500">Add and manage scholarships with realistic details.</p>
        </div>
        <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Scholarship
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search scholarships..."
          className="pl-9 bg-white"
        />
      </div>

      {/* Scholarships Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No scholarships found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((scholarship) => {
              const university = universities.find(u => u.id === scholarship.universityId);
              const country = countries.find(c => c.id === scholarship.countryId);
              return (
                <motion.div
                  key={scholarship.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-[#111827]">{scholarship.name}</h3>
                        <p className="text-sm text-gray-500">{university?.name || 'Unknown University'}</p>
                        <p className="text-sm text-gray-500">{country?.name || 'Unknown Country'}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(scholarship)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(scholarship.id)}
                          disabled={deletingId === scholarship.id}
                        >
                          {deletingId === scholarship.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
                        </Button>
                      </div>
                    </div>

                    {scholarship.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{scholarship.description}</p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Banknote className="h-4 w-4 text-[#C9A96E]" />
                        ${scholarship.fundingAmount?.toLocaleString() || 'Varies'}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 text-[#C9A96E]" />
                        {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'Open'}
                      </span>
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
        <DialogContent className="bg-white sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold text-[#111827]">
              {editing ? 'Edit Scholarship' : 'Add Scholarship'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editing ? 'Update scholarship details.' : 'Create a new scholarship.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#111827]">University</label>
                <select
                  value={form.universityId}
                  onChange={(e) => setForm({ ...form, universityId: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
                  required
                >
                  <option value="">Select university</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
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
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Scholarship Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Global Leadership Scholarship"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Describe the scholarship..."
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#111827]">Funding Amount (USD)</label>
                <Input
                  type="number"
                  value={form.fundingAmount}
                  onChange={(e) => setForm({ ...form, fundingAmount: e.target.value })}
                  placeholder="10000"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">Deadline</label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Eligibility (JSON)</label>
              <Textarea
                value={form.eligibilityJson}
                onChange={(e) => setForm({ ...form, eligibilityJson: e.target.value })}
                rows={3}
                placeholder='{"minGPA": 3.5, "countries": ["US","CA"]}'
                className="mt-1 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Application Link</label>
              <Input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://..."
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