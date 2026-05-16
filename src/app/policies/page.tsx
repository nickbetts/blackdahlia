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
    "Deposits are non-refundable and reserve artist time.",
    "One transfer is usually possible with appropriate notice.",
    "Late cancellations and no-shows may lose deposit and slot priority.",
  ];

  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <p className="eyebrow">Policy Framework</p>
          <h1>Clear terms that protect client care and artist time.</h1>
          <p className="lede">
            Please read these before booking. They are designed to protect artists, clients, and
            session quality.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal className="policyKeyTerms">
          <h2>Key terms at a glance</h2>
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
          <h2>Need clarification before paying a deposit?</h2>
          <p>
            Send details on your idea, timeline, and artist preference so the studio can guide you on
            next steps.
          </p>
          <Link href="/contact" className="inlineAction">
            Ask a policy question <ArrowRight size={16} />
          </Link>
          <Link href="/booking" className="primaryButton">
            Continue to booking
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
