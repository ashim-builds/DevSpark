import { useEffect } from 'react';

/**
 * Dynamic SEO component to manage title, meta tags, and OpenGraph per page.
 */
export default function SEO({
  title = 'DevSpark — Software Development Agency',
  description = 'DevSpark is a premier software development agency building high-performance web applications, ERP management systems, scalable e-commerce storefronts, and Android mobile apps.',
  keywords = 'software development agency, web development, ERP systems, ecommerce, Android apps, PWA',
  image = 'https://devspark.com/banner.png',
  url = 'https://devspark.com',
  type = 'website',
}) {
  useEffect(() => {
    // 1. Title
    const formattedTitle = title.includes('DevSpark') ? title : `${title} | DevSpark`;
    document.title = formattedTitle;

    // 2. Meta Helper function
    const setMeta = (attrName, attrVal, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);

    // OpenGraph
    setMeta('property', 'og:title', formattedTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', type);

    // Twitter
    setMeta('name', 'twitter:title', formattedTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, keywords, image, url, type]);

  return null;
}
