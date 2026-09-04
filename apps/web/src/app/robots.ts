import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard', '/consultant', '/api'],
    },
    sitemap: 'https://globalimmigration.example.com/sitemap.xml',
  };
}
