'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api-client';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function SiteFooter() {
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
    <footer className="bg-gradient-to-b from-deep-navy to-[#030B12] text-slate-200 border-t border-border/20">
      <div className="container-premium grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="font-display text-2xl font-bold text-white tracking-tight">
            Global<span className="text-accent">Citizens</span> Solution
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Government‑approved immigration and citizenship by investment consultancy with 50+ years of combined expertise.
            Your trusted partner for global mobility.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-lg font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/countries" className="text-slate-400 transition-colors hover:text-accent">Countries</Link></li>
            <li><Link href="/programs" className="text-slate-400 transition-colors hover:text-accent">Programs</Link></li>
            <li><Link href="/packages" className="text-slate-400 transition-colors hover:text-accent">Packages</Link></li>
            <li><Link href="/scholarships" className="text-slate-400 transition-colors hover:text-accent">Scholarships</Link></li>
            <li><Link href="/faq" className="text-slate-400 transition-colors hover:text-accent">FAQ</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-display text-lg font-semibold text-white">Legal</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/legal/privacy" className="text-slate-400 transition-colors hover:text-accent">Privacy Policy</Link></li>
            <li><Link href="/legal/terms" className="text-slate-400 transition-colors hover:text-accent">Terms of Service</Link></li>
            <li><Link href="/legal/cookies" className="text-slate-400 transition-colors hover:text-accent">Cookie Policy</Link></li>
            <li><Link href="/legal/disclaimer" className="text-slate-400 transition-colors hover:text-accent">Immigration Disclaimer</Link></li>
          </ul>
        </div>

        {/* Newsletter & Contact */}
        <div>
          <h4 className="font-display text-lg font-semibold text-white">Stay Updated</h4>
          <p className="mt-4 text-sm text-slate-400">Get immigration updates and policy changes.</p>
          <form onSubmit={subscribe} className="mt-4">
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full rounded-l-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                required
              />
              <button
                type="submit"
                className="flex items-center rounded-r-md bg-accent text-deep-navy font-semibold px-4 py-3 text-sm transition-colors hover:bg-gold-light"
              >
                {subscribed ? <CheckCircle2 className="h-4 w-4" /> : 'Subscribe'}
              </button>
            </div>
          </form>
          <div className="mt-6 space-y-2 text-sm text-slate-400">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> support@ctcorporationbusiness.com</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +1 (555) 123-4567</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> New York, London, Doha, Dubai</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-premium flex flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Global Citizens Solution. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/sitemap" className="hover:text-accent transition-colors">Sitemap</Link>
            <Link href="/accessibility" className="hover:text-accent transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}