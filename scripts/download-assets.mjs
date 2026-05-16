#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const crawlMediaFile = path.join(rootDir, "data", "crawl", "media.json");
const outputRoot = path.join(rootDir, "public", "media", "crawl");
const outputImagesDir = path.join(outputRoot, "images");
const outputVideosDir = path.join(outputRoot, "videos");
const publicManifestFile = path.join(rootDir, "public", "media", "manifest.json");
const contentManifestFile = path.join(rootDir, "src", "content", "media.json");

const MAX_IMAGES = Number(process.env.MAX_IMAGES ?? "160");
const MAX_VIDEOS = Number(process.env.MAX_VIDEOS ?? "2");
const MAX_VIDEO_BYTES = Number(process.env.MAX_VIDEO_BYTES ?? String(40 * 1024 * 1024));

const USER_AGENT = "blackdahlia-site-rebuild/1.0 (+https://www.theblackdahlia.co.uk)";

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function inferExtension(url, contentType) {
  const urlPath = new URL(url).pathname;
  const dotIndex = urlPath.lastIndexOf(".");

  if (dotIndex > -1) {
    const ext = urlPath.slice(dotIndex + 1).toLowerCase();
    if (/^[a-z0-9]{2,5}$/.test(ext)) {
      return ext;
    }
  }

  if (contentType.includes("jpeg")) return "jpg";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("avif")) return "avif";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("mp4")) return "mp4";

  return "bin";
}

function detectArtist(pageUrl = "") {
  if (pageUrl.includes("sharnia")) return "sharnia";
  if (pageUrl.includes("laura")) return "laura";
  if (pageUrl.includes("caitlin")) return "caitlin";
  return null;
}

async function downloadBinary(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept-Language": "en-GB,en;q=0.9",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed request ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "application/octet-stream";
  const contentLength = Number(response.headers.get("content-length") ?? "0");
  const arrayBuffer = await response.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);

  return {
    bytes,
    contentType,
    contentLength,
  };
}

async function main() {
  const mediaPayload = JSON.parse(await readFile(crawlMediaFile, "utf8"));
  const imageDetails = mediaPayload.imageDetails ?? [];

  const metadataByUrl = new Map();
  for (const entry of imageDetails) {
    if (!entry.url || metadataByUrl.has(entry.url)) {
      continue;
    }

    metadataByUrl.set(entry.url, {
      title: entry.title ?? "",
      pageUrl: entry.pageUrl ?? "",
      artist: detectArtist(entry.pageUrl ?? ""),
    });
  }

  await mkdir(outputImagesDir, { recursive: true });
  await mkdir(outputVideosDir, { recursive: true });
  await mkdir(path.dirname(publicManifestFile), { recursive: true });
  await mkdir(path.dirname(contentManifestFile), { recursive: true });

  const selectedImageUrls = unique(mediaPayload.images ?? []).slice(0, MAX_IMAGES);
  const selectedVideoUrls = unique(mediaPayload.videos ?? []).slice(0, MAX_VIDEOS);

  const hashToPath = new Map();
  const imageManifest = [];
  const failedImages = [];

  for (const imageUrl of selectedImageUrls) {
    try {
      const { bytes, contentType } = await downloadBinary(imageUrl);

      if (!contentType.startsWith("image/")) {
        failedImages.push({ url: imageUrl, reason: `Unexpected content type: ${contentType}` });
        continue;
      }

      const hash = createHash("sha1").update(bytes).digest("hex");
      const ext = inferExtension(imageUrl, contentType);
      const existingPath = hashToPath.get(hash);

      let publicPath = existingPath;
      if (!publicPath) {
        const metadata = metadataByUrl.get(imageUrl);
        const baseSlug = slugify(metadata?.title || `asset-${hash.slice(0, 10)}`);
        const fileName = `${baseSlug}-${hash.slice(0, 10)}.${ext}`;
        const localAbsolutePath = path.join(outputImagesDir, fileName);

        await writeFile(localAbsolutePath, bytes);

        publicPath = `/media/crawl/images/${fileName}`;
        hashToPath.set(hash, publicPath);
      }

      const metadata = metadataByUrl.get(imageUrl);
      imageManifest.push({
        sourceUrl: imageUrl,
        localPath: publicPath,
        title: metadata?.title ?? "",
        pageUrl: metadata?.pageUrl ?? "",
        artist: metadata?.artist ?? null,
        hash,
        bytes: bytes.length,
        contentType,
      });
    } catch (error) {
      failedImages.push({
        url: imageUrl,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const videoManifest = [];
  const failedVideos = [];

  for (const videoUrl of selectedVideoUrls) {
    try {
      const { bytes, contentType, contentLength } = await downloadBinary(videoUrl);

      if (!contentType.startsWith("video/")) {
        failedVideos.push({ url: videoUrl, reason: `Unexpected content type: ${contentType}` });
        continue;
      }

      if ((contentLength || bytes.length) > MAX_VIDEO_BYTES) {
        failedVideos.push({
          url: videoUrl,
          reason: `Skipped large video (${contentLength || bytes.length} bytes)`,
        });
        continue;
      }

      const hash = createHash("sha1").update(bytes).digest("hex");
      const ext = inferExtension(videoUrl, contentType);
      const fileName = `video-${hash.slice(0, 10)}.${ext}`;
      const localAbsolutePath = path.join(outputVideosDir, fileName);

      await writeFile(localAbsolutePath, bytes);

      const publicPath = `/media/crawl/videos/${fileName}`;

      videoManifest.push({
        sourceUrl: videoUrl,
        localPath: publicPath,
        hash,
        bytes: bytes.length,
        contentType,
      });
    } catch (error) {
      failedVideos.push({
        url: videoUrl,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    limits: {
      maxImages: MAX_IMAGES,
      maxVideos: MAX_VIDEOS,
      maxVideoBytes: MAX_VIDEO_BYTES,
    },
    images: imageManifest,
    videos: videoManifest,
    failures: {
      images: failedImages,
      videos: failedVideos,
    },
  };

  await writeFile(publicManifestFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await writeFile(contentManifestFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(`Images downloaded: ${imageManifest.length}`);
  console.log(`Image failures: ${failedImages.length}`);
  console.log(`Videos downloaded: ${videoManifest.length}`);
  console.log(`Video failures: ${failedVideos.length}`);
  console.log(`Manifest written to: ${publicManifestFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
