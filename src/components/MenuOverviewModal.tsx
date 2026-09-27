import React, { useState } from "react";
import { ProductGroup, RESTAURANT_INFO } from "../data/menuData";
import { X, Search, Phone, Eye } from "lucide-react";

interface MenuOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: ProductGroup[];
  onSelectGroup: (index: number) => void;
}

export const MenuOverviewModal: React.FC<MenuOverviewModalProps> = ({
  isOpen,
  onClose,
  groups,
  onSelectGroup,
}) => {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filteredGroups = groups.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.tagline.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.items.some((i) => i.name.toLowerCase().includes(q))
    );
  });

  const totalMenuItems = groups.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-zinc-950/80">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{RESTAURANT_INFO.brandName}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Extracted Catalog ({totalMenuItems} Items across {groups.length} Groups)
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Verified from uploaded menu photo. Hotlines: {RESTAURANT_INFO.deliveryNumber}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes, burgers, broast, pizzas, prices..."
              className="w-full bg-zinc-800/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="text-xs text-zinc-400 flex items-center gap-2 font-mono">
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>0322-7816809</span>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredGroups.map((group) => {
            const originalIndex = groups.findIndex((g) => g.id === group.id);
            return (
              <div
                key={group.id}
                className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-amber-400 font-bold">
                        GROUP #{String(originalIndex + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-base font-bold text-white uppercase">
                        {group.name}
                      </h3>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                        {group.category}
                      </span>
                    </div>
                    <p className="text-xs font-serif-italic text-amber-300 mt-1">
                      "{group.tagline}"
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectGroup(originalIndex);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Display on LCD
                  </button>
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-white/5">
                  {group.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-zinc-900/60 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <span className="text-zinc-200 font-medium truncate pr-2">
                        {item.name}
                      </span>
                      <span className="text-amber-400 font-mono font-bold shrink-0">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
