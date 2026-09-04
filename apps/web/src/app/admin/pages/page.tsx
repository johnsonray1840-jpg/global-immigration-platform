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
  FileText,
  Save,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    slug: '',
    title: '',
    content: '',
    metaTitle: '',
    metaDesc: '',
  });

  const fetchPages = async () => {
    try {
      const res = await api.get('/admin/crud/page?take=200');
      setPages(res.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load pages:', err);
      toast.error('Failed to load pages');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const filtered = useMemo(() => {
    return pages.filter(
      (p) =>
        (p.slug || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.metaTitle || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [pages, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({ slug: '', title: '', content: '', metaTitle: '', metaDesc: '' });
    setShowForm(true);
  };

  const openEdit = (page: any) => {
    setEditing(page);
    setForm({
      slug: page.slug,
      title: page.title,
      content: typeof page.content === 'string' ? page.content : JSON.stringify(page.content),
      metaTitle: page.metaTitle || '',
      metaDesc: page.metaDesc || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug.trim() || !form.title.trim()) {
      toast.error('Slug and title are required');
      return;
    }
    if (!form.slug.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) {
      toast.error('Slug must be lowercase letters, numbers, and hyphens only');
      return;
    }
    setSaving(true);
    try {
      // content may be JSON or HTML; store as raw string; backend may parse if needed
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        content: form.content,
        metaTitle: form.metaTitle.trim() || null,
        metaDesc: form.metaDesc.trim() || null,
      };
      if (editing) {
        await api.patch(`/admin/crud/page/${editing.id}`, payload);
        toast.success('Page updated');
      } else {
        await api.post('/admin/crud/page', payload);
        toast.success('Page created');
      }
      setShowForm(false);
      fetchPages();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save page';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this page?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/crud/page/${id}`);
      toast.success('Page deleted');
      fetchPages();
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
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load pages.</p>
        <Button variant="outline" className="mt-4" onClick={fetchPages}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">Pages / Legal Content</h2>
          <p className="mt-2 text-sm text-gray-500">Manage static pages like Privacy Policy, Terms, and Disclaimers.</p>
        </div>
        <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Page
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by slug or title..."
          className="pl-9 bg-white"
        />
      </div>

      {/* Pages List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No pages found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((page) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#E8EEEE] px-3 py-1 text-xs font-medium text-[#0B5D66]">
                          /{page.slug}
                        </span>
                        <h3 className="font-display text-lg font-semibold text-[#111827]">{page.title}</h3>
                      </div>
                      {page.metaDesc && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{page.metaDesc}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(page)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(page.id)}
                        disabled={deletingId === page.id}
                      >
                        {deletingId === page.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
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
        <DialogContent className="bg-white sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold text-[#111827]">
              {editing ? 'Edit Page' : 'Add Page'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editing ? 'Update page details.' : 'Create a new static page.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#111827]">Slug</label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="privacy-policy"
                className="mt-1"
              />
              <p className="mt-1 text-xs text-gray-400">Use lowercase letters, numbers, and hyphens only.</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Page title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Content (HTML or JSON)</label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={6}
                placeholder="<p>Your content here</p> or JSON"
                className="mt-1 font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Meta Title</label>
              <Input
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                placeholder="SEO title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Meta Description</label>
              <Textarea
                value={form.metaDesc}
                onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
                rows={2}
                placeholder="Brief description for search engines"
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