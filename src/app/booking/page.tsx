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
          <p className="eyebrow">Booking Form</p>
          <h1>Start your tattoo brief.</h1>
          <p className="lede">
            Share as much detail as possible so the team can quote accurately and match you with the
            right artist.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal className="bookingCard">
          <h2>Request An Appointment</h2>
          <p>
            Include style, references, placement, and any timeline constraints. The static form opens
            your email app with all details prefilled.
          </p>
          <BookingForm />
        </Reveal>
      </section>
    </div>
  );
}
