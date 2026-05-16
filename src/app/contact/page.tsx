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
    "Booking briefs jump the queue — use the booking form if it’s a real piece.",
    "Drop references and placement up front — it saves three emails.",
    "Policy, aftercare and visit questions go straight to the team.",
  ];

  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <p className="eyebrow eyebrowTypewriter">Get in touch</p>
          <h1 className="heroDisplay">Questions first? <em>Drop us a line.</em></h1>
          <p className="lede">
            For an actual booking, the form is faster. For anything else — visit planning, policy,
            aftercare, cover-up assessments — use the channels below.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing contactEditorialGrid">
        <Reveal className="contactChannelPanel">
          <h2 className="displayMix">Direct <em>channels</em></h2>
          <p>
            Pick whichever’s easiest. Email is best for anything detailed, socials are best for
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
        </Reveal>

        <Reveal delay={0.1} className="contactLocationPanel">
          <h2 className="displayMix">Find <em>the studio</em></h2>
          <p className="artistRole">Private — appointment only</p>
          <p>
            <MapPin size={16} /> {addressOneLine}
          </p>
          <a href={studioInfo.mapUrl} target="_blank" rel="noreferrer" className="inlineAction">
            Open in Google Maps <ArrowRight size={15} />
          </a>

          <div className="contactLocationActions">
            <Link href="/booking" className="primaryButton">
              Book a session
            </Link>
            <Link href="/faq" className="ghostButton">
              Read the FAQ
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal className="contactMailtoBox">
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
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal className="contactBookingBand">
          <div>
            <p className="eyebrow">For actual bookings</p>
            <h2 className="displayMix">The form gets the <em>fastest reply.</em></h2>
            <p>
              Style direction, placement, references, preferred artist — send it once, properly.
            </p>
          </div>
          <Link href="/booking" className="primaryButton">
            Book a session
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
