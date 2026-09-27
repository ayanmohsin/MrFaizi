import React, { useState, useEffect } from "react";
import { ProductGroup, RestaurantInfo, RESTAURANT_INFO } from "../data/menuData";
import { Phone, Clock, Sparkles, Flame, CheckCircle2, Award, ChevronLeft, ChevronRight, Layers } from "lucide-react";

interface ShowroomSlideProps {
  group: ProductGroup;
  slideIndex: number;
  totalSlides: number;
  currentTime: string;
  isPaused: boolean;
  progressPercent: number;
  isFullscreen?: boolean;
  restaurantInfo?: RestaurantInfo;
}

export const ShowroomSlide: React.FC<ShowroomSlideProps> = ({
  group,
  slideIndex,
  totalSlides,
  currentTime,
  isPaused,
  progressPercent,
  restaurantInfo = RESTAURANT_INFO,
}) => {
  // Gallery images support (2 to 4 pictures per menu group)
  const imageList = group.images && group.images.length > 0 ? group.images : [group.image];
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Reset to first image when changing slide group
  useEffect(() => {
    setActivePhotoIdx(0);
  }, [group.id]);

  // Subtle auto-crossfade between the 2-3 images inside the same slide group every 4 seconds
  useEffect(() => {
    if (imageList.length <= 1 || isPaused) return;

    const crossfadeInterval = setInterval(() => {
      setActivePhotoIdx((prev) => (prev + 1) % imageList.length);
    }, 4000);

    return () => clearInterval(crossfadeInterval);
  }, [imageList.length, isPaused, group.id]);

  const activeImage = imageList[activePhotoIdx] || group.image;

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-950 select-none flex flex-col justify-between text-zinc-100">
      {/* 1. CINEMATIC FULL-SCREEN BACKGROUND HERO IMAGE (Auto-transitioning between 2-3 high-res photos) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          key={activeImage}
          src={activeImage}
          alt={group.imageAlt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center animate-kenburns scale-105 filter brightness-85 contrast-105 transition-opacity duration-1000 ease-in-out"
        />
        {/* Multistage atmospheric dark gradients for maximum typography legibility on large LCD screen */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/60 to-black/50" />
        <div
          className="absolute inset-0 mix-blend-overlay opacity-30"
          style={{ background: group.bgAtmosphere }}
        />
      </div>

      {/* Dynamic Ambient Accent Flares */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />

      {/* TOP HEADER BAR (Signage Navigation & Order Hotline) */}
      <header className="relative z-10 w-full px-6 sm:px-10 pt-5 pb-3.5 flex items-center justify-between border-b border-white/10 bg-black/60 backdrop-blur-xl">
        {/* Brand Crest */}
        <div className="flex items-center gap-4">
          {restaurantInfo.logoUrl ? (
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-400/40 shadow-lg shadow-orange-500/25 bg-black">
              <img
                src={restaurantInfo.logoUrl}
                alt={restaurantInfo.brandName}
                className="w-full h-full object-contain p-1"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 p-[2px] shadow-lg shadow-orange-500/25">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Flame className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>
            </div>
          )}
          <div>
            <div className="flex items-baseline gap-2.5">
              <h1 className="font-cinzel text-2xl md:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 drop-shadow">
                {restaurantInfo.brandName}
              </h1>
              <span className="text-[10px] tracking-widest uppercase font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 font-mono">
                SHOWROOM DISPLAY
              </span>
            </div>
            <p className="text-xs text-zinc-300 font-medium tracking-wide">
              {restaurantInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Center: Slide Index & Multi-photo indicator */}
        <div className="hidden lg:flex items-center gap-3 text-xs bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
          <span className="text-zinc-400 font-mono">GROUP</span>
          <span className="text-amber-300 font-bold tracking-wide uppercase">{group.category}</span>
          <span className="text-zinc-600">•</span>
          <span className="font-mono text-white font-extrabold">
            SLIDE {String(slideIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
          </span>
          {imageList.length > 1 && (
            <>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-mono">
                <Layers className="w-3 h-3" />
                <span>PHOTO {activePhotoIdx + 1}/{imageList.length}</span>
              </span>
            </>
          )}
          {isPaused && (
            <span className="text-xs text-amber-300 font-mono px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
              PAUSED
            </span>
          )}
        </div>

        {/* Right: Hotline & Digital Clock */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Order Delivery Callout */}
          <div className="flex items-center gap-3 px-4 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-red-600/30 to-amber-600/30 border border-red-500/50 shadow-lg shadow-red-950/40 backdrop-blur-md">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-md">
              <Phone className="w-4 h-4 text-white animate-bounce" />
            </div>
            <div className="text-left">
              <div className="text-[9px] uppercase font-extrabold tracking-wider text-red-300">
                DELIVERY HOTLINE
              </div>
              <div className="text-base sm:text-xl font-black font-mono tracking-tight text-white drop-shadow">
                {restaurantInfo.deliveryNumber}
              </div>
            </div>
          </div>

          {/* Clock */}
          <div className="hidden sm:flex items-center gap-2 text-zinc-300 font-mono text-sm px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentTime}</span>
          </div>
        </div>
      </header>

      {/* MAIN SHOWROOM CANVAS */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 px-6 sm:px-10 py-4 sm:py-6 items-center overflow-hidden">
        {/* LEFT COLUMN: Typography, Tagline, & Menu Item Pricing */}
        <div className="lg:col-span-7 flex flex-col justify-center h-full pr-1 space-y-3">
          {/* Kicker & Group Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{group.category}</span>
            </div>
            <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{group.badge}</span>
            </div>
            {group.preparationTime && (
              <span className="text-xs text-zinc-300 font-mono bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
                {group.preparationTime}
              </span>
            )}
          </div>

          {/* Giant Commercial Display Title */}
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              {group.name}
            </h2>
            
            {/* Custom Tagline */}
            <p className="mt-1.5 text-xl sm:text-2xl md:text-3xl font-serif-italic text-amber-300 tracking-wide font-medium leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              "{group.tagline}"
            </p>
            {group.secondaryTagline && (
              <p className="mt-1 text-xs sm:text-sm text-zinc-300 font-light drop-shadow">
                {group.secondaryTagline}
              </p>
            )}
          </div>

          {/* Feature Highlights Row */}
          <div className="flex flex-wrap gap-2 text-xs">
            {group.highlights.map((highlight, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-black/50 border border-white/15 text-zinc-200 font-medium flex items-center gap-1.5 backdrop-blur-md shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                {highlight}
              </span>
            ))}
          </div>

          {/* Meticulous Items & Prices Glass Panel */}
          <div className="mt-1 rounded-3xl bg-zinc-950/85 border border-white/15 p-4 sm:p-5 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs text-zinc-400 uppercase font-mono tracking-wider">
              <span>Item Selection & Recipe</span>
              <span>Price (PKR)</span>
            </div>

            <div className="space-y-1.5 max-h-[250px] sm:max-h-[280px] overflow-y-auto pr-1.5 scrollbar-thin">
              {group.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 p-2 rounded-xl transition-all hover:bg-white/10 group/item border border-transparent hover:border-white/10"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base font-bold text-zinc-100 group-hover/item:text-amber-300 transition-colors">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/25 text-amber-300 border border-amber-500/40">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-zinc-300 truncate mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="text-right shrink-0">
                    <span className="text-base sm:text-xl font-extrabold font-mono tracking-tight text-amber-400 group-hover/item:text-yellow-300 drop-shadow">
                      {item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {group.servingNote && (
              <div className="mt-2.5 pt-2 border-t border-white/10 text-[11px] text-amber-200/90 font-medium italic">
                {group.servingNote}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Multi-Image Showcase Box (Displays 2-3 High-Res Item Photos with Thumbnails) */}
        <div className="lg:col-span-5 h-full flex flex-col justify-center items-center relative">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.8)] group">
            {/* Active Highlight Photo */}
            <img
              key={activeImage}
              src={activeImage}
              alt={group.imageAlt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out"
            />

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

            {/* Floating Quality Seal */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-xl">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Showroom Signature Item</span>
            </div>

            {/* Manual Image Carousel Arrows if multiple images */}
            {imageList.length > 1 && (
              <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIdx((prev) => (prev - 1 + imageList.length) % imageList.length);
                  }}
                  className="pointer-events-auto p-1.5 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black text-white transition-all backdrop-blur-md border border-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIdx((prev) => (prev + 1) % imageList.length);
                  }}
                  className="pointer-events-auto p-1.5 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black text-white transition-all backdrop-blur-md border border-white/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Floating Price Pill */}
            <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-amber-500 text-black font-mono font-black text-xs shadow-lg">
              {group.items[0]?.price}
            </div>

            {/* Floating Bottom Card Over Focal Image */}
            <div className="absolute bottom-3 inset-x-3 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  FEATURED DISH
                </div>
                <div className="text-sm font-bold text-white">
                  {group.items[activePhotoIdx]?.name || group.items[0]?.name || group.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono text-zinc-300">Fresh Cooked</div>
                <div className="text-xs font-bold text-emerald-400">
                  Ready to Serve
                </div>
              </div>
            </div>
          </div>

          {/* Multiple Image Thumbnails Gallery (Click to inspect other photos of this dish) */}
          {imageList.length > 1 ? (
            <div className="w-full flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              {imageList.map((imgUrl, pIdx) => {
                const isSelected = pIdx === activePhotoIdx;
                return (
                  <button
                    key={pIdx}
                    onClick={() => setActivePhotoIdx(pIdx)}
                    className={`relative aspect-video h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      isSelected
                        ? "border-amber-400 shadow-md shadow-amber-500/30 scale-105"
                        : "border-white/15 opacity-60 hover:opacity-100 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Photo ${pIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-mono text-center text-zinc-300">
                      Photo #{pIdx + 1}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Quick Quality Indicators if single image */
            <div className="w-full grid grid-cols-3 gap-2.5 mt-3.5 text-center">
              <div className="px-3 py-2 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md shadow-md">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Taste</div>
                <div className="text-xs font-bold text-amber-300">Mr Faizi Original</div>
              </div>
              <div className="px-3 py-2 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md shadow-md">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Quality</div>
                <div className="text-xs font-bold text-emerald-400">100% Fresh Halal</div>
              </div>
              <div className="px-3 py-2 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md shadow-md">
                <div className="text-[10px] text-zinc-400 uppercase font-mono">Hotline</div>
                <div className="text-xs font-bold font-mono text-red-400">{restaurantInfo.deliveryNumber}</div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* BOTTOM TICKER / FOOTER */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="overflow-hidden whitespace-nowrap py-2.5 px-4 text-xs font-medium text-zinc-300 flex items-center">
          <div className="animate-marquee flex items-center gap-12 font-mono">
            <span className="flex items-center gap-2 text-amber-300 font-bold">
              <Phone className="w-3.5 h-3.5 text-red-500 animate-bounce" />
              HOTLINE DELIVERY: {restaurantInfo.deliveryNumber}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-amber-200 font-bold text-sm">
              {restaurantInfo.urduNote || RESTAURANT_INFO.urduNote}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-amber-400 uppercase tracking-wider font-semibold">
              PREMIUM COMMERCIAL 16:9 FULL HD DIGITAL SIGNAGE • SHOWROOM CONTINUOUS DISPLAY
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-200">
              {restaurantInfo.brandName} — {restaurantInfo.tagline}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-red-400 font-bold">
              CALL {restaurantInfo.deliveryNumber} FOR FAST HOME DELIVERY
            </span>
          </div>
        </div>

        {/* Dynamic Timing Progress Bar (8-10 seconds continuous slideshow) */}
        <div className="w-full h-1 bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-100 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </footer>
    </div>
  );
};
