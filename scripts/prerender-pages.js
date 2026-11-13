import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToString } from "vue/server-renderer";
import { createServer } from "vite";
import { seo } from "../src/data/seo.js";

const siteUrl = seo.siteUrl;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(root, "dist");
const template = await readFile(
  path.join(outputDirectory, "index.html"),
  "utf8",
);
process.env.NODE_ENV = "production";
const vite = await createServer({
  configFile: path.join(root, "vite.config.js"),
  mode: "production",
  server: { middlewareMode: true },
  appType: "custom",
});

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function metadataTags(route, metadata) {
  const canonical = metadata.canonical;
  const image = new URL(metadata.image, siteUrl).href;
  const project = metadata.project;
  let structuredData;

  if (project) {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: metadata.description,
      url: canonical,
      image,
      author: { "@type": "Person", name: seo.siteName, url: siteUrl },
    };
  } else if (route.name === "projects") {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: metadata.title,
      description: metadata.description,
      url: canonical,
    };
  } else {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: seo.siteName,
      url: siteUrl,
      description: metadata.description,
    };
  }

  const jsonLd = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return [
    `<meta name="robots" content="index,follow">`,
    `<meta name="description" content="${escapeHtml(metadata.description)}">`,
    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
    `<meta property="og:type" content="${escapeHtml(metadata.ogType)}">`,
    `<meta property="og:title" content="${escapeHtml(metadata.ogTitle ?? metadata.title)}">`,
    `<meta property="og:description" content="${escapeHtml(metadata.ogDescription ?? metadata.description)}">`,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
    `<meta property="og:image" content="${escapeHtml(image)}">`,
    `<meta property="og:site_name" content="${escapeHtml(seo.siteName)}">`,
    `<meta name="twitter:card" content="${escapeHtml(metadata.twitterCard)}">`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join("\n    ");
}

function renderDocument(body, route, metadata, teleports) {
  let html = template
    .replace(
      /<title>[\s\S]*?<\/title>/,
      `<title>${escapeHtml(metadata.title)}</title>`,
    )
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, "")
    .replace(/<link\s+rel="canonical"[\s\S]*?\/>/, "")
    .replace(/<meta\s+property="og:[^"]+"[\s\S]*?\/>/g, "")
    .replace(/<meta\s+name="twitter:[^"]+"[\s\S]*?\/>/g, "")
    .replace("</head>", `    ${metadataTags(route, metadata)}\n  </head>`)
    .replace('<div id="app"></div>', `<div id="app">${body}</div>`);

  if (teleports?.body) {
    html = html.replace("</body>", `${teleports.body}\n  </body>`);
  }

  return html;
}

const staticPaths = [
  "/",
  "/about/",
  "/contact/",
  "/projects/",
  ...(await vite.ssrLoadModule("/src/data/projects.js")).projects.map(
    (project) => `/projects/${encodeURIComponent(project.id)}/`,
  ),
];

try {
  const [{ createServerApp }, { getRouteMetadata }] = await Promise.all([
    vite.ssrLoadModule("/src/entry-server.js"),
    vite.ssrLoadModule("/src/router.js"),
  ]);

  for (const routePath of staticPaths) {
    const { app, router } = createServerApp();
    await router.push(routePath);
    await router.isReady();

    const route = router.currentRoute.value;
    const metadata = getRouteMetadata(route);
    const teleports = {};
    const body = await renderToString(app, { teleports });
    const filePath = path.join(
      outputDirectory,
      routePath === "/" ? "index.html" : routePath.slice(1),
      ...(routePath === "/" ? [] : ["index.html"]),
    );

    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, renderDocument(body, route, metadata, teleports));
  }

  const sitemapUrls = staticPaths
    .map(
      (routePath) =>
        `  <url><loc>${escapeHtml(new URL(routePath, siteUrl).href)}</loc></url>`,
    )
    .join("\n");
  await writeFile(
    path.join(outputDirectory, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
  );
  await writeFile(
    path.join(outputDirectory, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
  );

  console.log(`Prerendered ${staticPaths.length} portfolio routes.`);
} finally {
  await vite.close();
}
