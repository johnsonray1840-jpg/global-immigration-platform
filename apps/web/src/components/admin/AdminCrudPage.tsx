'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Search, Plus, Pencil, Trash2, Loader2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Field {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'boolean';
  options?: string[];
  isJson?: boolean;
  isArray?: boolean;
}

interface AdminCrudPageProps {
  model: string;
  title: string;
  fields: Field[];
}

export default function AdminCrudPage({ model, title, fields }: AdminCrudPageProps) {
  const [records, setRecords] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      const res = await api.get(`/admin/crud/${model}?take=500`);
      setRecords(res.data);
      setLoading(false);
    } catch {
      toast.error(`Failed to load ${model}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [model]);

  const filtered = records.filter((r) =>
    JSON.stringify(r).toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setForm({});
    setShowForm(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    const updated: any = { ...record };
    fields.forEach((field) => {
      if (field.isArray && Array.isArray(updated[field.name])) {
        updated[field.name] = updated[field.name].join(', ');
      }
      if (field.type === 'boolean') {
        updated[field.name] = updated[field.name] ? 'true' : 'false';
      }
    });
    setForm(updated);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      fields.forEach((field) => {
        if (field.type === 'number' && payload[field.name] !== '' && payload[field.name] !== undefined) {
          payload[field.name] = Number(payload[field.name]);
        }
        if (field.type === 'boolean') {
          payload[field.name] = payload[field.name] === 'true' || payload[field.name] === true;
        }
        if (field.isJson && typeof payload[field.name] === 'string') {
          payload[field.name] = JSON.parse(payload[field.name]);
        }
        if (field.isArray && typeof payload[field.name] === 'string') {
          payload[field.name] = payload[field.name].split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      });

      if (editing) {
        await api.patch(`/admin/crud/${model}/${editing.id}`, payload);
        toast.success(`${model} updated`);
      } else {
        await api.post(`/admin/crud/${model}`, payload);
        toast.success(`${model} created`);
      }
      setShowForm(false);
      fetchRecords();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this ${model}?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/crud/${model}/${id}`);
      toast.success(`${model} deleted`);
      fetchRecords();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">Manage {model} records.</p>
        </div>
        <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${model}...`}
          className="pl-9 bg-white"
        />
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-xl font-semibold text-[#111827]">
                {editing ? 'Edit' : 'New'} {model}
              </h3>
              <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.name} className={field.type === 'textarea' || field.isJson ? 'md:col-span-2' : ''}>
                    <label className="text-sm font-medium text-[#111827]">
                      {field.label} {field.isArray && '(comma separated)'}
                    </label>
                    {field.type === 'textarea' ? (
                      <Textarea value={form[field.name] || ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} className="mt-1" rows={4} />
                    ) : field.type === 'select' && field.options ? (
                      <select value={form[field.name] || ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827]">
                        <option value="">Select...</option>
                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : field.type === 'boolean' ? (
                      <select value={form[field.name] || 'false'} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827]">
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    ) : (
                      <Input type={field.type === 'number' ? 'number' : 'text'} value={form[field.name] || ''} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })} className="mt-1" />
                    )}
                  </div>
                ))}
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowForm(false)} className="text-gray-600">Cancel</Button>
                  <Button type="submit" disabled={saving} className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {editing ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-[#F8FAFA]">
              <th className="p-4 text-sm font-medium text-gray-500">ID</th>
              {fields.slice(0, 4).map(field => (
                <th key={field.name} className="p-4 text-sm font-medium text-gray-500">{field.label}</th>
              ))}
              <th className="p-4 text-sm font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((record) => (
              <tr key={record.id} className="border-b border-gray-100 last:border-0 hover:bg-[#F8FAFA]">
                <td className="p-4 text-sm text-gray-600">{record.id.slice(0, 8)}...</td>
                {fields.slice(0, 4).map(field => (
                  <td key={field.name} className="p-4 text-sm text-gray-600">
                    {Array.isArray(record[field.name]) ? record[field.name].join(', ').slice(0, 80) :
                     typeof record[field.name] === 'object' ? JSON.stringify(record[field.name]).slice(0, 80) :
                     String(record[field.name]).slice(0, 80)}
                  </td>
                ))}
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(record)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id)} disabled={deletingId === record.id}>
                      {deletingId === record.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}