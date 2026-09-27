import React, { useState } from "react";
import { ProductGroup, MenuItem, RestaurantInfo } from "../data/menuData";
import { compressImageFile } from "../utils/imageCompressor";
import { uploadToImgBB } from "../utils/imgbbService";
import {
  X,
  Eye,
  EyeOff,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  DollarSign,
  Flame,
  Image as ImageIcon,
  Building2,
  Phone,
  Layers,
  Save,
  Loader2,
  CloudUpload,
} from "lucide-react";

interface SlideManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: ProductGroup[];
  restaurantInfo: RestaurantInfo;
  onUpdateRestaurantInfo: (info: RestaurantInfo) => void;
  onToggleVisibility: (groupId: string) => void;
  onUpdateGroup: (updatedGroup: ProductGroup) => void;
  onResetAll: () => void;
  onSelectSlide: (index: number) => void;
}

export const SlideManagerModal: React.FC<SlideManagerModalProps> = ({
  isOpen,
  onClose,
  groups,
  restaurantInfo,
  onUpdateRestaurantInfo,
  onToggleVisibility,
  onUpdateGroup,
  onResetAll,
  onSelectSlide,
}) => {
  const [activeTab, setActiveTab] = useState<"slides" | "branding">("slides");
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || "");
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isUploadingCloud, setIsUploadingCloud] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
  const activeCount = groups.filter((g) => g.isVisible !== false).length;
  const currentImages = currentGroup.images && currentGroup.images.length > 0
    ? currentGroup.images
    : [currentGroup.image];

  // Upload custom logo for brand with Cloud ImgBB + local backup
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCloud(true);
    setUploadMessage("Uploading logo to Cloud CDN...");
    try {
      // First try upload directly to ImgBB Cloud
      let finalUrl: string;
      try {
        finalUrl = await uploadToImgBB(file);
        setUploadMessage("Logo uploaded to Cloud successfully!");
      } catch (cloudErr) {
        console.warn("ImgBB upload failed, falling back to local compressed:", cloudErr);
        finalUrl = await compressImageFile(file, 800, 800, 0.9);
        setUploadMessage("Saved locally!");
      }

      onUpdateRestaurantInfo({
        ...restaurantInfo,
        logoUrl: finalUrl,
      });
    } catch (err) {
      console.error("Error setting logo:", err);
      setUploadMessage("Upload failed.");
    } finally {
      setIsUploadingCloud(false);
      setTimeout(() => setUploadMessage(null), 3000);
    }
  };

  // Upload an additional or replacement photo for dish with Cloud ImgBB + local backup
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentGroup) return;

    setIsUploadingCloud(true);
    setUploadMessage("Uploading photo to Cloud Server...");
    try {
      let finalUrl: string;
      try {
        finalUrl = await uploadToImgBB(file);
        setUploadMessage("Uploaded to Cloud CDN!");
      } catch (cloudErr) {
        console.warn("ImgBB cloud failed, falling back to compressed local:", cloudErr);
        finalUrl = await compressImageFile(file, 1920, 1080, 0.85);
        setUploadMessage("Saved locally!");
      }

      const updatedImages = [...currentImages, finalUrl];
      onUpdateGroup({
        ...currentGroup,
        image: updatedImages[0],
        images: updatedImages,
      });
    } catch (err) {
      console.error("Error processing photo:", err);
      setUploadMessage("Upload failed.");
    } finally {
      setIsUploadingCloud(false);
      setTimeout(() => setUploadMessage(null), 3000);
    }
  };

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim() || !currentGroup) return;

    const updatedImages = [...currentImages, newImageUrl.trim()];
    onUpdateGroup({
      ...currentGroup,
      image: updatedImages[0],
      images: updatedImages,
    });
    setNewImageUrl("");
  };

  const handleSetPrimaryImage = (index: number) => {
    if (!currentGroup) return;
    const reordered = [...currentImages];
    const [selected] = reordered.splice(index, 1);
    reordered.unshift(selected);

    onUpdateGroup({
      ...currentGroup,
      image: selected,
      images: reordered,
    });
  };

  const handleDeleteImage = (index: number) => {
    if (!currentGroup || currentImages.length <= 1) return;
    const filtered = currentImages.filter((_, idx) => idx !== index);
    onUpdateGroup({
      ...currentGroup,
      image: filtered[0],
      images: filtered,
    });
  };

  const handleUpdateName = (name: string) => {
    if (!currentGroup) return;
    onUpdateGroup({ ...currentGroup, name });
  };

  const handleUpdateTagline = (tagline: string) => {
    if (!currentGroup) return;
    onUpdateGroup({ ...currentGroup, tagline });
  };

  const handleUpdateSecondary = (secondaryTagline: string) => {
    if (!currentGroup) return;
    onUpdateGroup({ ...currentGroup, secondaryTagline });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice.trim() || !currentGroup) return;

    const newItem: MenuItem = {
      name: newItemName.trim(),
      price: newItemPrice.trim().startsWith("Rs.") ? newItemPrice.trim() : `Rs. ${newItemPrice.trim()}/-`,
      description: newItemDesc.trim() || undefined,
    };

    onUpdateGroup({
      ...currentGroup,
      items: [...currentGroup.items, newItem],
    });

    setNewItemName("");
    setNewItemPrice("");
    setNewItemDesc("");
  };

  const handleDeleteItem = (itemIndex: number) => {
    if (!currentGroup) return;
    const updated = currentGroup.items.filter((_, idx) => idx !== itemIndex);
    onUpdateGroup({
      ...currentGroup,
      items: updated,
    });
  };

  const handleUpdateItem = (itemIndex: number, field: keyof MenuItem, value: string) => {
    if (!currentGroup) return;
    const updated = [...currentGroup.items];
    updated[itemIndex] = {
      ...updated[itemIndex],
      [field]: value,
    };
    onUpdateGroup({
      ...currentGroup,
      items: updated,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/90 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Signage Display Manager & Brand Customizer</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {activeCount} of {groups.length} Slides Visible
                </span>
                {isUploadingCloud && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Cloud Uploading...</span>
                  </span>
                )}
                {uploadMessage && !isUploadingCloud && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                    <CloudUpload className="w-3 h-3" />
                    <span>{uploadMessage}</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400">
                Change brand name & logo, upload cloud photos via ImgBB CDN, hide/show slides, or update prices.
              </p>
            </div>
          </div>

          {/* Tab Switcher: Slides vs Brand Profile */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-white/10 rounded-2xl">
            <button
              onClick={() => setActiveTab("slides")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "slides"
                  ? "bg-amber-500 text-black shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Menu Slides & Photos</span>
            </button>
            <button
              onClick={() => setActiveTab("branding")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "branding"
                  ? "bg-amber-500 text-black shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Company Name & Logo</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetAll}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5 transition-colors"
              title="Reset all images and items to original menu defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB 1: BRANDING (Company Name, Logo, Hotline, Urdu Ticker Note) */}
        {activeTab === "branding" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Branding Overview Card */}
              <div className="p-6 rounded-3xl bg-zinc-950 border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">
                        Restaurant / Brand Profile Settings
                      </h3>
                      <p className="text-xs text-zinc-400">
                        These details appear across all 16:9 showroom TV slides, top bar, and footer ticker.
                      </p>
                    </div>
                  </div>
                  {restaurantInfo.logoUrl && (
                    <button
                      onClick={() => onUpdateRestaurantInfo({ ...restaurantInfo, logoUrl: undefined })}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Custom Logo</span>
                    </button>
                  )}
                </div>

                {/* Company Logo Upload & Live Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-4 flex flex-col items-center text-center p-4 rounded-2xl bg-zinc-900 border border-white/10">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black border-2 border-amber-500/40 p-1 flex items-center justify-center shadow-lg relative group">
                      {restaurantInfo.logoUrl ? (
                        <img
                          src={restaurantInfo.logoUrl}
                          alt="Company Logo"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-zinc-500 gap-1">
                          <Flame className="w-10 h-10 text-amber-400 animate-pulse" />
                          <span className="text-[10px] font-mono text-zinc-400">Default Crest</span>
                        </div>
                      )}
                    </div>
                    <label className={`mt-3 cursor-pointer px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow ${
                      isUploadingCloud
                        ? "bg-amber-500/50 text-black pointer-events-none"
                        : "bg-amber-500 hover:bg-amber-400 text-black"
                    }`}>
                      {isUploadingCloud ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <CloudUpload className="w-3.5 h-3.5" />
                          <span>Upload Cloud Logo</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={isUploadingCloud}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-zinc-500 mt-1">Saves to Cloud CDN</span>
                  </div>

                  <div className="sm:col-span-8 space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                        Brand / Company Name
                      </label>
                      <input
                        type="text"
                        value={restaurantInfo.brandName}
                        onChange={(e) =>
                          onUpdateRestaurantInfo({
                            ...restaurantInfo,
                            brandName: e.target.value,
                          })
                        }
                        placeholder="e.g. MR FAIZI, AL-MADINA TIKKA"
                        className="w-full px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-lg font-black text-amber-300 tracking-wider focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                        Subtitle / Kitchen Category
                      </label>
                      <input
                        type="text"
                        value={restaurantInfo.subtitle}
                        onChange={(e) =>
                          onUpdateRestaurantInfo({
                            ...restaurantInfo,
                            subtitle: e.target.value,
                          })
                        }
                        placeholder="Fast Food, BBQ & Gourmet Kitchen"
                        className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Hotline & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-red-400" />
                      <span>Delivery Hotline Number</span>
                    </label>
                    <input
                      type="text"
                      value={restaurantInfo.deliveryNumber}
                      onChange={(e) =>
                        onUpdateRestaurantInfo({
                          ...restaurantInfo,
                          deliveryNumber: e.target.value,
                        })
                      }
                      placeholder="0322-7816809"
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl font-mono text-base font-bold text-red-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                      Slogan / Tagline
                    </label>
                    <input
                      type="text"
                      value={restaurantInfo.tagline}
                      onChange={(e) =>
                        onUpdateRestaurantInfo({
                          ...restaurantInfo,
                          tagline: e.target.value,
                        })
                      }
                      placeholder="Taste That Keeps You Coming Back"
                      className="w-full px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm italic text-amber-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Urdu Ticker Message in Footer */}
                <div className="pt-4 border-t border-white/10">
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                    Urdu Ticker Notice (Scrolling at bottom of TV screen)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={restaurantInfo.urduNote || ""}
                    onChange={(e) =>
                      onUpdateRestaurantInfo({
                        ...restaurantInfo,
                        urduNote: e.target.value,
                      })
                    }
                    placeholder="نوٹ: رائیدڑ سے بل لازمی لیں اور کھلے پیسے خود دیں..."
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm text-amber-200 text-right font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Quick Preview Card */}
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/5 flex items-center justify-between text-xs text-zinc-400">
                <span>All changes apply instantly to the TV display slideshow.</span>
                <button
                  onClick={() => setActiveTab("slides")}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
                >
                  Continue to Slide Photos →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SLIDES & MULTI-IMAGE MANAGEMENT */}
        {activeTab === "slides" && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* LEFT SIDEBAR: List of all 12 Slides with Show/Hide Toggles */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 bg-zinc-950/50 flex flex-col overflow-y-auto">
              <div className="p-3 border-b border-white/5 text-[11px] font-mono uppercase text-zinc-400 font-semibold tracking-wider flex items-center justify-between">
                <span>All Slides ({groups.length})</span>
                <span>Display Toggle</span>
              </div>

              <div className="p-2 space-y-1">
                {groups.map((g, idx) => {
                  const isSelected = g.id === currentGroup?.id;
                  const isVisible = g.isVisible !== false;
                  const imgCount = g.images?.length || 1;

                  return (
                    <div
                      key={g.id}
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500/40 text-white"
                          : "bg-zinc-900/40 border-white/5 text-zinc-300 hover:bg-white/5"
                      }`}
                    >
                      <button
                        onClick={() => setSelectedGroupId(g.id)}
                        className="flex-1 flex items-center gap-2.5 text-left min-w-0"
                      >
                        <div className="w-10 h-7 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black relative">
                          <img
                            src={g.image}
                            alt={g.name}
                            className={`w-full h-full object-cover ${!isVisible ? "opacity-30 grayscale" : ""}`}
                          />
                          {imgCount > 1 && (
                            <div className="absolute bottom-0 right-0 px-1 bg-amber-500 text-black font-black text-[8px] rounded-tl">
                              {imgCount}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold truncate flex items-center gap-1.5">
                            <span className="font-mono text-[10px] text-amber-400">
                              #{String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className={!isVisible ? "line-through text-zinc-500" : ""}>
                              {g.name}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-500 truncate flex items-center gap-2">
                            <span>{g.items.length} items</span>
                            <span>•</span>
                            <span className="text-amber-400/80 font-mono">{imgCount} photos</span>
                          </div>
                        </div>
                      </button>

                      {/* Show/Hide Eyeball Button */}
                      <button
                        onClick={() => onToggleVisibility(g.id)}
                        className={`p-1.5 rounded-lg border transition-all shrink-0 ml-1 ${
                          isVisible
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                        }`}
                        title={isVisible ? "Hide this slide from display" : "Show this slide on display"}
                      >
                        {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT DETAIL AREA: Edit Active Slide Images, Tagline, Items, and Prices */}
            {currentGroup && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Slide Status Banner */}
                <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-2xl bg-zinc-950 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          EDITING SLIDE
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            currentGroup.isVisible !== false
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {currentGroup.isVisible !== false ? "Active on LCD" : "Hidden from LCD"}
                        </span>
                      </div>
                      <h3 className="text-xl font-black uppercase text-white mt-0.5">
                        {currentGroup.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const idx = groups.findIndex((g) => g.id === currentGroup.id);
                        onSelectSlide(idx);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View on Fullscreen LCD</span>
                    </button>

                    <button
                      onClick={() => onToggleVisibility(currentGroup.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                        currentGroup.isVisible !== false
                          ? "bg-red-500/10 text-red-300 border-red-500/30 hover:bg-red-500/20"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
                      }`}
                    >
                      {currentGroup.isVisible !== false ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Hide Slide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Show Slide</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 1. MULTI-IMAGE GALLERY MANAGEMENT (Add 2-3 Photos, Reorder, Upload from Device) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>Slide Photo Gallery ({currentImages.length} Photos for this Dish)</span>
                    </div>
                    <span className="text-xs text-amber-400 font-mono">
                      Slideshow alternates between these photos automatically
                    </span>
                  </div>

                  {/* Grid of All Photos for this Menu Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentImages.map((imgUrl, imgIdx) => {
                      const isPrimary = imgIdx === 0;

                      return (
                        <div
                          key={imgIdx}
                          className={`relative aspect-video rounded-2xl overflow-hidden border-2 bg-zinc-900 group ${
                            isPrimary
                              ? "border-amber-400 ring-2 ring-amber-400/20"
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${currentGroup.name} Photo ${imgIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            {!isPrimary && (
                              <button
                                onClick={() => handleSetPrimaryImage(imgIdx)}
                                className="px-2.5 py-1 bg-amber-500 text-black text-[11px] font-bold rounded-lg shadow"
                              >
                                Make Main Photo
                              </button>
                            )}
                            {currentImages.length > 1 && (
                              <button
                                onClick={() => handleDeleteImage(imgIdx)}
                                className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-500 shadow"
                                title="Delete this photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="absolute bottom-1.5 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-zinc-200">
                            {isPrimary ? "★ Primary Cover" : `Photo #${imgIdx + 1}`}
                          </div>
                        </div>
                      );
                    })}

                    {/* Add New Photo Upload Card */}
                    <label className={`cursor-pointer aspect-video rounded-2xl border-2 border-dashed transition-colors p-4 text-center flex flex-col items-center justify-center gap-2 ${
                      isUploadingCloud
                        ? "border-amber-400 bg-amber-500/15 pointer-events-none"
                        : "border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10"
                    }`}>
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                        {isUploadingCloud ? (
                          <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                        ) : (
                          <CloudUpload className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-amber-300">
                          {isUploadingCloud ? "Uploading to Cloud..." : "+ Upload Dish Photo"}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          Auto-saved to ImgBB Cloud CDN
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploadingCloud}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Or paste web image URL */}
                  <form
                    onSubmit={handleAddImageUrl}
                    className="flex items-center gap-2 pt-2 border-t border-white/5"
                  >
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Or paste external image URL (e.g. https://...)"
                      className="flex-1 px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-colors shrink-0"
                    >
                      Add URL
                    </button>
                  </form>
                </div>

                {/* 2. GROUP TITLE & COMMERCIAL TAGLINES */}
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-3">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Category Title & Showroom Tagline</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-mono">
                        Category Display Name
                      </label>
                      <input
                        type="text"
                        value={currentGroup.name}
                        onChange={(e) => handleUpdateName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-mono">
                        Commercial Slogan / Tagline
                      </label>
                      <input
                        type="text"
                        value={currentGroup.tagline}
                        onChange={(e) => handleUpdateTagline(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-xl text-amber-300 font-serif-italic focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-mono">
                      Secondary Sub-Description
                    </label>
                    <input
                      type="text"
                      value={currentGroup.secondaryTagline || ""}
                      onChange={(e) => handleUpdateSecondary(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-xl text-zinc-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* 3. MENU ITEMS & REAL-TIME PRICE EDITING */}
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>Items & Prices in this Group ({currentGroup.items.length})</span>
                    </div>
                    <span className="text-xs text-zinc-400">
                      Click any price or name to edit directly
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {currentGroup.items.map((item, idx) => {
                      const isEditing = editingItemIndex === idx;

                      return (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between gap-3 text-xs"
                        >
                          {isEditing ? (
                            <div className="flex-1 flex items-center gap-2 flex-wrap">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleUpdateItem(idx, "name", e.target.value)}
                                placeholder="Item Name"
                                className="flex-1 min-w-[140px] px-2.5 py-1 bg-black border border-amber-500 rounded-lg text-white font-bold"
                              />
                              <input
                                type="text"
                                value={item.price}
                                onChange={(e) => handleUpdateItem(idx, "price", e.target.value)}
                                placeholder="Rs. 500/-"
                                className="w-28 px-2.5 py-1 bg-black border border-amber-500 rounded-lg text-amber-300 font-mono font-bold"
                              />
                              <input
                                type="text"
                                value={item.description || ""}
                                onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                                placeholder="Optional short description"
                                className="flex-1 min-w-[180px] px-2.5 py-1 bg-black border border-white/10 rounded-lg text-zinc-300"
                              />
                              <button
                                onClick={() => setEditingItemIndex(null)}
                                className="px-3 py-1 bg-emerald-500 text-black font-bold rounded-lg flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Done</span>
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white text-sm">{item.name}</span>
                                  {item.badge && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="text-[11px] text-zinc-400 truncate">{item.description}</p>
                                )}
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-mono font-black text-amber-400 text-sm sm:text-base">
                                  {item.price}
                                </span>
                                <button
                                onClick={() => setEditingItemIndex(idx)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors"
                                title="Edit item details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(idx)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                title="Delete item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add New Item Form */}
                <form
                  onSubmit={handleAddItem}
                  className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                >
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="+ New Item Name (e.g. Zinger Roll)"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Price (e.g. 450)"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Short description (optional)"
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/10 rounded-xl text-zinc-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Item</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-zinc-950 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="text-emerald-400 flex items-center gap-1.5 font-medium">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Auto-Saved: All photos, prices & brand name are permanently preserved in browser storage.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors shadow-md"
          >
            Apply & Return to Showroom
          </button>
        </div>
      </div>
    </div>
  );
};
