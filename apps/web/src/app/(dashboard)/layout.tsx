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
} from 'lucide-react';
import { getToken, removeToken } from '@/lib/auth';
import api from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import NotificationsBell from '@/components/notifications/NotificationsBell';
import ThemeToggle from '@/components/layout/theme-toggle';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

const AIChatWidget = dynamic(() => import('@/components/ai/AIChatWidget'), { ssr: false });

const nav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Cases', href: '/dashboard/cases', icon: Briefcase },
  { label: 'Documents', href: '/dashboard/documents', icon: FileText },
  { label: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
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
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFA]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B5D66]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFA]">
      {/* Sidebar (Desktop) */}
      <aside className="hidden w-64 flex-col bg-[#0B5D66] p-6 md:flex">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-display text-2xl font-bold text-white">
            Global<span className="text-[#C9A96E]">Immigration</span>
          </span>
        </Link>

        <nav className="mt-10 flex-1 space-y-1">
          {nav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white text-[#0B5D66] shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#C9A96E]"></span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A96E]/20">
                <User className="h-5 w-5 text-[#C9A96E]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {user?.profile?.firstName || user?.email || 'User'}
                </p>
                <p className="truncate text-xs text-white/60">Client Dashboard</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg md:hidden">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="font-display text-xl font-bold text-[#0B5D66]">
            Global<span className="text-[#C9A96E]">Immigration</span>
          </Link>
          <div className="flex items-center gap-2">
            <NotificationsBell />
            <ThemeToggle />
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2">
          {nav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex shrink-0 items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-[#0B5D66] text-white'
                    : 'bg-[#E8EEEE] text-gray-600 hover:bg-[#C9A96E]/20'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-[104px] md:pt-0">
        <header className="hidden items-center justify-between border-b border-gray-200 bg-white p-6 md:flex">
          <h1 className="font-display text-2xl font-semibold text-[#111827]">Dashboard</h1>
          <div className="flex items-center gap-2">
            <NotificationsBell />
            <ThemeToggle />
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>

      <AIChatWidget />
    </div>
  );
}