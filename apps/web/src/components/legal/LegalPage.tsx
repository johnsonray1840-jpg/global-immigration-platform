'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api-client';
import { SectionHeading } from '@/components/shared/section-heading';
import { Loader2 } from 'lucide-react';

export default function LegalPage({ slug }: { slug: string }) {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/pages/${slug}`)
      .then((res) => {
        setPage(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-ash-dark" />
      </div>
    );
  }

  if (!page) {
    return <div className="py-20 text-center text-ash-dark">Page not found.</div>;
  }

  return (
    <div>
      <SectionHeading title={page.title} />
      <div className="prose prose-lg max-w-none text-charcoal dark:text-white">
        {typeof page.content === 'string' ? page.content : JSON.stringify(page.content)}
      </div>
    </div>
  );
}
