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
  Package,
  Save,
  Star,
  DollarSign,
  FileText,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface ServicePackage {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const packageTypes = [
  'Holiday',
  'Tourist',
  'Honeymoon',
  'Investment',
  'Student',
  'Skilled Worker',
  'Family Relocation',
  'Business',
  'Retirement',
];

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ServicePackage | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState('');

  const [form, setForm] = useState({
    name: '',
    type: 'Holiday',
    description: '',
    price: '',
    duration: '',
    features: [] as string[],
    imageUrl: '',
    isActive: true,
  });

  const fetchData = async () => {
    try {
      const res = await api.get('/admin/crud/adminServicePackage?take=500');
      setPackages(res.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load packages:', err);
      toast.error('Failed to load service packages');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return packages.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.type.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [packages, search]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: '',
      type: 'Holiday',
      description: '',
      price: '',
      duration: '',
      features: [],
      imageUrl: '',
      isActive: true,
    });
    setFeatureInput('');
    setShowForm(true);
  };

  const openEdit = (pkg: ServicePackage) => {
    setEditing(pkg);
    setForm({
      name: pkg.name,
      type: pkg.type,
      description: pkg.description,
      price: pkg.price.toString(),
      duration: pkg.duration,
      features: pkg.features || [],
      imageUrl: pkg.imageUrl || '',
      isActive: pkg.isActive,
    });
    setFeatureInput('');
    setShowForm(true);
  };

  const addFeature = () => {
    if (featureInput.trim() && !form.features.includes(featureInput.trim())) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const removeFeature = (feature: string) => {
    setForm({ ...form, features: form.features.filter((f) => f !== feature) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.type || !form.description.trim() || !form.price || !form.duration) {
      toast.error('All fields are required');
      return;
    }
    if (form.features.length === 0) {
      toast.error('At least one feature is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        description: form.description.trim(),
        price: Number(form.price),
        duration: form.duration,
        features: form.features,
        imageUrl: form.imageUrl.trim() || null,
        isActive: form.isActive,
      };
      if (editing) {
        await api.patch(`/admin/crud/adminServicePackage/${editing.id}`, payload);
        toast.success('Package updated');
      } else {
        await api.post('/admin/crud/adminServicePackage', payload);
        toast.success('Package created');
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save package';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service package?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/crud/adminServicePackage/${id}`);
      toast.success('Package deleted');
      fetchData();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (pkg: ServicePackage) => {
    try {
      await api.patch(`/admin/crud/adminServicePackage/${pkg.id}`, {
        isActive: !pkg.isActive,
      });
      toast.success(pkg.isActive ? 'Package deactivated' : 'Package activated');
      fetchData();
    } catch {
      toast.error('Failed to update package status');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load service packages.</p>
        <Button variant="outline" className="mt-4" onClick={fetchData}>
          Retry
        </Button>
      </div>
    );
  }

  const activeCount = packages.filter((p) => p.isActive).length;
  const inactiveCount = packages.filter((p) => !p.isActive).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">
            Premium Service Packages
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Create and manage premium service packages with full details.
          </p>
        </div>
        <Button
          className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]"
          onClick={openCreate}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Package
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Packages</p>
          <p className="font-display text-2xl font-semibold text-[#111827]">
            {packages.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Active</p>
          <p className="font-display text-2xl font-semibold text-green-600">
            {activeCount}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Inactive</p>
          <p className="font-display text-2xl font-semibold text-red-600">
            {inactiveCount}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Avg Price</p>
          <p className="font-display text-2xl font-semibold text-[#111827]">
            ${packages.length > 0 ? Math.round(packages.reduce((sum, p) => sum + p.price, 0) / packages.length).toLocaleString() : '0'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search packages..."
          className="pl-9 bg-white"
        />
      </div>

      {/* Packages Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No packages found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md">
                  {/* Image */}
                  <div className="relative h-48 w-full bg-gradient-to-br from-[#0B5D66] to-[#0A4E56]">
                    {pkg.imageUrl ? (
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute left-4 top-4">
                      <Badge className="bg-[#C9A96E] text-white border-0">
                        <Star className="mr-1 h-3 w-3 fill-white" /> {pkg.type}
                      </Badge>
                    </div>
                    <div className="absolute right-4 top-4">
                      <Badge
                        className={cn(
                          'border-0',
                          pkg.isActive
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                        )}
                      >
                        {pkg.isActive ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-xl font-semibold text-white">
                        {pkg.name}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {pkg.description}
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 text-[#C9A96E]" />
                        <span className="font-display text-lg font-semibold text-[#111827]">
                          ${pkg.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4 text-[#C9A96E]" />
                        <span>Duration: {pkg.duration}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">Features:</p>
                      <ul className="space-y-1">
                        {pkg.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                            <CheckCircle2 className="mt-0.5 h-3 w-3 text-[#0B5D66]" />
                            {feature}
                          </li>
                        ))}
                        {pkg.features.length > 4 && (
                          <li className="text-xs text-gray-400">
                            +{pkg.features.length - 4} more
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <Switch
                        checked={pkg.isActive}
                        onCheckedChange={() => toggleActive(pkg)}
                      />
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(pkg)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(pkg.id)}
                          disabled={deletingId === pkg.id}
                        >
                          {deletingId === pkg.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-500" />
                          )}
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
        <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold text-[#111827]">
              {editing ? 'Edit Package' : 'Create New Package'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editing
                ? 'Update service package details.'
                : 'Create a new premium service package.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#111827]">
                  Package Name
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Premium Holiday Package"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
                  required
                >
                  {packageTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#111827]">
                Description
              </label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Describe the package..."
                className="mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#111827]">
                  Price (USD)
                </label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="2500"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">
                  Duration
                </label>
                <Input
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="e.g., 14 Days, 3 Months"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#111827]">
                Image URL (optional)
              </label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#111827]">
                Features
              </label>
              <div className="mt-1 flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Add a feature"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  Add
                </Button>
              </div>
              {form.features.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.features.map((feature, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeFeature(feature)}
                    >
                      {feature} <XCircle className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
              />
              <label htmlFor="isActive" className="text-sm font-medium text-[#111827]">
                Active (visible on website)
              </label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="text-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {editing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
