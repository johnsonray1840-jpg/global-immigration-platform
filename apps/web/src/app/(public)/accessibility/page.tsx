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
    <div className="bg-[#F8FAFA]">
      <section className="relative overflow-hidden bg-[#0B5D66] py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.2),transparent)]" />
        <div className="container-premium relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white">Accessibility Statement</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            We are committed to ensuring our website is accessible to everyone.
          </p>
        </div>
      </section>

      <div className="container-premium py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-lg leading-relaxed text-gray-600">
            Global Immigration Platform strives to provide an inclusive experience. We follow the Web Content
            Accessibility Guidelines (WCAG) 2.1 Level AA to make our content accessible to a wide range of
            people with disabilities.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B5D66]/10">
                  <feature.icon className="h-5 w-5 text-[#0B5D66]" />
                </div>
                <h2 className="mt-3 font-display text-lg font-semibold text-[#111827]">{feature.title}</h2>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-[#111827]">Need Assistance?</h2>
            <p className="mt-2 text-gray-600">
              If you encounter any accessibility barriers or have suggestions, please contact us at{' '}
              <a href="mailto:accessibility@globalimmigration.com" className="text-[#0B5D66] hover:underline">
                accessibility@globalimmigration.com
              </a>
              . We are continually improving the user experience for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}