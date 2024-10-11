import fs from 'fs';
import path from 'path';

// Define your routes
const routes = [
  '/',
  '/camps',
  '/class-schedule',
  '/services',
  '/staff',
  '/facility',
  '/contact-us',
];

// Create sitemap content
const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `
    <url>
      <loc>https://dauntlessathletics.com${route}</loc>
    </url>
  `
    )
    .join('')}
</urlset>`;

  // Save sitemap.xml to the dist folder
  fs.writeFileSync(path.resolve('dist', 'sitemap.xml'), sitemap);
};

// Generate the sitemap
generateSitemap();
