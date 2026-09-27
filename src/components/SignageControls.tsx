import React from "react";
import { ProductGroup } from "../data/menuData";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sliders,
  ListOrdered,
  FileCheck,
  Edit,
} from "lucide-react";

interface SignageControlsProps {
  groups: ProductGroup[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  intervalSec: number;
  onChangeInterval: (sec: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenConfirmation: () => void;
  onOpenOverview: () => void;
  onOpenManager: () => void;
}

export const SignageControls: React.FC<SignageControlsProps> = ({
  groups,
  currentIndex,
  onSelectIndex,
  isPlaying,
  onTogglePlay,
  intervalSec,
  onChangeInterval,
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  onOpenConfirmation,
  onOpenOverview,
  onOpenManager,
}) => {
  return (
    <div className="w-full bg-zinc-900/90 border-t border-white/10 px-4 sm:px-8 py-3.5 backdrop-blur-xl shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Playback & Slide Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Previous Slide */}
          <button
            onClick={() => onSelectIndex((currentIndex - 1 + groups.length) % groups.length)}
            aria-label="Previous Slide"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={onTogglePlay}
            className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-md ${
              isPlaying
                ? "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20"
                : "bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Auto-Play</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Slideshow</span>
              </>
            )}
          </button>

          {/* Next Slide */}
          <button
            onClick={() => onSelectIndex((currentIndex + 1) % groups.length)}
            aria-label="Next Slide"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Speed / Interval Picker */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            <Sliders className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400 font-medium">Timer:</span>
            {[8, 10, 12].map((sec) => (
              <button
                key={sec}
                onClick={() => onChangeInterval(sec)}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                  intervalSec === sec
                    ? "bg-amber-500 text-black font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>

          {/* Audio Chime */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl border transition-colors ${
              !isMuted
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                : "bg-white/5 text-zinc-400 hover:text-white border-white/10"
            }`}
            title={isMuted ? "Turn sound effects on" : "Mute sound effects"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Side: Modals, Confirmation, & Fullscreen Mode */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Signage Manager & Slide Customizer (Show/Hide, Upload Image, Edit Price) */}
          <button
            onClick={onOpenManager}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/30"
          >
            <Edit className="w-4 h-4 text-emerald-400" />
            <span>Slide Manager & Edit Items</span>
          </button>

          {/* Review & Confirm Taglines Modal */}
          <button
            onClick={onOpenConfirmation}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <FileCheck className="w-4 h-4 text-amber-400" />
            <span>Taglines & Previews</span>
          </button>

          {/* Menu Extraction Breakdown */}
          <button
            onClick={onOpenOverview}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <ListOrdered className="w-4 h-4 text-zinc-400" />
            <span>All Groups ({groups.length})</span>
          </button>

          {/* Fullscreen TV Showroom Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors"
            title="Toggle Large LCD TV Fullscreen"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span className="hidden sm:inline">Exit TV Mode</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">16:9 Fullscreen TV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Horizontal Group Quick-Switch Bar */}
      <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-white/5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {groups.map((group, idx) => {
          const isActive = idx === currentIndex;
          const isVisible = group.isVisible !== false;

          return (
            <button
              key={group.id}
              onClick={() => onSelectIndex(idx)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
                isActive
                  ? "bg-amber-500 text-black border-amber-400 font-bold shadow-md shadow-amber-500/20"
                  : isVisible
                  ? "bg-white/5 text-zinc-300 hover:text-white border-white/5 hover:bg-white/10"
                  : "bg-black/40 text-zinc-500 border-dashed border-red-500/30 opacity-60"
              }`}
            >
              <span className="font-mono text-[10px] opacity-75">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className={!isVisible ? "line-through" : ""}>{group.name}</span>
              {!isVisible && (
                <span className="text-[9px] px-1 rounded bg-red-500/20 text-red-400">
                  Hidden
                </span>
              )}
              {group.image && isVisible && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
