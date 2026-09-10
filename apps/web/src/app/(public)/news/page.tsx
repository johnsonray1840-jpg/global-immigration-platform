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
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-deep-navy via-deep-navy/95 to-atlantic py-16 md:py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,107,0.15),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-white/10">
            <CalendarDays className="h-4 w-4 text-accent" />
            Policy & Industry Insights
          </span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Immigration News & Updates
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Stay informed with the latest global immigration policy changes, visa updates, and country guidelines.
          </p>
        </div>
      </section>

      <div className="container-premium py-12 md:py-16">
        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-64 rounded-2xl"></div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card">
            <p className="text-muted-foreground">No news articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`}>
                <div className="group h-full rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <CalendarDays className="h-4 w-4 text-accent" />
                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">{item.summary || item.content}</p>
                  <div className="mt-4 flex items-center text-xs font-semibold text-primary">
                    Read Article →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
