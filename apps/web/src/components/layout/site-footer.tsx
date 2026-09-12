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
          <div className="mt-6 space-y-2.5 text-sm text-slate-300">
            <a
              href="https://wa.me/12565858538?text=Hello%20Global%20Citizens%20Solution%2C%20I%20would%20like%20to%20inquire%20about%20your%20immigration%20and%20residency%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp: +1 (256) 585-8538</span>
            </a>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +1 (256) 585-8538</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> support@gcsworldwide.org</p>
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