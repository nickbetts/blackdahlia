#!/usr/bin/env node

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const requiredFiles = [
  path.join(rootDir, "data", "crawl", "summary.json"),
  path.join(rootDir, "src", "content", "media.json"),
  path.join(rootDir, "public", "media", "manifest.json"),
];

const imagesDir = path.join(rootDir, "public", "media", "crawl", "images");

function hasCommittedArtifacts() {
  const filesPresent = requiredFiles.every((filePath) => existsSync(filePath));
  if (!filesPresent || !existsSync(imagesDir)) {
    return false;
  }

  const imageCount = readdirSync(imagesDir).length;
  return imageCount > 0;
}

function runRefresh() {
  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npmCmd, ["run", "content"], {
    cwd: rootDir,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const shouldForceRefresh = process.env.FORCE_CONTENT_REFRESH === "1";
const runningOnVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

if (shouldForceRefresh) {
  console.log("FORCE_CONTENT_REFRESH=1 detected: regenerating crawl/media assets.");
  runRefresh();
  process.exit(0);
}

if (hasCommittedArtifacts()) {
  console.log("Using committed crawl/media artifacts for build.");
  process.exit(0);
}

if (runningOnVercel) {
  console.error("Missing committed crawl/media artifacts during Vercel build.");
  console.error(
    "Run 'npm run refresh-content' locally and commit 'data/', 'src/content/media.json', and 'public/media/'."
  );
  process.exit(1);
}

console.log("Missing local artifacts: generating crawl/media assets now.");
runRefresh();
