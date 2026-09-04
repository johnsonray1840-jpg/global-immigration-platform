'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getToken, removeToken } from '@/lib/auth';
import api from '@/lib/api-client';
import { LayoutDashboard, Briefcase, FileText, LogOut, MessageSquare, FolderOpen } from 'lucide-react';
import ThemeToggle from '@/components/layout/theme-toggle';

const nav = [
  { label: 'Dashboard', href: '/consultant', icon: LayoutDashboard },
  { label: 'Assigned Cases', href: '/consultant/cases', icon: Briefcase },
  { label: 'Document Review', href: '/consultant/documents', icon: FileText },
  { label: 'Messages', href: '/consultant/messages', icon: MessageSquare },
  { label: 'Workspace', href: '/consultant/workspace', icon: FolderOpen },
];

export default function ConsultantLayout({ children }: { children: React.ReactNode }) {
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
        if (user.role !== 'CONSULTANT' && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
          router.push('/dashboard');
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
    return <div className="flex min-h-screen items-center justify-center">Loading Consultant Portal...</div>;
  }

  return (
    <div className="flex min-h-screen bg-ash-light dark:bg-charcoal">
      <aside className="hidden w-64 flex-col border-r border-silver bg-white p-6 dark:bg-charcoal md:flex">
        <Link href="/" className="font-serif text-xl font-semibold text-charcoal dark:text-white">
          Consultant Portal
        </Link>
        <nav className="mt-10 flex flex-col space-y-2">
          {nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/consultant' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal'
                    : 'text-charcoal hover:bg-ash-light dark:text-white dark:hover:bg-ash-dark'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-silver bg-white p-6 dark:bg-charcoal">
          <h1 className="font-serif text-2xl font-semibold text-charcoal dark:text-white">Consultant Management</h1>
          <ThemeToggle />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}