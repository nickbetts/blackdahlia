import type { Metadata } from "next";
import Link from "next/link";
import { Camera, MoveLeft, Music4, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { artists } from "@/content/studio";
import { getArtistGallery, getLeadImage } from "@/lib/media";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { Particles } from "@/components/ui/particles";
import { FocusCards } from "@/components/ui/focus-cards";
import { MovingBorderLink } from "@/components/moving-border-link";

type ArtistPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = artists.find((entry) => entry.slug === slug);

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

export default async function ArtistDetailPage({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = artists.find((entry) => entry.slug === slug);

  if (!artist) {
    notFound();
  }

  const leadImage = getLeadImage(artist.slug);
  const gallery = getArtistGallery(artist.slug, 18);
  const galleryCards = gallery.map((img) => ({
    title: img.title || `${artist.name} tattoo`,
    src: img.localPath,
  }));

  return (
    <div className="pageStack">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ paddingBlock: "clamp(2rem, 5vw, 3.5rem)" }}>
        <Particles
          className="absolute inset-0 pointer-events-none"
          quantity={30}
          color="#c9a26b"
          size={0.4}
          staticity={75}
          ease={55}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <BlurFade inView direction="up" delay={0.05} className="pageHeroCompact">
            <Link href="/artists" className="inlineAction" style={{ marginBottom: "0.5rem", display: "inline-flex" }}>
              <MoveLeft size={14} /> Back to all artists
            </Link>
            <AnimatedGradientText colorFrom="#c9a26b" colorTo="#9a4c3b" speed={0.6} className="eyebrow">
              Artist profile
            </AnimatedGradientText>
            <h1 className="heroDisplay">{artist.name}</h1>
            <p className="lede">{artist.longBio}</p>
          </BlurFade>
        </div>
      </section>

      {/* ── DETAIL LAYOUT ────────────────────────────────────────────── */}
      <section className="container sectionSpacing artistDetailLayout">
        <BlurFade inView direction="up" delay={0.05}>
          <div className="artistDetailMain">
            {leadImage ? (
              <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden" }}>
                <img
                  src={leadImage.localPath}
                  alt={leadImage.title || artist.name}
                  loading="eager"
                  className="artistDetailLead"
                />
                <BorderBeam colorFrom="#c9a26b" colorTo="#9a4c3b" size={180} duration={10} borderWidth={1.5} />
              </div>
            ) : null}
            <div className="artistTags">
              {artist.specialities.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </BlurFade>

        <BlurFade inView direction="up" delay={0.14}>
          <CardSpotlight
            className="artistDetailSidebar border-[rgba(255,255,255,0.1)]"
            color="rgba(201,162,107,0.08)"
            radius={320}
          >
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
            <MovingBorderLink
              href="/booking"
              containerClassName="h-auto w-auto py-0"
              borderClassName="bg-[radial-gradient(#c9a26b_40%,transparent_60%)]"
              className="primaryButton sidebarButton border-[rgba(201,162,107,0.25)] bg-[rgba(8,8,8,0.92)]"
              borderRadius="0.5rem"
              duration={3000}
            >
              Book with {artist.name}
            </MovingBorderLink>
          </CardSpotlight>
        </BlurFade>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <BlurFade inView direction="up" delay={0.04}>
          <div className="sectionHeaderWithAction">
            <div>
              <p className="eyebrow">
                <AnimatedGradientText colorFrom="#c9a26b" colorTo="#9a4c3b" speed={0.6}>
                  Portfolio
                </AnimatedGradientText>
              </p>
              <h2 className="sectionTitle displayMix">{artist.name}&apos;s <em>gallery</em></h2>
            </div>
          </div>
        </BlurFade>
        <BlurFade inView delay={0.12}>
          <FocusCards
            cards={galleryCards}
            className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          />
        </BlurFade>
      </section>

    </div>
  );
}
