import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleHelp } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { faqSections } from "@/content/studio";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Read booking, pricing, preparation, aftercare, safety, and policy answers from The Black Dahlia tattoo studio.",
};

export default function FaqPage() {
  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <p className="eyebrow eyebrowTypewriter">FAQ</p>
          <h1 className="heroDisplay">Everything <em>before you sit down.</em></h1>
          <p className="lede">
            Booking, deposits, prep, healing, cover-ups — the questions we get every week, answered
            once, clearly.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal className="faqCategoryStrip">
          {faqSections.map((section) => (
            <article key={section.title}>
              <p className="artistRole">Category</p>
              <h2>{section.title}</h2>
              <p>{section.items.length} answers</p>
            </article>
          ))}
        </Reveal>
      </section>

      <section className="container sectionSpacing faqSectionStack">
        {faqSections.map((section, sectionIndex) => (
          <Reveal key={section.title} delay={sectionIndex * 0.08} className="faqSectionCard faqSectionCardEditorial">
            <div className="faqSectionHeading">
              <h2>{section.title}</h2>
              <p>{section.items.length} answers</p>
            </div>
            <div className="faqList">
              {section.items.map((item) => (
                <details key={item.question}>
                  <summary>
                    <CircleHelp size={15} />
                    <span>{item.question}</span>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        ))}
      </section>

      <section className="container ctaBand">
        <Reveal className="ctaBandInner">
          <div>
            <p className="eyebrow eyebrowTypewriter">Still unsure?</p>
            <h2 className="displayMix">Ask us <em>before you pay.</em></h2>
            <p>
              If the answer’s tied to your piece, your skin or your timeline, drop us a line with
              the detail. We’ll come back to you properly.
            </p>
          </div>
          <div className="ctaBandLinks">
            <Link href="/contact" className="primaryButton">
              Ask a question
            </Link>
            <Link href="/booking" className="ghostButton">
              Book a session <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
