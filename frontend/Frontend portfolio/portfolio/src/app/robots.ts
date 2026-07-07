export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/auth/', '/researcher/dashboard/'],
    },
    sitemap: 'https://inchtechs.com/sitemap.xml',
  };
}