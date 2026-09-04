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
    return <div className="py-20 text-center text-ash-dark">Article not found.</div>;
  }

  return (
    <div className="py-20">
      <div className="container mx-auto max-w-3xl px-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <GlassCard className="p-8">
          <div className="flex items-center gap-2 text-sm text-ash-dark">
            <CalendarDays className="h-4 w-4" />
            {new Date(article.createdAt).toLocaleDateString()}
          </div>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-charcoal dark:text-white">
            {article.title}
          </h1>
          {article.imageUrl && (
            <img src={article.imageUrl} alt={article.title} className="mt-6 w-full rounded-lg object-cover" />
          )}
          <div className="mt-6 text-charcoal dark:text-white">{article.content}</div>
        </GlassCard>
      </div>
    </div>
  );
}
