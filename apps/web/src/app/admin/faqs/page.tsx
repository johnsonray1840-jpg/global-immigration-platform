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
  HelpCircle,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Languages,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const supportedLanguages = ['en', 'fr', 'es', 'de', 'zh', 'ar'];

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: '',
    language: 'en',
    order: 0,
  });

  const fetchFaqs = async () => {
    try {
      const res = await api.get('/admin/crud/faq?take=200');
      setFaqs(res.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load FAQs:', err);
      toast.error('Failed to load FAQs');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(faqs.map((f) => f.category).filter(Boolean));
    return Array.from(set) as string[];
  }, [faqs]);

  const filtered = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || faq.category === categoryFilter;
      const matchesLanguage = !languageFilter || faq.language === languageFilter;
      return matchesSearch && matchesCategory && matchesLanguage;
    }).sort((a, b) => a.order - b.order);
  }, [faqs, search, categoryFilter, languageFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ question: '', answer: '', category: '', language: 'en', order: 0 });
    setShowForm(true);
  };

  const openEdit = (faq: any) => {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || '',
      language: faq.language || 'en',
      order: faq.order || 0,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error('Question and answer are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        category: form.category.trim() || null,
        language: form.language,
        order: Number(form.order) || 0,
      };
      if (editing) {
        await api.patch(`/admin/crud/faq/${editing.id}`, payload);
        toast.success('FAQ updated');
      } else {
        await api.post('/admin/crud/faq', payload);
        toast.success('FAQ created');
      }
      setShowForm(false);
      fetchFaqs();
    } catch (err) {
      toast.error('Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/crud/faq/${id}`);
      toast.success('FAQ deleted');
      fetchFaqs();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const moveOrder = async (faq: any, direction: 'up' | 'down') => {
    const currentIndex = faqs.findIndex((f) => f.id === faq.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const targetFaq = faqs[targetIndex];
    try {
      await Promise.all([
        api.patch(`/admin/crud/faq/${faq.id}`, { order: targetFaq.order }),
        api.patch(`/admin/crud/faq/${targetFaq.id}`, { order: faq.order }),
      ]);
      toast.success('Order updated');
      fetchFaqs();
    } catch {
      toast.error('Failed to reorder');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load FAQs.</p>
        <Button variant="outline" className="mt-4" onClick={fetchFaqs}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">FAQ Management</h2>
          <p className="mt-2 text-sm text-gray-500">Manage frequently asked questions and their categories.</p>
        </div>
        <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add FAQ
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search question or answer..."
            className="pl-9 bg-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30 sm:w-48"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30 sm:w-40"
        >
          <option value="">All Languages</option>
          {supportedLanguages.map((lang) => (
            <option key={lang} value={lang}>{lang.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* FAQ List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No FAQs found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg font-semibold text-[#111827]">{faq.question}</h3>
                        {faq.category && (
                          <span className="rounded-full bg-[#E8EEEE] px-3 py-1 text-xs font-medium text-[#0B5D66]">
                            {faq.category}
                          </span>
                        )}
                        <span className="rounded-full bg-[#C9A96E]/20 px-3 py-1 text-xs font-medium text-[#111827]">
                          {faq.language?.toUpperCase()}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-1 md:flex-col lg:flex-row">
                      <Button variant="ghost" size="icon" onClick={() => moveOrder(faq, 'up')}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => moveOrder(faq, 'down')}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(faq.id)}
                        disabled={deletingId === faq.id}
                      >
                        {deletingId === faq.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
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
              {editing ? 'Edit FAQ' : 'Add FAQ'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editing ? 'Update the question and answer details.' : 'Create a new frequently asked question.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#111827]">Question</label>
              <Input
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="Enter question"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Answer</label>
              <Textarea
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                rows={4}
                placeholder="Enter answer"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-[#111827]">Category</label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g., Visas"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">Language</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">Order</label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
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