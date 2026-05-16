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
    "One client at a time — no overlap, no shared chair, no rush.",
    "Direct contact with your artist from brief to healed skin.",
    "Strict hygiene, single-use kit, aftercare you can actually follow.",
  ];

  const studioFrames = studioGallery.slice(0, 8);

  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <p className="eyebrow eyebrowTypewriter">About the studio</p>
          <h1 className="heroDisplay">A private room <em>for proper</em> tattoos.</h1>
          <p className="lede">
            Three artists, custom work only, no flash wall. Built for long sessions and considered
            pieces — the kind you want to live with for a while.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing aboutEditorialGrid">
        <Reveal className="aboutManifestoCard">
          <h2 className="displayMix">{aboutCopy.title}</h2>
          <p className="aboutSectionIntro">
            Tattooing here is artist-led, custom first, and paced to the work — not the diary.
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
          <h2 className="displayMix">How the studio <em>came together.</em></h2>
          <ol>
            {aboutCopy.story.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="aboutTimelineMeta">
            <p>
              <Users size={16} /> Three resident artists, each working in their own lane.
            </p>
            <p>
              <Sparkles size={16} /> Custom commissions — placement and composition planned with you.
            </p>
          </div>

          <Link href="/booking" className="primaryButton">
            Book a session
          </Link>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal>
          <div className="sectionHeaderWithAction">
            <h2 className="sectionTitle displayMix">The <em>resident</em> team</h2>
            <Link href="/artists" className="inlineAction">
              See all artists <ArrowRight size={16} />
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
                    See portfolio <ArrowRight size={15} />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="container sectionSpacing aboutGalleryBand">
        <Reveal className="aboutGalleryIntro">
          <p className="eyebrow">Inside the room</p>
          <h2 className="sectionTitle displayMix">Quiet space. <em>High-focus sessions.</em></h2>
          <p className="sectionIntro">
            Low traffic, low noise, and enough room to actually collaborate on placement and
            composition without anyone breathing down your neck.
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
            <p className="eyebrow eyebrowTypewriter">Ready when you are</p>
            <h2 className="displayMix">Bring references, placement, <em>and an open mind.</em></h2>
            <p>
              Send your idea through the booking form so we can pair you with the right artist
              and a session that actually suits the piece.
            </p>
          </div>
          <div className="ctaBandLinks">
            <Link href="/booking" className="primaryButton">
              Book a session
            </Link>
            <Link href="/contact" className="ghostButton">
              Ask first
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
