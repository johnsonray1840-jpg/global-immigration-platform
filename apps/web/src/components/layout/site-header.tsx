'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LanguageSwitcher from './language-switcher';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu, Home, Globe2, FileText, ShieldCheck, User, LayoutDashboard, LogOut,
  GraduationCap, Package, HelpCircle, ChevronDown,
} from 'lucide-react';
import ThemeToggle from './theme-toggle';
import { getToken, removeToken } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default function SiteHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setIsLoggedIn(!!getToken()); }, [pathname]);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { removeToken(); setIsLoggedIn(false); router.push('/'); };

  const mainNav = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Countries', href: '/countries', icon: Globe2 },
    { label: 'Compare', href: '/compare', icon: FileText },
    { label: 'Eligibility', href: '/eligibility', icon: ShieldCheck },
    { label: 'Packages', href: '/packages', icon: Package },
    { label: 'Scholarships', href: '/scholarships', icon: GraduationCap },
    { label: 'FAQ', href: '/faq', icon: HelpCircle },
    { label: 'About', href: '/about', icon: User },
  ];

  const programLinks = [
    { label: 'All Programs', href: '/programs' },
    { label: 'Permanent Residence', href: '/programs/permanent-residence' },
    { label: 'Citizenship by Investment', href: '/programs/citizenship-by-investment' },
    { label: 'Work Permit', href: '/programs/work-permit' },
    { label: 'Student Immigration', href: '/programs/student-immigration' },
    { label: 'Family Sponsorship', href: '/programs/family-sponsorship' },
    { label: 'Skilled Worker', href: '/programs/skilled-worker' },
  ];

  const isProgramActive = pathname.startsWith('/programs');

  return (
    <header className={cn(
      'sticky top-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-background/90 dark:bg-deep-navy/90 backdrop-blur-md border-b border-border shadow-xs'
        : 'bg-transparent'
    )}>
      <div className="container-premium flex h-16 md:h-20 items-center justify-between">
        {/* Brand */}
        <Link href="/" className="font-display text-xl md:text-2xl font-bold text-primary tracking-tight">
          Global<span className="text-accent">Citizens</span> Solution
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-primary font-semibold'
                  : 'text-foreground/80'
              )}
            >
              {item.label}
            </Link>
          ))}

          {/* Programs Accessible Radix Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(
              'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary outline-hidden cursor-pointer',
              isProgramActive ? 'text-primary font-semibold' : 'text-foreground/80'
            )}>
              Programs <ChevronDown className="h-4 w-4 opacity-70 transition-transform duration-200" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-1.5 bg-popover text-popover-foreground border-border shadow-lg rounded-xl">
              {programLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center w-full px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors',
                      pathname === link.href
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground/90 hover:bg-muted hover:text-primary'
                    )}
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher />
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-foreground/80 hover:text-sky-400 transition-colors"
              >
                Dashboard
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-foreground/80 hover:text-sky-400 transition-colors px-2 py-1"
              >
                Sign In
              </Link>
              <Link href="/register">
                <Button variant="outline" className="border-sky-500/40 text-sky-300 hover:bg-sky-500/10 hover:border-sky-400 font-medium">
                  Register
                </Button>
              </Link>
              <Link href="/consultation">
                <Button className="btn-gold font-semibold shadow-xs">
                  Book Consultation
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile top bar actions */}
        <div className="lg:hidden flex items-center gap-2">
          {!isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-sky-200 hover:text-white hover:bg-sky-500/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="h-8 px-3 text-xs btn-sky font-semibold rounded-lg shadow-sm">
                  Register
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/dashboard">
              <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs border-sky-500/40 text-sky-300">
                Dashboard
              </Button>
            </Link>
          )}

          <LanguageSwitcher />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open Navigation Menu" className="h-9 w-9 text-sky-200 hover:text-white hover:bg-sky-500/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-84 max-w-[90vw] p-0 bg-[#030D1A]/95 backdrop-blur-2xl text-foreground border-r border-sky-500/20 flex flex-col justify-between"
            >
              <div>
                <div className="p-5 border-b border-sky-500/15 flex items-center justify-between">
                  <SheetTitle className="font-display text-xl font-bold text-sky-400 tracking-tight">
                    Global<span className="text-accent">Citizens</span> Solution
                  </SheetTitle>
                </div>
                <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 min-h-[48px] px-4 rounded-xl text-base font-medium transition-all',
                        pathname === item.href
                          ? 'bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30'
                          : 'text-foreground/90 hover:bg-white/5 hover:text-sky-300'
                      )}
                    >
                      <item.icon className="h-5 w-5 text-sky-400 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  <div className="pt-3 mt-3 border-t border-sky-500/15">
                    <p className="px-4 text-xs font-semibold uppercase tracking-wider text-sky-400/80 mb-2">
                      Immigration & Investment Programs
                    </p>
                    {programLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center min-h-[44px] px-4 rounded-xl text-sm transition-all',
                          pathname === link.href
                            ? 'text-sky-300 font-medium bg-sky-500/15 border border-sky-500/25'
                            : 'text-foreground/80 hover:bg-white/5 hover:text-sky-300'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>
              </div>

              {/* Bottom Drawer CTA */}
              <div className="p-4 border-t border-sky-500/15 bg-black/40 space-y-2">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 min-h-[48px] px-4 rounded-xl text-base font-medium text-foreground hover:text-sky-300 hover:bg-white/5"
                    >
                      <LayoutDashboard className="h-5 w-5 text-sky-400" /> Dashboard
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="w-full min-h-[48px] justify-start text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center min-h-[44px] rounded-xl text-sm font-medium border border-sky-500/30 text-sky-200 hover:bg-sky-500/10"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center min-h-[44px] rounded-xl text-sm font-medium btn-sky"
                      >
                        Register
                      </Link>
                    </div>
                    <Link href="/consultation" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full min-h-[48px] btn-gold font-semibold shadow-md">
                        Book Consultation
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}