'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  User,
  CalendarPlus,
  XCircle,
  CheckCircle2,
  Loader2,
  Video,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, any> = {
  VIDEO: Video,
  PHONE: Phone,
  OFFICE: MapPin,
};

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  COMPLETED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  CANCELLED: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState<'UPCOMING' | 'PAST' | 'ALL'>('UPCOMING');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/appointments')
      .then((res) => {
        setAppointments(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setAppointments([]);
        setLoading(false);
      });
  }, []);

  const now = new Date();
  const filtered = appointments.filter((appt) => {
    const apptDate = new Date(appt.scheduledAt);
    if (filter === 'UPCOMING') return apptDate >= now && appt.status === 'SCHEDULED';
    if (filter === 'PAST') return apptDate < now || appt.status === 'COMPLETED';
    return true;
  });

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this consultation session?')) return;
    setCancellingId(id);
    try {
      await api.patch(`/appointments/${id}/cancel`);
      toast.success('Consultation cancelled successfully');
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a)));
    } catch (error) {
      toast.error('Cancellation failed');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 bg-sky-950/40" />
        <Skeleton className="h-12 w-72 bg-sky-950/40" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-44 rounded-2xl bg-sky-950/40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-0.5 text-xs font-semibold text-sky-400 border border-sky-500/20">
              <Sparkles className="h-3 w-3 text-[#C8A96B]" /> VIP Private Advisory
            </span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            Senior Partner Consultations
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Schedule and manage private legal and financial structuring video calls.
          </p>
        </div>
        <Link href="/consultation">
          <Button className="btn-sky text-xs font-bold px-4 py-2 shadow-lg shadow-sky-500/20">
            <CalendarPlus className="mr-1.5 h-4 w-4" /> Book New Session
          </Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 bg-[#030D1A] p-1 rounded-xl border border-sky-500/20 w-fit">
        {(['UPCOMING', 'PAST', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              'rounded-lg px-4 py-1.5 text-xs font-semibold transition-all duration-200',
              filter === tab
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                : 'text-slate-400 hover:text-white'
            )}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Appointments grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sky-500/20 bg-[#0A1F38]/40 p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-sky-400/40" />
          <p className="mt-4 text-base font-semibold text-white">
            No {filter.toLowerCase()} advisory sessions found
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Schedule a dedicated 1-on-1 strategy session with our senior immigration counsel.
          </p>
          <Link href="/consultation">
            <Button className="mt-6 btn-sky text-xs font-bold">
              Schedule Consultation <CalendarPlus className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AnimatePresence>
            {filtered.map((appt) => {
              const TypeIcon = typeIcons[appt.type] || Phone;
              return (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-2xl border border-sky-500/20 bg-[#0A1F38]/80 p-6 shadow-xl backdrop-blur-md hover:border-sky-400/40 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20">
                          <TypeIcon className="h-6 w-6 text-sky-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-base">
                            {new Date(appt.scheduledAt).toLocaleDateString(undefined, {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-sky-300 font-mono font-medium">
                            <Clock className="h-3.5 w-3.5 text-[#C8A96B]" />
                            {new Date(appt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {appt.durationMin || 45} mins
                          </p>
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-300">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            Advisor: <span className="text-white font-medium">{appt.consultant?.user?.email || 'Senior Mobility Counsel'}</span>
                          </p>
                          <p className="mt-1 text-[11px] text-slate-400">
                            Format: {appt.type === 'VIDEO' ? 'Encrypted HD Video Call' : appt.type === 'PHONE' ? 'Private Phone Bridge' : 'Diplomatic Office Suite'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2.5">
                        <Badge className={cn('border text-xs px-2.5 py-0.5 font-semibold', statusColors[appt.status] || statusColors.SCHEDULED)}>
                          {appt.status}
                        </Badge>
                        {appt.status === 'SCHEDULED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(appt.id)}
                            disabled={cancellingId === appt.id}
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs h-7 px-2.5"
                          >
                            {cancellingId === appt.id ? (
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            ) : (
                              <XCircle className="mr-1 h-3.5 w-3.5" />
                            )}
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}