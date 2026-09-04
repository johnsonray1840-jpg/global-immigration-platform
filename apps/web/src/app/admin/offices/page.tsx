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
  MapPin,
  Phone,
  Mail,
  Globe2,
  Save,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminOfficesPage() {
  const [offices, setOffices] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    countryId: '',
    address: '',
    phone: '',
    email: '',
    lat: '',
    lng: '',
    imageUrl: '',
  });

  const fetchData = async () => {
    try {
      const [officesRes, countriesRes] = await Promise.all([
        api.get('/admin/crud/office?take=200'),
        api.get('/admin/crud/country?take=200'),
      ]);
      setOffices(officesRes.data);
      setCountries(countriesRes.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load offices:', err);
      toast.error('Failed to load offices');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return offices.filter((office) => {
      const matchesSearch =
        (office.address || '').toLowerCase().includes(search.toLowerCase()) ||
        (office.phone || '').toLowerCase().includes(search.toLowerCase()) ||
        (office.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (office.country?.name || '').toLowerCase().includes(search.toLowerCase());
      const matchesCountry = !countryFilter || office.countryId === countryFilter;
      return matchesSearch && matchesCountry;
    });
  }, [offices, search, countryFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ countryId: '', address: '', phone: '', email: '', lat: '', lng: '', imageUrl: '' });
    setShowForm(true);
  };

  const openEdit = (office: any) => {
    setEditing(office);
    setForm({
      countryId: office.countryId || '',
      address: office.address || '',
      phone: office.phone || '',
      email: office.email || '',
      lat: office.lat ?? '',
      lng: office.lng ?? '',
      imageUrl: office.imageUrl || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.countryId || !form.address.trim()) {
      toast.error('Country and address are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        countryId: form.countryId,
        address: form.address.trim(),
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        lat: form.lat === '' ? null : Number(form.lat),
        lng: form.lng === '' ? null : Number(form.lng),
        imageUrl: form.imageUrl.trim() || null,
      };
      if (editing) {
        await api.patch(`/admin/crud/office/${editing.id}`, payload);
        toast.success('Office updated');
      } else {
        await api.post('/admin/crud/office', payload);
        toast.success('Office created');
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to save office');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this office?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/crud/office/${id}`);
      toast.success('Office deleted');
      fetchData();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageError = (id: string) => {
    setImageError((prev) => ({ ...prev, [id]: true }));
  };

  const openMapLink = (office: any) => {
    if (office.lat && office.lng) {
      window.open(`https://maps.google.com/?q=${office.lat},${office.lng}`, '_blank');
    } else {
      toast.error('No coordinates available');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
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
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load offices.</p>
        <Button variant="outline" className="mt-4" onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">Office Management</h2>
          <p className="mt-2 text-sm text-gray-500">Manage global office locations and contact details.</p>
        </div>
        <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Office
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by address, phone, email, or country..."
            className="pl-9 bg-white"
          />
        </div>
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30 sm:w-56"
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>{country.name}</option>
          ))}
        </select>
      </div>

      {/* Offices Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No offices found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((office) => (
              <motion.div
                key={office.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md">
                  {office.imageUrl && !imageError[office.id] ? (
                    <img
                      src={office.imageUrl}
                      alt={office.address}
                      className="h-32 w-full object-cover"
                      loading="lazy"
                      onError={() => handleImageError(office.id)}
                    />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center bg-[#E8EEEE]">
                      <MapPin className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between">
                      <h3 className="font-display text-lg font-semibold text-[#111827]">
                        {office.country?.name || 'Unknown'}
                      </h3>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openMapLink(office)} title="View on map">
                          <Globe2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(office)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(office.id)}
                          disabled={deletingId === office.id}
                        >
                          {deletingId === office.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
                        </Button>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{office.address}</p>
                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[#0B5D66]" /> {office.phone || 'N/A'}</p>
                      <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-[#0B5D66]" /> {office.email || 'N/A'}</p>
                      {office.lat && office.lng && (
                        <p className="text-xs text-gray-400">📍 {office.lat}, {office.lng}</p>
                      )}
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
              {editing ? 'Edit Office' : 'Add Office'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editing ? 'Update office details.' : 'Create a new office location.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-[#111827]">Country</label>
              <select
                value={form.countryId}
                onChange={(e) => setForm({ ...form, countryId: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
                required
              >
                <option value="">Select country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Address</label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street, city, postal code"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#111827]">Phone</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 234 567 890"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="office@example.com"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#111827]">Latitude</label>
                <Input
                  type="number"
                  step="any"
                  value={form.lat}
                  onChange={(e) => setForm({ ...form, lat: e.target.value })}
                  placeholder="40.7128"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">Longitude</label>
                <Input
                  type="number"
                  step="any"
                  value={form.lng}
                  onChange={(e) => setForm({ ...form, lng: e.target.value })}
                  placeholder="-74.0060"
                  className="mt-1"
                />
              </div>
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