import Link from "next/link";
import { ArrowRight, Clock3, MapPin } from "lucide-react";
import { GiRose, GiInkSwirl, GiDiamondHard } from "react-icons/gi";
import { ShieldCheck as PhShieldCheck, CheckCircle, SealWarning } from "@phosphor-icons/react/dist/ssr";
import { HeroCarousel } from "@/components/hero-carousel";
import { MarqueeGsap } from "@/components/marquee-gsap";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { artists, faqSections, homeIntro, studioInfo } from "@/content/studio";
import { getLeadImage, heroImages, studioGallery } from "@/lib/media";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Particles } from "@/components/ui/particles";
import { FlipWords } from "@/components/ui/flip-words";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { BorderBeam } from "@/components/ui/border-beam";
import { MovingBorderLink } from "@/components/moving-border-link";

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

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="heroOuter relative overflow-hidden" style={{ paddingBottom: "2rem" }}>
        <BackgroundBeams />
        <Particles
          className="absolute inset-0 pointer-events-none"
          quantity={55}
          color="#c9a26b"
          size={0.55}
          staticity={60}
          ease={50}
        />

        <div className="container homeHeroEditorial" style={{ position: "relative", zIndex: 1 }}>
          <BlurFade className="heroCopy heroCopyEditorial" delay={0.1} inView direction="up">
            <AnimatedGradientText
              colorFrom="#c9a26b"
              colorTo="#9a4c3b"
              speed={0.8}
              className="eyebrow eyebrowTypewriter"
            >
              {homeIntro.eyebrow}
            </AnimatedGradientText>

            <h1 className="heroDisplay">
              Custom tattoos.{" "}
              <FlipWords
                words={["Hand drawn.", "One of one.", "Yours entirely.", "Never repeated."]}
                className="text-[#c9a26b] italic"
                duration={3200}
              />
            </h1>

            <p className="lede">{homeIntro.subhead}</p>

            <div className="heroActions">
              <MovingBorderLink
                href={homeIntro.ctaPrimary.href}
                containerClassName="h-auto w-auto py-0"
                borderClassName="bg-[radial-gradient(#c9a26b_40%,transparent_60%)]"
                className="primaryButton border-[rgba(201,162,107,0.25)] bg-[rgba(8,8,8,0.92)]"
                borderRadius="0.5rem"
                duration={3000}
              >
                {homeIntro.ctaPrimary.label}
              </MovingBorderLink>
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
          </BlurFade>

          <BlurFade className="heroMedia" delay={0.28} inView direction="up">
            <span className="heroVerticalTag" aria-hidden="true">
              Est. {studioInfo.founded} &middot; The Black Dahlia
            </span>
            <HeroCarousel slides={slides} />
            <BorderBeam
              colorFrom="#c9a26b"
              colorTo="#9a4c3b"
              size={180}
              duration={10}
              borderWidth={1.5}
            />
          </BlurFade>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────── */}
      <section className="marqueeBand" aria-hidden="true">
        <MarqueeGsap items={marqueeItems} speed={70} />
      </section>

      {/* ── SIGNATURE STYLES ─────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <BlurFade delay={0.05} inView direction="up">
          <p className="eyebrow">
            <AnimatedGradientText colorFrom="#c9a26b" colorTo="#9a4c3b" speed={0.6}>
              <span className="eyebrowNumber">No. 01</span>
            </AnimatedGradientText>
            {" "}What we do
          </p>
          <h2 className="sectionTitle displayMix">
            Built across <em>blackwork</em>, realism, traditional &amp; illustrative.
          </h2>
        </BlurFade>
        <div className="signatureStrip">
          {signatureStyles.map((style, index) => (
            <BlurFade key={style} delay={0.08 + index * 0.04} inView direction="up" className="signaturePill">
              <GiDiamondHard size={13} />
              <span>{style}</span>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ── ARTISTS ──────────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <BlurFade inView direction="up" delay={0.05}>
          <div className="sectionHeaderWithAction">
            <div>
              <p className="eyebrow">
                <AnimatedGradientText colorFrom="#c9a26b" colorTo="#9a4c3b" speed={0.6}>
                  <span className="eyebrowNumber">No. 02</span>
                </AnimatedGradientText>
                {" "}The artists
              </p>
              <h2 className="sectionTitle displayMix">
                Three artists. <em>Three distinct hands.</em>
              </h2>
            </div>
            <Link href="/artists" className="inlineAction">
              See all artists <ArrowRight size={16} />
            </Link>
          </div>
        </BlurFade>

        <div className="artistEditorialGrid">
          {artists.map((artist, index) => {
            const image = getLeadImage(artist.slug);
            return (
              <BlurFade
                key={artist.slug}
                delay={0.1 + index * 0.08}
                inView
                direction="up"
                className={`artistFeatureCard${index === 0 ? " primary" : ""}`}
                style={{ padding: 0 }}
              >
                <CardSpotlight
                  className="p-0 rounded-[inherit] border-0 bg-transparent w-full h-full flex flex-col"
                  color="rgba(201,162,107,0.07)"
                  radius={380}
                >
                  {image ? (
                    <img src={image.localPath} alt={image.title || artist.name} loading="lazy" />
                  ) : null}
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
                </CardSpotlight>
              </BlurFade>
            );
          })}
        </div>
      </section>

      {/* ── PORTFOLIO ────────────────────────────────────────────────── */}
      <section className="container sectionSpacing portfolioStoryBand">
        <BlurFade className="portfolioStoryPanel" inView direction="up" delay={0.05}>
          <p className="eyebrow">
            <AnimatedGradientText colorFrom="#c9a26b" colorTo="#9a4c3b" speed={0.6}>
              <span className="eyebrowNumber">No. 03</span>
            </AnimatedGradientText>
            {" "}Recent work
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
        </BlurFade>

        <div className="portfolioGalleryCluster">
          <PortfolioGallery images={portfolioImages} columns={3} />
        </div>
      </section>

      {/* ── TRUST + PROCESS ──────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <div className="trustProcessGrid">
          <BlurFade className="trustPanel" inView delay={0.03} direction="up">
            <p className="eyebrow">
              <AnimatedGradientText colorFrom="#c9a26b" colorTo="#9a4c3b" speed={0.6}>
                <span className="eyebrowNumber">No. 04</span>
              </AnimatedGradientText>
              {" "}The house
            </p>
            <h2 className="sectionTitle displayMix">
              Why people <em>sit with us.</em>
            </h2>
            <div className="trustGrid">
              {trustPoints.map((point, i) => (
                <BlurFade key={point.title} inView delay={0.08 + i * 0.06} direction="up">
                  <CardSpotlight
                    className="trustItem p-[0.75rem] rounded-[12px] border-[rgba(255,255,255,0.08)] bg-transparent"
                    color="rgba(201,162,107,0.09)"
                    radius={260}
                  >
                    {point.icon}
                    <div>
                      <h3>{point.title}</h3>
                      <p>{point.body}</p>
                    </div>
                  </CardSpotlight>
                </BlurFade>
              ))}
            </div>
          </BlurFade>

          <BlurFade className="processPanel" inView delay={0.12} direction="up">
            <p className="eyebrow">
              <AnimatedGradientText colorFrom="#c9a26b" colorTo="#9a4c3b" speed={0.6}>
                <span className="eyebrowNumber">No. 05</span>
              </AnimatedGradientText>
              {" "}How it goes
            </p>
            <h2 className="displayMix">
              From idea <em>to skin.</em>
            </h2>
            <ol className="processList">
              {processSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <MovingBorderLink
              href="/booking"
              containerClassName="h-auto w-auto py-0"
              borderClassName="bg-[radial-gradient(#c9a26b_40%,transparent_60%)]"
              className="primaryButton border-[rgba(201,162,107,0.25)] bg-[rgba(8,8,8,0.92)]"
              borderRadius="0.5rem"
              duration={3000}
            >
              Send your idea
            </MovingBorderLink>
          </BlurFade>
        </div>
      </section>

      {/* ── FAQ PREVIEW ──────────────────────────────────────────────── */}
      <section className="container sectionSpacing faqPreviewSection">
        <BlurFade inView direction="up" delay={0.04}>
          <div className="sectionHeaderWithAction">
            <div>
              <p className="eyebrow">
                <AnimatedGradientText colorFrom="#c9a26b" colorTo="#9a4c3b" speed={0.6}>
                  <span className="eyebrowNumber">No. 06</span>
                </AnimatedGradientText>
                {" "}Quick questions
              </p>
              <h2 className="sectionTitle displayMix">
                Before you <em>sit down.</em>
              </h2>
            </div>
            <Link href="/faq" className="inlineAction">
              Read the full FAQ <ArrowRight size={16} />
            </Link>
          </div>
        </BlurFade>

        <div className="faqPreviewGrid">
          {faqPreview.map((item, index) => (
            <BlurFade key={item.question} delay={0.06 + index * 0.05} inView direction="up">
              <CardSpotlight
                className="faqPreviewCard p-[1.1rem_1.25rem] rounded-[inherit] border-[rgba(255,255,255,0.08)] bg-transparent h-full"
                color="rgba(201,162,107,0.08)"
                radius={300}
              >
                <h3>
                  <SealWarning weight="fill" size={16} /> {item.question}
                </h3>
                <p>{item.answer}</p>
              </CardSpotlight>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────────── */}
      <section className="container ctaBand relative overflow-hidden" style={{ borderRadius: "22px" }}>
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
        <BlurFade className="ctaBandInner" inView direction="up" delay={0.05}>
          <div>
            <AnimatedGradientText
              colorFrom="#c9a26b"
              colorTo="#9a4c3b"
              speed={0.7}
              className="eyebrow eyebrowTypewriter"
            >
              Ready when you are
            </AnimatedGradientText>
            <h2 className="displayMix">
              Got an idea? <em>Let&apos;s draw it.</em>
            </h2>
            <p>
              Send placement, references and the rough shape of what you want.
              We&apos;ll come back with the artist, the date and the price.
            </p>
          </div>
          <div className="ctaBandLinks">
            <MovingBorderLink
              href="/booking"
              containerClassName="h-auto w-auto py-0"
              borderClassName="bg-[radial-gradient(#c9a26b_40%,transparent_60%)]"
              className="primaryButton border-[rgba(201,162,107,0.25)] bg-[rgba(8,8,8,0.92)]"
              borderRadius="0.5rem"
              duration={2800}
            >
              Book a session
            </MovingBorderLink>
            <a href={studioInfo.mapUrl} target="_blank" rel="noreferrer" className="ghostButton">
              Find the studio
            </a>
          </div>
        </BlurFade>
      </section>

    </div>
  );
}
