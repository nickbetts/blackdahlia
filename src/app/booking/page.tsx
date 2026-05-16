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
          <p className="eyebrow">Consultation Booking</p>
          <h1>Build your tattoo brief in four steps.</h1>
          <p className="lede">
            This flow is designed to match you with the right artist quickly, quote accurately, and
            keep communication clean from the first message.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing bookingIntroGrid">
        <Reveal className="bookingGuidance" delay={0.05}>
          <h2>Before you submit</h2>
          <p>
            Include references, placement, scale, and style intent. Detailed briefs move faster and
            reduce revision rounds.
          </p>
          <ol className="bookingChecklist">
            <li>Describe the concept and mood, not just the object.</li>
            <li>Add size and placement so we can estimate timing correctly.</li>
            <li>Share links to references or inspirations where possible.</li>
            <li>Tell us if this is a cover-up or rework from existing ink.</li>
          </ol>
        </Reveal>

        <Reveal className="bookingCard bookingCardExpanded" delay={0.1}>
          <h2>Request a consultation</h2>
          <p>
            The form is step-based and ends in a prefilled email draft so your details are delivered
            in one structured message.
          </p>
          <BookingForm />
        </Reveal>
      </section>
    </div>
  );
}
