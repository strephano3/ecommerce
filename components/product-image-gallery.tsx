"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { ProductImage } from "@/lib/types";

export function ProductImageGallery({
  images,
  productName
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen]);

  const activeImage = images[activeIndex];

  if (!activeImage) {
    return <div className="product-card-placeholder">touch grass</div>;
  }

  return (
    <>
      <div className="product-gallery-stage">
        <button
          type="button"
          className="product-gallery-main"
          onClick={() => setLightboxOpen(true)}
          aria-label="Apri immagine a piena risoluzione"
        >
          <Image
            src={activeImage.url}
            alt={activeImage.alt || productName}
            fill
            sizes="(max-width: 960px) 100vw, 50vw"
          />
        </button>
      </div>

      {images.length > 1 ? (
        <div className="product-gallery-thumbs">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={`product-thumb ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Apri immagine ${index + 1}`}
            >
              <Image src={image.url} alt={image.alt || productName} fill sizes="84px" />
            </button>
          ))}
        </div>
      ) : null}

      {lightboxOpen ? (
        <div className="product-lightbox" onClick={() => setLightboxOpen(false)}>
          <button
            type="button"
            className="product-lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Chiudi immagine"
          >
            ×
          </button>
          <div className="product-lightbox-frame" onClick={(event) => event.stopPropagation()}>
            <img
              src={activeImage.url}
              alt={activeImage.alt || productName}
              className="product-lightbox-image"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
