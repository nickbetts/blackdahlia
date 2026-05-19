import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, ExternalLink } from "lucide-react";
import { GiSkullCrossedBones, GiRose } from "react-icons/gi";
import { ArtistDrawer } from "@/components/artist-drawer";
import { artists } from "@/content/studio";
import { getArtistGallery, getLeadImage } from "@/lib/media";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { Meteors } from "@/components/ui/meteors";
import { Particles } from "@/components/ui/particles";
import { MovingBorderLink } from "@/components/moving-border-link";

export const metadata: Metadata = {
  title: "Artists",
  description:
    "Explore the resident artists at The Black Dahlia and browse styles including realism, blackwork, geometric, illustrative, and traditional work.",
};

const motifIcons = [<GiRose key="rose" size={14} />, <GiSkullCrossedBones key="skull" size={14} />, <GiRose key="rose2" size={14} />];

export default function ArtistsPage() {
  const styleIndex = Array.from(new Set(artists.flatMap((artist) => artist.specialities))).slice(0, 12);

  return (
    <div className="pageStack">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ paddingBlock: "clamp(2rem, 5vw, 3.5rem)" }}>
        <Meteors number={10} color="#c9a26b" />
        <Particles
          className="absolute inset-0 pointer-events-none"
          quantity={20}
          color="#c9a26b"
          size={0.35}
          staticity={85}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <BlurFade inView direction="up" delay={0.05} className="pageHeroCompact">
            <AnimatedGradientText colorFrom="#c9a26b" colorTo="#9a4c3b" speed={0.6} className="eyebrow eyebrowTypewriter">
              The artists
            </AnimatedGradientText>
            <h1 className="heroDisplay">Find <em>the right hand</em> for your piece.</h1>
            <p className="lede">
              Different lines, different pace, different way of building a composition. Read the room
              before you send the brief.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* ── STYLE INDEX + ATLAS ──────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <BlurFade inView direction="up" delay={0.04}>
          <CardSpotlight
            className="artistStyleRibbon border-[rgba(255,255,255,0.08)]"
            color="rgba(201,162,107,0.05)"
            radius={500}
          >
            <p className="artistRole">What gets asked for</p>
            <div className="artistStylePills">
              {styleIndex.map((style) => (
                <span key={style}>{style}</span>
              ))}
            </div>
          </CardSpotlight>
        </BlurFade>

        <div className="artistAtlasGrid">
          {artists.map((artist, index) => {
            const leadImage = getLeadImage(artist.slug);
            const thumbnailGallery = getArtistGallery(artist.slug, index === 0 ? 5 : 3);
            const motifIcon = motifIcons[index % motifIcons.length];
            const isPrimary = index === 0;

            return (
              <BlurFade
                key={artist.slug}
                delay={0.08 + index * 0.07}
                inView
                direction="up"
              >
                <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden", height: "100%" }}>
                  <CardSpotlight
                    className={`artistAtlasCard${isPrimary ? " isPrimary" : ""} border-0 h-full`}
                    color="rgba(201,162,107,0.07)"
                    radius={450}
                  >
                    {leadImage ? (
                      <div className="artistAtlasMedia">
                        <img src={leadImage.localPath} alt={leadImage.title || artist.name} loading="lazy" />
                      </div>
                    ) : null}

                    <div className="artistAtlasBody">
                      <p className="artistRole">{artist.role}</p>
                      <h2>{artist.name}</h2>
                      <p>{artist.shortBio}</p>

                      <div className="artistTags">
                        {artist.specialities.map((item) => (
                          <span key={item}>{motifIcon}{item}</span>
                        ))}
                      </div>

                      <p className="artistAtlasMeta">
                        Best if you&apos;re after {artist.specialities.slice(0, 2).join(" or ").toLowerCase()}.
                      </p>

                      <div className="artistActionsRow">
                        <ArtistDrawer
                          name={artist.name}
                          role={artist.role}
                          shortBio={artist.shortBio}
                          longBio={artist.longBio}
                          specialities={artist.specialities}
                          slug={artist.slug}
                          instagramUrl={artist.social.instagram}
                          leadImageSrc={leadImage?.localPath}
                        >
                          <button className="inlineAction">Quick look</button>
                        </ArtistDrawer>
                        <Link href={`/artists/${artist.slug}`} className="inlineAction">
                          Full profile <ExternalLink size={15} />
                        </Link>
                        <a href={artist.social.instagram} target="_blank" rel="noreferrer" className="inlineAction">
                          Instagram <Camera size={15} />
                        </a>
                      </div>

                      <div className="artistAtlasGallery">
                        {thumbnailGallery.map((image) => (
                          <img key={`${artist.slug}-${image.hash}`} src={image.localPath} alt={image.title || artist.name} loading="lazy" />
                        ))}
                      </div>
                    </div>
                  </CardSpotlight>
                  {isPrimary && (
                    <BorderBeam colorFrom="#c9a26b" colorTo="#9a4c3b" size={160} duration={10} borderWidth={1} />
                  )}
                </div>
              </BlurFade>
            );
          })}
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────────── */}
      <section className="container ctaBand relative overflow-hidden" style={{ borderRadius: "22px" }}>
        <ShootingStars
          className="absolute inset-0 rounded-[inherit]"
          starColor="#c9a26b"
          trailColor="#9a4c3b"
          minSpeed={8}
          maxSpeed={18}
          minDelay={1000}
          maxDelay={2400}
        />
        <StarsBackground
          className="absolute inset-0 rounded-[inherit]"
          starDensity={0.00015}
          allStarsTwinkle
          twinkleProbability={0.5}
        />
        <BlurFade className="ctaBandInner" inView direction="up" delay={0.05}>
          <div>
            <AnimatedGradientText colorFrom="#c9a26b" colorTo="#9a4c3b" speed={0.7} className="eyebrow eyebrowTypewriter">
              Seen enough?
            </AnimatedGradientText>
            <h2 className="displayMix">Pick your artist. <em>Send the brief.</em></h2>
            <p>
              Reference a style, name the artist, drop the placement. We&apos;ll come back with
              timing and a quote before any deposit changes hands.
            </p>
          </div>
          <div className="ctaBandLinks">
            <MovingBorderLink
              href="/booking"
              containerClassName="h-auto w-auto py-0"
              borderClassName="bg-[radial-gradient(#c9a26b_40%,transparent_60%)]"
              className="primaryButton border-[rgba(201,162,107,0.25)] bg-[rgba(8,8,8,0.92)]"
              borderRadius="0.5rem"
              duration={2800}
            >
              Book a session
            </MovingBorderLink>
            <Link href="/contact" className="ghostButton">
              Ask first <ArrowRight size={15} />
            </Link>
          </div>
        </BlurFade>
      </section>

    </div>
  );
}
