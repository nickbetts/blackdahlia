import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { BookingForm } from "@/components/booking-form";

export const metadata: Metadata = {
  title: "Booking",
  description:
    "Submit your tattoo booking details to The Black Dahlia with concept, placement, artist preference, and scheduling info.",
};

export default function BookingPage() {
  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <p className="eyebrow eyebrowTypewriter">Booking</p>
          <h1 className="heroDisplay">Send your idea. <em>We&apos;ll take it from there.</em></h1>
          <p className="lede">
            Four short steps. The form ends in a prefilled email so everything lands in one
            clean message — no back-and-forth, no missing details.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing bookingIntroGrid">
        <Reveal className="bookingGuidance" delay={0.05}>
          <h2 className="displayMix">Before you <em>hit send</em></h2>
          <p>
            The more we know, the faster we can match you with the right artist and quote the
            piece properly. A couple of minutes here saves a week of emails.
          </p>
          <ol className="bookingChecklist">
            <li>Describe the idea — mood, story, references, not just the object.</li>
            <li>Tell us where it goes and roughly how big you want it.</li>
            <li>Drop any Instagram, Pinterest or image links you’re drawing from.</li>
            <li>Flag cover-ups, existing ink, or anything tricky about the placement.</li>
          </ol>
        </Reveal>

        <Reveal className="bookingCard bookingCardExpanded" delay={0.1}>
          <h2 className="displayMix">The <em>booking form</em></h2>
          <p>
            Four steps. We open your mail app at the end with the brief already written — you
            just hit send.
          </p>
          <BookingForm />
        </Reveal>
      </section>
    </div>
  );
}
