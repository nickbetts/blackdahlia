import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, Mail, MapPin, ShieldCheck, Users } from "lucide-react";
import { studioInfo } from "@/content/studio";
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
              Get in touch
            </AnimatedGradientText>
            <h1 className="heroDisplay">Questions first? <em>Drop us a line.</em></h1>
            <p className="lede">
              For an actual booking, the form is faster. For anything else — visit planning, policy,
              aftercare, cover-up assessments — use the channels below.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* ── EDITORIAL GRID ───────────────────────────────────────────── */}
      <section className="container sectionSpacing contactEditorialGrid">
        <BlurFade inView direction="up" delay={0.05}>
          <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden" }}>
            <CardSpotlight
              className="contactChannelPanel border-0"
              color="rgba(201,162,107,0.07)"
              radius={400}
            >
              <h2 className="displayMix">Direct <em>channels</em></h2>
              <p>
                Pick whichever's easiest. Email is best for anything detailed, socials are best for
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

              <div className="contactExpectationList">
                {responseExpectations.map((item) => (
                  <p key={item}>
                    <ShieldCheck size={15} /> {item}
                  </p>
                ))}
              </div>
            </CardSpotlight>
            <BorderBeam colorFrom="#c9a26b" colorTo="#9a4c3b" size={160} duration={10} borderWidth={1} />
          </div>
        </BlurFade>

        <BlurFade inView direction="up" delay={0.1}>
          <CardSpotlight
            className="contactLocationPanel border-[rgba(255,255,255,0.08)]"
            color="rgba(154,76,59,0.06)"
            radius={380}
          >
            <h2 className="displayMix">Find <em>the studio</em></h2>
            <p className="artistRole">Private — appointment only</p>
            <p>
              <MapPin size={16} /> {addressOneLine}
            </p>
            <a href={studioInfo.mapUrl} target="_blank" rel="noreferrer" className="inlineAction">
              Open in Google Maps <ArrowRight size={15} />
            </a>

            <div className="contactLocationActions">
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
              <Link href="/faq" className="ghostButton">
                Read the FAQ
              </Link>
            </div>
          </CardSpotlight>
        </BlurFade>
      </section>

      {/* ── QUICK EMAIL ──────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <BlurFade inView direction="up" delay={0.05}>
          <CardSpotlight
            className="contactMailtoBox border-[rgba(255,255,255,0.08)]"
            color="rgba(201,162,107,0.06)"
            radius={450}
          >
            <h2 className="displayMix">Quick email <em>template</em></h2>
            <p>
              Just need to ask something fast? This opens your mail app with the subject already set.
            </p>
            <a
              className="ghostButton"
              href={`mailto:${studioInfo.email}?subject=${encodeURIComponent("Question — The Black Dahlia")}`}
            >
              Open email draft
            </a>
          </CardSpotlight>
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
              For actual bookings
            </AnimatedGradientText>
            <h2 className="displayMix">The form gets the <em>fastest reply.</em></h2>
            <p>
              Style direction, placement, references, preferred artist — send it once, properly.
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
            <Link href="/faq" className="ghostButton">
              Read the FAQ <ArrowRight size={15} />
            </Link>
          </div>
        </BlurFade>
      </section>

    </div>
  );
}
