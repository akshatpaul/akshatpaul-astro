# akshatpaul.com — Astro Site

## How the site works

This is a static Astro site migrated from WordPress. All content lives as pre-built HTML files in `public/`. Astro simply serves them — there is no CMS, no Markdown, no content collections.

- Each page/post is a folder: `public/your-slug/index.html`
- `src/pages/[...slug].astro` — catch-all route that reads and serves the matching `public/{slug}/index.html`
- `src/pages/sitemap.xml.ts` — dynamically generates the sitemap by scanning `public/` at build time

## Adding a new blog post

1. Create `public/your-post-slug/index.html` (copy an existing post as a template)
2. Update `public/blog/index.html` to add the post to the listing
3. Make sure the `gtag.js` analytics snippet is included in the new HTML file
4. **Run `npm run build`** to regenerate the sitemap — the sitemap auto-includes any new folder with an `index.html`, but it is generated at build time so a build is required

## Sitemap

The sitemap at `/sitemap.xml` is generated dynamically by `src/pages/sitemap.xml.ts`. It scans `public/` and outputs absolute URLs (`https://akshatpaul.com/...`).

**Every time you add a new page or post, run `npm run build` so the sitemap is regenerated and includes the new URL.**

`robots.txt` points to `https://akshatpaul.com/sitemap.xml`.

## Git commits

Never include Claude as a co-author in commit messages. Do not add `Co-Authored-By: Claude` or any similar line.

## Deployment

Deployed on Cloudflare Pages. Push to `main` to trigger a deploy.
