import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, Mail, MapPin, ShieldCheck, Users } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { studioInfo } from "@/content/studio";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact The Black Dahlia in Littleport for consultations, booking support, and tattoo enquiries.",
};

export default function ContactPage() {
  const addressOneLine = studioInfo.addressLines.join(", ");
  const responseExpectations = [
    "Booking briefs are prioritised over generic enquiries.",
    "Share references and placement details for faster replies.",
    "Policy and aftercare questions are answered directly by the team.",
  ];

  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <p className="eyebrow">Studio Contact</p>
          <h1>Need guidance before you book? Start here.</h1>
          <p className="lede">
            For tattoo requests, the consultation form is still the fastest route. This page is best
            for direct questions and visit planning.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing contactEditorialGrid">
        <Reveal className="contactChannelPanel">
          <h2>Direct channels</h2>
          <p>
            If your message is not a full booking brief, use one of the channels below and the team
            will point you to the right next step.
          </p>

          <div className="contactLinkStack">
            <a href={`mailto:${studioInfo.email}`}>
              <Mail size={16} /> {studioInfo.email}
            </a>
            <a href={studioInfo.social.instagram} target="_blank" rel="noreferrer">
              <Camera size={16} /> Instagram
            </a>
            <a href={studioInfo.social.facebook} target="_blank" rel="noreferrer">
              <Users size={16} /> Facebook
            </a>
          </div>

          <div className="contactExpectationList">
            {responseExpectations.map((item) => (
              <p key={item}>
                <ShieldCheck size={15} /> {item}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="contactLocationPanel">
          <h2>Visit planning</h2>
          <p className="artistRole">Private studio / appointment only</p>
          <p>
            <MapPin size={16} /> {addressOneLine}
          </p>
          <a href={studioInfo.mapUrl} target="_blank" rel="noreferrer" className="inlineAction">
            Open in Google Maps <ArrowRight size={15} />
          </a>

          <div className="contactLocationActions">
            <Link href="/booking" className="primaryButton">
              Start consultation form
            </Link>
            <Link href="/faq" className="ghostButton">
              Read common questions
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal className="contactMailtoBox">
          <h2>Quick message template</h2>
          <p>
            Need to send a fast note first? Use this prefilled subject line and include your key
            question.
          </p>
          <a
            className="ghostButton"
            href={`mailto:${studioInfo.email}?subject=${encodeURIComponent("General enquiry - The Black Dahlia")}`}
          >
            Draft email
          </a>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal className="contactBookingBand">
          <div>
            <p className="eyebrow">For tattoo requests</p>
            <h2>The booking route gets the fastest, most accurate response.</h2>
            <p>
              Include style direction, placement, references, and preferred artist to avoid back and
              forth.
            </p>
          </div>
          <Link href="/booking" className="primaryButton">
            Open booking flow
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
