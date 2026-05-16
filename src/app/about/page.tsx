import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { aboutCopy, artists } from "@/content/studio";
import { getLeadImage, studioGallery } from "@/lib/media";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the story behind The Black Dahlia, the studio values, and the artists shaping custom tattoo work in Littleport.",
};

export default function AboutPage() {
  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <p className="eyebrow">About The Black Dahlia</p>
          <h1>{aboutCopy.title}</h1>
          <p className="lede">
            A private studio built around collaboration, comfort, and craft-led tattooing.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing twoColumnStory">
        <Reveal>
          <div className="storyPanel">
            <h2>Studio Philosophy</h2>
            {aboutCopy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="storyPanel">
            <h2>Our Story</h2>
            <ol>
              {aboutCopy.story.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <Link href="/booking" className="inlineAction">
              Book a consultation <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal>
          <h2 className="sectionTitle">The Team</h2>
        </Reveal>

        <div className="artistPreviewGrid">
          {artists.map((artist, index) => {
            const image = getLeadImage(artist.slug);
            return (
              <Reveal key={artist.slug} delay={0.08 + index * 0.06} className="artistPreviewCard">
                {image ? <img src={image.localPath} alt={image.title || artist.name} loading="lazy" /> : null}
                <div>
                  <p className="artistRole">{artist.role}</p>
                  <h3>{artist.name}</h3>
                  <p>{artist.longBio}</p>
                  <Link href={`/artists/${artist.slug}`}>View portfolio</Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="container sectionSpacing">
        <Reveal>
          <h2 className="sectionTitle">Inside The Studio</h2>
        </Reveal>
        <div className="galleryGrid">
          {studioGallery.slice(0, 9).map((image, index) => (
            <Reveal key={image.hash} delay={0.04 * (index % 3)} className="galleryCard">
              <img src={image.localPath} alt={image.title || "Studio image"} loading="lazy" />
              <div>
                <p>{image.title || "The Black Dahlia"}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
