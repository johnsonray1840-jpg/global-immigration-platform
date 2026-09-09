'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getToken, removeToken } from '@/lib/auth';
import api from '@/lib/api-client';
import {
  LayoutDashboard,
  Users,
  Globe2,
  FileText,
  Wallet,
  BarChart3,
  LogOut,
  Landmark,
  Star,
  Newspaper,
  Tag,
  Coins,
  ScrollText,
  CheckSquare,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import ThemeToggle from '@/components/layout/theme-toggle';
import { cn } from '@/lib/utils';

const nav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Payment Approvals', href: '/admin/approvals', icon: CheckSquare },
  { label: 'Users & Roles', href: '/admin/users', icon: Users },
  { label: 'Countries', href: '/admin/countries', icon: Globe2 },
  { label: 'Visa Rules', href: '/admin/visa-rules', icon: FileText },
  { label: 'Cases', href: '/admin/cases', icon: Briefcase },               
  { label: 'Scholarships', href: '/admin/scholarships', icon: GraduationCap },
  { label: 'Payment Methods', href: '/admin/payments', icon: Wallet },
  { label: 'Wire Accounts', href: '/admin/wire-accounts', icon: Landmark },
  { label: 'Crypto Wallets', href: '/admin/crypto-wallets', icon: Coins },
  { label: 'Promotions', href: '/admin/promotions', icon: Tag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'FAQs', href: '/admin/faqs', icon: FileText },
  { label: 'Consultants', href: '/admin/consultants', icon: Users },
  { label: 'Offices', href: '/admin/offices', icon: Globe2 },
  { label: 'Partners', href: '/admin/partners', icon: Users },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { label: 'News', href: '/admin/news', icon: Newspaper },
  { label: 'Pages', href: '/admin/pages', icon: FileText },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    api
      .get('/users/me')
      .then((res) => {
        const user = res.data;
        const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'FINANCE', 'COMPLIANCE', 'SUPPORT', 'CONTENT_EDITOR'];
        if (!allowedRoles.includes(user.role)) {
          router.push(user.role === 'CONSULTANT' ? '/consultant' : '/dashboard');
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        removeToken();
        router.push('/login');
      });
  }, [router]);

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
          <span className="font-display text-xl font-bold text-white">
            Admin<span className="text-[#C9A96E]">Panel</span>
          </span>
        </Link>

        <nav className="mt-8 flex-1 space-y-1 overflow-y-auto pr-1">
          {nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white text-[#0B5D66] shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#C9A96E]"></span>}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex w-full items-center space-x-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Top Bar */}
        <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg md:hidden">
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="font-display text-xl font-bold text-[#0B5D66]">
              Admin<span className="text-[#C9A96E]">Panel</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-4 pb-2">
            {nav.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
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

        {/* Desktop Header */}
        <header className="hidden items-center justify-between border-b border-gray-200 bg-white p-6 md:flex">
          <h1 className="font-display text-2xl font-semibold text-[#111827]">Administration</h1>
          <ThemeToggle />
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}