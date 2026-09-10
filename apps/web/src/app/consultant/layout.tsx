'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getToken, removeToken } from '@/lib/auth';
import api from '@/lib/api-client';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  LogOut,
  MessageSquare,
  FolderOpen,
  Menu,
} from 'lucide-react';
import ThemeToggle from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

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
  const [mobileOpen, setMobileOpen] = useState(false);

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar (Desktop) */}
      <aside className="hidden w-64 flex-col bg-deep-navy border-r border-border/20 p-6 md:flex">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-display text-xl font-bold text-white tracking-tight">
            Global<span className="text-accent">Citizens</span>
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-semibold">
            Consultant
          </span>
        </Link>
        <nav className="mt-10 flex flex-col space-y-1.5 flex-1">
          {nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/consultant' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"></span>}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center space-x-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/90 dark:bg-deep-navy/90 backdrop-blur-lg flex items-center justify-between p-4 md:hidden">
          <div className="flex items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open Navigation Menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-deep-navy text-white border-r border-border/20 flex flex-col justify-between">
                <div>
                  <div className="p-5 border-b border-white/10">
                    <SheetTitle className="font-display text-xl font-bold text-white tracking-tight">
                      Global<span className="text-accent">Citizens</span> Consultant
                    </SheetTitle>
                  </div>
                  <nav className="p-4 space-y-1.5">
                    {nav.map((item) => {
                      const isActive = pathname === item.href || (item.href !== '/consultant' && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            'flex items-center space-x-3 min-h-[48px] rounded-xl px-3.5 text-base font-medium transition-colors',
                            isActive
                              ? 'bg-primary text-white font-semibold'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
                <div className="p-4 border-t border-white/10">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full min-h-[48px] justify-start text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <LogOut className="mr-2 h-5 w-5" /> Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <span className="font-display text-lg font-bold text-primary">
              Global<span className="text-accent">Citizens</span>
            </span>
          </div>
          <ThemeToggle />
        </div>

        {/* Desktop Header */}
        <header className="hidden items-center justify-between border-b border-border bg-card p-6 md:flex">
          <h1 className="font-display text-2xl font-semibold text-foreground">Consultant Management</h1>
          <ThemeToggle />
        </header>

        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}