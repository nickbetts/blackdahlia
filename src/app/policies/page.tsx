import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { policySections } from "@/content/studio";

export const metadata: Metadata = {
  title: "Studio Policies",
  description:
    "Read studio terms, booking policies, deposits, rescheduling, and client preparation guidelines for The Black Dahlia.",
};

export default function PoliciesPage() {
  const keyTerms = [
    "Deposits are non-refundable — they hold the artist’s time.",
    "One reschedule with 7+ days’ notice. After that the deposit’s gone.",
    "No-shows lose the deposit and slot priority on future bookings.",
  ];

  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <p className="eyebrow eyebrowTypewriter">Studio policies</p>
          <h1 className="heroDisplay">The <em>house rules.</em></h1>
          <p className="lede">
            Read these before you book. They keep the room running properly — fair on artists,
            fair on clients, and clear from the start.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal className="policyKeyTerms">
          <h2 className="displayMix">Quick <em>read first</em></h2>
          <div>
            {keyTerms.map((term) => (
              <p key={term}>
                <CircleAlert size={15} />
                <span>{term}</span>
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="container sectionSpacing policyEditorialStack">
        {policySections.map((section, index) => (
          <Reveal key={section.title} delay={0.06 + index * 0.05} className="policyCard policyCardEditorial">
            <h2>{section.title}</h2>
            <ul>
              {section.bullets.map((bullet) => (
                <li key={bullet}>
                  <CheckCircle2 size={15} />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </section>

      <section className="container sectionSpacing">
        <Reveal className="policyReminder">
          <h2 className="displayMix">Not sure something applies <em>to your piece?</em></h2>
          <p>
            Tell us the idea, timing and artist you’re leaning toward and we’ll walk you through
            what it means for you specifically.
          </p>
          <Link href="/contact" className="inlineAction">
            Ask a policy question <ArrowRight size={16} />
          </Link>
          <Link href="/booking" className="primaryButton">
            Book a session
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
