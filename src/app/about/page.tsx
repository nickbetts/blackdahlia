import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { aboutCopy, artists } from "@/content/studio";
import { getLeadImage, studioGallery } from "@/lib/media";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the story behind The Black Dahlia, the studio values, and the artists shaping custom tattoo work in Littleport.",
};

export default function AboutPage() {
  const studioValues = [
    "Private appointment pacing over high-volume turnover",
    "Artist-led consultations with direct communication",
    "Strict hygiene and aftercare expectations",
  ];

  const studioFrames = studioGallery.slice(0, 8);

  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <p className="eyebrow">Studio Ethos</p>
          <h1>A private tattoo studio built for deliberate craft.</h1>
          <p className="lede">
            The Black Dahlia is designed to feel calm, focused, and collaborative from first brief
            through healed result.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing aboutEditorialGrid">
        <Reveal className="aboutManifestoCard">
          <h2>{aboutCopy.title}</h2>
          <p className="aboutSectionIntro">
            Tattooing here is consultation-first and artist-led, with room for intention at every
            stage.
          </p>

          <div className="aboutCopyStack">
            {aboutCopy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="aboutValueGrid">
            {studioValues.map((value) => (
              <article key={value}>
                <ShieldCheck size={16} />
                <p>{value}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="aboutTimelineCard">
          <h2>How the studio evolved</h2>
          <ol>
            {aboutCopy.story.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="aboutTimelineMeta">
            <p>
              <Users size={16} /> Three resident artists, each with a distinct visual lane.
            </p>
            <p>
              <Sparkles size={16} /> Custom commissions and tailored placement planning.
            </p>
          </div>

          <Link href="/booking" className="primaryButton">
            Book a consultation
          </Link>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal>
          <div className="sectionHeaderWithAction">
            <h2 className="sectionTitle">Resident Team</h2>
            <Link href="/artists" className="inlineAction">
              Open artist atlas <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="artistEditorialGrid">
          {artists.map((artist, index) => {
            const image = getLeadImage(artist.slug);
            return (
              <Reveal
                key={artist.slug}
                delay={0.08 + index * 0.06}
                className={`artistFeatureCard${index === 0 ? " primary" : ""}`}
              >
                {image ? <img src={image.localPath} alt={image.title || artist.name} loading="lazy" /> : null}
                <div>
                  <p className="artistRole">{artist.role}</p>
                  <h3>{artist.name}</h3>
                  <p>{artist.shortBio}</p>
                  <div className="artistTags">
                    {artist.specialities.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <Link href={`/artists/${artist.slug}`} className="inlineAction">
                    View portfolio <ArrowRight size={15} />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="container sectionSpacing aboutGalleryBand">
        <Reveal className="aboutGalleryIntro">
          <p className="eyebrow">Inside The Room</p>
          <h2 className="sectionTitle">Quiet space, high-focus sessions.</h2>
          <p className="sectionIntro">
            The atmosphere is intentional: slower pacing, fewer interruptions, and enough room to
            collaborate properly on design and placement.
          </p>
        </Reveal>

        <div className="aboutGalleryGrid">
          {studioFrames.map((image, index) => (
            <Reveal key={image.hash} delay={0.03 * (index % 4)} className="aboutGalleryTile">
              <img src={image.localPath} alt={image.title || "Studio image"} loading="lazy" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container ctaBand">
        <Reveal className="ctaBandInner">
          <div>
            <p className="eyebrow">Ready to start</p>
            <h2>Bring your references, placement, and style direction.</h2>
            <p>
              Use the guided consultation form so the team can match you to the right artist and
              session format.
            </p>
          </div>
          <div className="ctaBandLinks">
            <Link href="/booking" className="primaryButton">
              Start consultation
            </Link>
            <Link href="/contact" className="ghostButton">
              Ask a question
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
