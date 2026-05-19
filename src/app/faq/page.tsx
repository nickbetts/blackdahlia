import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleHelp } from "lucide-react";
import { faqSections } from "@/content/studio";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Read booking, pricing, preparation, aftercare, safety, and policy answers from The Black Dahlia tattoo studio.",
};

export default function FaqPage() {
  const sectionId = (title: string) =>
    `faq-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

  return (
    <div className="pageStack pageStack--faq">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pageHero">
        <div className="container">
          <div className="pageHeroDivider" />
          <p className="eyebrow">FAQ</p>
          <h1 className="displayXL">
            Everything <em>before<br />you sit down.</em>
          </h1>
          <p className="lede">
            Booking, deposits, prep, healing, cover-ups — the questions we get every week, answered
            once, clearly.
          </p>
        </div>
      </section>

      <section className="container faqJumpStrip" aria-label="FAQ categories">
        {faqSections.map((section) => (
          <a key={section.title} href={`#${sectionId(section.title)}`}>
            {section.title}
          </a>
        ))}
      </section>

      {/* ── FAQ SECTIONS ─────────────────────────────────────────────── */}
      <section className="container sectionSpacing faqSectionStack">
        {faqSections.map((section) => (
          <div key={section.title} className="faqSection" id={sectionId(section.title)}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem" }}>
              <h2 className="displayMix">{section.title}</h2>
              <span style={{ color: "var(--text-300)", fontSize: "0.8rem", fontFamily: "var(--font-accent)", whiteSpace: "nowrap" }}>
                {section.items.length} answers
              </span>
            </div>
            <div className="faqList">
              {section.items.map((item) => (
                <details key={item.question}>
                  <summary>
                    <CircleHelp size={15} style={{ flexShrink: 0, color: "var(--accent-gold)" }} />
                    <span>{item.question}</span>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
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
            <p className="eyebrow">Still unsure?</p>
            <h2 className="displayMix">
              Ask us <em>before you pay.</em>
            </h2>
            <p style={{ color: "var(--text-200)", fontSize: "0.95rem", lineHeight: 1.6 }}>
              If the answer&apos;s tied to your piece, your skin or your timeline, drop us a line with
              the detail. We&apos;ll come back to you properly.
            </p>
          </div>
          <div className="ctaBandLinks">
            <Link href="/contact" className="primaryButton">
              Ask a question <ArrowRight size={15} />
            </Link>
            <Link href="/booking" className="ghostButton">
              Book a session
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
