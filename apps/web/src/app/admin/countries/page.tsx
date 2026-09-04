'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Search,
  Pencil,
  Save,
  X,
  Loader2,
  Globe2,
  ShieldCheck,
  Banknote,
  HeartPulse,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const fetchCountries = async () => {
    try {
      const res = await api.get('/admin/crud/country?take=200');
      setCountries(res.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load countries:', err);
      toast.error('Failed to load countries');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const filtered = useMemo(() => {
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase())
    );
  }, [countries, search]);

  const startEdit = (country: any) => {
    setEditingId(country.id);
    setEditForm({
      name: country.name,
      code: country.code,
      continent: country.continent || '',
      passportRank: country.passportRank ?? '',
      safetyIndex: country.safetyIndex ?? '',
      livingCostIndex: country.livingCostIndex ?? '',
      healthcareIndex: country.healthcareIndex ?? '',
      educationIndex: country.educationIndex ?? '',
      taxRate: country.taxRate ?? '',
      currency: country.currency || '',
      languages: country.languages?.join(', ') || '',
      climate: country.climate || '',
      imageUrl: country.imageUrl || '',
    });
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        passportRank: editForm.passportRank === '' ? null : Number(editForm.passportRank),
        safetyIndex: editForm.safetyIndex === '' ? null : Number(editForm.safetyIndex),
        livingCostIndex: editForm.livingCostIndex === '' ? null : Number(editForm.livingCostIndex),
        healthcareIndex: editForm.healthcareIndex === '' ? null : Number(editForm.healthcareIndex),
        educationIndex: editForm.educationIndex === '' ? null : Number(editForm.educationIndex),
        taxRate: editForm.taxRate === '' ? null : Number(editForm.taxRate),
        languages: editForm.languages ? editForm.languages.split(',').map((l: string) => l.trim()) : [],
      };
      await api.patch(`/admin/crud/country/${id}`, payload);
      toast.success('Country updated successfully');
      setEditingId(null);
      fetchCountries();
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-xs" />
        <div className="space-y-3">
          {[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <Globe2 className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load countries.</p>
        <Button variant="outline" className="mt-4" onClick={fetchCountries}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">Country Management</h2>
          <p className="mt-2 text-sm text-gray-500">
            Edit passport rank, safety, living cost, healthcare, education, taxes, and more.
          </p>
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country..."
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-[#F8FAFA]">
              <th className="p-4 text-sm font-medium text-gray-500">Country</th>
              <th className="p-4 text-sm font-medium text-gray-500">Code</th>
              <th className="p-4 text-sm font-medium text-gray-500">Passport</th>
              <th className="p-4 text-sm font-medium text-gray-500">Safety</th>
              <th className="p-4 text-sm font-medium text-gray-500">Living Cost</th>
              <th className="p-4 text-sm font-medium text-gray-500">Healthcare</th>
              <th className="p-4 text-sm font-medium text-gray-500">Education</th>
              <th className="p-4 text-sm font-medium text-gray-500">Tax %</th>
              <th className="p-4 text-sm font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((country) => (
                <motion.tr
                  key={country.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-gray-100 last:border-0 hover:bg-[#F8FAFA]"
                >
                  <td className="p-4 text-sm font-medium text-[#111827]">{country.name}</td>
                  <td className="p-4 text-sm text-gray-600">{country.code}</td>
                  <td className="p-4 text-sm text-gray-600">{country.passportRank ?? '-'}</td>
                  <td className="p-4 text-sm text-gray-600">{country.safetyIndex ?? '-'}</td>
                  <td className="p-4 text-sm text-gray-600">{country.livingCostIndex ?? '-'}</td>
                  <td className="p-4 text-sm text-gray-600">{country.healthcareIndex ?? '-'}</td>
                  <td className="p-4 text-sm text-gray-600">{country.educationIndex ?? '-'}</td>
                  <td className="p-4 text-sm text-gray-600">{country.taxRate ?? '-'}</td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(country)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Edit Form */}
      {editingId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-[#111827]">Edit Country</h3>
            <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-[#111827]">Name</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Code</label>
              <Input
                value={editForm.code}
                onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Continent</label>
              <Input
                value={editForm.continent}
                onChange={(e) => setEditForm({ ...editForm, continent: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Passport Rank</label>
              <Input
                type="number"
                value={editForm.passportRank}
                onChange={(e) => setEditForm({ ...editForm, passportRank: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Safety Index</label>
              <Input
                type="number"
                value={editForm.safetyIndex}
                onChange={(e) => setEditForm({ ...editForm, safetyIndex: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Living Cost Index</label>
              <Input
                type="number"
                value={editForm.livingCostIndex}
                onChange={(e) => setEditForm({ ...editForm, livingCostIndex: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Healthcare Index</label>
              <Input
                type="number"
                value={editForm.healthcareIndex}
                onChange={(e) => setEditForm({ ...editForm, healthcareIndex: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Education Index</label>
              <Input
                type="number"
                value={editForm.educationIndex}
                onChange={(e) => setEditForm({ ...editForm, educationIndex: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Tax Rate (%)</label>
              <Input
                type="number"
                value={editForm.taxRate}
                onChange={(e) => setEditForm({ ...editForm, taxRate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Currency</label>
              <Input
                value={editForm.currency}
                onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Languages (comma separated)</label>
              <Input
                value={editForm.languages}
                onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Climate</label>
              <Input
                value={editForm.climate}
                onChange={(e) => setEditForm({ ...editForm, climate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditingId(null)} className="text-gray-600">
                Cancel
              </Button>
              <Button
                onClick={() => handleSave(editingId)}
                disabled={saving}
                className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]"
              >
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}