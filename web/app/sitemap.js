export default function sitemap() {
  const baseUrl = 'https://devspark.com';

  const staticPages = [
    '',
    '/about',
    '/services',
    '/projects',
    '/team',
    '/testimonials',
    '/contact',
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Note: In a production app, you would fetch dynamic routes here
  // For now, we return static routes
  return staticRoutes;
}
