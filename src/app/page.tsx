import Link from "next/link";
import { ArrowRight, Clock3, MapPin, Star } from "lucide-react";
import { GiSkullCrossedBones, GiRose, GiInkSwirl, GiDiamondHard } from "react-icons/gi";
import { ShieldCheck as PhShieldCheck, CheckCircle, SealWarning } from "@phosphor-icons/react/dist/ssr";
import { HeroCarousel } from "@/components/hero-carousel";
import { Reveal } from "@/components/reveal";
import { MarqueeGsap } from "@/components/marquee-gsap";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { artists, faqSections, homeIntro, studioInfo } from "@/content/studio";
import { getLeadImage, heroImages, studioGallery } from "@/lib/media";

export default function Home() {
  const slides = heroImages.map((image) => ({
    src: image.localPath,
    alt: image.title || "Tattoo portfolio image",
  }));

  const signatureStyles = Array.from(new Set(artists.flatMap((artist) => artist.specialities))).slice(0, 9);
  const portfolioImages = studioGallery.slice(0, 12).map((img) => ({
    src: img.localPath,
    width: 800,
    height: 1000,
    title: img.title || "Tattoo portfolio",
  }));
  const marqueeItems = homeIntro.marquee;

  const trustPoints = [
    {
      icon: <PhShieldCheck weight="fill" size={22} />,
      title: "Private room, no walk-ins",
      body: "One client at a time. No queue, no rush, no flash wall — just your session.",
    },
    {
      icon: <GiRose size={20} />,
      title: "Three artists, three hands",
      body: "Pick the artist whose line work matches your idea, not whoever happens to be free.",
    },
    {
      icon: <CheckCircle weight="fill" size={22} />,
      title: "Straight answers, no surprises",
      body: "Quote, timing, deposit and aftercare are agreed before the machine ever turns on.",
    },
    {
      icon: <GiInkSwirl size={20} />,
      title: "Custom designs only",
      body: "Everything is drawn for your placement, your story. Nothing pulled off a flash wall.",
    },
  ];

  const processSteps = [
    "Send the idea — placement, size, references, anything that matters.",
    "We match you to the right artist and come back with a quote and a date.",
    "Deposit holds it. We draw, you sit, we send you home with aftercare that works.",
  ];

  const faqPreview = faqSections.flatMap((section) => section.items).slice(0, 4);

  return (
    <div className="pageStack">
      <section className="container homeHeroEditorial">
        <Reveal className="heroCopy heroCopyEditorial" delay={0.1}>
          <p className="eyebrow eyebrowTypewriter">{homeIntro.eyebrow}</p>
          <h1 className="heroDisplay">
            Custom tattoos. <em>Hand drawn.</em>
            <br />
            Appointment <em>only.</em>
          </h1>
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
              <Clock3 size={16} /> Tue – Sat &middot; by appointment
            </span>
            <span>
              <MapPin size={16} /> 17 Granby Street, Littleport &middot; CB6 1NE
            </span>
          </div>
        </Reveal>

        <Reveal className="heroMedia" delay={0.25}>
          <span className="heroVerticalTag" aria-hidden="true">
            Est. {studioInfo.founded} &middot; The Black Dahlia
          </span>
          <HeroCarousel slides={slides} />
        </Reveal>
      </section>

      <section className="marqueeBand" aria-hidden="true">
        <MarqueeGsap items={marqueeItems} speed={70} />
      </section>

      <section className="container sectionSpacing">
        <Reveal delay={0.05}>
          <p className="eyebrow">
            <span className="eyebrowNumber">No. 01</span> What we do
          </p>
          <h2 className="sectionTitle displayMix">
            Built across <em>blackwork</em>, realism, traditional &amp; illustrative.
          </h2>
        </Reveal>
        <div className="signatureStrip">
          {signatureStyles.map((style, index) => (
            <Reveal key={style} delay={0.08 + index * 0.04} className="signaturePill">
              <GiDiamondHard size={13} />
              <span>{style}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container sectionSpacing">
        <Reveal>
          <div className="sectionHeaderWithAction">
            <div>
              <p className="eyebrow">
                <span className="eyebrowNumber">No. 02</span> The artists
              </p>
              <h2 className="sectionTitle displayMix">
                Three artists. <em>Three distinct hands.</em>
              </h2>
            </div>
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
                    See {artist.name}&apos;s work <ArrowRight size={15} />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="container sectionSpacing portfolioStoryBand">
        <Reveal className="portfolioStoryPanel">
          <p className="eyebrow">
            <span className="eyebrowNumber">No. 03</span> Recent work
          </p>
          <h2 className="sectionTitle displayMix">
            Fresh <em>off the floor.</em>
          </h2>
          <p className="sectionIntro">
            Not a noisy feed — a tighter cut of line quality, black saturation and healed
            composition across the team.
          </p>
          <Link href="/artists" className="inlineAction">
            See full portfolios <ArrowRight size={16} />
          </Link>
        </Reveal>

        <div className="portfolioGalleryCluster">
          <PortfolioGallery images={portfolioImages} columns={3} />
        </div>
      </section>

      <section className="container sectionSpacing">
        <div className="trustProcessGrid">
          <Reveal className="trustPanel" delay={0.03}>
            <p className="eyebrow">
              <span className="eyebrowNumber">No. 04</span> The house
            </p>
            <h2 className="sectionTitle displayMix">
              Why people <em>sit with us.</em>
            </h2>
            <div className="trustGrid">
              {trustPoints.map((point) => (
                <article key={point.title} className="trustItem">
                  {point.icon}
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>

          <Reveal className="processPanel" delay={0.12}>
            <p className="eyebrow">
              <span className="eyebrowNumber">No. 05</span> How it goes
            </p>
            <h2 className="displayMix">
              From idea <em>to skin.</em>
            </h2>
            <ol className="processList">
              {processSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <Link href="/booking" className="primaryButton">
              Send your idea
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="container sectionSpacing faqPreviewSection">
        <Reveal>
          <div className="sectionHeaderWithAction">
            <div>
              <p className="eyebrow">
                <span className="eyebrowNumber">No. 06</span> Quick questions
              </p>
              <h2 className="sectionTitle displayMix">
                Before you <em>sit down.</em>
              </h2>
            </div>
            <Link href="/faq" className="inlineAction">
              Read the full FAQ <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="faqPreviewGrid">
          {faqPreview.map((item, index) => (
            <Reveal key={item.question} delay={0.06 + index * 0.05} className="faqPreviewCard">
              <h3>
                <SealWarning weight="fill" size={16} /> {item.question}
              </h3>
              <p>{item.answer}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container ctaBand">
        <Reveal className="ctaBandInner">
          <div>
            <p className="eyebrow eyebrowTypewriter">Ready when you are</p>
            <h2 className="displayMix">
              Got an idea? <em>Let&apos;s draw it.</em>
            </h2>
            <p>
              Send placement, references and the rough shape of what you want.
              We&apos;ll come back with the artist, the date and the price.
            </p>
          </div>
          <div className="ctaBandLinks">
            <Link href="/booking" className="primaryButton">
              Book a session
            </Link>
            <a href={studioInfo.mapUrl} target="_blank" rel="noreferrer" className="ghostButton">
              Find the studio
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
