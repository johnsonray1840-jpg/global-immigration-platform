import { CheckCircle2, Keyboard, Eye, MonitorSmartphone, Volume2 } from 'lucide-react';

export const metadata = {
  title: 'Accessibility',
  description: 'Our commitment to digital accessibility.',
};

const features = [
  {
    icon: Keyboard,
    title: 'Keyboard Navigation',
    description: 'All interactive elements are fully operable using only a keyboard.',
  },
  {
    icon: Eye,
    title: 'High Contrast',
    description: 'Text and background colors meet WCAG 2.1 AA contrast requirements.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Responsive Design',
    description: 'The platform works seamlessly on desktops, tablets, and mobile devices.',
  },
  {
    icon: Volume2,
    title: 'Screen Reader Support',
    description: 'Semantic HTML and ARIA labels ensure compatibility with assistive technologies.',
  },
];

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-gradient-to-r from-deep-navy via-deep-navy/95 to-atlantic py-16 md:py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,107,0.15),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white">Accessibility Statement</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            We are committed to ensuring our platform is accessible to all individuals.
          </p>
        </div>
      </section>

      <div className="container-premium py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Global Citizens Solution strives to provide an inclusive digital experience. We follow the Web Content
            Accessibility Guidelines (WCAG) 2.1 Level AA standards to ensure equal access and smooth navigation for everyone.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold text-foreground">{feature.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-card text-card-foreground p-6 md:p-8 shadow-sm">
            <h2 className="font-display text-2xl font-semibold text-foreground">Need Assistance?</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              If you encounter any accessibility barriers or have suggestions, please contact us at{' '}
              <a href="mailto:accessibility@globalimmigration.com" className="font-medium text-primary hover:underline">
                accessibility@globalimmigration.com
              </a>
              . We continuously test and improve the user experience across all devices and assistive tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}