"use client";

import { useState } from "react";
import { ColumnsPhotoAlbum, type RenderPhotoProps, type RenderPhotoContext } from "react-photo-album";
import "react-photo-album/columns.css";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

interface GalleryImage {
  src: string;
  width: number;
  height: number;
  title?: string;
}

interface PortfolioGalleryProps {
  images: GalleryImage[];
  columns?: number;
}

function renderPhoto(props: RenderPhotoProps, context: RenderPhotoContext<GalleryImage>) {
  const { onClick } = props;
  const { photo } = context;
  return (
    <div className="portfolioAlbumTile" onClick={onClick} style={{ cursor: "zoom-in" }}>
      <img
        src={photo.src}
        alt={photo.title || "Portfolio"}
        style={{ display: "block", width: "100%", height: "auto" }}
        loading="lazy"
      />
    </div>
  );
}

export function PortfolioGallery({ images, columns = 3 }: PortfolioGalleryProps) {
  const [index, setIndex] = useState(-1);

  return (
    <>
      <div className="portfolioAlbumGrid">
        <ColumnsPhotoAlbum
          photos={images}
          columns={columns}
          render={{ photo: renderPhoto }}
          onClick={({ index: i }) => setIndex(i)}
        />
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={images.map((img) => ({
          src: img.src,
          title: img.title,
          width: img.width,
          height: img.height,
        }))}
        plugins={[Zoom, Captions]}
      />
    </>
  );
}
