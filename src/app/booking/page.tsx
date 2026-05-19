import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";

export const metadata: Metadata = {
  title: "Booking",
  description:
    "Submit your tattoo booking details to The Black Dahlia with concept, placement, artist preference, and scheduling info.",
};

export default function BookingPage() {
  return (
    <div className="pageStack pageStack--booking">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pageHero">
        <div className="container">
          <div className="pageHeroDivider" />
          <p className="eyebrow">Booking</p>
          <h1 className="displayXL">
            Send your idea.<br /><em>We&apos;ll take it from there.</em>
          </h1>
          <p className="lede">
            Four short steps. The form ends in a prefilled email so everything lands in one
            clean message — no back-and-forth, no missing details.
          </p>
        </div>
      </section>

      {/* ── BOOKING GRID ─────────────────────────────────────────────── */}
      <section className="container sectionSpacing bookingIntroGrid">
        <div className="bookingGuidance">
          <p className="eyebrow">Before you hit send</p>
          <h2
            className="displayMix"
            style={{ marginTop: "0.5rem", marginBottom: "1rem" }}
          >
            What we need <em>to help properly.</em>
          </h2>
          <p style={{ color: "var(--text-200)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.2rem" }}>
            The more we know, the faster we can match you with the right artist and quote the
            piece properly. A couple of minutes here saves a week of emails.
          </p>
          <ol className="bookingChecklist">
            <li>Describe the idea — mood, story, references, not just the object.</li>
            <li>Tell us where it goes and roughly how big you want it.</li>
            <li>Drop any Instagram, Pinterest or image links you&apos;re drawing from.</li>
            <li>Flag cover-ups, existing ink, or anything tricky about the placement.</li>
          </ol>
        </div>

        <div className="bookingCard">
          <p className="eyebrow">The booking form</p>
          <h2
            className="displayMix"
            style={{ marginTop: "0.5rem", marginBottom: "0.8rem" }}
          >
            Four steps. <em>One email.</em>
          </h2>
          <p style={{ color: "var(--text-200)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.4rem" }}>
            We open your mail app at the end with the brief already written — you
            just hit send.
          </p>
          <BookingForm />
          <p className="bookingPromise">
            No automated bots and no generic templates. Every booking brief is reviewed by the studio team before it gets to the artist.
          </p>
        </div>
      </section>

    </div>
  );
}
