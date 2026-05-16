"use client";

import { Drawer } from "vaul";
import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import { GiRose } from "react-icons/gi";

interface ArtistDrawerProps {
  children: React.ReactNode;
  name: string;
  role: string;
  shortBio: string;
  longBio: string;
  specialities: string[];
  slug: string;
  instagramUrl: string;
  leadImageSrc?: string;
}

export function ArtistDrawer({
  children,
  name,
  role,
  shortBio,
  longBio,
  specialities,
  slug,
  instagramUrl,
  leadImageSrc,
}: ArtistDrawerProps) {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="drawerOverlay" />
        <Drawer.Content className="drawerContent" aria-label={`${name} artist profile`}>
          <div className="drawerHandle" />

          <div className="drawerInner">
            {leadImageSrc ? (
              <div className="drawerMedia">
                <img src={leadImageSrc} alt={name} loading="lazy" />
              </div>
            ) : null}

            <div className="drawerBody">
              <p className="eyebrow drawerEyebrow">
                <GiRose />
                {role}
              </p>
              <h2 className="heroDisplay">{name}</h2>
              <p className="lede">{shortBio}</p>
              <p>{longBio}</p>

              <div className="drawerTags">
                {specialities.map((s) => (
                  <span key={s} className="signaturePill">{s}</span>
                ))}
              </div>

              <div className="drawerActions">
                <Link href={`/artists/${slug}`} className="primaryButton">
                  Full portfolio <ArrowRight size={16} />
                </Link>
                <a href={instagramUrl} target="_blank" rel="noreferrer" className="ghostButton">
                  Instagram <Camera size={16} />
                </a>
                <Link href={`/booking?artist=${slug}`} className="ghostButton">
                  Book with {name}
                </Link>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
