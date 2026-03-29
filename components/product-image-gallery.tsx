"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { ProductImage } from "@/lib/types";

export function ProductImageGallery({
  images,
  productName,
  isPoster = false
}: {
  images: ProductImage[];
  productName: string;
  isPoster?: boolean;
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
  const hasMultipleImages = images.length > 1;

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  }

  if (!activeImage) {
    return <div className="product-card-placeholder">touch grass</div>;
  }

  return (
    <>
      <div className={`product-gallery-stage ${isPoster ? "is-poster" : ""}`}>
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

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              className="product-gallery-arrow is-left"
              onClick={showPrevious}
              aria-label="Immagine precedente"
            >
              ‹
            </button>
            <button
              type="button"
              className="product-gallery-arrow is-right"
              onClick={showNext}
              aria-label="Immagine successiva"
            >
              ›
            </button>
          </>
        ) : null}
      </div>

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
            {hasMultipleImages ? (
              <>
                <button
                  type="button"
                  className="product-gallery-arrow is-left in-lightbox"
                  onClick={showPrevious}
                  aria-label="Immagine precedente"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="product-gallery-arrow is-right in-lightbox"
                  onClick={showNext}
                  aria-label="Immagine successiva"
                >
                  ›
                </button>
              </>
            ) : null}
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
