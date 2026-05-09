import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://akshatpaul.com';

function getSlugLastMod(htmlPath: string): string {
  try {
    const stat = fs.statSync(htmlPath);
    return stat.mtime.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export async function GET() {
  const publicDir = path.resolve(process.cwd(), 'public');
  const stack = [{ dir: publicDir, relBase: '' }];
  const urls: { slug: string; lastmod: string }[] = [];

  // Add homepage
  const indexPath = path.join(publicDir, 'index.html');
  urls.push({ slug: '', lastmod: getSlugLastMod(indexPath) });

  const excluded = new Set([
    '404', '404_not_found', 'wp-admin', 'wp-includes', 'wp-content',
    'wp-json', 'feed', 'comments', 'author', 'tag', 'category',
  ]);

  while (stack.length) {
    const { dir, relBase } = stack.pop()!;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith('.')) continue;

      const rel = relBase ? `${relBase}/${entry.name}` : entry.name;
      const topLevel = rel.split('/')[0];
      if (excluded.has(topLevel)) continue;

      const full = path.join(dir, entry.name);
      const htmlPath = path.join(full, 'index.html');

      if (fs.existsSync(htmlPath)) {
        urls.push({ slug: rel, lastmod: getSlugLastMod(htmlPath) });
      }

      stack.push({ dir: full, relBase: rel });
    }
  }

  const urlEntries = urls
    .map(({ slug, lastmod }) => {
      const loc = slug ? `${SITE_URL}/${slug}/` : `${SITE_URL}/`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
