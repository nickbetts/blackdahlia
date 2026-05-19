import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ShieldCheck, Sparkle, Users } from "@phosphor-icons/react/dist/ssr";
import { GiInkSwirl, GiSkullCrossedBones } from "react-icons/gi";
import { aboutCopy, artists } from "@/content/studio";
import { getLeadImage, studioGallery } from "@/lib/media";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the story behind The Black Dahlia, the studio values, and the artists shaping custom tattoo work in Littleport.",
};

export default function AboutPage() {
  const studioValues = [
    { icon: <ShieldCheck weight="fill" size={18} />, text: "One client at a time — no overlap, no shared chair, no rush." },
    { icon: <GiSkullCrossedBones size={18} />, text: "Direct contact with your artist from brief to healed skin." },
    { icon: <GiInkSwirl size={18} />, text: "Strict hygiene, single-use kit, aftercare you can actually follow." },
  ];

  const galleryImages = studioGallery.slice(0, 6);

  return (
    <div className="pageStack">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pageHero">
        <div className="container">
          <div className="pageHeroDivider" />
          <p className="eyebrow">About the studio</p>
          <h1 className="displayXL">
            A private room<br /><em>for proper tattoos.</em>
          </h1>
          <p className="lede">
            Three artists, custom work only, no flash wall. Built for long sessions and considered
            pieces — the kind you want to live with for a while.
          </p>
        </div>
      </section>

      {/* ── ABOUT SPLIT ──────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <div className="aboutSplit">
          <div>
            <p className="eyebrow">The studio</p>
            <h2 className="displayMix" style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
              {aboutCopy.title}
            </h2>
            <p className="lede" style={{ marginBottom: "1.2rem" }}>
              Tattooing here is artist-led, custom first, and paced to the work — not the diary.
            </p>
            <div className="aboutBodyText">
              {aboutCopy.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">How the studio came together</p>
            <h2 className="displayMix" style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
              The <em>story so far.</em>
            </h2>
            <div className="aboutTimeline">
              {aboutCopy.story.map((step, i) => (
                <div key={step} className="aboutTimelineItem">
                  <span style={{ color: "var(--accent-gold)", fontFamily: "var(--font-accent)", fontSize: "0.8rem" }}>
                    0{i + 1}
                  </span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <p style={{ color: "var(--text-200)", fontSize: "0.9rem" }}>
                <Users weight="fill" size={15} style={{ display: "inline", marginRight: "0.4rem" }} />
                Three resident artists, each working in their own lane.
              </p>
              <p style={{ color: "var(--text-200)", fontSize: "0.9rem" }}>
                <Sparkle weight="fill" size={15} style={{ display: "inline", marginRight: "0.4rem" }} />
                Custom commissions — placement and composition planned with you.
              </p>
            </div>
            <Link
              href="/booking"
              className="primaryButton"
              style={{ display: "inline-flex", marginTop: "1.5rem" }}
            >
              Book a session <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <hr className="sectionRule container" />

      {/* ── VALUES ───────────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <p className="eyebrow">The values</p>
        <h2 className="displayLg" style={{ marginTop: "0.4rem", marginBottom: "1.4rem" }}>
          How we <em>run the room.</em>
        </h2>
        <div className="aboutValueGrid">
          {studioValues.map((value) => (
            <div key={value.text} className="aboutValueCard">
              <span style={{ color: "var(--accent-gold)" }}>{value.icon}</span>
              <p>{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="sectionRule container" />

      {/* ── RESIDENT TEAM ────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <div className="sectionHeaderWithAction">
          <div>
            <p className="eyebrow">The team</p>
            <h2 className="displayLg" style={{ marginTop: "0.4rem" }}>
              The <em>resident</em> artists
            </h2>
          </div>
          <Link href="/artists" className="inlineAction">
            See full profiles <ArrowRight size={16} />
          </Link>
        </div>

        <div className="aboutGalleryGrid" style={{ marginTop: "1.6rem" }}>
          {artists.map((artist) => {
            const image = getLeadImage(artist.slug);
            return (
              <Link key={artist.slug} href={`/artists/${artist.slug}`} style={{ display: "block", borderRadius: "12px", overflow: "hidden", position: "relative" }}>
                {image ? (
                  <img
                    src={image.localPath}
                    alt={image.title || artist.name}
                    loading="lazy"
                    style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block" }}
                  />
                ) : null}
                <div style={{ padding: "0.8rem", background: "var(--bg-900)", borderTop: "1px solid var(--border-soft)" }}>
                  <p className="artistRole">{artist.role}</p>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", color: "var(--text-100)" }}>
                    {artist.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <hr className="sectionRule container" />

      {/* ── STUDIO GALLERY ───────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <p className="eyebrow">The work</p>
        <h2 className="displayLg" style={{ marginTop: "0.4rem", marginBottom: "1.4rem" }}>
          From the <em>studio floor.</em>
        </h2>
        <div className="aboutGalleryGrid">
          {galleryImages.map((img) => (
            <div
              key={img.hash}
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                aspectRatio: "1",
                background: "var(--bg-900)",
              }}
            >
              <img
                src={img.localPath}
                alt={img.title || "Studio work"}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────────── */}
      <section className="container ctaBand">
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
        <div className="ctaBandInner" style={{ position: "relative", zIndex: 2 }}>
          <div>
            <p className="eyebrow">Come and sit</p>
            <h2 className="displayMix">
              Talk to us <em>before you book.</em>
            </h2>
          </div>
          <div className="ctaBandLinks">
            <Link href="/booking" className="primaryButton">
              Book a session <ArrowRight size={15} />
            </Link>
            <Link href="/contact" className="ghostButton">
              Ask a question
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
