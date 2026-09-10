'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api-client';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays } from 'lucide-react';

export default function NewsDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    if (id) {
      api.get(`/news/${id}`).then((res) => setArticle(res.data)).catch(() => {});
    }
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background py-20 text-center flex flex-col items-center justify-center">
        <p className="text-xl font-display font-semibold text-foreground">Article not found</p>
        <Button variant="ghost" onClick={() => router.push('/news')} className="mt-4 text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-16 md:py-20">
      <div className="container-premium max-w-3xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <article className="rounded-2xl border border-border bg-card text-card-foreground p-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-accent" />
            {new Date(article.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {article.title}
          </h1>
          {article.imageUrl && (
            <img src={article.imageUrl} alt={article.title} className="mt-6 w-full rounded-xl object-cover max-h-96" />
          )}
          <div className="mt-8 text-base leading-relaxed text-foreground/90 whitespace-pre-line space-y-4">
            {article.content}
          </div>
        </article>
      </div>
    </div>
  );
}
