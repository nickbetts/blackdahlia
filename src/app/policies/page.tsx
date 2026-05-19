import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { policySections } from "@/content/studio";
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
  title: "Studio Policies",
  description:
    "Read studio terms, booking policies, deposits, rescheduling, and client preparation guidelines for The Black Dahlia.",
};

export default function PoliciesPage() {
  const keyTerms = [
    "Deposits are non-refundable — they hold the artist's time.",
    "One reschedule with 7+ days' notice. After that the deposit's gone.",
    "No-shows lose the deposit and slot priority on future bookings.",
  ];

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
              Studio policies
            </AnimatedGradientText>
            <h1 className="heroDisplay">The <em>house rules.</em></h1>
            <p className="lede">
              Read these before you book. They keep the room running properly — fair on artists,
              fair on clients, and clear from the start.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* ── KEY TERMS ────────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <BlurFade inView direction="up" delay={0.05}>
          <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden" }}>
            <CardSpotlight
              className="policyKeyTerms border-0"
              color="rgba(154,76,59,0.09)"
              radius={420}
            >
              <h2 className="displayMix">Quick <em>read first</em></h2>
              <div>
                {keyTerms.map((term) => (
                  <p key={term}>
                    <CircleAlert size={15} />
                    <span>{term}</span>
                  </p>
                ))}
              </div>
            </CardSpotlight>
            <BorderBeam colorFrom="#9a4c3b" colorTo="#c9a26b" size={160} duration={9} borderWidth={1} />
          </div>
        </BlurFade>
      </section>

      {/* ── POLICY CARDS ─────────────────────────────────────────────── */}
      <section className="container sectionSpacing policyEditorialStack">
        {policySections.map((section, index) => (
          <BlurFade key={section.title} inView direction="up" delay={0.06 + index * 0.05}>
            <CardSpotlight
              className="policyCard policyCardEditorial border-[rgba(255,255,255,0.08)]"
              color="rgba(154,76,59,0.07)"
              radius={360}
            >
              <h2>{section.title}</h2>
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>
                    <CheckCircle2 size={15} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </CardSpotlight>
          </BlurFade>
        ))}
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
              Not sure something applies to your piece?
            </AnimatedGradientText>
            <h2 className="displayMix">Tell us the idea. <em>We'll walk you through it.</em></h2>
            <p>
              Timing, artist preference, cover-ups — drop us a line and we'll explain what any of these mean for you specifically.
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
              Ask a policy question <ArrowRight size={15} />
            </Link>
          </div>
        </BlurFade>
      </section>

    </div>
  );
}
