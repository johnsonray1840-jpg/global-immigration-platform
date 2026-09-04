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
  Newspaper,
  Image as ImageIcon,
  Calendar,
  Tag,
  X,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    title: '',
    content: '',
    summary: '',
    imageUrl: '',
    tags: '',
    published: true,
  });

  const fetchNews = async () => {
    try {
      const res = await api.get('/admin/crud/news?take=200');
      setNews(res.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load news:', err);
      toast.error('Failed to load news');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filtered = useMemo(() => {
    return news.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.summary?.toLowerCase().includes(search.toLowerCase()) ||
        n.content?.toLowerCase().includes(search.toLowerCase());
      const matchesPublished =
        publishedFilter === 'all' ||
        (publishedFilter === 'published' && n.published) ||
        (publishedFilter === 'unpublished' && !n.published);
      return matchesSearch && matchesPublished;
    });
  }, [news, search, publishedFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', content: '', summary: '', imageUrl: '', tags: '', published: true });
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({
      title: item.title,
      content: item.content,
      summary: item.summary || '',
      imageUrl: item.imageUrl || '',
      tags: (item.tags || []).join(', '),
      published: item.published,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        summary: form.summary.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        published: form.published,
      };
      if (editing) {
        await api.patch(`/admin/crud/news/${editing.id}`, payload);
        toast.success('News updated');
      } else {
        await api.post('/admin/crud/news', payload);
        toast.success('News created');
      }
      setShowForm(false);
      fetchNews();
    } catch (err) {
      toast.error('Failed to save news');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this news article?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/crud/news/${id}`);
      toast.success('News deleted');
      fetchNews();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageError = (id: string) => {
    setImageError((prev) => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <Newspaper className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load news.</p>
        <Button variant="outline" className="mt-4" onClick={fetchNews}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">News Management</h2>
          <p className="mt-2 text-sm text-gray-500">Publish and manage immigration news articles.</p>
        </div>
        <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add News
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, summary, or content..."
            className="pl-9 bg-white"
          />
        </div>
        <select
          value={publishedFilter}
          onChange={(e) => setPublishedFilter(e.target.value as any)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30 sm:w-48"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      {/* News Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Newspaper className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No news articles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md">
                  {item.imageUrl && !imageError[item.id] ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                      onError={() => handleImageError(item.id)}
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-[#E8EEEE]">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between">
                      <h3 className="font-display text-lg font-semibold text-[#111827] line-clamp-2">{item.title}</h3>
                      <span className={cn(
                        'ml-2 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium',
                        item.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      )}>
                        {item.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {item.summary && (
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">{item.summary}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(item.tags || []).map((tag: string) => (
                        <span key={tag} className="rounded-full bg-[#C9A96E]/20 px-2.5 py-0.5 text-xs font-medium text-[#111827]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" /> {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
                        </Button>
                      </div>
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
              {editing ? 'Edit News' : 'Add News'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editing ? 'Update the news article details.' : 'Create a new news article.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#111827]">Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter title"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Summary</label>
              <Input
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="Short summary (optional)"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Content</label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={5}
                placeholder="Write the full article content..."
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Image URL</label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
              {form.imageUrl && (
                <div className="mt-2 h-24 w-full overflow-hidden rounded-lg bg-[#E8EEEE]">
                  <img
                    src={form.imageUrl}
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
              <label className="text-sm font-medium text-[#111827]">Tags (comma separated)</label>
              <Input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="e.g., Canada, Express Entry, Study"
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="newsPublished"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#0B5D66] focus:ring-[#0B5D66]"
              />
              <label htmlFor="newsPublished" className="text-sm font-medium text-[#111827]">Published</label>
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