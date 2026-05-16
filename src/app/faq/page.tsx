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
          <p className="eyebrow">Studio FAQ</p>
          <h1>Everything clients ask before they sit in the chair.</h1>
          <p className="lede">
            This is the fastest way to understand booking, deposits, preparation, and healing
            expectations before your appointment.
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
            <p className="eyebrow">Still unsure?</p>
            <h2>Ask directly before you place a deposit.</h2>
            <p>
              If your question is specific to your concept or timeline, contact the studio and
              include enough detail for a useful reply.
            </p>
          </div>
          <div className="ctaBandLinks">
            <Link href="/contact" className="primaryButton">
              Ask a question
            </Link>
            <Link href="/booking" className="ghostButton">
              Start booking flow <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
