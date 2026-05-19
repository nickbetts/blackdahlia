import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Manrope, Special_Elite, Geist } from "next/font/google";
import { studioInfo } from "@/content/studio";
import { SiteNav } from "@/components/site-nav";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CommandPalette } from "@/components/command-palette";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const headingFont = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const accentFont = Special_Elite({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400"],
});

const navLinks = [
  { href: "/", label: "Studio" },
  { href: "/about", label: "About" },
  { href: "/artists", label: "Artists" },
  { href: "/faq", label: "FAQ" },
  { href: "/policies", label: "Policies" },
  { href: "/contact", label: "Visit" },
  { href: "/booking", label: "Booking" },
];

export const metadata: Metadata = {
  metadataBase: new URL("https://www.theblackdahlia.co.uk"),
  title: {
    default: "The Black Dahlia - Private Tattoo Studio in Littleport",
    template: "%s | The Black Dahlia",
  },
  description:
    "Appointment-only tattoo studio in Littleport near Ely. Explore artist portfolios, booking details, FAQs, and studio policies.",
  openGraph: {
    title: "The Black Dahlia - Private Tattoo Studio",
    description:
      "Custom tattoos in Littleport with specialist artists in blackwork, realism, traditional, illustrative, and floral styles.",
    type: "website",
    url: "https://www.theblackdahlia.co.uk",
    siteName: "The Black Dahlia",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Black Dahlia - Private Tattoo Studio",
    description:
      "Explore portfolios, policies, and booking details for The Black Dahlia tattoo studio in Littleport.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className={cn(headingFont.variable, bodyFont.variable, accentFont.variable, "font-sans", geist.variable)}>
      <body>
        <a className="skipLink" href="#main-content">
          Skip to content
        </a>

        <SmoothScroll />
        <CommandPalette />
        <div className="ambientGradient" aria-hidden="true" />
        <div className="ambientGrain" aria-hidden="true" />

        <header className="siteHeader">
          <div className="container headerInner">
            <Link href="/" className="brandWordmark">
              <span className="brandSymbol" aria-hidden="true">
                BD
              </span>
              <span>
                <strong>{studioInfo.name}</strong>
                <small>{studioInfo.strapline}</small>
              </span>
            </Link>

            <SiteNav items={navLinks} />

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <button
                className="cmdHint"
                aria-label="Open navigation palette"
                onClick={undefined}
                suppressHydrationWarning
              >
                <kbd>⌘</kbd><kbd>K</kbd>
              </button>
              <div style={{ position: "relative", display: "inline-flex", borderRadius: "8px" }}>
                <GlowingEffect spread={28} borderWidth={1} disabled={false} proximity={50} />
                <Link className="headerCta" href="/booking">Book a session</Link>
              </div>
            </div>
          </div>
        </header>

        <main id="main-content" className="siteMain">
          {children}
        </main>

        <footer className="siteFooter">
          <span className="footerWatermark" aria-hidden="true">The Black Dahlia</span>
          <div className="footerContent">
          <div className="container footerGrid">
            <section className="footerBrand">
              <span className="brandSymbol" aria-hidden="true">BD</span>
              <h2>{studioInfo.name}</h2>
              <p>
                Private tattoo studio in {studioInfo.city}. Three artists, custom work only,
                inked by appointment since {studioInfo.founded}.
              </p>
            </section>

            <section>
              <p className="footerEyebrow">Visit</p>
              <address>
                {studioInfo.addressLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
              <a href={studioInfo.mapUrl} target="_blank" rel="noreferrer" className="footerInlineLink">
                Open in Google Maps
              </a>
            </section>

            <section>
              <p className="footerEyebrow">Contact</p>
              <a href={`mailto:${studioInfo.email}`}>{studioInfo.email}</a>
              <a href={studioInfo.social.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={studioInfo.social.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </section>
          </div>

          <div className="container footerBottom">
            <p>&copy; {currentYear} {studioInfo.name}. All rights reserved.</p>
            <div className="footerBottomLinks">
              <Link href="/policies">Studio policies</Link>
              <Link href="/booking">Book a session</Link>
            </div>
          </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
