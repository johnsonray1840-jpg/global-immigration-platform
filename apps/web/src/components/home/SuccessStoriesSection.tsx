'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'John & Sarah Mitchell',
    destination: 'Canada',
    visaType: 'Express Entry – Skilled Worker',
    duration: '6 months',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    text: 'The team was absolutely phenomenal. From the initial assessment to the final landing, every step was handled with precision and care. Our Express Entry profile was optimized perfectly, and we received our invitation to apply within three months. The document preparation was flawless—no requests for additional information. We are now settled in Toronto and couldn’t be happier.',
  },
  {
    name: 'Amina Al-Farsi',
    destination: 'United Kingdom',
    visaType: 'Student Visa (Tier 4)',
    duration: '4 months',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    text: 'I was overwhelmed by the UK student visa process until I found this platform. My advisor helped me choose the right university and even secured a partial scholarship. The application was submitted without a single error, and I received my visa in record time. The guidance on financial documents and accommodation was invaluable. I am now studying at King’s College London, and it’s a dream come true.',
  },
  {
    name: 'Carlos Mendes',
    destination: 'Australia',
    visaType: 'Skilled Independent Visa (Subclass 189)',
    duration: '8 months',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    text: 'I had a complex case due to previous visa refusals. The consultants here did a thorough review, identified the weak points, and built a strong application. They prepared me for the skills assessment and even helped with the English test strategy. When my visa was granted, I literally cried. The level of professionalism and personal attention is unmatched. I recommend them to anyone serious about migrating.',
  },
  {
    name: 'Priya Sharma',
    destination: 'Singapore',
    visaType: 'Employment Pass',
    duration: '3 months',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    text: 'Relocating to Singapore for work seemed impossible until I engaged their services. They streamlined the entire process, from job offer evaluation to pass application. Their knowledge of Singapore’s immigration policies is deep, and they kept me updated at every stage. I moved within three months and am loving my new life.',
  },
  {
    name: 'Dmitri Ivanov',
    destination: 'Germany',
    visaType: 'EU Blue Card',
    duration: '5 months',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
    text: 'As a software engineer, I wanted to move to Germany but didn’t know where to start. The team here provided a clear roadmap, helped me get my degree recognized, and prepared all documents flawlessly. The Blue Card was approved without any hiccups. I am now working at a top tech company in Berlin. Fantastic service!',
  },
  {
    name: 'Yuki Tanaka',
    destination: 'New Zealand',
    visaType: 'Skilled Migrant Category',
    duration: '7 months',
    photo: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=400&auto=format&fit=crop',
    text: 'The process to New Zealand was complex, but their expertise made it feel simple. They guided me through the points system, arranged a job offer, and handled all paperwork. The communication was excellent—always responsive and patient. I am now a permanent resident and loving the Kiwi lifestyle. Thank you for making my dream a reality!',
  },
];

const ITEMS_PER_PAGE = 3;

export default function SuccessStoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);

  const nextPage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalPages);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isPaused, totalPages]);

  const visibleTestimonials = testimonials.slice(
    currentIndex * ITEMS_PER_PAGE,
    currentIndex * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  return (
    <section
      className="relative overflow-hidden py-24 bg-[#0B5D66]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-premium relative z-10">
        <SectionHeading
          title="Success Stories"
          subtitle="Real people, real journeys. Trusted by thousands worldwide."
          className="text-white"
          // titleClassName="text-white"
        />
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {visibleTestimonials.map((story) => (
                <div
                  key={story.name}
                  className="flex h-full flex-col rounded-xl border border-white/20 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-[#C9A96E]/50 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <Quote className="h-8 w-8 text-[#C9A96E]" />
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#C9A96E] text-[#C9A96E]" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-white/90">
                    {story.text}
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                    <Image
                      src={story.photo}
                      alt={story.name}
                      width={44}
                      height={44}
                      className="rounded-full object-cover ring-2 ring-white/20"
                      loading="lazy"
                    />
                    <div>
                      <p className="font-medium text-white">{story.name}</p>
                      <p className="text-xs text-white/70">
                        Moved to {story.destination} • {story.visaType}
                      </p>
                      <p className="text-xs text-white/50">Duration: {story.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prevPage}
            className="absolute -left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-lg transition hover:bg-[#C9A96E]/50 md:block"
            aria-label="Previous stories"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextPage}
            className="absolute -right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-lg transition hover:bg-[#C9A96E]/50 md:block"
            aria-label="Next stories"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-8 flex justify-center space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                'h-2 rounded-full transition-all',
                i === currentIndex ? 'w-6 bg-[#C9A96E]' : 'w-2 bg-white/30 hover:bg-white/50'
              )}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}