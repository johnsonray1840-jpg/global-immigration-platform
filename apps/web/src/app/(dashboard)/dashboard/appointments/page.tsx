'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, any> = {
  VIDEO: Video,
  PHONE: Phone,
  OFFICE: MapPin,
};

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState<'UPCOMING' | 'PAST' | 'ALL'>('UPCOMING');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/appointments')
      .then((res) => {
        setAppointments(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load appointments');
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
    if (!confirm('Cancel this appointment?')) return;
    setCancellingId(id);
    try {
      await api.patch(`/appointments/${id}/cancel`);
      toast.success('Appointment cancelled');
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
        <div className="skeleton h-8 w-64"></div>
        <div className="skeleton h-12 w-full max-w-md"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-40 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-foreground">
            My Appointments
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your consultation schedule.
          </p>
        </div>
        <Link href="/consultation">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 btn-glow">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Book Consultation
          </Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['UPCOMING', 'PAST', 'ALL'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-medium transition-all',
              filter === tab
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
            )}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Appointments grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            No {filter.toLowerCase()} appointments.
          </p>
          <Link href="/consultation">
            <Button variant="outline" className="mt-6">
              Book Consultation <CalendarPlus className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                  <GlassCard className="p-6 transition-shadow hover:shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <TypeIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {new Date(appt.scheduledAt).toLocaleDateString(undefined, {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {new Date(appt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {appt.consultant?.user?.email || 'Consultant'}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Type: {appt.type} • Duration: {appt.durationMin || 60} min
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={cn('border', statusColors[appt.status] || 'bg-gray-100 text-gray-700 border-gray-200')}>
                          {appt.status}
                        </Badge>
                        {appt.status === 'SCHEDULED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(appt.id)}
                            disabled={cancellingId === appt.id}
                            className="text-red-600 hover:bg-red-50"
                          >
                            {cancellingId === appt.id ? (
                              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            ) : (
                              <XCircle className="mr-1 h-4 w-4" />
                            )}
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}