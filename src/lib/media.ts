import mediaManifest from "@/content/media.json";
import type { ArtistSlug } from "@/content/studio";
import { listGalleryImages } from "@/lib/admin-db";
import type { GalleryImage } from "@/lib/admin-types";

export type MediaImage = {
  sourceUrl: string;
  localPath: string;
  title: string;
  pageUrl: string;
  artist: ArtistSlug | null;
  hash: string;
  bytes: number;
  contentType: string;
};

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".webp", ".avif", ".png"];

function isLikelyPhoto(image: MediaImage) {
  const lowerPath = image.localPath.toLowerCase();
  const hasPhotoExt = IMAGE_EXTENSIONS.some((ext) => lowerPath.endsWith(ext));
  const hasMeaningfulSize = image.bytes > 45_000;

  return hasPhotoExt && hasMeaningfulSize;
}

const allImages = (mediaManifest.images as MediaImage[]).filter(isLikelyPhoto);
const titledImages = allImages.filter((image) => image.title.trim().length > 0);

function pickUniqueByHash(images: MediaImage[]) {
  const seen = new Set<string>();
  return images.filter((image) => {
    if (seen.has(image.hash)) {
      return false;
    }

    seen.add(image.hash);
    return true;
  });
}

export const curatedImages = pickUniqueByHash(titledImages.length > 0 ? titledImages : allImages);

export const heroImages = pickUniqueByHash([
  ...curatedImages.filter((image) => image.title.toLowerCase().includes("studio")),
  ...curatedImages.filter((image) => image.artist === "sharnia"),
  ...curatedImages.filter((image) => image.artist === "laura"),
  ...curatedImages.filter((image) => image.artist === "caitlin"),
  ...curatedImages,
]).slice(0, 10);

export function getArtistGallery(slug: ArtistSlug, count = 18) {
  const primary = curatedImages.filter((image) => image.artist === slug);

  if (primary.length >= count) {
    return primary.slice(0, count);
  }

  const backup = curatedImages.filter((image) => image.artist !== slug);
  return [...primary, ...backup].slice(0, count);
}

export const studioGallery = pickUniqueByHash([
  ...curatedImages.filter((image) => image.artist === null),
  ...curatedImages,
]).slice(0, 24);

export function getLeadImage(slug: ArtistSlug) {
  return getArtistGallery(slug, 1)[0] ?? heroImages[0] ?? null;
}

function galleryImageToMediaImage(image: GalleryImage): MediaImage {
  return {
    sourceUrl: `/api/gallery/${image.id}`,
    localPath: `/api/gallery/${image.id}`,
    title: image.alt || "",
    pageUrl: "",
    artist: image.artistSlug,
    hash: `managed-${image.id}`,
    bytes: image.byteSize,
    contentType: image.mimeType,
  };
}

async function fetchManagedGallery(slug: ArtistSlug): Promise<MediaImage[]> {
  try {
    const managed = await listGalleryImages(slug);
    return managed.map(galleryImageToMediaImage);
  } catch {
    return [];
  }
}

export async function getArtistManagedGallery(slug: ArtistSlug, count = 18): Promise<MediaImage[]> {
  const managed = await fetchManagedGallery(slug);
  if (managed.length >= count) {
    return managed.slice(0, count);
  }

  const fallback = getArtistGallery(slug, count).filter(
    (image) => !managed.some((entry) => entry.localPath === image.localPath)
  );

  return [...managed, ...fallback].slice(0, count);
}

export async function getArtistManagedLeadImage(slug: ArtistSlug): Promise<MediaImage | null> {
  const managed = await fetchManagedGallery(slug);
  if (managed[0]) return managed[0];
  return getLeadImage(slug);
}
