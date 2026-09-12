'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  Wallet,
  MessagesSquare,
  Settings,
  LogOut,
  Gift,
  FolderOpen,
  User,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getToken, removeToken } from '@/lib/auth';
import api from '@/lib/api-client';
import NotificationsBell from '@/components/notifications/NotificationsBell';
import { cn } from '@/lib/utils';

const nav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Cases', href: '/dashboard/cases', icon: Briefcase },
  { label: 'Documents', href: '/dashboard/documents', icon: FileText },
  { label: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  { label: 'Wallet & Escrow', href: '/dashboard/wallet', icon: Wallet },
  { label: 'Messages', href: '/dashboard/messages', icon: MessagesSquare },
  { label: 'Referrals', href: '/dashboard/referral', icon: Gift },
  { label: 'Workspace', href: '/dashboard/workspace', icon: FolderOpen },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    api.get('/users/me')
      .then((res) => {
        const user = res.data;
        setUser(user);

        if (user.role !== 'CLIENT') {
          router.push(user.role === 'CONSULTANT' ? '/consultant' : '/admin');
          return;
        }

        if (!user.onboardingCompleted && pathname !== '/dashboard/onboarding') {
          router.push('/dashboard/onboarding');
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        removeToken();
        router.push('/login');
      });
  }, [router, pathname]);

  const handleLogout = () => {
    removeToken();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030D1A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  // Determine current page title
  const currentNav = nav.find((item) => item.href === pathname || (item.href !== '/dashboard' && pathname.startsWith(item.href)));
  const pageTitle = currentNav ? currentNav.label : 'Private Client Portal';

  return (
    <div className="flex min-h-screen bg-[#030D1A] text-white">
      {/* Sidebar (Desktop) */}
      <aside className="hidden w-64 flex-col bg-[#030D1A]/95 border-r border-sky-500/20 p-6 md:flex backdrop-blur-xl shadow-2xl">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-sky-400/40 shadow-md shrink-0 bg-[#030D1A]">
            <Image
              src="/logo.png"
              alt="Global Citizens Solution"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="font-display text-lg font-bold text-white tracking-tight">
            Global<span className="text-sky-400">Citizens</span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
            PRO
          </span>
        </Link>

        <nav className="mt-8 flex-1 space-y-1.5">
          {nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/20 to-sky-400/10 text-white border border-sky-400/40 shadow-[0_0_15px_rgba(56,189,248,0.15)] font-semibold'
                    : 'text-slate-400 hover:bg-[#0A1F38] hover:text-white'
                )}
              >
                <item.icon className={cn('h-5 w-5 shrink-0 transition-colors', isActive ? 'text-sky-400' : 'text-slate-400')} />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="border-t border-sky-500/20 pt-4">
            <div className="flex items-center space-x-3 rounded-xl bg-[#0A1F38]/80 border border-sky-500/20 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30">
                <User className="h-5 w-5 text-sky-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">
                  {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ''}` : user?.email || 'Private Client'}
                </p>
                <p className="truncate text-[11px] text-[#C8A96B] flex items-center gap-1 font-medium">
                  <ShieldCheck className="h-3 w-3" /> Tier-1 Verified
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-sky-500/20 bg-[#030D1A]/95 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-sky-400/40 shadow-md shrink-0 bg-[#030D1A]">
              <Image
                src="/logo.png"
                alt="Global Citizens Solution"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-display text-base font-bold text-white">
              Global<span className="text-sky-400">Citizens</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationsBell />
          </div>
        </div>
        <nav className="flex gap-1.5 overflow-x-auto px-4 pb-2.5 scrollbar-none">
          {nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex shrink-0 items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'bg-[#0A1F38] text-slate-300 hover:text-white border border-sky-500/10'
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pt-[104px] md:pt-0">
        <header className="hidden items-center justify-between border-b border-sky-500/20 bg-[#030D1A]/80 backdrop-blur-md px-8 py-5 md:flex">
          <div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">{pageTitle}</h1>
            <p className="text-xs text-slate-400">Private Global Mobility & Immigration Hub</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/12565858538?text=Hello%20Global%20Citizens%20Solution%2C%20I%20am%20a%20private%20client%20requesting%20priority%20case%20advisory."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold hover:bg-emerald-500/20 hover:border-emerald-400 transition-all shadow-xs"
            >
              <svg className="h-3.5 w-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>VIP WhatsApp Counsel</span>
            </a>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-[#C8A96B]" />
              <span>Senior Partner Assigned</span>
            </div>
            <NotificationsBell />
          </div>
        </header>
        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}