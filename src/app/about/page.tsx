import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ShieldCheck, Sparkle, Users } from "@phosphor-icons/react/dist/ssr";
import { GiInkSwirl, GiSkullCrossedBones } from "react-icons/gi";
import { aboutCopy, artists } from "@/content/studio";
import { getLeadImage, studioGallery } from "@/lib/media";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { Meteors } from "@/components/ui/meteors";
import { Particles } from "@/components/ui/particles";
import { FocusCards } from "@/components/ui/focus-cards";
import { MovingBorderLink } from "@/components/moving-border-link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the story behind The Black Dahlia, the studio values, and the artists shaping custom tattoo work in Littleport.",
};

export default function AboutPage() {
  const studioValues = [
    "One client at a time — no overlap, no shared chair, no rush.",
    "Direct contact with your artist from brief to healed skin.",
    "Strict hygiene, single-use kit, aftercare you can actually follow.",
  ];

  const galleryCards = studioGallery.slice(0, 6).map((img) => ({
    title: img.title || "Studio",
    src: img.localPath,
  }));

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
              About the studio
            </AnimatedGradientText>
            <h1 className="heroDisplay">A private room <em>for proper</em> tattoos.</h1>
            <p className="lede">
              Three artists, custom work only, no flash wall. Built for long sessions and considered
              pieces — the kind you want to live with for a while.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* ── ABOUT EDITORIAL ──────────────────────────────────────────── */}
      <section className="container sectionSpacing aboutEditorialGrid">
        <BlurFade inView direction="up" delay={0.05}>
          <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden" }}>
            <CardSpotlight
              className="aboutManifestoCard border-0"
              color="rgba(201,162,107,0.07)"
              radius={420}
            >
              <h2 className="displayMix">{aboutCopy.title}</h2>
              <p className="aboutSectionIntro">
                Tattooing here is artist-led, custom first, and paced to the work — not the diary.
              </p>
              <div className="aboutCopyStack">
                {aboutCopy.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="aboutValueGrid">
                {studioValues.map((value, i) => (
                  <article key={value}>
                    {i === 0 ? <ShieldCheck weight="fill" size={18} /> : i === 1 ? <GiSkullCrossedBones size={18} /> : <GiInkSwirl size={18} />}
                    <p>{value}</p>
                  </article>
                ))}
              </div>
            </CardSpotlight>
            <BorderBeam colorFrom="#c9a26b" colorTo="#9a4c3b" size={140} duration={9} borderWidth={1} />
          </div>
        </BlurFade>

        <BlurFade inView direction="up" delay={0.12}>
          <CardSpotlight
            className="aboutTimelineCard"
            color="rgba(154,76,59,0.08)"
            radius={360}
          >
            <h2 className="displayMix">How the studio <em>came together.</em></h2>
            <ol>
              {aboutCopy.story.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="aboutTimelineMeta">
              <p>
                <Users weight="fill" size={16} /> Three resident artists, each working in their own lane.
              </p>
              <p>
                <Sparkle weight="fill" size={16} /> Custom commissions — placement and composition planned with you.
              </p>
            </div>
            <MovingBorderLink
              href="/booking"
              containerClassName="h-auto w-auto py-0"
              borderClassName="bg-[radial-gradient(#c9a26b_40%,transparent_60%)]"
              className="primaryButton border-[rgba(201,162,107,0.25)] bg-[rgba(8,8,8,0.92)]"
              borderRadius="0.5rem"
              duration={3000}
            >
              Book a session
            </MovingBorderLink>
          </CardSpotlight>
        </BlurFade>
      </section>

      {/* ── RESIDENT TEAM ────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <BlurFade inView direction="up" delay={0.03}>
          <div className="sectionHeaderWithAction">
            <div>
              <p className="eyebrow">
                <AnimatedGradientText colorFrom="#c9a26b" colorTo="#9a4c3b" speed={0.6}>
                  <span className="eyebrowNumber">The team</span>
                </AnimatedGradientText>
              </p>
              <h2 className="sectionTitle displayMix">The <em>resident</em> artists</h2>
            </div>
            <Link href="/artists" className="inlineAction">
              See full profiles <ArrowRight size={16} />
            </Link>
          </div>
        </BlurFade>

        <div className="artistEditorialGrid">
          {artists.map((artist, index) => {
            const image = getLeadImage(artist.slug);
            return (
              <BlurFade
                key={artist.slug}
                delay={0.08 + index * 0.07}
                inView
                direction="up"
                className={`artistFeatureCard${index === 0 ? " primary" : ""}`}
                style={{ padding: 0 }}
              >
                <CardSpotlight
                  className="p-0 rounded-[inherit] border-0 bg-transparent w-full h-full flex flex-col"
                  color="rgba(201,162,107,0.07)"
                  radius={380}
                >
                  {image ? (
                    <img src={image.localPath} alt={image.title || artist.name} loading="lazy" />
                  ) : null}
                  <div>
                    <p className="artistRole">{artist.role}</p>
                    <h3>{artist.name}</h3>
                    <p>{artist.shortBio}</p>
                    <div className="artistTags">
                      {artist.specialities.slice(0, 3).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <Link href={`/artists/${artist.slug}`} className="inlineAction">
                      See portfolio <ArrowRight size={15} />
                    </Link>
                  </div>
                </CardSpotlight>
              </BlurFade>
            );
          })}
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <BlurFade inView direction="up" delay={0.05} className="aboutGalleryIntro">
          <p className="eyebrow">
            <AnimatedGradientText colorFrom="#c9a26b" colorTo="#9a4c3b" speed={0.6}>
              Inside the room
            </AnimatedGradientText>
          </p>
          <h2 className="sectionTitle displayMix">Quiet space. <em>High-focus sessions.</em></h2>
          <p className="sectionIntro">
            Low traffic, low noise, and enough room to actually collaborate on placement and
            composition without anyone breathing down your neck.
          </p>
        </BlurFade>
        <BlurFade inView delay={0.15}>
          <FocusCards cards={galleryCards} />
        </BlurFade>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────────── */}
      <section className="container ctaBand relative overflow-hidden" style={{ borderRadius: "22px" }}>
        <ShootingStars
          className="absolute inset-0 rounded-[inherit]"
          starColor="#c9a26b"
          trailColor="#9a4c3b"
          minSpeed={8}
          maxSpeed={20}
          minDelay={900}
          maxDelay={2200}
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
              Ready when you are
            </AnimatedGradientText>
            <h2 className="displayMix">Bring references, placement, <em>and an open mind.</em></h2>
            <p>
              Send your idea through the booking form so we can pair you with the right artist
              and a session that actually suits the piece.
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
              Ask first
            </Link>
          </div>
        </BlurFade>
      </section>

    </div>
  );
}
