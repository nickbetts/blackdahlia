import type { Metadata } from "next";
import Link from "next/link";
import { Cinzel, Manrope } from "next/font/google";
import { studioInfo } from "@/content/studio";
import "./globals.css";

const headingFont = Cinzel({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/artists", label: "Artists" },
  { href: "/faq", label: "FAQ" },
  { href: "/policies", label: "Policies" },
  { href: "/contact", label: "Contact" },
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
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>
        <a className="skipLink" href="#main-content">
          Skip to content
        </a>

        <div className="ambientGradient" aria-hidden="true" />
        <div className="ambientMesh" aria-hidden="true" />

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

            <nav className="siteNav" aria-label="Primary">
              {navLinks.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link className="headerCta" href="/booking">
              Book Now
            </Link>
          </div>
        </header>

        <main id="main-content" className="siteMain">
          {children}
        </main>

        <footer className="siteFooter">
          <div className="container footerGrid">
            <section>
              <h2>{studioInfo.name}</h2>
              <p>
                Appointment-only private tattoo studio in {studioInfo.city}. Custom design,
                collaborative sessions, and specialist artists.
              </p>
            </section>

            <section>
              <h3>Visit</h3>
              <address>
                {studioInfo.addressLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </section>

            <section>
              <h3>Contact</h3>
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
            <p>{currentYear} The Black Dahlia. All rights reserved.</p>
            <a href={studioInfo.mapUrl} target="_blank" rel="noreferrer">
              Open Map
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
