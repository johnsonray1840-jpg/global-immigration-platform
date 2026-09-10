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
} from '@/components/ui/sheet';
import {
  Menu, X, Home, Globe2, FileText, ShieldCheck, User, LayoutDashboard, LogOut,
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
  const [programsOpen, setProgramsOpen] = useState(false);

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
    { label: "compare", href: '/compare', icon: FileText },
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

  return (
    <header className={cn(
      'sticky top-0 z-50 transition-all duration-300',
      scrolled ? 'bg-white/95 shadow-md backdrop-blur-lg border-b border-gray-200' : 'bg-transparent'
    )}>
      <div className="container-premium flex h-16 md:h-20 items-center justify-between">
        <Link href="/" className="font-display text-xl md:text-2xl font-bold text-[#0B5D66]">
          Global<span className="text-[#C9A96E]">Citizens</span> Solution
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className={cn('text-sm font-medium', pathname === item.href ? 'text-[#0B5D66]' : 'text-gray-700 hover:text-[#0B5D66]')}>
              {item.label}
            </Link>
          ))}
          {/* Programs Dropdown */}
          <div className="relative" onMouseEnter={() => setProgramsOpen(true)} onMouseLeave={() => setProgramsOpen(false)}>
            <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#0B5D66]">
              Programs <ChevronDown className="h-4 w-4" />
            </button>
            {programsOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                {programLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-[#F8FAFA] hover:text-[#0B5D66]">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-[#0B5D66]">Dashboard</Link>
              <Button variant="ghost" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-[#0B5D66]">Sign In</Link>
              <Link href="/consultation"><Button className="bg-[#0B5D66] text-white hover:bg-[#0A4E56]">Consultation</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 bg-white">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <span className="font-display text-xl font-bold text-[#0B5D66]">Global<span className="text-[#C9A96E]">Citizens</span> Solution</span>
                <SheetTrigger asChild><Button variant="ghost" size="icon"><X className="h-5 w-5" /></Button></SheetTrigger>
              </div>
              <nav className="p-5 space-y-1 overflow-y-auto max-h-[80vh]">
                {mainNav.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 py-2.5 text-base text-gray-800 hover:text-[#0B5D66]">
                    <item.icon className="h-5 w-5 text-[#0B5D66]" /> {item.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Programs</p>
                  {programLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="block py-2 text-base text-gray-800 hover:text-[#0B5D66]">
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-100">
                  {isLoggedIn ? (
                    <>
                      <Link href="/dashboard" className="flex items-center gap-3 py-2.5 text-base text-gray-800 hover:text-[#0B5D66]">
                        <LayoutDashboard className="h-5 w-5 text-[#0B5D66]" /> Dashboard
                      </Link>
                      <Button variant="ghost" onClick={handleLogout} className="w-full justify-start"><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
                    </>
                  ) : (
                    <Link href="/consultation"><Button className="w-full bg-[#0B5D66] text-white">Book Consultation</Button></Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}