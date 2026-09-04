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
  Banknote,
  Clock,
  RefreshCw,
  Save,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Country {
  id: string;
  name: string;
  code: string;
}

interface VisaType {
  id: string;
  name: string;
  category: string;
}

export default function AdminVisaRulesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [visaTypeFilter, setVisaTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    countryId: '',
    visaTypeId: '',
    eligibilityJson: '',
    requiredDocs: '',
    governmentFee: '',
    feeCurrency: 'USD',
    processingTimeMin: '',
    processingTimeMax: '',
    validityPeriod: '',
    renewalAllowed: false,
    workspaceSchema: '',
  });

  const fetchData = async () => {
    try {
      const [rulesRes, countriesRes, visaTypesRes] = await Promise.all([
        api.get('/admin/crud/countryVisaRule?take=500'),
        api.get('/admin/crud/country?take=300'),
        api.get('/admin/crud/visaType?take=200'),
      ]);
      setRules(rulesRes.data);
      setCountries(countriesRes.data);
      setVisaTypes(visaTypesRes.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load visa rules:', err);
      toast.error('Failed to load visa rules');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCountryName = (id: string) => countries.find((c) => c.id === id)?.name || 'Unknown';
  const getVisaTypeName = (id: string) => visaTypes.find((v) => v.id === id)?.name || 'Unknown';

  const filtered = useMemo(() => {
    return rules.filter((rule) => {
      const countryName = getCountryName(rule.countryId).toLowerCase();
      const visaTypeName = getVisaTypeName(rule.visaTypeId).toLowerCase();
      const matchesSearch =
        countryName.includes(search.toLowerCase()) ||
        visaTypeName.includes(search.toLowerCase());
      const matchesCountry = !countryFilter || rule.countryId === countryFilter;
      const matchesVisaType = !visaTypeFilter || rule.visaTypeId === visaTypeFilter;
      return matchesSearch && matchesCountry && matchesVisaType;
    });
  }, [rules, search, countryFilter, visaTypeFilter, countries, visaTypes]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      countryId: '',
      visaTypeId: '',
      eligibilityJson: '',
      requiredDocs: '',
      governmentFee: '',
      feeCurrency: 'USD',
      processingTimeMin: '',
      processingTimeMax: '',
      validityPeriod: '',
      renewalAllowed: false,
      workspaceSchema: '',
    });
    setShowForm(true);
  };

  const openEdit = (rule: any) => {
    setEditing(rule);
    setForm({
      countryId: rule.countryId,
      visaTypeId: rule.visaTypeId,
      eligibilityJson: typeof rule.eligibilityJson === 'string' ? rule.eligibilityJson : JSON.stringify(rule.eligibilityJson, null, 2),
      requiredDocs: typeof rule.requiredDocs === 'string' ? rule.requiredDocs : JSON.stringify(rule.requiredDocs, null, 2),
      governmentFee: rule.governmentFee ?? '',
      feeCurrency: rule.feeCurrency || 'USD',
      processingTimeMin: rule.processingTimeMin ?? '',
      processingTimeMax: rule.processingTimeMax ?? '',
      validityPeriod: rule.validityPeriod ?? '',
      renewalAllowed: rule.renewalAllowed,
      workspaceSchema: typeof rule.workspaceSchema === 'string' ? rule.workspaceSchema : JSON.stringify(rule.workspaceSchema, null, 2),
    });
    setShowForm(true);
  };

  const validateJson = (value: string, fieldName: string): boolean => {
    if (!value.trim()) return true; // optional
    try {
      JSON.parse(value);
      return true;
    } catch {
      toast.error(`${fieldName} must be valid JSON`);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.countryId || !form.visaTypeId) {
      toast.error('Country and visa type are required');
      return;
    }
    if (!validateJson(form.eligibilityJson, 'Eligibility') ||
        !validateJson(form.requiredDocs, 'Required Documents') ||
        !validateJson(form.workspaceSchema, 'Workspace Schema')) {
      return;
    }
    setSaving(true);
    try {
      const payload = {
        countryId: form.countryId,
        visaTypeId: form.visaTypeId,
        eligibilityJson: form.eligibilityJson ? JSON.parse(form.eligibilityJson) : {},
        requiredDocs: form.requiredDocs ? JSON.parse(form.requiredDocs) : [],
        governmentFee: form.governmentFee === '' ? null : Number(form.governmentFee),
        feeCurrency: form.feeCurrency,
        processingTimeMin: form.processingTimeMin === '' ? null : Number(form.processingTimeMin),
        processingTimeMax: form.processingTimeMax === '' ? null : Number(form.processingTimeMax),
        validityPeriod: form.validityPeriod === '' ? null : Number(form.validityPeriod),
        renewalAllowed: form.renewalAllowed,
        workspaceSchema: form.workspaceSchema ? JSON.parse(form.workspaceSchema) : {},
      };
      if (editing) {
        await api.patch(`/admin/crud/countryVisaRule/${editing.id}`, payload);
        toast.success('Visa rule updated');
      } else {
        await api.post('/admin/crud/countryVisaRule', payload);
        toast.success('Visa rule created');
      }
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save visa rule';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this visa rule?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/crud/countryVisaRule/${id}`);
      toast.success('Visa rule deleted');
      fetchData();
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
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load visa rules.</p>
        <Button variant="outline" className="mt-4" onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#111827]">Visa Rules Management</h2>
          <p className="mt-2 text-sm text-gray-500">Define eligibility, fees, processing times, and documents for each visa rule.</p>
        </div>
        <Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Visa Rule
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by country or visa type..."
            className="pl-9 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={visaTypeFilter}
            onChange={(e) => setVisaTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
          >
            <option value="">All Visa Types</option>
            {visaTypes.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Rules Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No visa rules found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8FAFA]">
                <th className="p-4 text-sm font-medium text-gray-500">Country</th>
                <th className="p-4 text-sm font-medium text-gray-500">Visa Type</th>
                <th className="p-4 text-sm font-medium text-gray-500">Fee</th>
                <th className="p-4 text-sm font-medium text-gray-500">Processing</th>
                <th className="p-4 text-sm font-medium text-gray-500">Validity</th>
                <th className="p-4 text-sm font-medium text-gray-500">Renewal</th>
                <th className="p-4 text-sm font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((rule) => (
                  <motion.tr
                    key={rule.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-gray-100 last:border-0 hover:bg-[#F8FAFA]"
                  >
                    <td className="p-4 text-sm font-medium text-[#111827]">{getCountryName(rule.countryId)}</td>
                    <td className="p-4 text-sm text-gray-600">{getVisaTypeName(rule.visaTypeId)}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {rule.governmentFee ? `${rule.governmentFee} ${rule.feeCurrency}` : '—'}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {rule.processingTimeMin && rule.processingTimeMax
                        ? `${rule.processingTimeMin}-${rule.processingTimeMax} days`
                        : '—'}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {rule.validityPeriod ? `${rule.validityPeriod} months` : '—'}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium',
                        rule.renewalAllowed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      )}>
                        {rule.renewalAllowed ? 'Allowed' : 'Not Allowed'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(rule)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(rule.id)}
                          disabled={deletingId === rule.id}
                        >
                          {deletingId === rule.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-semibold text-[#111827]">
              {editing ? 'Edit Visa Rule' : 'Add Visa Rule'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {editing ? 'Update visa rule details.' : 'Create a new visa rule for a country and visa type.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#111827]">Country</label>
                <select
                  value={form.countryId}
                  onChange={(e) => setForm({ ...form, countryId: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
                  required
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">Visa Type</label>
                <select
                  value={form.visaTypeId}
                  onChange={(e) => setForm({ ...form, visaTypeId: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
                  required
                >
                  <option value="">Select visa type</option>
                  {visaTypes.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Eligibility (JSON)</label>
              <Textarea
                value={form.eligibilityJson}
                onChange={(e) => setForm({ ...form, eligibilityJson: e.target.value })}
                rows={3}
                placeholder='{"minAge": 18, "minIncome": 30000}'
                className="mt-1 font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Required Documents (JSON array)</label>
              <Textarea
                value={form.requiredDocs}
                onChange={(e) => setForm({ ...form, requiredDocs: e.target.value })}
                rows={2}
                placeholder='["Passport", "Proof of Funds"]'
                className="mt-1 font-mono text-xs"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-[#111827]">Government Fee</label>
                <Input
                  type="number"
                  value={form.governmentFee}
                  onChange={(e) => setForm({ ...form, governmentFee: e.target.value })}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">Fee Currency</label>
                <Input
                  value={form.feeCurrency}
                  onChange={(e) => setForm({ ...form, feeCurrency: e.target.value })}
                  placeholder="USD"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">Validity (months)</label>
                <Input
                  type="number"
                  value={form.validityPeriod}
                  onChange={(e) => setForm({ ...form, validityPeriod: e.target.value })}
                  placeholder="12"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#111827]">Processing Min (days)</label>
                <Input
                  type="number"
                  value={form.processingTimeMin}
                  onChange={(e) => setForm({ ...form, processingTimeMin: e.target.value })}
                  placeholder="15"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#111827]">Processing Max (days)</label>
                <Input
                  type="number"
                  value={form.processingTimeMax}
                  onChange={(e) => setForm({ ...form, processingTimeMax: e.target.value })}
                  placeholder="30"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="renewalAllowed"
                checked={form.renewalAllowed}
                onChange={(e) => setForm({ ...form, renewalAllowed: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#0B5D66] focus:ring-[#0B5D66]"
              />
              <label htmlFor="renewalAllowed" className="text-sm font-medium text-[#111827]">Renewal Allowed</label>
            </div>
            <div>
              <label className="text-sm font-medium text-[#111827]">Workspace Schema (JSON)</label>
              <Textarea
                value={form.workspaceSchema}
                onChange={(e) => setForm({ ...form, workspaceSchema: e.target.value })}
                rows={3}
                placeholder='{"formSchema": {...}}'
                className="mt-1 font-mono text-xs"
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