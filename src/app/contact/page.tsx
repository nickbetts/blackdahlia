import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, Mail, MapPin, ShieldCheck, Users } from "lucide-react";
import { studioInfo } from "@/content/studio";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact The Black Dahlia in Littleport for consultations, booking support, and tattoo enquiries.",
};

export default function ContactPage() {
  const addressOneLine = studioInfo.addressLines.join(", ");
  const responseExpectations = [
    "Booking briefs jump the queue — use the booking form if it's a real piece.",
    "Drop references and placement up front — it saves three emails.",
    "Policy, aftercare and visit questions go straight to the team.",
  ];

  return (
    <div className="pageStack pageStack--contact">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pageHero">
        <div className="container">
          <div className="pageHeroDivider" />
          <p className="eyebrow">Get in touch</p>
          <h1 className="displayXL">
            Questions first?<br /><em>Drop us a line.</em>
          </h1>
          <p className="lede">
            For an actual booking, the form is faster. For anything else — visit planning, policy,
            aftercare, cover-up assessments — use the channels below.
          </p>
        </div>
      </section>

      <section className="container contactMetaStrip" aria-label="Visit readiness">
        <span>Private appointments only</span>
        <span>Littleport, Cambridgeshire</span>
        <span>Replies within studio hours</span>
      </section>

      {/* ── CONTACT GRID ─────────────────────────────────────────────── */}
      <section className="container sectionSpacing contactGrid">

        <div className="contactPanel">
          <p className="eyebrow">Direct channels</p>
          <h2 className="displayMix" style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
            Reach us <em>directly.</em>
          </h2>
          <p style={{ color: "var(--text-200)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.4rem" }}>
            Pick whichever&apos;s easiest. Email is best for anything detailed, socials are best for
            quick questions.
          </p>

          <div className="contactLinkStack">
            <a href={`mailto:${studioInfo.email}`}>
              <Mail size={16} /> {studioInfo.email}
            </a>
            <a href={studioInfo.social.instagram} target="_blank" rel="noreferrer">
              <Camera size={16} /> @theblackdahliastudio
            </a>
            <a href={studioInfo.social.facebook} target="_blank" rel="noreferrer">
              <Users size={16} /> Facebook page
            </a>
          </div>

          <div style={{ marginTop: "1.4rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {responseExpectations.map((item) => (
              <p
                key={item}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  color: "var(--text-200)",
                  fontSize: "0.88rem",
                  lineHeight: 1.5,
                }}
              >
                <ShieldCheck size={14} style={{ flexShrink: 0, color: "var(--accent-gold)", marginTop: "0.15rem" }} />
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="contactPanel">
          <p className="eyebrow">Find the studio</p>
          <h2 className="displayMix" style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
            Private <em>— appointment only.</em>
          </h2>
          <p
            style={{
              display: "flex",
              gap: "0.5rem",
              color: "var(--text-200)",
              fontSize: "0.95rem",
              marginBottom: "0.8rem",
              alignItems: "flex-start",
            }}
          >
            <MapPin size={16} style={{ flexShrink: 0, color: "var(--accent-gold)", marginTop: "0.2rem" }} />
            {addressOneLine}
          </p>
          <a
            href={studioInfo.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inlineAction"
            style={{ marginBottom: "1.4rem", display: "inline-flex" }}
          >
            Open in Google Maps <ArrowRight size={15} />
          </a>

          <div className="contactMailBox">
            <p className="eyebrow">Quick email template</p>
            <p style={{ color: "var(--text-200)", fontSize: "0.9rem", lineHeight: 1.6, margin: "0.5rem 0 0.9rem" }}>
              Just need to ask something fast? This opens your mail app with the subject already set.
            </p>
            <a
              className="ghostButton"
              href={`mailto:${studioInfo.email}?subject=${encodeURIComponent("Question — The Black Dahlia")}`}
            >
              Open email draft
            </a>
          </div>

          <div style={{ marginTop: "1.2rem", display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <Link href="/booking" className="primaryButton">
              Book a session <ArrowRight size={14} />
            </Link>
            <Link href="/faq" className="ghostButton">
              Read the FAQ
            </Link>
          </div>
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
            <p className="eyebrow">Prefer to just book?</p>
            <h2 className="displayMix">
              Use the form. <em>It&apos;s faster.</em>
            </h2>
          </div>
          <div className="ctaBandLinks">
            <Link href="/booking" className="primaryButton">
              Book a session <ArrowRight size={15} />
            </Link>
            <Link href="/artists" className="ghostButton">
              Browse artists
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
