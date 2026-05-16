import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Mail, MapPin, Users } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { studioInfo } from "@/content/studio";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact The Black Dahlia in Littleport for consultations, booking support, and tattoo enquiries.",
};

export default function ContactPage() {
  const addressOneLine = studioInfo.addressLines.join(", ");

  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <p className="eyebrow">Contact The Studio</p>
          <h1>Send your idea over and we will come back with the right path.</h1>
          <p className="lede">
            For booking requests, the dedicated booking page gives the team the detail they need for
            accurate responses.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing contactLayout">
        <Reveal className="contactCard">
          <h2>Direct channels</h2>
          <a href={`mailto:${studioInfo.email}`}>
            <Mail size={16} /> {studioInfo.email}
          </a>
          <a href={studioInfo.social.instagram} target="_blank" rel="noreferrer">
            <Camera size={16} /> Instagram
          </a>
          <a href={studioInfo.social.facebook} target="_blank" rel="noreferrer">
            <Users size={16} /> Facebook
          </a>
        </Reveal>

        <Reveal delay={0.1} className="contactCard">
          <h2>Location</h2>
          <p>
            <MapPin size={16} /> {addressOneLine}
          </p>
          <a href={studioInfo.mapUrl} target="_blank" rel="noreferrer" className="inlineAction">
            Open in Google Maps
          </a>
          <Link href="/booking" className="primaryButton sidebarButton">
            Open Booking Form
          </Link>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal className="contactMailtoBox">
          <h2>Quick message template</h2>
          <p>
            If you want to send a fast query by email, use the button below with a prefilled subject
            line.
          </p>
          <a
            className="ghostButton"
            href={`mailto:${studioInfo.email}?subject=${encodeURIComponent("General enquiry - The Black Dahlia")}`}
          >
            Draft Email
          </a>
        </Reveal>
      </section>
    </div>
  );
}
