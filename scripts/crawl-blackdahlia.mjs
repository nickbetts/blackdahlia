#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";

const SITE_ORIGIN = "https://www.theblackdahlia.co.uk";
const SITEMAP_INDEX_URL = `${SITE_ORIGIN}/sitemap.xml`;
const OUTPUT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "crawl");
const USER_AGENT = "blackdahlia-site-rebuild/1.0 (+https://www.theblackdahlia.co.uk)";

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
});

function toArray(value) {
  if (value === undefined || value === null) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function cleanText(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept-Language": "en-GB,en;q=0.9",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed request ${response.status} for ${url}`);
  }

  return response.text();
}

function parseSitemapIndex(xml) {
  const parsed = parser.parse(xml);
  const sitemapNodes = toArray(parsed?.sitemapindex?.sitemap);

  return sitemapNodes
    .map((node) => cleanText(node?.loc))
    .filter((loc) => loc.startsWith("http"));
}

function parseUrlSet(xml, sitemapUrl) {
  const parsed = parser.parse(xml);
  const urlNodes = toArray(parsed?.urlset?.url);

  const pageUrls = [];
  const imageEntries = [];

  for (const node of urlNodes) {
    const pageUrl = cleanText(node?.loc);
    if (!pageUrl.startsWith("http")) {
      continue;
    }

    pageUrls.push(pageUrl);

    const imageNodes = toArray(node?.["image:image"] ?? node?.image);
    for (const imageNode of imageNodes) {
      const imageUrl = cleanText(imageNode?.["image:loc"] ?? imageNode?.loc);
      const imageTitle = cleanText(imageNode?.["image:title"] ?? imageNode?.title);

      if (!imageUrl.startsWith("http")) {
        continue;
      }

      imageEntries.push({
        url: imageUrl,
        title: imageTitle,
        pageUrl,
        sitemapUrl,
      });
    }
  }

  return {
    pageUrls: unique(pageUrls),
    imageEntries,
  };
}

function extractPageData(url, html) {
  const $ = cheerio.load(html);

  const title = cleanText($("title").first().text());
  const description = cleanText($("meta[name='description']").attr("content") ?? "");
  const canonical = cleanText($("link[rel='canonical']").attr("href") ?? "");

  const headings = unique(
    $("h1, h2, h3")
      .map((_, el) => cleanText($(el).text()))
      .get()
      .filter((item) => item.length > 0 && item.length < 150)
  );

  const textBlocks = unique(
    $("p, li")
      .map((_, el) => cleanText($(el).text()))
      .get()
      .filter((item) => item.length >= 30 && item.length <= 420)
  ).slice(0, 120);

  const anchorHrefs = unique(
    $("a[href]")
      .map((_, el) => cleanText($(el).attr("href") ?? ""))
      .get()
  );

  const internalLinks = unique(
    anchorHrefs
      .map((href) => {
        if (href.startsWith("/")) {
          return `${SITE_ORIGIN}${href}`;
        }

        return href;
      })
      .filter((href) => href.startsWith(SITE_ORIGIN))
  );

  const socialLinks = unique(
    anchorHrefs.filter((href) => /instagram\.com|facebook\.com|tiktok\.com/i.test(href))
  );

  const staticWixMatches = html.match(/https:\/\/static\.wixstatic\.com\/media\/[^\s"'<)]+/g) ?? [];
  const videoMatches = html.match(/https:\/\/video\.wixstatic\.com\/[^\s"'<)]+/g) ?? [];

  return {
    url,
    title,
    description,
    canonical,
    headings,
    textBlocks,
    internalLinks,
    socialLinks,
    imageUrls: unique(staticWixMatches),
    videoUrls: unique(videoMatches),
  };
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      const result = await mapper(items[currentIndex], currentIndex);
      results[currentIndex] = result;
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const sitemapIndexXml = await fetchText(SITEMAP_INDEX_URL);
  const childSitemaps = parseSitemapIndex(sitemapIndexXml);

  const sitemapsToRead = childSitemaps.length > 0 ? childSitemaps : [SITEMAP_INDEX_URL];

  const sitemapBreakdown = [];
  const discoveredPageUrls = [];
  const discoveredImageEntries = [];

  for (const sitemapUrl of sitemapsToRead) {
    const sitemapXml = await fetchText(sitemapUrl);
    const { pageUrls, imageEntries } = parseUrlSet(sitemapXml, sitemapUrl);

    sitemapBreakdown.push({
      sitemapUrl,
      pageCount: pageUrls.length,
      imageCount: imageEntries.length,
    });

    discoveredPageUrls.push(...pageUrls);
    discoveredImageEntries.push(...imageEntries);
  }

  const pageUrls = unique(discoveredPageUrls);
  const sitemapImageUrls = unique(discoveredImageEntries.map((entry) => entry.url));

  const pageResults = await mapWithConcurrency(pageUrls, 5, async (url) => {
    try {
      const html = await fetchText(url);
      return extractPageData(url, html);
    } catch (error) {
      return {
        url,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });

  const crawlErrors = pageResults.filter((result) => "error" in result);
  const crawledPages = pageResults.filter((result) => !("error" in result));

  const discoveredPageImageUrls = crawledPages.flatMap((page) => page.imageUrls);
  const discoveredVideoUrls = crawledPages.flatMap((page) => page.videoUrls);

  const allImageUrls = unique([...sitemapImageUrls, ...discoveredPageImageUrls]);
  const allVideoUrls = unique(discoveredVideoUrls);

  const summary = {
    generatedAt: new Date().toISOString(),
    siteOrigin: SITE_ORIGIN,
    sitemapIndex: SITEMAP_INDEX_URL,
    childSitemaps,
    sitemapBreakdown,
    totals: {
      pageUrlsFromSitemaps: pageUrls.length,
      crawledPages: crawledPages.length,
      crawlErrors: crawlErrors.length,
      imageUrls: allImageUrls.length,
      videoUrls: allVideoUrls.length,
      socialLinks: unique(crawledPages.flatMap((page) => page.socialLinks)).length,
    },
  };

  await writeFile(path.join(OUTPUT_DIR, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  await writeFile(
    path.join(OUTPUT_DIR, "sitemap-index.json"),
    `${JSON.stringify(
      {
        generatedAt: summary.generatedAt,
        sitemapIndex: SITEMAP_INDEX_URL,
        childSitemaps,
        sitemapBreakdown,
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  await writeFile(
    path.join(OUTPUT_DIR, "media.json"),
    `${JSON.stringify(
      {
        generatedAt: summary.generatedAt,
        images: allImageUrls,
        videos: allVideoUrls,
        imageDetails: discoveredImageEntries,
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  await writeFile(path.join(OUTPUT_DIR, "pages.json"), `${JSON.stringify(crawledPages, null, 2)}\n`, "utf8");
  await writeFile(path.join(OUTPUT_DIR, "errors.json"), `${JSON.stringify(crawlErrors, null, 2)}\n`, "utf8");

  console.log(`Crawled pages: ${crawledPages.length}`);
  console.log(`Crawl errors: ${crawlErrors.length}`);
  console.log(`Image URLs discovered: ${allImageUrls.length}`);
  console.log(`Video URLs discovered: ${allVideoUrls.length}`);
  console.log(`Saved crawl outputs to: ${OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
