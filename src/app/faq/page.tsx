import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleHelp } from "lucide-react";
import { faqSections } from "@/content/studio";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { Meteors } from "@/components/ui/meteors";
import { Particles } from "@/components/ui/particles";
import { MovingBorderLink } from "@/components/moving-border-link";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Read booking, pricing, preparation, aftercare, safety, and policy answers from The Black Dahlia tattoo studio.",
};

export default function FaqPage() {
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
              FAQ
            </AnimatedGradientText>
            <h1 className="heroDisplay">Everything <em>before you sit down.</em></h1>
            <p className="lede">
              Booking, deposits, prep, healing, cover-ups — the questions we get every week, answered
              once, clearly.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* ── CATEGORY STRIP ───────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <BlurFade inView direction="up" delay={0.04}>
          <div className="faqCategoryStrip">
            {faqSections.map((section) => (
              <CardSpotlight
                key={section.title}
                className="faqCategoryCard border-[rgba(255,255,255,0.07)]"
                color="rgba(201,162,107,0.05)"
                radius={240}
              >
                <p className="artistRole">Category</p>
                <h2>{section.title}</h2>
                <p>{section.items.length} answers</p>
              </CardSpotlight>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* ── FAQ SECTIONS ─────────────────────────────────────────────── */}
      <section className="container sectionSpacing faqSectionStack">
        {faqSections.map((section, sectionIndex) => (
          <BlurFade key={section.title} inView direction="up" delay={sectionIndex * 0.06}>
            <CardSpotlight
              className="faqSectionCard faqSectionCardEditorial border-[rgba(255,255,255,0.08)]"
              color="rgba(201,162,107,0.07)"
              radius={400}
            >
              <div className="faqSectionHeading">
                <h2>{section.title}</h2>
                <p>{section.items.length} answers</p>
              </div>
              <div className="faqList">
                {section.items.map((item) => (
                  <details key={item.question}>
                    <summary>
                      <CircleHelp size={15} />
                      <span>{item.question}</span>
                    </summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
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
              Still unsure?
            </AnimatedGradientText>
            <h2 className="displayMix">Ask us <em>before you pay.</em></h2>
            <p>
              If the answer's tied to your piece, your skin or your timeline, drop us a line with
              the detail. We'll come back to you properly.
            </p>
          </div>
          <div className="ctaBandLinks">
            <MovingBorderLink
              href="/contact"
              containerClassName="h-auto w-auto py-0"
              borderClassName="bg-[radial-gradient(#c9a26b_40%,transparent_60%)]"
              className="primaryButton border-[rgba(201,162,107,0.25)] bg-[rgba(8,8,8,0.92)]"
              borderRadius="0.5rem"
              duration={2800}
            >
              Ask a question
            </MovingBorderLink>
            <Link href="/booking" className="ghostButton">
              Book a session <ArrowRight size={15} />
            </Link>
          </div>
        </BlurFade>
      </section>

    </div>
  );
}
