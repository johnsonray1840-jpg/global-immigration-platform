'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/shared/glass-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { toast } from 'sonner';
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  Video,
  MapPin,
  Check,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ConsultationPage() {
  const router = useRouter();
  const [consultants, setConsultants] = useState<any[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/consultants')
      .then((res) => setConsultants(res.data))
      .catch(() => toast.error('Failed to load consultants'));
  }, []);

  const fetchSlots = async () => {
    if (!selectedConsultant || !date) return;
    setLoadingSlots(true);
    try {
      const res = await api.get(`/appointments/availability/${selectedConsultant}?date=${date}`);
      setSlots(res.data);
      setSelectedSlot('');
    } catch (error) {
      toast.error('Failed to load availability');
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (selectedConsultant && date) {
      fetchSlots();
    }
  }, [selectedConsultant, date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/appointments', {
        consultantId: selectedConsultant,
        scheduledAt: selectedSlot,
        type: 'PHONE',
        notes,
      });
      toast.success('Consultation booked successfully');
      router.push('/dashboard/appointments');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed. Please login and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-16 md:py-20">
      <div className="container-premium">
        <SectionHeading
          title="Book a Consultation"
          subtitle="Speak with a licensed immigration advisor at a time that suits you."
        />

        <div className="mx-auto max-w-4xl">
          <GlassCard className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Choose Consultant */}
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  1. Choose Your Consultant
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {consultants.map((consultant) => {
                    const isSelected = selectedConsultant === consultant.id;
                    return (
                      <button
                        key={consultant.id}
                        type="button"
                        onClick={() => setSelectedConsultant(consultant.id)}
                        className={cn(
                          'rounded-xl border p-4 text-left transition-all duration-200',
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-border bg-card hover:border-primary/50 hover:bg-muted'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {consultant.user?.profile?.firstName || 'Consultant'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {consultant.specialities?.join(', ') || 'Immigration Advisor'}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-2 flex items-center text-sm text-primary"
                          >
                            <Check className="mr-1 h-4 w-4" /> Selected
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose Date */}
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  2. Select a Date
                </h3>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-4 w-full rounded-lg border border-input bg-card px-4 py-3 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                  required
                />
              </div>

              {/* Step 3: Choose Time Slot */}
              <AnimatePresence>
                {selectedConsultant && date && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      3. Pick a Time Slot
                    </h3>
                    {loadingSlots ? (
                      <div className="mt-4 flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : slots.length > 0 ? (
                      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                        {slots.map((slot) => {
                          const isSelected = selectedSlot === slot.start;
                          return (
                            <button
                              key={slot.start}
                              type="button"
                              onClick={() => setSelectedSlot(slot.start)}
                              className={cn(
                                'rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                  : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted'
                              )}
                            >
                              {new Date(slot.start).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-4 rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground">
                        No available slots for this date. Please try another day.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Notes */}
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Additional Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Tell us about your immigration goals or any specific questions..."
                  className="mt-4 w-full rounded-lg border border-input bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting || !selectedSlot}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 btn-glow py-3 text-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    Book Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}