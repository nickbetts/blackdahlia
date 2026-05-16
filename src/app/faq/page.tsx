import type { Metadata } from "next";
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
          <p className="eyebrow">Frequently Asked Questions</p>
          <h1>Everything clients ask before their appointment.</h1>
          <p className="lede">
            If your question is not listed, use the contact page and the team can guide you directly.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing faqSectionStack">
        {faqSections.map((section, sectionIndex) => (
          <Reveal key={section.title} delay={sectionIndex * 0.08} className="faqSectionCard">
            <h2>{section.title}</h2>
            <div className="faqList">
              {section.items.map((item) => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
