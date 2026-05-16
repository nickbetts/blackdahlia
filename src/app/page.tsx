import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, Clock3, MapPin, ShieldCheck, Sparkles, Star } from "lucide-react";
import { HeroCarousel } from "@/components/hero-carousel";
import { Reveal } from "@/components/reveal";
import { artists, faqSections, homeIntro, studioInfo } from "@/content/studio";
import { getLeadImage, heroImages, studioGallery } from "@/lib/media";

export default function Home() {
  const slides = heroImages.map((image) => ({
    src: image.localPath,
    alt: image.title || "Tattoo portfolio image",
  }));

  const signatureStyles = Array.from(new Set(artists.flatMap((artist) => artist.specialities))).slice(0, 9);
  const portfolioLead = studioGallery[0] ?? null;
  const portfolioTiles = studioGallery.slice(1, 7);

  const trustPoints = [
    {
      icon: ShieldCheck,
      title: "Private, appointment-only room",
      body: "Sessions are paced deliberately to protect comfort, focus, and design quality.",
    },
    {
      icon: Award,
      title: "Experienced resident artists",
      body: "Each artist works in a distinct visual lane and handles direct consultation with clients.",
    },
    {
      icon: CheckCircle2,
      title: "Clear process, no guesswork",
      body: "From concept to aftercare, expectations are laid out before needles ever touch skin.",
    },
  ];

  const processSteps = [
    "Share concept, placement, and references through the booking form.",
    "Get matched to the right artist with quote and timeline guidance.",
    "Lock your date with a deposit and prepare using studio guidance.",
  ];

  const faqPreview = faqSections.flatMap((section) => section.items).slice(0, 4);

  return (
    <div className="pageStack">
      <section className="container homeHeroEditorial">
        <Reveal className="heroCopy heroCopyEditorial" delay={0.1}>
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
          <p className="eyebrow">Signature Styles</p>
          <h2 className="sectionTitle">Crafted across realism, blackwork, and illustrative lineages.</h2>
        </Reveal>
        <div className="signatureStrip">
          {signatureStyles.map((style, index) => (
            <Reveal key={style} delay={0.08 + index * 0.04} className="signaturePill">
              <Sparkles size={15} />
              <span>{style}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container sectionSpacing">
        <Reveal>
          <div className="sectionHeaderWithAction">
            <h2 className="sectionTitle">Choose your artist by style, not by chance.</h2>
            <Link href="/artists" className="inlineAction">
              View artist atlas <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="artistEditorialGrid">
          {artists.map((artist, index) => {
            const image = getLeadImage(artist.slug);
            return (
              <Reveal
                key={artist.slug}
                delay={0.1 + index * 0.08}
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
                    Explore {artist.name}&apos;s work <ArrowRight size={15} />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="container sectionSpacing portfolioStoryBand">
        <Reveal className="portfolioStoryPanel">
          <p className="eyebrow">Curated Work</p>
          <h2 className="sectionTitle">A tighter edit of recent pieces from the studio floor.</h2>
          <p className="sectionIntro">
            Instead of a noisy feed, this is a measured snapshot of line quality, black saturation,
            texture, and healed composition across artists.
          </p>
          <Link href="/artists" className="inlineAction">
            Browse full portfolios <ArrowRight size={16} />
          </Link>
        </Reveal>

        <div className="portfolioGalleryCluster">
          {portfolioLead ? (
            <Reveal className="portfolioLeadTile" delay={0.06}>
              <img src={portfolioLead.localPath} alt={portfolioLead.title || "Lead portfolio piece"} loading="lazy" />
            </Reveal>
          ) : null}

          <div className="portfolioTileGrid">
            {portfolioTiles.map((image, index) => (
              <Reveal key={image.hash} delay={0.08 + index * 0.04} className="portfolioTile">
                <img src={image.localPath} alt={image.title || "Tattoo portfolio"} loading="lazy" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container sectionSpacing">
        <div className="trustProcessGrid">
          <Reveal className="trustPanel" delay={0.03}>
            <p className="eyebrow">Studio Standard</p>
            <h2 className="sectionTitle">Why people trust the room.</h2>
            <div className="trustGrid">
              {trustPoints.map((point) => (
                <article key={point.title} className="trustItem">
                  <point.icon size={18} />
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal className="processPanel" delay={0.12}>
            <p className="eyebrow">Consultation Flow</p>
            <h2>How booking runs here</h2>
            <ol className="processList">
              {processSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <Link href="/booking" className="primaryButton">
              Start consultation brief
            </Link>
          </Reveal>
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
            <p className="eyebrow">Private consultation</p>
            <h2>Bring the concept, we&apos;ll shape the final tattoo with you.</h2>
            <p>
              Fill in the guided booking brief with references, style direction, and placement.
              You&apos;ll get matched to the right artist with clear next steps.
            </p>
          </div>
          <div className="ctaBandLinks">
            <Link href="/booking" className="primaryButton">
              Start consultation
            </Link>
            <a href={studioInfo.mapUrl} target="_blank" rel="noreferrer" className="ghostButton">
              Visit the studio
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
