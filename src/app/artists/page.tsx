import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Camera, ExternalLink } from "lucide-react";
import { GiSkullCrossedBones, GiRose } from "react-icons/gi";
import { ArtistDrawer } from "@/components/artist-drawer";
import { artists } from "@/content/studio";
import { getArtistGallery, getLeadImage } from "@/lib/media";

export const metadata: Metadata = {
  title: "Artists",
  description:
    "Explore the resident artists at The Black Dahlia and browse styles including realism, blackwork, geometric, illustrative, and traditional work.",
};

const motifIcons = [
  <GiRose key="rose" size={12} />,
  <GiSkullCrossedBones key="skull" size={12} />,
  <GiRose key="rose2" size={12} />,
];

export default function ArtistsPage() {
  const styleIndex = Array.from(
    new Set(artists.flatMap((artist) => artist.specialities))
  ).slice(0, 12);

  return (
    <div className="pageStack">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="pageHero">
        <div className="container">
          <div className="pageHeroDivider" />
          <p className="eyebrow">The artists</p>
          <h1 className="displayXL">
            Find <em>the right hand</em><br />for your piece.
          </h1>
          <p className="lede">
            Different lines, different pace, different way of building a composition.
            Read the room before you send the brief.
          </p>
        </div>
      </section>

      {/* ── STYLE INDEX ──────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <p className="eyebrow">What gets asked for</p>
        <div className="styleScroll" style={{ marginTop: "0.7rem" }}>
          {styleIndex.map((style) => (
            <span key={style} className="stylePill">{style}</span>
          ))}
        </div>
      </section>

      {/* ── ARTIST ATLAS ─────────────────────────────────────────────── */}
      <section className="container sectionSpacing">
        <div className="artistAtlasGrid">
          {artists.map((artist, index) => {
            const leadImage = getLeadImage(artist.slug);
            const thumbnailGallery = getArtistGallery(artist.slug, index === 0 ? 5 : 3);
            const motifIcon = motifIcons[index % motifIcons.length];
            const isPrimary = index === 0;

            return (
              <div
                key={artist.slug}
                className={`artistAtlasCard${isPrimary ? " isPrimary" : ""}`}
              >
                {leadImage ? (
                  <div className="artistAtlasMedia">
                    <img
                      src={leadImage.localPath}
                      alt={leadImage.title || artist.name}
                      loading="lazy"
                    />
                  </div>
                ) : null}

                <div className="artistAtlasBody">
                  <p className="artistRole">{artist.role}</p>
                  <h2>{artist.name}</h2>
                  <p style={{ color: "var(--text-200)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {artist.shortBio}
                  </p>

                  <div className="artistTags">
                    {artist.specialities.map((item) => (
                      <span key={item}>{motifIcon}{item}</span>
                    ))}
                  </div>

                  <p className="artistAtlasMeta">
                    Best if you&apos;re after{" "}
                    {artist.specialities.slice(0, 2).join(" or ").toLowerCase()}.
                  </p>

                  <div className="artistActionsRow">
                    <ArtistDrawer
                      name={artist.name}
                      role={artist.role}
                      shortBio={artist.shortBio}
                      longBio={artist.longBio}
                      specialities={artist.specialities}
                      slug={artist.slug}
                      instagramUrl={artist.social.instagram}
                      leadImageSrc={leadImage?.localPath}
                    >
                      <button className="inlineAction">Quick look</button>
                    </ArtistDrawer>
                    <Link href={`/artists/${artist.slug}`} className="inlineAction">
                      Full profile <ExternalLink size={15} />
                    </Link>
                    <a
                      href={artist.social.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="inlineAction"
                    >
                      Instagram <Camera size={15} />
                    </a>
                  </div>

                  <div className="artistAtlasGallery">
                    {thumbnailGallery.map((image) => (
                      <img
                        key={`${artist.slug}-${image.hash}`}
                        src={image.localPath}
                        alt={image.title || artist.name}
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────────────── */}
      <section className="container ctaBand">
        <div className="ctaBandInner" style={{ position: "relative", zIndex: 2 }}>
          <div>
            <p className="eyebrow">Ready to sit?</p>
            <h2 className="displayMix">
              Pick your artist. <em>Send the brief.</em>
            </h2>
          </div>
          <div className="ctaBandLinks">
            <Link href="/booking" className="primaryButton">
              Book a session <ArrowRight size={15} />
            </Link>
            <Link href="/contact" className="ghostButton">
              Ask a question
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
