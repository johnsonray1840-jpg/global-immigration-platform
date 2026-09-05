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
  Plus,
  Trash2,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

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

  const resetForm = () => {
    setEditForm({
      name: '',
      code: '',
      continent: '',
      passportRank: '',
      safetyIndex: '',
      livingCostIndex: '',
      healthcareIndex: '',
      educationIndex: '',
      taxRate: '',
      currency: '',
      languages: '',
      climate: '',
      imageUrl: '',
    });
  };

  const startCreate = () => {
    resetForm();
    setCreating(true);
    setEditingId(null);
  };

  const startEdit = (country: any) => {
    setCreating(false);
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

  const handleSave = async () => {
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
      
      if (creating) {
        await api.post('/admin/crud/country', payload);
        toast.success('Country created successfully');
      } else {
        await api.patch(`/admin/crud/country/${editingId}`, payload);
        toast.success('Country updated successfully');
      }
      
      setCreating(false);
      setEditingId(null);
      resetForm();
      fetchCountries();
    } catch (err) {
      toast.error(creating ? 'Creation failed' : 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setCountryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!countryToDelete) return;
    try {
      await api.delete(`/admin/crud/country/${countryToDelete}`);
      toast.success('Country deleted successfully');
      setDeleteDialogOpen(false);
      setCountryToDelete(null);
      fetchCountries();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const getFlagEmoji = (code: string) => {
    return code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
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
            Create, edit, and delete countries with passport rank, safety, living cost, healthcare, education, taxes, and more.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="pl-10 bg-white"
            />
          </div>
          <Button onClick={startCreate} className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]">
            <Plus className="mr-2 h-4 w-4" />
            Add Country
          </Button>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((country, index) => (
          <motion.div
            key={country.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="group relative overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-[#C9A96E]/50 transition-all duration-300">
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-[#0B5D66] to-[#0a4c55] p-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{getFlagEmoji(country.code)}</span>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    #{country.passportRank || '-'}
                  </Badge>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold truncate">{country.name}</h3>
                <p className="text-sm text-white/80 truncate">{country.continent || 'Unknown'}</p>
              </div>

              {/* Content */}
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <ShieldCheck className="h-3 w-3 text-[#0B5D66]" />
                    <span className="text-gray-600">Safety:</span>
                    <span className="font-medium">{country.safetyIndex ?? '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Banknote className="h-3 w-3 text-[#0B5D66]" />
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-medium">{country.livingCostIndex ?? '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <HeartPulse className="h-3 w-3 text-[#0B5D66]" />
                    <span className="text-gray-600">Health:</span>
                    <span className="font-medium">{country.healthcareIndex ?? '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <GraduationCap className="h-3 w-3 text-[#0B5D66]" />
                    <span className="text-gray-600">Edu:</span>
                    <span className="font-medium">{country.educationIndex ?? '-'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{country.currency || '-'}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => startEdit(country)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(country.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Form Dialog */}
      <Dialog open={creating || editingId !== null} onOpenChange={(open) => {
        if (!open) {
          setCreating(false);
          setEditingId(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-semibold text-[#111827]">
              {creating ? 'Create New Country' : 'Edit Country'}
            </DialogTitle>
            <DialogDescription>
              {creating ? 'Add a new country to the system' : 'Update country information'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="mt-1"
                placeholder="e.g., United States"
              />
            </div>
            <div>
              <Label>Code</Label>
              <Input
                value={editForm.code}
                onChange={(e) => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })}
                className="mt-1"
                placeholder="e.g., US"
                maxLength={2}
              />
            </div>
            <div>
              <Label>Continent</Label>
              <Input
                value={editForm.continent}
                onChange={(e) => setEditForm({ ...editForm, continent: e.target.value })}
                className="mt-1"
                placeholder="e.g., North America"
              />
            </div>
            <div>
              <Label>Passport Rank</Label>
              <Input
                type="number"
                value={editForm.passportRank}
                onChange={(e) => setEditForm({ ...editForm, passportRank: e.target.value })}
                className="mt-1"
                placeholder="e.g., 1"
              />
            </div>
            <div>
              <Label>Safety Index</Label>
              <Input
                type="number"
                value={editForm.safetyIndex}
                onChange={(e) => setEditForm({ ...editForm, safetyIndex: e.target.value })}
                className="mt-1"
                placeholder="e.g., 85"
              />
            </div>
            <div>
              <Label>Living Cost Index</Label>
              <Input
                type="number"
                value={editForm.livingCostIndex}
                onChange={(e) => setEditForm({ ...editForm, livingCostIndex: e.target.value })}
                className="mt-1"
                placeholder="e.g., 75"
              />
            </div>
            <div>
              <Label>Healthcare Index</Label>
              <Input
                type="number"
                value={editForm.healthcareIndex}
                onChange={(e) => setEditForm({ ...editForm, healthcareIndex: e.target.value })}
                className="mt-1"
                placeholder="e.g., 90"
              />
            </div>
            <div>
              <Label>Education Index</Label>
              <Input
                type="number"
                value={editForm.educationIndex}
                onChange={(e) => setEditForm({ ...editForm, educationIndex: e.target.value })}
                className="mt-1"
                placeholder="e.g., 88"
              />
            </div>
            <div>
              <Label>Tax Rate (%)</Label>
              <Input
                type="number"
                value={editForm.taxRate}
                onChange={(e) => setEditForm({ ...editForm, taxRate: e.target.value })}
                className="mt-1"
                placeholder="e.g., 25"
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Input
                value={editForm.currency}
                onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
                className="mt-1"
                placeholder="e.g., USD"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Languages (comma separated)</Label>
              <Input
                value={editForm.languages}
                onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })}
                className="mt-1"
                placeholder="e.g., English, Spanish, French"
              />
            </div>
            <div>
              <Label>Climate</Label>
              <Input
                value={editForm.climate}
                onChange={(e) => setEditForm({ ...editForm, climate: e.target.value })}
                className="mt-1"
                placeholder="e.g., Temperate"
              />
            </div>
            <div className="md:col-span-3">
              <Label>Image URL</Label>
              <Input
                value={editForm.imageUrl}
                onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                className="mt-1"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => {
              setCreating(false);
              setEditingId(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !editForm.name || !editForm.code}
              className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {creating ? 'Create Country' : 'Save Changes'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Country</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this country? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}