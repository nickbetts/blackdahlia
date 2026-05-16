import type { Metadata } from "next";
import Link from "next/link";
import { Camera, MoveLeft, Music4, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/reveal";
import { artists } from "@/content/studio";
import { getArtistGallery, getLeadImage } from "@/lib/media";

type ArtistPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artist.slug }));
}

export function generateMetadata({ params }: ArtistPageProps): Metadata {
  const artist = artists.find((entry) => entry.slug === params.slug);

  if (!artist) {
    return {
      title: "Artist",
    };
  }

  return {
    title: `${artist.name} Portfolio`,
    description: `${artist.name} at The Black Dahlia. ${artist.shortBio}`,
  };
}

export default function ArtistDetailPage({ params }: ArtistPageProps) {
  const artist = artists.find((entry) => entry.slug === params.slug);

  if (!artist) {
    notFound();
  }

  const leadImage = getLeadImage(artist.slug);
  const gallery = getArtistGallery(artist.slug, 18);

  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <Link href="/artists" className="inlineAction">
            <MoveLeft size={14} /> Back to all artists
          </Link>
          <p className="eyebrow">Artist profile</p>
          <h1>{artist.name}</h1>
          <p className="lede">{artist.longBio}</p>
        </Reveal>
      </section>

      <section className="container sectionSpacing artistDetailLayout">
        <Reveal>
          <div className="artistDetailMain">
            {leadImage ? (
              <img src={leadImage.localPath} alt={leadImage.title || artist.name} loading="eager" className="artistDetailLead" />
            ) : null}
            <div className="artistTags">
              {artist.specialities.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <aside className="artistDetailSidebar">
            <p className="artistRole">{artist.role}</p>
            <h2>Connect</h2>
            <a href={artist.social.instagram} target="_blank" rel="noreferrer">
              <Camera size={16} /> Instagram
            </a>
            {artist.social.facebook ? (
              <a href={artist.social.facebook} target="_blank" rel="noreferrer">
                <Users size={16} /> Facebook
              </a>
            ) : null}
            {artist.social.tiktok ? (
              <a href={artist.social.tiktok} target="_blank" rel="noreferrer">
                <Music4 size={16} /> TikTok
              </a>
            ) : null}
            <Link href="/booking" className="primaryButton sidebarButton">
              Book with {artist.name}
            </Link>
          </aside>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal>
          <h2 className="sectionTitle">{artist.name}&apos;s Gallery</h2>
        </Reveal>
        <div className="galleryGrid">
          {gallery.map((image, index) => (
            <Reveal key={`${artist.slug}-${image.hash}`} delay={0.03 * (index % 5)} className="galleryCard">
              <img src={image.localPath} alt={image.title || `${artist.name} tattoo work`} loading="lazy" />
              <div>
                <p>{image.title || "Portfolio piece"}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
