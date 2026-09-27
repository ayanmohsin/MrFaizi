import React, { useState } from "react";
import { Lock, KeyRound, ShieldAlert, X } from "lucide-react";
import { verifyAdminPin } from "../utils/cloudSyncService";

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPin(pin)) {
      setError(false);
      setPin("");
      onSuccess();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-zinc-900 border border-white/15 rounded-3xl p-6 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white mb-1">
          Owner / Admin PIN Required
        </h3>
        <p className="text-xs text-zinc-400 mb-6">
          Kewal authorized user hi menu, photos aur prices change kar sakta hai.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={8}
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="Enter PIN (Default: 7860)"
              className="w-full text-center text-2xl font-mono font-bold tracking-widest px-4 py-3 bg-zinc-950 border border-white/10 rounded-2xl text-amber-400 focus:outline-none focus:border-amber-500 shadow-inner"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center justify-center gap-1.5 animate-shake">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Ghalat PIN! Barah-e-karam sahi password dalein.</span>
            </div>
          )}

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Admin</span>
            </button>
          </div>

          <div className="pt-2 text-[11px] text-zinc-500">
            Default Security PIN: <span className="text-amber-400 font-mono font-bold">7860</span>
          </div>
        </form>
      </div>
    </div>
  );
};
