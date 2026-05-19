import Link from "next/link";
import { ArrowRight, Clock3, MapPin } from "lucide-react";
import { ShieldCheck, CheckCircle, SealWarning } from "@phosphor-icons/react/dist/ssr";
import { GiRose, GiInkSwirl, GiDiamondHard } from "react-icons/gi";
import { MarqueeGsap } from "@/components/marquee-gsap";
import { TrustCards, type TrustPoint } from "@/components/trust-cards";
import { artists, faqSections, homeIntro, studioInfo } from "@/content/studio";
import { getLeadImage, heroImages, studioGallery } from "@/lib/media";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Particles } from "@/components/ui/particles";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";

export default function Home() {
  const signatureStyles = Array.from(
    new Set(artists.flatMap((a) => a.specialities))
  ).slice(0, 9);

  const portfolioImages = studioGallery.slice(0, 8);
  const marqueeItems = homeIntro.marquee;
  const faqPreview = faqSections.flatMap((s) => s.items).slice(0, 4);
  const heroImg = heroImages[0];

  const trustPoints: TrustPoint[] = [
    {
      icon: <ShieldCheck weight="fill" size={24} />,
      title: "Private room, no walk-ins",
      body: "One client at a time. No queue, no rush — just your session, your artist, your piece.",
    },
    {
      icon: <GiRose size={22} />,
      title: "Three artists, three hands",
      body: "Pick the artist whose line work matches your idea, not whoever happens to be free.",
    },
    {
      icon: <CheckCircle weight="fill" size={24} />,
      title: "Straight answers, no surprises",
      body: "Quote, timing, deposit and aftercare are agreed before the machine turns on.",
    },
    {
      icon: <GiInkSwirl size={22} />,
      title: "Custom designs only",
      body: "Everything drawn for your placement, your story. Nothing pulled off a flash wall.",
    },
  ];

  const processSteps = [
    {
      num: "01",
      title: "Send the idea",
      body: "Placement, size, references — anything that tells us what you actually want. Mood boards welcome.",
    },
    {
      num: "02",
      title: "We match and quote",
      body: "We match you to the right artist and come back with a clear quote and an available date.",
    },
    {
      num: "03",
      title: "Deposit, draw, sit",
      body: "Deposit holds it. We draw for your placement. You sit, we ink, we send you home with aftercare that works.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      {/* ── HERO — FULL SCREEN ─────────────────────────────────────── */}
      <section className="heroFull">
        <div className="heroBg">
          {heroImg ? (
            <img
              src={heroImg.localPath}
              alt={heroImg.title || "The Black Dahlia tattoo studio"}
              loading="eager"
              fetchPriority="high"
            />
          ) : null}
        </div>
        <div className="heroBgOverlay" />
        <BackgroundBeams className="absolute inset-0 z-[1] pointer-events-none opacity-40" />
        <Particles
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
          quantity={45}
          color="#c9a26b"
          size={0.5}
          staticity={65}
          ease={50}
        />

        <div className="container heroContent">
          <p className="eyebrow">{homeIntro.eyebrow}</p>
          <h1 className="displayXXL">
            Custom tattoos.<br />
            <em>Hand drawn.</em>
          </h1>
          <p className="lede">{homeIntro.subhead}</p>
          <div className="heroActions">
            <Link href={homeIntro.ctaPrimary.href} className="primaryButton">
              {homeIntro.ctaPrimary.label} <ArrowRight size={16} />
            </Link>
            <Link href={homeIntro.ctaSecondary.href} className="ghostButton">
              {homeIntro.ctaSecondary.label}
            </Link>
          </div>
          <div className="heroMeta">
            <span><Clock3 size={15} /> Tue – Sat &middot; by appointment</span>
            <span><MapPin size={15} /> 17 Granby Street, Littleport &middot; CB6&nbsp;1NE</span>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────── */}
      <section className="marqueeBand" aria-hidden="true">
        <MarqueeGsap items={marqueeItems} speed={70} />
      </section>

      <div className="pageStack" style={{ paddingTop: "5rem" }}>

        {/* ── SIGNATURE STYLES ─────────────────────────────────────── */}
        <section className="container sectionSpacing">
          <div>
            <p className="eyebrow">What we do</p>
            <h2 className="displayLg" style={{ marginTop: "0.4rem", marginBottom: "1.2rem" }}>
              Built across <em>blackwork</em>, realism,<br />
              traditional &amp; illustrative.
            </h2>
          </div>
          <div className="styleScroll">
            {signatureStyles.map((style) => (
              <span key={style} className="stylePill">
                <GiDiamondHard size={11} style={{ display: "inline", marginRight: "0.3rem" }} />
                {style}
              </span>
            ))}
          </div>
        </section>

        <hr className="sectionRule container" />

        {/* ── ARTISTS — 3D TRIPTYCH ────────────────────────────────── */}
        <section className="container sectionSpacing">
          <div className="sectionHeaderWithAction">
            <div>
              <p className="eyebrow">The artists</p>
              <h2 className="displayLg" style={{ marginTop: "0.4rem" }}>
                Three artists.<br /><em>Three distinct hands.</em>
              </h2>
            </div>
            <Link href="/artists" className="inlineAction">
              See all artists <ArrowRight size={16} />
            </Link>
          </div>

          <div className="artistTriptych">
            {artists.map((artist) => {
              const image = getLeadImage(artist.slug);
              return (
                <CardContainer
                  key={artist.slug}
                  containerClassName="py-0 w-full"
                >
                  <CardBody className="artistCard3D">
                    <CardItem translateZ={60} className="artistCard3DImg">
                      {image ? (
                        <img
                          src={image.localPath}
                          alt={image.title || artist.name}
                          loading="lazy"
                        />
                      ) : null}
                    </CardItem>
                    <CardItem translateZ={20} className="artistCard3DBody">
                      <p className="artistRole">{artist.role}</p>
                      <h3 className="artistName">{artist.name}</h3>
                      <div className="artistTags">
                        {artist.specialities.slice(0, 3).map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <p style={{ color: "var(--text-200)", fontSize: "0.88rem", lineHeight: 1.55 }}>
                        {artist.shortBio}
                      </p>
                      <Link
                        href={`/artists/${artist.slug}`}
                        className="inlineAction"
                        style={{ marginTop: "0.5rem" }}
                      >
                        See {artist.name}&apos;s work <ArrowRight size={14} />
                      </Link>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              );
            })}
          </div>
        </section>

        <hr className="sectionRule container" />

        {/* ── PORTFOLIO ────────────────────────────────────────────── */}
        <section className="container sectionSpacing">
          <div className="sectionHeaderWithAction">
            <div>
              <p className="eyebrow">Recent work</p>
              <h2 className="displayLg" style={{ marginTop: "0.4rem" }}>
                Fresh <em>off the floor.</em>
              </h2>
            </div>
            <Link href="/artists" className="inlineAction">
              Full portfolios <ArrowRight size={16} />
            </Link>
          </div>
          <div className="portfolioGrid">
            {portfolioImages.map((img, i) => (
              <div key={img.hash} className={`portfolioCell${i === 2 || i === 6 ? " tall" : ""}`}>
                <img src={img.localPath} alt={img.title || "Tattoo"} loading="lazy" />
              </div>
            ))}
          </div>
        </section>

        <hr className="sectionRule container" />

        {/* ── TRUST ────────────────────────────────────────────────── */}
        <section className="container sectionSpacing">
          <div>
            <p className="eyebrow">The house</p>
            <h2 className="displayLg" style={{ marginTop: "0.4rem", marginBottom: "1.4rem" }}>
              Why people <em>sit with us.</em>
            </h2>
          </div>
          <TrustCards points={trustPoints} />
        </section>

        <hr className="sectionRule container" />

        {/* ── PROCESS ──────────────────────────────────────────────── */}
        <section className="container sectionSpacing">
          <div>
            <p className="eyebrow">How it goes</p>
            <h2 className="displayLg" style={{ marginTop: "0.4rem", marginBottom: "1.4rem" }}>
              From idea <em>to skin.</em>
            </h2>
          </div>
          <div className="processEditorial">
            {processSteps.map((step) => (
              <div key={step.num} className="processStep">
                <span className="processNum">{step.num}</span>
                <div className="processBody">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="sectionRule container" />

        {/* ── FAQ PREVIEW ──────────────────────────────────────────── */}
        <section className="container sectionSpacing">
          <div className="sectionHeaderWithAction">
            <div>
              <p className="eyebrow">Quick questions</p>
              <h2 className="displayLg" style={{ marginTop: "0.4rem" }}>
                Before you <em>sit down.</em>
              </h2>
            </div>
            <Link href="/faq" className="inlineAction">
              Full FAQ <ArrowRight size={16} />
            </Link>
          </div>
          <div className="faqPreviewGrid">
            {faqPreview.map((item) => (
              <div key={item.question} className="faqPreviewCard">
                <h3>
                  <SealWarning weight="fill" size={15} style={{ display: "inline", marginRight: "0.35rem", color: "var(--accent-gold)" }} />
                  {item.question}
                </h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BAND ─────────────────────────────────────────────── */}
        <section className="container ctaBand">
          <ShootingStars
            className="absolute inset-0 rounded-[inherit]"
            starColor="#c9a26b"
            trailColor="#9a4c3b"
            minSpeed={8}
            maxSpeed={20}
            minDelay={900}
            maxDelay={2200}
          />
          <StarsBackground
            className="absolute inset-0 rounded-[inherit]"
            starDensity={0.00015}
            allStarsTwinkle
            twinkleProbability={0.5}
          />
          <div className="ctaBandInner" style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <p className="eyebrow">Ready when you are</p>
              <h2 className="displayMix">
                Got an idea? <em>Let&apos;s draw it.</em>
              </h2>
              <p style={{ color: "var(--text-200)", fontSize: "0.95rem", maxWidth: "52ch", lineHeight: 1.6 }}>
                Send placement, references and the rough shape of what you want.
                We&apos;ll come back with the artist, the date and the price.
              </p>
            </div>
            <div className="ctaBandLinks">
              <Link href="/booking" className="primaryButton">
                Book a session <ArrowRight size={15} />
              </Link>
              <a href={studioInfo.mapUrl} target="_blank" rel="noreferrer" className="ghostButton">
                Find the studio
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
