const express = require('express');
const router = express.Router();
const Blog = require('../models/blog.model');

// Generate robots.txt
router.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://infiap.com/sitemap.xml`);
});

// Generate dynamic sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).select('slug updatedAt');

        const baseUrl = 'https://infiap.com';
        const staticPages = [
            '',
            '/about',
            '/solutions',
            '/products',
            '/pricing',
            '/careers',
            '/contact',
            '/blog'
        ];

        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Add static pages
        staticPages.forEach(page => {
            xml += '<url>';
            xml += `<loc>${baseUrl}${page}</loc>`;
            xml += `<changefreq>weekly</changefreq>`;
            xml += `<priority>${page === '' ? '1.0' : '0.8'}</priority>`;
            xml += '</url>';
        });

        // Add blog posts
        blogs.forEach(blog => {
            xml += '<url>';
            xml += `<loc>${baseUrl}/blog/${blog.slug || blog._id}</loc>`;
            xml += `<lastmod>${blog.updatedAt.toISOString().split('T')[0]}</lastmod>`;
            xml += `<changefreq>monthly</changefreq>`;
            xml += `<priority>0.6</priority>`;
            xml += '</url>';
        });

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).send('Error generating sitemap');
    }
});

module.exports = router;
