'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api-client';
import { SectionHeading } from '@/components/shared/section-heading';
import { GlassCard } from '@/components/shared/glass-card';
import { CalendarDays } from 'lucide-react';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/news')
      .then((res) => {
        setNews(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="py-20">
      <div className="container mx-auto px-6">
        <SectionHeading title="Immigration News & Updates" subtitle="Latest policy changes and visa updates." />
        {loading ? (
          <p className="text-center text-ash-dark">Loading...</p>
        ) : news.length === 0 ? (
          <p className="text-center text-ash-dark">No news published yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`}>
                <GlassCard className="h-full p-6 transition-transform hover:-translate-y-1">
                  <div className="flex items-center gap-2 text-sm text-ash-dark">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                  <h3 className="mt-3 font-serif text-xl font-semibold text-charcoal dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-ash-dark line-clamp-3">{item.summary || item.content}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
