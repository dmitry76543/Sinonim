"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ProductImage } from "@/components/catalog/ProductImage";
import { CompareButton } from "@/components/compare/CompareButton";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { useCart } from "@/context/CartContext";
import { trackAddToCart } from "@/lib/analytics/metrika";
import { formatPrice } from "@/lib/products";
import type { CategorySlug } from "@/lib/products";
import { useProductSelection } from "./ProductSelectionContext";

type GallerySlide =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

type ProductGalleryProps = {
  images: string[];
  name: string;
  videoUrl?: string;
  slug: string;
  price: number;
  productImage: string;
  category: CategorySlug;
  stoneWeight: number;
  stoneLabel: string;
};

type GalleryVideoProps = {
  src: string;
  label: string;
  className?: string;
  preload?: "auto" | "metadata";
  playing: boolean;
};

type GalleryLayoutProps = {
  slides: GallerySlide[];
  name: string;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  thumbClassName: string;
  mainClassName: string;
  mainObjectFit: "cover" | "contain";
  mainImageSizes: string;
  thumbImageSizes: string;
  mainPriority?: boolean;
  onMainClick?: () => void;
  thumbListClassName?: string;
};

const MODAL_ICON_BUTTON_CLASS =
  "opacity-100 bg-brand-sand text-brand-olive-dark hover:text-brand-terracotta w-11 h-11";

function GalleryVideo({
  src,
  label,
  className = "",
  preload = "auto",
  playing,
}: GalleryVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    if (!playing) {
      video.pause();
      return;
    }

    const play = () => {
      const promise = video.play();
      if (promise) {
        promise.catch(() => {
          // Browser may block autoplay until interaction.
        });
      }
    };

    play();

    if (video.readyState < 2) {
      video.addEventListener("loadeddata", play, { once: true });
      return () => video.removeEventListener("loadeddata", play);
    }
  }, [src, playing]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload={preload}
      className={className}
      aria-label={label}
    />
  );
}

function GalleryLayout({
  slides,
  name,
  activeIndex,
  onActiveIndexChange,
  thumbClassName,
  mainClassName,
  mainObjectFit,
  mainImageSizes,
  thumbImageSizes,
  mainPriority,
  onMainClick,
  thumbListClassName = "max-h-full",
}: GalleryLayoutProps) {
  const activeSlide = slides[activeIndex] ?? slides[0];
  const isVideoActive = activeSlide?.type === "video";

  if (!activeSlide) return null;

  const mainContent =
    activeSlide.type === "video" ? (
      <GalleryVideo
        key={`main-${activeSlide.src}`}
        src={activeSlide.src}
        label={`Видео — ${name}`}
        className={`h-full w-full ${mainObjectFit === "cover" ? "object-cover" : "object-contain"} bg-black`}
        playing
      />
    ) : (
      <ProductImage
        src={activeSlide.src}
        alt={name}
        fill
        className={mainObjectFit === "cover" ? "object-cover" : "object-contain"}
        sizes={mainImageSizes}
        priority={mainPriority}
      />
    );

  return (
    <div className="flex gap-3 md:gap-4 items-start min-h-0">
      {slides.length > 1 && (
        <div
          className={`flex shrink-0 flex-col gap-3 overflow-y-auto py-0.5 pr-0.5 ${thumbListClassName}`}
        >
          {slides.map((slide, index) => (
            <button
              key={
                slide.type === "video"
                  ? `video-${slide.src}`
                  : `${slide.src}-${index}`
              }
              type="button"
              onClick={() => onActiveIndexChange(index)}
              aria-label={
                slide.type === "video"
                  ? `Видео ${name}`
                  : `${name} — фото ${index + 1}`
              }
              aria-pressed={activeIndex === index}
              className={`relative shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${thumbClassName} ${
                activeIndex === index
                  ? "border-brand-olive"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {slide.type === "video" ? (
                <GalleryVideo
                  key={`thumb-${slide.src}`}
                  src={slide.src}
                  label={`Видео ${name}`}
                  className="h-full w-full object-cover pointer-events-none"
                  preload="metadata"
                  playing={!isVideoActive}
                />
              ) : (
                <ProductImage
                  src={slide.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes={thumbImageSizes}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {onMainClick ? (
        <button
          type="button"
          onClick={onMainClick}
          className={`min-w-0 flex-1 relative overflow-hidden rounded-xl bg-brand-surface shadow-sm cursor-zoom-in ${mainClassName}`}
          aria-label="Открыть галерею в полном размере"
        >
          {mainContent}
        </button>
      ) : (
        <div
          className={`min-w-0 flex-1 relative overflow-hidden rounded-xl bg-brand-surface ${mainClassName}`}
        >
          {mainContent}
        </div>
      )}
    </div>
  );
}

type ProductGalleryModalFooterProps = {
  slug: string;
  name: string;
  price: number;
  productImage: string;
  category: CategorySlug;
  stoneWeight: number;
  stoneLabel: string;
};

function ProductGalleryModalFooter({
  slug,
  name,
  price,
  productImage,
  category,
  stoneWeight,
  stoneLabel,
}: ProductGalleryModalFooterProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { selectedSize, selectedSizeLabel, artNo } = useProductSelection();

  const handleBuy = () => {
    const variant = [
      stoneLabel,
      selectedSizeLabel != null ? `размер ${selectedSizeLabel}` : null,
    ]
      .filter(Boolean)
      .join(", ");

    addItem({
      productSlug: slug,
      name,
      image: productImage,
      price,
      stoneWeight,
      stoneLabel,
      size: selectedSize,
      artNo,
    });
    trackAddToCart({
      id: artNo ?? slug,
      name,
      price,
      category,
      variant: variant || undefined,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brand-sand px-4 py-4 md:px-6 md:py-5">
      <p className="font-heading text-2xl md:text-3xl text-brand-olive-dark">
        {formatPrice(price)}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          data-add-to-cart
          onClick={handleBuy}
          className="px-6 py-3.5 bg-brand-terracotta hover:bg-brand-terracotta-logo text-white text-sm tracking-widest uppercase transition-colors whitespace-nowrap"
        >
          {added ? "Добавлено ✓" : "Купить"}
        </button>
        <FavoriteButton
          slug={slug}
          className={MODAL_ICON_BUTTON_CLASS}
        />
        <CompareButton slug={slug} className={MODAL_ICON_BUTTON_CLASS} />
      </div>
    </div>
  );
}

type ProductGalleryModalProps = {
  open: boolean;
  onClose: () => void;
  slides: GallerySlide[];
  name: string;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  slug: string;
  price: number;
  productImage: string;
  category: CategorySlug;
  stoneWeight: number;
  stoneLabel: string;
};

function ProductGalleryModal({
  open,
  onClose,
  slides,
  name,
  activeIndex,
  onActiveIndexChange,
  slug,
  price,
  productImage,
  category,
  stoneWeight,
  stoneLabel,
}: ProductGalleryModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-label="Закрыть галерею"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Галерея — ${name}`}
        className="relative z-10 flex w-full max-w-6xl max-h-[min(92vh,900px)] flex-col overflow-hidden rounded-xl bg-brand-surface shadow-2xl"
      >
        <div className="flex items-center justify-end border-b border-brand-sand px-4 py-3 md:px-6">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-muted transition-colors hover:bg-brand-sand hover:text-brand-olive-dark"
            aria-label="Закрыть"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-hidden p-4 md:p-6">
            <GalleryLayout
              slides={slides}
              name={name}
              activeIndex={activeIndex}
              onActiveIndexChange={onActiveIndexChange}
              thumbClassName="h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28"
              mainClassName="h-[min(58vh,640px)]"
              mainObjectFit="contain"
              mainImageSizes="(max-width: 1024px) 90vw, 60vw"
              thumbImageSizes="112px"
              thumbListClassName="max-h-full"
            />
          </div>

          <ProductGalleryModalFooter
            slug={slug}
            name={name}
            price={price}
            productImage={productImage}
            category={category}
            stoneWeight={stoneWeight}
            stoneLabel={stoneLabel}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function ProductGallery({
  images,
  name,
  videoUrl,
  slug,
  price,
  productImage,
  category,
  stoneWeight,
  stoneLabel,
}: ProductGalleryProps) {
  const slides = useMemo(() => {
    const uniqueImages = images.filter((img, i, arr) => arr.indexOf(img) === i);
    const items: GallerySlide[] = uniqueImages.map((src) => ({
      type: "image",
      src,
    }));

    if (videoUrl) {
      items.push({ type: "video", src: videoUrl });
    }

    return items;
  }, [images, videoUrl]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  if (slides.length === 0) return null;

  return (
    <>
      <GalleryLayout
        slides={slides}
        name={name}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        thumbClassName="h-24 w-24 md:h-28 md:w-28 lg:h-32 lg:w-32"
        mainClassName="aspect-square"
        mainObjectFit="cover"
        mainImageSizes="(max-width: 1024px) 100vw, 50vw"
        thumbImageSizes="128px"
        mainPriority
        thumbListClassName="max-h-[min(80vw,36rem)]"
        onMainClick={() => setModalOpen(true)}
      />

      <ProductGalleryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        slides={slides}
        name={name}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        slug={slug}
        price={price}
        productImage={productImage}
        category={category}
        stoneWeight={stoneWeight}
        stoneLabel={stoneLabel}
      />
    </>
  );
}
