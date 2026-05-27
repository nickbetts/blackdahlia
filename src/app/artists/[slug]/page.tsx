import type { Metadata } from "next";
import Link from "next/link";
import { Camera, MoveLeft, Music4, Users, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { artists } from "@/content/studio";
import { getArtistGallery, getLeadImage } from "@/lib/media";

type ArtistPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = artists.find((entry) => entry.slug === slug);
  if (!artist) return { title: "Artist" };
  return {
    title: `${artist.name} Portfolio`,
    description: `${artist.name} at The Black Dahlia. ${artist.shortBio}`,
  };
}

export default async function ArtistDetailPage({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = artists.find((entry) => entry.slug === slug);
  if (!artist) notFound();

  const leadImage = getLeadImage(artist.slug);
  const gallery = getArtistGallery(artist.slug, 18);

  return (
    <div className="pageStack pageStack--artist">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pageHero">
        <div className="container">
          <Link
            href="/artists"
            className="inlineAction"
            style={{ marginBottom: "1.2rem", display: "inline-flex" }}
          >
            <MoveLeft size={14} /> Back to all artists
          </Link>
          <div className="pageHeroDivider" />
          <p className="eyebrow">Artist profile</p>
          <h1 className="displayXL">{artist.name}</h1>
          <p className="lede">{artist.longBio}</p>
        </div>
      </section>

      {/* ── DETAIL LAYOUT ────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <div className="artistDetailGrid">

          {/* Sidebar */}
          <aside className="artistDetailSidebar">
            {leadImage ? (
              <img
                src={leadImage.localPath}
                alt={leadImage.title || artist.name}
                loading="eager"
                style={{ width: "100%", display: "block" }}
              />
            ) : null}
            <div className="artistDetailSidebarBody">
              <p className="artistRole">{artist.role}</p>
              <div className="artistTags" style={{ marginBlock: "0.8rem" }}>
                {artist.specialities.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <a
                  href={artist.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inlineAction"
                >
                  <Camera size={15} /> Instagram
                </a>
                {artist.social.facebook ? (
                  <a
                    href={artist.social.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="inlineAction"
                  >
                    <Users size={15} /> Facebook
                  </a>
                ) : null}
                {artist.social.tiktok ? (
                  <a
                    href={artist.social.tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="inlineAction"
                  >
                    <Music4 size={15} /> TikTok
                  </a>
                ) : null}
              </div>
              <Link href="/booking" className="primaryButton" style={{ display: "inline-flex" }}>
                Book with {artist.name} <ArrowRight size={14} />
              </Link>
            </div>
          </aside>

          {/* Main */}
          <div className="artistDetailMain">
            <div className="artistNoteCard">
              <p className="eyebrow">Best booking result</p>
              <p>
                {`Tell us exact placement, size in centimetres, and at least one reference for tone. That’s enough for ${artist.name} to plan it properly and come back with a real quote.`}
              </p>
            </div>
            <div>
              <p className="eyebrow">Portfolio</p>
              <h2
                className="displayMix"
                style={{ marginTop: "0.4rem", marginBottom: "1.4rem" }}
              >
                {artist.name}&apos;s <em>gallery</em>
              </h2>
            </div>
            <div className="galleryGrid">
              {gallery.map((img) => (
                <div key={img.hash} className="galleryCell">
                  <img
                    src={img.localPath}
                    alt={img.title || `${artist.name} tattoo`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
