import React, { useState } from "react";
import { ProductGroup } from "../data/menuData";
import {
  CheckCircle,
  Sparkles,
  X,
  Edit3,
  Flame,
  Check,
  Eye,
} from "lucide-react";

interface ConfirmationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  groups: ProductGroup[];
  onUpdateTagline: (groupId: string, newTagline: string) => void;
  onSelectSlide: (index: number) => void;
}

export const ConfirmationDrawer: React.FC<ConfirmationDrawerProps> = ({
  isOpen,
  onClose,
  groups,
  onUpdateTagline,
  onSelectSlide,
}) => {
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editTaglineVal, setEditTaglineVal] = useState("");

  if (!isOpen) return null;

  const handleStartEdit = (group: ProductGroup) => {
    setEditingGroupId(group.id);
    setEditTaglineVal(group.tagline);
  };

  const handleSaveEdit = (groupId: string) => {
    if (editTaglineVal.trim()) {
      onUpdateTagline(groupId, editTaglineVal.trim());
    }
    setEditingGroupId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                All Product Groups & High-Resolution Background Imagery
              </h2>
              <p className="text-xs text-zinc-400">
                All 12 groups now feature large commercial food photography backgrounds, dedicated item presentations, and custom slogans.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group, idx) => {
              const isEditing = editingGroupId === group.id;

              return (
                <div
                  key={group.id}
                  className="rounded-2xl border border-white/10 bg-zinc-950/80 overflow-hidden flex flex-col justify-between shadow-lg group hover:border-amber-500/50 transition-all"
                >
                  {/* Visual Preview */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                    <img
                      src={group.image}
                      alt={group.imageAlt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300">
                      SLIDE #{String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs">
                      <span className="font-bold text-white drop-shadow">
                        {group.name}
                      </span>
                      <span className="text-emerald-400 font-mono text-[10px] bg-black/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> 8K Visual
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                        <span>{group.category}</span>
                        <span className="font-mono text-amber-400 font-semibold">{group.items.length} Items</span>
                      </div>

                      {/* Tagline Display or Edit */}
                      {isEditing ? (
                        <div className="space-y-2 mt-1">
                          <input
                            type="text"
                            value={editTaglineVal}
                            onChange={(e) => setEditTaglineVal(e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-zinc-900 border border-amber-500 rounded-lg text-white focus:outline-none"
                            autoFocus
                          />
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingGroupId(null)}
                              className="px-2 py-0.5 text-[10px] text-zinc-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(group.id)}
                              className="px-2.5 py-0.5 text-[10px] bg-amber-500 text-black font-bold rounded flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-1 mt-1">
                          <p className="text-xs font-serif-italic text-amber-200 line-clamp-2">
                            "{group.tagline}"
                          </p>
                          <button
                            onClick={() => handleStartEdit(group)}
                            className="text-zinc-500 hover:text-amber-300 p-1 shrink-0"
                            title="Edit Tagline"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => {
                        onSelectSlide(idx);
                        onClose();
                      }}
                      className="w-full mt-2 py-1.5 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-black text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Display on Showroom Screen</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-zinc-950 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>12/12 Categories loaded with full-size commercial imagery</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors"
          >
            Return to Fullscreen Signage
          </button>
        </div>
      </div>
    </div>
  );
};
