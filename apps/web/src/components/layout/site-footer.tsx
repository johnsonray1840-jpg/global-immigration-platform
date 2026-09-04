'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api-client';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export default function SiteFooter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/newsletter/subscribe', { email });
      toast.success('Subscribed successfully');
      setEmail('');
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
    } catch (error) {
      toast.error('Subscription failed');
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#0b1e3a] to-[#0a1a30] text-dark-foreground">
      <div className="container-premium grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="font-display text-2xl font-bold text-white">
            Global<span className="text-primary">Immigration</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Government‑approved immigration consultancy with 50+ years of combined expertise.
            Your trusted partner for global mobility.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-lg font-semibold text-white">{t('nav.programs')}</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/countries" className="text-white/70 transition-colors hover:text-primary">{t('nav.countries')}</Link></li>
            <li><Link href="/programs" className="text-white/70 transition-colors hover:text-primary">{t('nav.programs')}</Link></li>
            <li><Link href="/packages" className="text-white/70 transition-colors hover:text-primary">{t('nav.packages')}</Link></li>
            <li><Link href="/scholarships" className="text-white/70 transition-colors hover:text-primary">{t('nav.scholarships')}</Link></li>
            <li><Link href="/faq" className="text-white/70 transition-colors hover:text-primary">{t('nav.faq')}</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-display text-lg font-semibold text-white">Legal</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/legal/privacy" className="text-white/70 transition-colors hover:text-primary">{t('footer.privacy')}</Link></li>
            <li><Link href="/legal/terms" className="text-white/70 transition-colors hover:text-primary">{t('footer.terms')}</Link></li>
            <li><Link href="/legal/cookies" className="text-white/70 transition-colors hover:text-primary">{t('footer.cookies')}</Link></li>
            <li><Link href="/legal/disclaimer" className="text-white/70 transition-colors hover:text-primary">{t('footer.disclaimer')}</Link></li>
          </ul>
        </div>

        {/* Newsletter & Contact */}
        <div>
          <h4 className="font-display text-lg font-semibold text-white">Stay Updated</h4>
          <p className="mt-4 text-sm text-white/70">Get immigration updates and policy changes.</p>
          <form onSubmit={subscribe} className="mt-4">
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full rounded-l-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none transition-colors focus:border-primary"
                required
              />
              <button
                type="submit"
                className="flex items-center rounded-r-md bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                {subscribed ? <CheckCircle2 className="h-4 w-4" /> : 'Subscribe'}
              </button>
            </div>
          </form>
          <div className="mt-6 space-y-2 text-sm text-white/70">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@globalimmigration.com</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (555) 123-4567</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> New York, London, Doha, Dubai</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-premium flex flex-col items-center justify-between gap-4 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Global Immigration Services. {t('footer.rights')}</p>
          <div className="flex gap-4">
            <Link href="/sitemap" className="hover:text-primary">Sitemap</Link>
            <Link href="/accessibility" className="hover:text-primary">{t('accessibility.title')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}