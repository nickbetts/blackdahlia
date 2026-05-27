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
            Four short steps. It lands straight with the studio so we can read it, pick the right
            artist, and get back to you.
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
            What we need <em>from you.</em>
          </h2>
          <p style={{ color: "var(--text-200)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.2rem" }}>
            The more you tell us, the faster we can put you with the right artist and give you
            a real quote. Two minutes here saves a week of emails.
          </p>
          <ol className="bookingChecklist">
            <li>Describe the idea. Mood, story, references, not just the object.</li>
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
            Send it once. It lands straight with us, no portals, no chasing.
          </p>
          <BookingForm />
          <p className="bookingPromise">
            No bots, no copy-paste replies. A real person reads every brief before it goes to the artist.
          </p>
        </div>
      </section>

    </div>
  );
}
