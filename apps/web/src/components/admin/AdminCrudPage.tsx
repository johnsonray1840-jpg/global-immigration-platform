'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminCrudPageProps {
  model: string;
  title: string;
  fields: {
    name: string;
    label: string;
    type?: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'boolean';
    options?: string[];
    isJson?: boolean;
    isArray?: boolean;
  }[];
}

export default function AdminCrudPage({ model, title, fields }: AdminCrudPageProps) {
  const [records, setRecords] = useState<any[]>([]);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [model]);

  const fetchRecords = async () => {
    try {
      const res = await api.get(`/admin/crud/${model}?take=200`);
      setRecords(res.data);
      setLoading(false);
    } catch (error) {
      toast.error(`Failed to load ${model}`);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData };
      for (const field of fields) {
        if (field.type === 'number' && payload[field.name] !== undefined && payload[field.name] !== '') {
          payload[field.name] = Number(payload[field.name]);
        }
        if (field.type === 'boolean') {
          payload[field.name] = payload[field.name] === 'true' || payload[field.name] === true;
        }
        if (field.isJson && typeof payload[field.name] === 'string') {
          try {
            payload[field.name] = JSON.parse(payload[field.name]);
          } catch (error) {
            toast.error(`Invalid JSON for ${field.label}`);
            setSaving(false);
            return;
          }
        }
        if (field.isArray && typeof payload[field.name] === 'string') {
          payload[field.name] = payload[field.name].split(',').map((s: string) => s.trim()).filter(Boolean);
        }
      }

      if (editingRecord) {
        await api.patch(`/admin/crud/${model}/${editingRecord.id}`, payload);
        toast.success(`${model} updated`);
      } else {
        await api.post(`/admin/crud/${model}`, payload);
        toast.success(`${model} created`);
      }
      setShowForm(false);
      setEditingRecord(null);
      setFormData({});
      fetchRecords();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record: any) => {
    const updated = { ...record };
    for (const field of fields) {
      if (field.isArray && Array.isArray(updated[field.name])) {
        updated[field.name] = updated[field.name].join(', ');
      }
      if (field.type === 'boolean') {
        updated[field.name] = updated[field.name] ? 'true' : 'false';
      }
    }
    setEditingRecord(record);
    setFormData(updated);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this ${model}?`)) return;
    try {
      await api.delete(`/admin/crud/${model}/${id}`);
      toast.success(`${model} deleted`);
      fetchRecords();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const filteredRecords = records.filter((record) =>
    JSON.stringify(record).toLowerCase().includes(search.toLowerCase())
  );

  const renderField = (field: any) => {
    const value = formData[field.name];
    if (field.type === 'textarea') {
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
          placeholder={field.label}
          rows={4}
          className="mt-1"
        />
      );
    } else if (field.type === 'select' && field.options) {
      return (
        <select
          value={value || ''}
          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
          className="mt-1 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Select...</option>
          {field.options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    } else if (field.type === 'boolean') {
      return (
        <select
          value={value || 'false'}
          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
          className="mt-1 w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      );
    } else {
      return (
        <Input
          type={field.type === 'number' ? 'number' : 'text'}
          value={value || ''}
          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
          placeholder={field.label}
          className="mt-1"
        />
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-foreground">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">Manage {model} records.</p>
        </div>
        <Button
          onClick={() => {
            setEditingRecord(null);
            setFormData({});
            setShowForm(true);
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 btn-glow"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${model}...`}
          className="pl-9"
        />
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard className="p-6">
              <h3 className="font-display text-xl font-semibold text-foreground">
                {editingRecord ? 'Edit' : 'New'} {model}
              </h3>
              <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.name} className={field.type === 'textarea' || field.isJson ? 'md:col-span-2' : ''}>
                    <label className="text-sm font-medium text-foreground">
                      {field.label} {field.isArray && '(comma separated)'}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
                <div className="md:col-span-2 flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setShowForm(false)} className="text-foreground">
                    <X className="mr-1 h-4 w-4" /> Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 btn-glow"
                  >
                    {saving ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-1 h-4 w-4" />
                    )}
                    {editingRecord ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <GlassCard className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-sm font-medium text-muted-foreground">ID</th>
                {fields.slice(0, 4).map((field) => (
                  <th key={field.name} className="p-4 text-sm font-medium text-muted-foreground">
                    {field.label}
                  </th>
                ))}
                <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 text-sm text-foreground">{record.id.slice(0, 8)}...</td>
                  {fields.slice(0, 4).map((field) => (
                    <td key={field.name} className="p-4 text-sm text-muted-foreground">
                      {Array.isArray(record[field.name])
                        ? record[field.name].join(', ').slice(0, 80)
                        : typeof record[field.name] === 'object'
                        ? JSON.stringify(record[field.name]).slice(0, 80)
                        : String(record[field.name]).slice(0, 80)}
                    </td>
                  ))}
                  <td className="p-4">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(record)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
}