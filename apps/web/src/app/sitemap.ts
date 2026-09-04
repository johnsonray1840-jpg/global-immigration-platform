import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://globalimmigration.example.com';

  const staticPages = [
    '',
    '/about',
    '/countries',
    '/programs',
    '/eligibility',
    '/compare',
    '/packages',
    '/faq',
    '/scholarships',
    '/consultation',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic program slugs
  const programSlugs = [
    'permanent-residence',
    'citizenship-by-naturalization',
    'citizenship-by-investment',
    'family-sponsorship',
    'skilled-worker',
    'student-immigration',
    'investor-immigration',
    'entrepreneur-immigration',
    'digital-nomad-visa',
    'retirement-visa',
    'work-permit',
    'tourist-visa',
    'medical-visa',
    'transit-visa',
    'refugee-information',
    'business-visa',
  ];

  const programPages = programSlugs.map((slug) => ({
    url: `${baseUrl}/programs/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...programPages];
}
