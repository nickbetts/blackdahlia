import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { policySections } from "@/content/studio";
import { StarsBackground } from "@/components/ui/stars-background";

export const metadata: Metadata = {
  title: "Studio Policies",
  description:
    "Read studio terms, booking policies, deposits, rescheduling, and client preparation guidelines for The Black Dahlia.",
};

export default function PoliciesPage() {
  const keyTerms = [
    "Deposits are non-refundable. They hold the artist's time.",
    "One reschedule with 7+ days' notice. After that the deposit's gone.",
    "No-shows lose the deposit and slot priority on future bookings.",
  ];

  return (
    <div className="pageStack pageStack--policies">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pageHero">
        <div className="container">
          <div className="pageHeroDivider" />
          <p className="eyebrow">Studio policies</p>
          <h1 className="displayXL">
            The <em>house rules.</em>
          </h1>
          <p className="lede">
            Read these before you book. They keep the room running properly, fair on artists,
            fair on clients, and clear from the start.
          </p>
        </div>
      </section>

      {/* ── KEY TERMS ────────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <p className="eyebrow">Quick read first</p>
        <h2 className="displayLg" style={{ marginTop: "0.4rem", marginBottom: "1.2rem" }}>
          Three things <em>you should know.</em>
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.7rem",
            padding: "1.4rem 1.6rem",
            background: "rgba(154,76,59,0.08)",
            border: "1px solid rgba(154,76,59,0.25)",
            borderRadius: "12px",
          }}
        >
          {keyTerms.map((term) => (
            <p
              key={term}
              style={{
                display: "flex",
                gap: "0.6rem",
                color: "var(--text-100)",
                fontSize: "0.95rem",
                lineHeight: 1.55,
                alignItems: "flex-start",
              }}
            >
              <CircleAlert
                size={15}
                style={{ flexShrink: 0, color: "var(--accent-red)", marginTop: "0.2rem" }}
              />
              {term}
            </p>
          ))}
        </div>
      </section>

      <section className="container policyLegend" aria-label="Policy legend">
        <span><CircleAlert size={14} /> Important</span>
        <span><CheckCircle2 size={14} /> Included in written confirmation</span>
      </section>

      {/* ── POLICY CARDS ─────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <p className="eyebrow">Full policies</p>
        <h2 className="displayLg" style={{ marginTop: "0.4rem", marginBottom: "1.4rem" }}>
          Everything <em>in detail.</em>
        </h2>
        <div className="policyGrid">
          {policySections.map((section) => (
            <div key={section.title} className="policyCard">
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.05rem",
                  color: "var(--text-100)",
                  marginBottom: "0.9rem",
                  paddingBottom: "0.7rem",
                  borderBottom: "1px solid var(--border-soft)",
                }}
              >
                {section.title}
              </h3>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.55rem", margin: 0, padding: 0, listStyle: "none" }}>
                {section.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      color: "var(--text-200)",
                      fontSize: "0.9rem",
                      lineHeight: 1.55,
                      alignItems: "flex-start",
                    }}
                  >
                    <CheckCircle2
                      size={14}
                      style={{ flexShrink: 0, color: "var(--accent-gold)", marginTop: "0.2rem" }}
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────────── */}
      <section className="container ctaBand">
        <StarsBackground
          className="absolute inset-0 rounded-[inherit]"
          starDensity={0.00015}
          allStarsTwinkle
          twinkleProbability={0.5}
        />
        <div className="ctaBandInner" style={{ position: "relative", zIndex: 2 }}>
          <div>
            <p className="eyebrow">Not sure something applies to your piece?</p>
            <h2 className="displayMix">
              Tell us the idea. <em>We&apos;ll walk you through it.</em>
            </h2>
          </div>
          <div className="ctaBandLinks">
            <Link href="/booking" className="primaryButton">
              Book a session <ArrowRight size={15} />
            </Link>
            <Link href="/contact" className="ghostButton">
              Ask a policy question
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
