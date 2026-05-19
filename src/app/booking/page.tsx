import type { Metadata } from "next";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BorderBeam } from "@/components/ui/border-beam";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Particles } from "@/components/ui/particles";
import { BookingForm } from "@/components/booking-form";

export const metadata: Metadata = {
  title: "Booking",
  description:
    "Submit your tattoo booking details to The Black Dahlia with concept, placement, artist preference, and scheduling info.",
};

export default function BookingPage() {
  return (
    <div className="pageStack">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="heroOuter relative overflow-hidden" style={{ paddingBottom: "2rem" }}>
        <BackgroundBeams />
        <Particles
          className="absolute inset-0 pointer-events-none"
          quantity={35}
          color="#c9a26b"
          size={0.45}
          staticity={65}
          ease={50}
        />
        <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "clamp(2rem, 5vw, 4rem)" }}>
          <BlurFade inView direction="up" delay={0.05} className="pageHeroCompact">
            <AnimatedGradientText colorFrom="#c9a26b" colorTo="#9a4c3b" speed={0.6} className="eyebrow eyebrowTypewriter">
              Booking
            </AnimatedGradientText>
            <h1 className="heroDisplay">Send your idea. <em>We&apos;ll take it from there.</em></h1>
            <p className="lede">
              Four short steps. The form ends in a prefilled email so everything lands in one
              clean message — no back-and-forth, no missing details.
            </p>
          </BlurFade>
        </div>
      </section>

      {/* ── BOOKING GRID ─────────────────────────────────────────────── */}
      <section className="container sectionSpacing bookingIntroGrid">
        <BlurFade inView direction="up" delay={0.05}>
          <CardSpotlight
            className="bookingGuidance border-[rgba(255,255,255,0.1)]"
            color="rgba(201,162,107,0.07)"
            radius={380}
          >
            <h2 className="displayMix">Before you <em>hit send</em></h2>
            <p>
              The more we know, the faster we can match you with the right artist and quote the
              piece properly. A couple of minutes here saves a week of emails.
            </p>
            <ol className="bookingChecklist">
              <li>Describe the idea — mood, story, references, not just the object.</li>
              <li>Tell us where it goes and roughly how big you want it.</li>
              <li>Drop any Instagram, Pinterest or image links you&apos;re drawing from.</li>
              <li>Flag cover-ups, existing ink, or anything tricky about the placement.</li>
            </ol>
          </CardSpotlight>
        </BlurFade>

        <BlurFade inView direction="up" delay={0.1}>
          <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden" }}>
            <CardSpotlight
              className="bookingCard bookingCardExpanded border-0"
              color="rgba(201,162,107,0.07)"
              radius={420}
            >
              <h2 className="displayMix">The <em>booking form</em></h2>
              <p>
                Four steps. We open your mail app at the end with the brief already written — you
                just hit send.
              </p>
              <BookingForm />
            </CardSpotlight>
            <BorderBeam colorFrom="#c9a26b" colorTo="#9a4c3b" size={200} duration={8} borderWidth={1.5} />
          </div>
        </BlurFade>

      </section>
    </div>
  );
}
