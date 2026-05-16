import Link from "next/link";
import { ArrowRight, Clock3, MapPin, Sparkles, Star } from "lucide-react";
import { HeroCarousel } from "@/components/hero-carousel";
import { Reveal } from "@/components/reveal";
import { artists, faqSections, homeIntro, services, studioInfo } from "@/content/studio";
import { getLeadImage, heroImages, studioGallery } from "@/lib/media";

export default function Home() {
  const slides = heroImages.map((image) => ({
    src: image.localPath,
    alt: image.title || "Tattoo portfolio image",
  }));

  const faqPreview = faqSections.flatMap((section) => section.items).slice(0, 4);

  return (
    <div className="pageStack">
      <section className="container heroSection">
        <Reveal className="heroCopy" delay={0.1}>
          <p className="eyebrow">Littleport, Cambridgeshire</p>
          <h1>{homeIntro.headline}</h1>
          <p className="lede">{homeIntro.subhead}</p>

          <div className="heroActions">
            <Link href={homeIntro.ctaPrimary.href} className="primaryButton">
              {homeIntro.ctaPrimary.label}
            </Link>
            <Link href={homeIntro.ctaSecondary.href} className="ghostButton">
              {homeIntro.ctaSecondary.label}
            </Link>
          </div>

          <div className="heroMeta">
            <span>
              <Clock3 size={16} /> Appointment only
            </span>
            <span>
              <MapPin size={16} /> 17 Granby Street, CB6 1NE
            </span>
          </div>
        </Reveal>

        <Reveal className="heroMedia" delay={0.25}>
          <HeroCarousel slides={slides} />
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal delay={0.05}>
          <h2 className="sectionTitle">What The Studio Delivers</h2>
        </Reveal>
        <div className="serviceGrid">
          {services.map((service, index) => (
            <Reveal key={service} delay={0.08 + index * 0.04} className="serviceCard">
              <Sparkles size={18} />
              <p>{service}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container sectionSpacing">
        <Reveal>
          <div className="sectionHeaderWithAction">
            <h2 className="sectionTitle">Meet The Artists</h2>
            <Link href="/artists" className="inlineAction">
              View Full Portfolios <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="artistPreviewGrid">
          {artists.map((artist, index) => {
            const image = getLeadImage(artist.slug);
            return (
              <Reveal key={artist.slug} delay={0.1 + index * 0.08} className="artistPreviewCard">
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
                  <Link href={`/artists/${artist.slug}`}>Explore {artist.name}&apos;s work</Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="container sectionSpacing">
        <Reveal>
          <h2 className="sectionTitle">Recent Work Snapshot</h2>
          <p className="sectionIntro">
            A fast look at the style range across the studio, from heavy blackwork to intricate
            realism and geometric detail.
          </p>
        </Reveal>

        <div className="galleryGrid">
          {studioGallery.slice(0, 15).map((image, index) => (
            <Reveal key={image.hash} delay={0.04 * (index % 5)} className="galleryCard">
              <img src={image.localPath} alt={image.title || "Tattoo portfolio"} loading="lazy" />
              <div>
                <p>{image.title || "Portfolio Piece"}</p>
                <small>{image.artist ? image.artist : "Studio"}</small>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container sectionSpacing faqPreviewSection">
        <Reveal>
          <div className="sectionHeaderWithAction">
            <h2 className="sectionTitle">Quick Answers</h2>
            <Link href="/faq" className="inlineAction">
              Open Full FAQ <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="faqPreviewGrid">
          {faqPreview.map((item, index) => (
            <Reveal key={item.question} delay={0.06 + index * 0.05} className="faqPreviewCard">
              <h3>
                <Star size={16} /> {item.question}
              </h3>
              <p>{item.answer}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container ctaBand">
        <Reveal className="ctaBandInner">
          <div>
            <p className="eyebrow">Ready when you are</p>
            <h2>Bring your idea in and build it properly.</h2>
            <p>
              Fill in the booking form with references, size, placement, and style direction.
              The team will come back with next steps.
            </p>
          </div>
          <div className="ctaBandLinks">
            <Link href="/booking" className="primaryButton">
              Start Booking
            </Link>
            <a href={studioInfo.mapUrl} target="_blank" rel="noreferrer" className="ghostButton">
              Find The Studio
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
