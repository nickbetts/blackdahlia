import type { Metadata } from "next";
import Link from "next/link";
import { Camera, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { artists } from "@/content/studio";
import { getArtistGallery, getLeadImage } from "@/lib/media";

export const metadata: Metadata = {
  title: "Artists",
  description:
    "Explore the resident artists at The Black Dahlia and browse styles including realism, blackwork, geometric, illustrative, and traditional work.",
};

export default function ArtistsPage() {
  const styleIndex = Array.from(new Set(artists.flatMap((artist) => artist.specialities))).slice(0, 12);

  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <p className="eyebrow">Artist Atlas</p>
          <h1>Find the right hand for your concept.</h1>
          <p className="lede">
            Every artist carries a different line language, pace, and composition preference. Start
            here before you send your booking brief.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <Reveal className="artistStyleRibbon" delay={0.04}>
          <p className="artistRole">Common Requests</p>
          <div className="artistStylePills">
            {styleIndex.map((style) => (
              <span key={style}>{style}</span>
            ))}
          </div>
        </Reveal>

        <div className="artistAtlasGrid">
          {artists.map((artist, index) => {
            const leadImage = getLeadImage(artist.slug);
            const thumbnailGallery = getArtistGallery(artist.slug, index === 0 ? 5 : 3);

            return (
              <Reveal
                key={artist.slug}
                delay={0.08 + index * 0.07}
                className={`artistAtlasCard${index === 0 ? " isPrimary" : ""}`}
              >
                {leadImage ? (
                  <div className="artistAtlasMedia">
                    <img src={leadImage.localPath} alt={leadImage.title || artist.name} loading="lazy" />
                  </div>
                ) : null}

                <div className="artistAtlasBody">
                  <p className="artistRole">{artist.role}</p>
                  <h2>{artist.name}</h2>
                  <p>{artist.shortBio}</p>

                  <div className="artistTags">
                    {artist.specialities.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>

                  <p className="artistAtlasMeta">
                    Best for clients looking for {artist.specialities.slice(0, 2).join(" and ").toLowerCase()}.
                  </p>

                  <div className="artistActionsRow">
                    <Link href={`/artists/${artist.slug}`} className="inlineAction">
                      Open full profile <ExternalLink size={15} />
                    </Link>
                    <a href={artist.social.instagram} target="_blank" rel="noreferrer" className="inlineAction">
                      Instagram <Camera size={15} />
                    </a>
                    <Link href="/booking" className="inlineAction">
                      Start consultation
                    </Link>
                  </div>

                  <div className="artistAtlasGallery">
                    {thumbnailGallery.map((image) => (
                      <img key={`${artist.slug}-${image.hash}`} src={image.localPath} alt={image.title || artist.name} loading="lazy" />
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
