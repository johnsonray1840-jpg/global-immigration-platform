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
  Star,
  Quote,
  Save,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [photoErrors, setPhotoErrors] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    clientName: '',
    photoUrl: '',
    text: '',
    rating: 5,
    caseId: '',
    featured: false,
  });

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/admin/crud/testimonial?take=200');
      setTestimonials(res.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
      toast.error('Failed to load testimonials');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const filtered = useMemo(() => {
    return testimonials.filter(
      (t) =>
        t.clientName.toLowerCase().includes(search.toLowerCase()) ||
        (t.text || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [testimonials, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ clientName: '', photoUrl: '', text: '', rating: 5, caseId: '', featured: false });
    setShowForm(true);
  };

  const openEdit = (testimonial: any) => {
    setEditing(testimonial);
    setForm({
      clientName: testimonial.clientName,
      photoUrl: testimonial.photoUrl || '',
      text: testimonial.text,
      rating: testimonial.rating || 5,
      caseId: testimonial.caseId || '',
      featured: testimonial.featured,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.text.trim()) {
      toast.error('Client name and text are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        clientName: form.clientName.trim(),
        photoUrl: form.photoUrl.trim() || null,
        text: form.text.trim(),
        rating: Number(form.rating),
        caseId: form.caseId.trim() || null,
        featured: form.featured,
      };
      if (editing) {
        await api.patch(`/admin/crud/testimonial/${editing.id}`, payload);
        toast.success('Testimonial updated');
      } else {
        await api.post('/admin/crud/testimonial', payload);
        toast.success('Testimonial created');
      }
      setShowForm(false);
      fetchTestimonials();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save testimonial';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/crud/testimonial/${id}`);
      toast.success('Testimonial deleted');
      fetchTestimonials();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePhotoError = (id: string) => {
    setPhotoErrors((prev) => ({ ...prev, [id]: true }));
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
        <Quote className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load testimonials.</p>
        <Button variant="outline" className="mt-4" onClick={fetchTestimonials}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">Testimonial Management</h2>
          <p className="mt-2 text-sm text-gray-500">Manage client success stories and reviews.</p>
        </div>
        <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by client name or text..."
          className="pl-9 bg-white"
        />
      </div>

      {/* Testimonials Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Quote className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No testimonials found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {testimonial.photoUrl && !photoErrors[testimonial.id] ? (
                        <img
                          src={testimonial.photoUrl}
                          alt={testimonial.clientName}
                          className="h-10 w-10 rounded-full object-cover"
                          loading="lazy"
                          onError={() => handlePhotoError(testimonial.id)}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5D66]/10">
                          <Quote className="h-5 w-5 text-[#0B5D66]" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-display text-lg font-semibold text-[#111827]">{testimonial.clientName}</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-3.5 w-3.5',
                                i < (testimonial.rating || 0) ? 'fill-[#C9A96E] text-[#C9A96E]' : 'text-gray-300'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {testimonial.featured && (
                      <span className="rounded-full bg-[#C9A96E]/20 px-3 py-1 text-xs font-medium text-[#111827]">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-4">
                    "{testimonial.text}"
                  </p>
                  <div className="mt-4 flex items-center justify-end border-t border-gray-100 pt-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(testimonial)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(testimonial.id)}
                        disabled={deletingId === testimonial.id}
                      >
                        {deletingId === testimonial.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
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
        <DialogContent className="bg-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold text-[#111827]">
              {editing ? 'Edit Testimonial' : 'Add Testimonial'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editing ? 'Update client testimonial details.' : 'Create a new client testimonial.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#111827]">Client Name</label>
              <Input
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                placeholder="e.g., John Smith"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Photo URL</label>
              <Input
                value={form.photoUrl}
                onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
              {form.photoUrl && (
                <div className="mt-2 h-16 w-16 overflow-hidden rounded-full bg-[#E8EEEE]">
                  <img
                    src={form.photoUrl}
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
              <label className="text-sm font-medium text-[#111827]">Testimonial Text</label>
              <Textarea
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                rows={4}
                placeholder="What did the client say?"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#111827]">Rating (1–5)</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">Case ID (optional)</label>
                <Input
                  value={form.caseId}
                  onChange={(e) => setForm({ ...form, caseId: e.target.value })}
                  placeholder="Related case ID"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#0B5D66] focus:ring-[#0B5D66]"
              />
              <label htmlFor="featured" className="text-sm font-medium text-[#111827]">Featured</label>
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