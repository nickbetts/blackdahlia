"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, MapPin, Clock3 } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export type ArtistMegaItem = {
  slug: string;
  name: string;
  role: string;
  specialities: string[];
  leadImagePath: string | null;
};

type NavBarProps = {
  artistData: ArtistMegaItem[];
  studioName: string;
  strapline: string;
  email: string;
  address: string[];
};

const mainLinks = [
  { href: "/", label: "Studio" },
  { href: "/about", label: "About" },
  { href: "/artists", label: "Artists", hasMega: true },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Visit" },
];

const subLinks = [{ href: "/policies", label: "Policies" }];

export function NavBar({ artistData, studioName, strapline, email, address }: NavBarProps) {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on route change
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Lock scroll when mobile open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const openMega = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }, []);

  const closeMega = useCallback(() => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <div className="container headerInner">
        {/* ── LOGO ─────────────────────────────────── */}
        <Link href="/" className="brandWordmark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dahlialogo-dark.svg" className="brandLogo" alt="" aria-hidden="true" />
          <span>
            <strong>{studioName}</strong>
            <small>{strapline}</small>
          </span>
        </Link>

        {/* ── DESKTOP NAV ──────────────────────────── */}
        <nav className="siteNav" aria-label="Primary">
          {mainLinks.map((link) => {
            if (link.hasMega) {
              return (
                <div
                  key={link.href}
                  className="navMegaTrigger"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                >
                  <Link
                    href={link.href}
                    className={`siteNavLink navMegaToggle${isActive(link.href) ? " isActive" : ""}`}
                    aria-expanded={megaOpen}
                  >
                    <span>{link.label}</span>
                    <motion.svg
                      animate={{ rotate: megaOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      width="10" height="10" viewBox="0 0 10 10"
                      className="navChevron"
                      aria-hidden="true"
                    >
                      <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </Link>
                </div>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`siteNavLink${isActive(link.href) ? " isActive" : ""}`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── DESKTOP ACTIONS ──────────────────────── */}
        <div className="headerActions">
          <AnimatedThemeToggler className="themeToggler" variant="circle" />
          <button
            type="button"
            className="cmdHint"
            aria-label="Open navigation palette"
            data-command-trigger="true"
          >
            <kbd>⌘</kbd><kbd>K</kbd>
          </button>
          <div style={{ position: "relative", display: "inline-flex", borderRadius: "8px" }}>
            <GlowingEffect spread={28} borderWidth={1} disabled={false} proximity={50} />
            <Link className="headerCta" href="/booking">Book a session</Link>
          </div>
        </div>

        {/* ── MOBILE HAMBURGER ─────────────────────── */}
        <button
          type="button"
          className="hamburgerBtn"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <motion.span
            className="hamburgerLine"
            animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 5 : 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          />
          <motion.span
            className="hamburgerLine"
            animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0.5 : 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="hamburgerLine"
            animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -5 : 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          />
        </button>
      </div>

      {/* ── MEGA MENU PANEL ──────────────────────────────────────────── */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="navMegaPanel"
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
          >
            <div className="container navMegaInner">
              <div className="navMegaArtists">
                {artistData.map((artist) => (
                  <Link
                    key={artist.slug}
                    href={`/artists/${artist.slug}`}
                    className="navMegaArtistCard"
                  >
                    <div className="navMegaArtistImg">
                      {artist.leadImagePath && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={artist.leadImagePath} alt={artist.name} loading="eager" />
                      )}
                    </div>
                    <div className="navMegaArtistInfo">
                      <strong className="navMegaArtistName">{artist.name}</strong>
                      <span className="navMegaArtistRole">{artist.role}</span>
                      <div className="navMegaArtistTags">
                        {artist.specialities.slice(0, 2).map((s) => (
                          <span key={s}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="navMegaArtistArrow">
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="navMegaFooter">
                <Link href="/artists" className="navMegaAll">
                  View all portfolios <ArrowRight size={13} />
                </Link>
                <span className="navMegaMeta">Three resident artists · Custom work only</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE DRAWER ────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mobileBackdrop"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="mobileDrawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Header row */}
              <div className="mobileDrawerHeader">
                <Link href="/" className="brandWordmark" onClick={() => setMobileOpen(false)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/dahlialogo-dark.svg" className="brandLogo" alt="" aria-hidden="true" />
                  <span>
                    <strong>{studioName}</strong>
                    <small>{strapline}</small>
                  </span>
                </Link>
                <button
                  type="button"
                  className="mobileDrawerClose"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="mobileDrawerNav" aria-label="Mobile navigation">
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } }, hidden: {} }}
                  style={{ listStyle: "none", margin: 0, padding: 0 }}
                >
                  {mainLinks.map((link) => (
                    <motion.li
                      key={link.href}
                      variants={{ visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: 32 } }}
                      transition={{ duration: 0.22 }}
                    >
                      <Link
                        href={link.href}
                        className={`mobileDrawerLink${isActive(link.href) ? " isActive" : ""}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                      {link.hasMega && (
                        <div className="mobileArtistList">
                          {artistData.map((a) => (
                            <Link
                              key={a.slug}
                              href={`/artists/${a.slug}`}
                              className="mobileArtistItem"
                              onClick={() => setMobileOpen(false)}
                            >
                              {a.leadImagePath && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={a.leadImagePath} alt="" aria-hidden="true" className="mobileArtistThumb" />
                              )}
                              <div>
                                <span className="mobileArtistItemName">{a.name}</span>
                                <span className="mobileArtistItemSpec">{a.specialities[0]}</span>
                              </div>
                              <ArrowRight size={13} className="mobileArtistArrow" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.li>
                  ))}

                  {subLinks.map((link) => (
                    <motion.li
                      key={link.href}
                      variants={{ visible: { opacity: 1, x: 0 }, hidden: { opacity: 0, x: 32 } }}
                      transition={{ duration: 0.22 }}
                    >
                      <Link
                        href={link.href}
                        className="mobileDrawerLink mobileDrawerLinkSub"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>

              {/* Footer */}
              <div className="mobileDrawerFooter">
                <Link
                  href="/booking"
                  className="primaryButton mobileDrawerCta"
                  onClick={() => setMobileOpen(false)}
                >
                  Book a session <ArrowRight size={15} />
                </Link>
                <div className="mobileDrawerMeta">
                  <span><MapPin size={13} /> {address.slice(0, 2).join(", ")}</span>
                  <span><Clock3 size={13} /> Tue – Sat · by appointment</span>
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
