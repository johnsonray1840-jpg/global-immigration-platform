'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  CreditCard,
  Landmark,
  Coins,
  Pencil,
  Save,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const [methods, setMethods] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchMethods = async () => {
    try {
      const res = await api.get('/admin/payment-methods');
      setMethods(res.data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Failed to load payment methods:', err);
      toast.error('Failed to load payment methods');
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const toggleMethod = async (id: string, currentActive: boolean) => {
    setSavingId(id);
    try {
      await api.patch(`/admin/payment-methods/${id}`, { isActive: !currentActive });
      toast.success(`Payment method ${currentActive ? 'suspended' : 'activated'}`);
      fetchMethods();
    } catch {
      toast.error('Update failed');
    } finally {
      setSavingId(null);
    }
  };

  const startEdit = (method: any) => {
    setEditingId(method.id);
    setEditMessage(method.suspensionMessage || '');
  };

  const saveEdit = async (id: string) => {
    setSavingId(id);
    try {
      await api.patch(`/admin/payment-methods/${id}`, { suspensionMessage: editMessage });
      toast.success('Suspension message updated');
      setEditingId(null);
      fetchMethods();
    } catch {
      toast.error('Update failed');
    } finally {
      setSavingId(null);
    }
  };

  const iconFor = (type: string) => {
    switch (type) {
      case 'CARD':
        return <CreditCard className="h-8 w-8 text-[#0B5D66]" />;
      case 'BANK_TRANSFER':
        return <Landmark className="h-8 w-8 text-[#0B5D66]" />;
      case 'CRYPTO':
        return <Coins className="h-8 w-8 text-[#0B5D66]" />;
      case 'PAYPAL':
        return <CreditCard className="h-8 w-8 text-[#0B5D66]" />;
      default:
        return <CreditCard className="h-8 w-8 text-[#0B5D66]" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-56 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-gray-500">Failed to load payment methods.</p>
        <Button variant="outline" className="mt-4" onClick={fetchMethods}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl font-semibold text-[#111827]">
          Payment Methods Management
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Control which payment methods are available to clients. Suspended methods show a premium message.
        </p>
      </div>

      {/* Grid */}
      {methods.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-500">No payment methods configured.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {methods.map((method) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {iconFor(method.type)}
                      <div>
                        <h3 className="font-display text-xl font-semibold text-[#111827]">
                          {method.displayName}
                        </h3>
                        <p className="text-xs text-gray-500">{method.type}</p>
                      </div>
                    </div>
                    <Switch
                      checked={method.isActive}
                      onCheckedChange={() => toggleMethod(method.id, method.isActive)}
                      disabled={savingId === method.id}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={cn(
                        'border',
                        method.isActive
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : 'border-red-200 bg-red-50 text-red-700'
                      )}
                    >
                      {method.isActive ? 'Active' : 'Suspended'}
                    </Badge>
                    {!method.isActive && (
                      <Button variant="ghost" size="sm" onClick={() => startEdit(method)} className="text-gray-600 hover:text-[#0B5D66]">
                        <Pencil className="mr-1 h-4 w-4" /> Edit Message
                      </Button>
                    )}
                  </div>

                  {/* Edit suspension message */}
                  {editingId === method.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4"
                    >
                      <textarea
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#0B5D66] focus:ring-2 focus:ring-[#0B5D66]/30"
                        placeholder="Enter suspension message..."
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingId(null)} className="text-gray-600">
                          <X className="mr-1 h-4 w-4" /> Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => saveEdit(method.id)}
                          disabled={savingId === method.id}
                          className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]"
                        >
                          {savingId === method.id ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
                          Save
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Suspension message display */}
                  {!method.isActive && editingId !== method.id && (
                    <p className="mt-4 text-sm italic text-gray-500">
                      "{method.suspensionMessage || 'This payment method is temporarily unavailable. Please try again later.'}"
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}