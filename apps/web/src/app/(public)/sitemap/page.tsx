import Link from 'next/link';
import { Globe2, FileText, ShieldCheck, GraduationCap, Package, HelpCircle, User } from 'lucide-react';

export const metadata = {
  title: 'Sitemap',
  description: 'Explore all pages of Global Immigration Platform.',
};

const sitemapSections = [
  {
    title: 'Immigration',
    icon: ShieldCheck,
    links: [
      { label: 'Permanent Residence', href: '/programs/permanent-residence' },
      { label: 'Citizenship by Investment', href: '/programs/citizenship-investment' },
      { label: 'Family Sponsorship', href: '/programs/family-sponsorship' },
      { label: 'Express Entry', href: '/programs/express-entry' },
      { label: 'Student Visa', href: '/programs/student-visa' },
      { label: 'Work Permit', href: '/programs/work-permit' },
    ],
  },
  {
    title: 'Countries',
    icon: Globe2,
    links: [
      { label: 'All Countries', href: '/countries' },
      { label: 'Compare Countries', href: '/compare' },
    ],
  },
  {
    title: 'Services',
    icon: Package,
    links: [
      { label: 'Service Packages', href: '/packages' },
      { label: 'Scholarships', href: '/scholarships' },
      { label: 'Consultation', href: '/consultation' },
    ],
  },
  {
    title: 'Resources',
    icon: FileText,
    links: [
      { label: 'Eligibility Assessment', href: '/eligibility' },
      { label: 'FAQ', href: '/faq' },
      { label: 'About Us', href: '/about' },
      { label: 'Sitemap', href: '/sitemap' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
  {
    title: 'Account',
    icon: User,
    links: [
      { label: 'Sign In', href: '/login' },
      { label: 'Register', href: '/register' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-gradient-to-r from-deep-navy via-deep-navy/95 to-atlantic py-16 md:py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,107,0.15),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white">Sitemap</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Find everything on our platform in one structured directory.
          </p>
        </div>
      </section>

      <div className="container-premium py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sitemapSections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <section.icon className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">{section.title}</h2>
              </div>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}