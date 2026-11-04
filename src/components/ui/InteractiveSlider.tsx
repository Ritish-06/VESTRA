"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sounds } from "@/utils/soundEffects";

interface InteractiveSliderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode[];
  itemWidthClass?: string;
  ariaLabel?: string;
}

export default function InteractiveSlider({
  eyebrow,
  title,
  subtitle,
  headerAction,
  children,
  itemWidthClass = "w-[270px] sm:w-[300px] lg:w-[310px]",
  ariaLabel,
}: InteractiveSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStateRef = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    movedDistance: 0,
  });

  const itemCount = React.Children.count(children);

  const updateScrollMetrics = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);

    const firstItem = track.querySelector<HTMLElement>("[data-slide-index]");
    if (firstItem) {
      const itemSpan = firstItem.offsetWidth + 20; // gap-5 = 20px
      const idx = Math.min(
        Math.max(0, Math.round(scrollLeft / Math.max(1, itemSpan))),
        Math.max(0, itemCount - 1)
      );
      setActiveIndex(idx);
    }
  }, [itemCount]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateScrollMetrics();

    // Native scrollsnapchange listener with scroll fallback (scroll-snap-state-sync)
    const handleSnapChange = (e: Event) => {
      const snapEvent = e as Event & { snapTargetInline?: HTMLElement | null };
      if (snapEvent.snapTargetInline) {
        const idxAttr = snapEvent.snapTargetInline.getAttribute("data-slide-index");
        if (idxAttr !== null) {
          setActiveIndex(Number(idxAttr));
        }
      }
      updateScrollMetrics();
    };

    track.addEventListener("scrollsnapchange", handleSnapChange);
    track.addEventListener("scroll", updateScrollMetrics, { passive: true });
    window.addEventListener("resize", updateScrollMetrics);

    return () => {
      track.removeEventListener("scrollsnapchange", handleSnapChange);
      track.removeEventListener("scroll", updateScrollMetrics);
      window.removeEventListener("resize", updateScrollMetrics);
    };
  }, [updateScrollMetrics, itemCount]);

  const scrollByStep = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    sounds.playClick();
    const firstItem = track.querySelector<HTMLElement>("[data-slide-index]");
    const step = firstItem ? firstItem.offsetWidth + 20 : track.clientWidth * 0.78;
    track.scrollBy({
      left: direction * step,
      behavior: "smooth",
    });
  };

  const scrollToSlide = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    sounds.playClick();
    const target = track.querySelector<HTMLElement>(`[data-slide-index="${index}"]`);
    if (target) {
      track.scrollTo({
        left: target.offsetLeft - 4,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    dragStateRef.current.isDown = true;
    dragStateRef.current.startX = e.pageX - track.offsetLeft;
    dragStateRef.current.scrollLeft = track.scrollLeft;
    dragStateRef.current.movedDistance = 0;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDown) return;
    const track = trackRef.current;
    if (!track) return;
    const x = e.pageX - track.offsetLeft;
    const delta = x - dragStateRef.current.startX;
    dragStateRef.current.movedDistance = Math.abs(delta);
    if (dragStateRef.current.movedDistance > 6) {
      if (!isDragging) setIsDragging(true);
      e.preventDefault();
      track.scrollLeft = dragStateRef.current.scrollLeft - delta * 1.15;
    }
  };

  const finishDrag = () => {
    dragStateRef.current.isDown = false;
    if (isDragging) {
      setTimeout(() => setIsDragging(false), 60);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByStep(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByStep(-1);
    }
  };

  if (itemCount === 0) return null;

  return (
    <section
      aria-label={ariaLabel || title}
      className="w-full space-y-6"
    >
      {/* Header Row with Title & Arrow Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E5E0D7]">
        <div>
          {eyebrow && (
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#8C7352] font-mono block">
              {eyebrow}
            </span>
          )}
          <h2 className="font-serif text-2xl sm:text-4xl text-[#25241F] font-medium mt-1">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[#77736C] mt-1 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 self-start sm:self-end">
          {headerAction}

          {/* Prev / Next Navigation Buttons */}
          <div className="flex items-center gap-1.5" role="group" aria-label={`${title} controls`}>
            <button
              type="button"
              onClick={() => scrollByStep(-1)}
              disabled={!canScrollLeft}
              aria-label={`Previous ${title} slide`}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? "bg-white border-[#E5E0D7] text-[#25241F] hover:border-[#B49A75] hover:bg-[#F0EDE6] shadow-2xs cursor-pointer"
                  : "bg-[#F0EDE6]/60 border-[#E5E0D7]/60 text-[#77736C]/40 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              onClick={() => scrollByStep(1)}
              disabled={!canScrollRight}
              aria-label={`Next ${title} slide`}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? "bg-white border-[#E5E0D7] text-[#25241F] hover:border-[#B49A75] hover:bg-[#F0EDE6] shadow-2xs cursor-pointer"
                  : "bg-[#F0EDE6]/60 border-[#E5E0D7]/60 text-[#77736C]/40 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Draggable & Touch-Swipeable Carousel Track */}
      <div
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} items`}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={finishDrag}
        onMouseLeave={finishDrag}
        onClickCapture={(e) => {
          if (dragStateRef.current.movedDistance > 10) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`vestra-carousel flex items-stretch gap-5 overflow-x-auto py-3 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B49A75] rounded-2xl ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            data-slide-index={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${itemCount}`}
            className={`vestra-carousel-item shrink-0 ${itemWidthClass} transition-transform duration-300`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Synchronized Pagination Indicators */}
      {itemCount > 1 && (
        <nav
          aria-label={`${title} pagination`}
          className="flex items-center justify-between pt-1"
        >
          <div className="flex items-center gap-1.5">
            {Array.from({ length: itemCount }).map((_, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Go to item ${idx + 1}`}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? "w-7 bg-[#25241F]"
                      : "w-2 bg-[#E5E0D7] hover:bg-[#B49A75]"
                  }`}
                />
              );
            })}
          </div>
          <span className="text-[10px] font-mono text-[#77736C] tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")} / {String(itemCount).padStart(2, "0")}
          </span>
        </nav>
      )}
    </section>
  );
}

