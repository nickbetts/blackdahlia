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
  return (
    <div className="pageStack">
      <section className="container pageHeroCompact">
        <Reveal>
          <p className="eyebrow">Artist Portfolio</p>
          <h1>Find the artist and style that matches your idea.</h1>
          <p className="lede">
            Every artist has a distinct visual language. Browse each profile and booking preferences
            before submitting your request.
          </p>
        </Reveal>
      </section>

      <section className="container sectionSpacing">
        <div className="artistIndexGrid">
          {artists.map((artist, index) => {
            const leadImage = getLeadImage(artist.slug);
            const thumbnailGallery = getArtistGallery(artist.slug, 4);

            return (
              <Reveal key={artist.slug} delay={0.08 + index * 0.07} className="artistIndexCard">
                {leadImage ? <img src={leadImage.localPath} alt={leadImage.title || artist.name} loading="lazy" /> : null}
                <div className="artistIndexBody">
                  <p className="artistRole">{artist.role}</p>
                  <h2>{artist.name}</h2>
                  <p>{artist.longBio}</p>

                  <div className="artistTags">
                    {artist.specialities.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>

                  <div className="artistActionsRow">
                    <Link href={`/artists/${artist.slug}`} className="inlineAction">
                      Open profile <ExternalLink size={15} />
                    </Link>
                    <a href={artist.social.instagram} target="_blank" rel="noreferrer" className="inlineAction">
                      Instagram <Camera size={15} />
                    </a>
                  </div>

                  <div className="miniGallery">
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
