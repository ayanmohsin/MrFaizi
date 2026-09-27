import { useState, useEffect, useRef, useCallback } from "react";
import { MENU_GROUPS, ProductGroup, RestaurantInfo, RESTAURANT_INFO } from "./data/menuData";
import { ShowroomSlide } from "./components/ShowroomSlide";
import { SignageControls } from "./components/SignageControls";
import { ConfirmationDrawer } from "./components/ConfirmationDrawer";
import { MenuOverviewModal } from "./components/MenuOverviewModal";
import { SlideManagerModal } from "./components/SlideManagerModal";
import { showroomAudio } from "./utils/audioChime";
import {
  loadGroupsFromStorage,
  saveGroupsToStorage,
  loadRestaurantInfoFromStorage,
  saveRestaurantInfoToStorage,
  clearSignageStorage,
} from "./utils/signageStorage";
import { Tv, Sparkles, Sliders, ChevronRight } from "lucide-react";

export default function App() {
  const [groups, setGroups] = useState<ProductGroup[]>(MENU_GROUPS);
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>(RESTAURANT_INFO);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [intervalSec, setIntervalSec] = useState(8); // 8-10 seconds per user requirement
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Visible groups for slideshow loop
  const visibleGroups = groups.filter((g) => g.isVisible !== false);
  const activeSlidePool = visibleGroups.length > 0 ? visibleGroups : groups;

  // Load saved slides, photos, and restaurant branding from IndexedDB / local storage
  useEffect(() => {
    async function initStorage() {
      try {
        const [savedGroups, savedInfo] = await Promise.all([
          loadGroupsFromStorage(),
          loadRestaurantInfoFromStorage(),
        ]);
        if (savedGroups && savedGroups.length > 0) {
          setGroups(savedGroups);
        }
        if (savedInfo) {
          setRestaurantInfo(savedInfo);
        }
      } catch (err) {
        console.error("Failed to load saved signage data:", err);
      } finally {
        setIsDataLoaded(true);
      }
    }
    initStorage();
  }, []);

  // Auto-save groups when modified
  useEffect(() => {
    if (!isDataLoaded) return;
    saveGroupsToStorage(groups);
  }, [groups, isDataLoaded]);

  // Auto-save branding and logo when modified
  const handleUpdateRestaurantInfo = (newInfo: RestaurantInfo) => {
    setRestaurantInfo(newInfo);
    saveRestaurantInfoToStorage(newInfo);
  };

  // Digital clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Slide transition with chime
  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      setProgressPercent(0);
      startTimeRef.current = Date.now();
      showroomAudio.playTransitionChime();
    },
    []
  );

  // Advance to next visible slide
  const nextSlide = useCallback(() => {
    // Find next index in groups that is visible
    let nextIdx = (currentIndex + 1) % groups.length;
    let attempts = 0;
    while (groups[nextIdx]?.isVisible === false && attempts < groups.length) {
      nextIdx = (nextIdx + 1) % groups.length;
      attempts++;
    }
    goToSlide(nextIdx);
  }, [currentIndex, groups, goToSlide]);

  // Slideshow progress & autoplay loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    const durationMs = intervalSec * 1000;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgressPercent(pct);

      if (elapsed >= durationMs) {
        nextSlide();
      } else {
        timerRef.current = requestAnimationFrame(tick);
      }
    };

    timerRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [currentIndex, isPlaying, intervalSec, nextSlide]);

  // Fullscreen sync
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleToggleMute = () => {
    const muted = showroomAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleUpdateTagline = (groupId: string, newTagline: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, tagline: newTagline } : g))
    );
  };

  // Toggle single slide visibility
  const handleToggleVisibility = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const isCurrentlyVisible = g.isVisible !== false;
          return { ...g, isVisible: !isCurrentlyVisible };
        }
        return g;
      })
    );
  };

  // Update complete group (for image changes, custom item additions/edits)
  const handleUpdateGroup = (updatedGroup: ProductGroup) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
    );
  };

  // Reset all to initial menu data
  const handleResetAll = async () => {
    if (window.confirm("Reset all slides, images, and items to default menu data?")) {
      await clearSignageStorage();
      setGroups(MENU_GROUPS);
      setRestaurantInfo(RESTAURANT_INFO);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        let prevIdx = (currentIndex - 1 + groups.length) % groups.length;
        let attempts = 0;
        while (groups[prevIdx]?.isVisible === false && attempts < groups.length) {
          prevIdx = (prevIdx - 1 + groups.length) % groups.length;
          attempts++;
        }
        goToSlide(prevIdx);
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key.toLowerCase() === "f") {
        handleToggleFullscreen();
      } else if (e.key.toLowerCase() === "m") {
        handleToggleMute();
      } else if (e.key.toLowerCase() === "e") {
        setIsManagerOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, groups, goToSlide, nextSlide]);

  const currentGroup = groups[currentIndex] || groups[0];

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between ${
        isFullscreen ? "h-screen w-screen overflow-hidden p-0" : ""
      }`}
    >
      {/* Top Banner on normal preview mode */}
      {!isFullscreen && (
        <div className="w-full bg-zinc-900 border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
              <Tv className="w-3.5 h-3.5" />
              16:9 Commercial Signage Engine
            </span>
            <span className="hidden md:inline text-zinc-400">
              Auto-advancing every {intervalSec}s • Press{" "}
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-white/10 text-[10px] font-mono">
                Space
              </kbd>{" "}
              to Pause,{" "}
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-white/10 text-[10px] font-mono">
                F
              </kbd>{" "}
              for Fullscreen,{" "}
              <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-white/10 text-[10px] font-mono">
                E
              </kbd>{" "}
              to Edit Slides
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Edit Manager Button */}
            <button
              onClick={() => setIsManagerOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edit Slides / Images / Prices</span>
            </button>

            <button
              onClick={() => setIsConfirmationOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center gap-1 transition-colors"
            >
              <span>Taglines & Previews</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Presentation Container */}
      <div
        className={`flex-1 flex items-center justify-center ${
          isFullscreen ? "p-0 h-full w-full" : "p-2 sm:p-6"
        }`}
      >
        <div
          className={`w-full transition-all duration-300 relative ${
            isFullscreen
              ? "h-full w-full rounded-none border-none"
              : "max-w-[1720px] aspect-video max-h-[82vh] rounded-3xl border border-white/15 shadow-2xl shadow-black overflow-hidden ring-1 ring-white/5"
          }`}
        >
          {/* Active 16:9 Slide */}
          <ShowroomSlide
            group={currentGroup}
            slideIndex={currentIndex}
            totalSlides={groups.length}
            currentTime={currentTime}
            isPaused={!isPlaying}
            progressPercent={progressPercent}
            isFullscreen={isFullscreen}
            restaurantInfo={restaurantInfo}
          />
        </div>
      </div>

      {/* Control Dock */}
      <SignageControls
        groups={groups}
        currentIndex={currentIndex}
        onSelectIndex={goToSlide}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        intervalSec={intervalSec}
        onChangeInterval={(sec) => setIntervalSec(sec)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenConfirmation={() => setIsConfirmationOpen(true)}
        onOpenOverview={() => setIsOverviewOpen(true)}
        onOpenManager={() => setIsManagerOpen(true)}
      />

      {/* Signage Display Manager (Hide Slides, Upload Image, Edit Prices, Brand Name & Logo) */}
      <SlideManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        groups={groups}
        restaurantInfo={restaurantInfo}
        onUpdateRestaurantInfo={handleUpdateRestaurantInfo}
        onToggleVisibility={handleToggleVisibility}
        onUpdateGroup={handleUpdateGroup}
        onResetAll={handleResetAll}
        onSelectSlide={goToSlide}
      />

      {/* Confirmation & Taglines Modal */}
      <ConfirmationDrawer
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        groups={groups}
        onUpdateTagline={handleUpdateTagline}
        onSelectSlide={goToSlide}
      />

      {/* Full Extracted Menu Overview Modal */}
      <MenuOverviewModal
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        groups={groups}
        onSelectGroup={goToSlide}
      />
    </div>
  );
}
