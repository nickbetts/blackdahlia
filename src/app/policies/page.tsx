import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { policySections } from "@/content/studio";

export const metadata: Metadata = {
  title: "Studio Policies",
  description:
    "Read studio terms, booking policies, deposits, rescheduling, and client preparation guidelines for The Black Dahlia.",
};

export default function PoliciesPage() {
  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <p className="eyebrow">Studio Policies</p>
          <h1>Clear terms so your appointment runs smoothly.</h1>
          <p className="lede">
            Please read these before booking. They are designed to protect artists, clients, and
            session quality.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing policyGrid">
        {policySections.map((section, index) => (
          <Reveal key={section.title} delay={0.06 + index * 0.05} className="policyCard">
            <h2>{section.title}</h2>
            <ul>
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
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
        </Reveal>
      </section>
    </div>
  );
}
