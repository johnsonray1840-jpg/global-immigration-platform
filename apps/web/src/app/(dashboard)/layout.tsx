'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-display text-xl font-bold text-white tracking-tight">
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
          <Link href="/" className="font-display text-lg font-bold text-white">
            Global<span className="text-sky-400">Citizens</span>
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
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-[#C8A96B]" />
              <span>Dedicated Senior Partner Assigned</span>
            </div>
            <NotificationsBell />
          </div>
        </header>
        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}