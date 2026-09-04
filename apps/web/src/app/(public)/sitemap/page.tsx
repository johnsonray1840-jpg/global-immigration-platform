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
    <div className="bg-[#F8FAFA]">
      <section className="relative overflow-hidden bg-[#0B5D66] py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.2),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white">Sitemap</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Find everything on our platform in one place.
          </p>
        </div>
      </section>

      <div className="container-premium py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sitemapSections.map((section) => (
            <div key={section.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5D66]/10">
                  <section.icon className="h-5 w-5 text-[#0B5D66]" />
                </div>
                <h2 className="font-display text-xl font-semibold text-[#111827]">{section.title}</h2>
              </div>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-[#0B5D66]"
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