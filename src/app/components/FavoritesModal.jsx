"use client";
import React from "react";
import { Star, X, MapPin, Trash2, ArrowRight } from "lucide-react";

const FavoritesModal = ({
  isOpen,
  onClose,
  savedCities = [],
  onSelectCity,
  onRemoveCity,
  currentCity = "",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl border border-white/20 bg-slate-900/90 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Favorite Cities</h3>
              <p className="text-xs text-slate-400">
                {savedCities.length} {savedCities.length === 1 ? "location" : "locations"} saved
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cities list */}
        <div className="py-4 max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {savedCities.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Star className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No favorite cities yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Click the star icon next to any city to quickly access its forecast anytime!
              </p>
            </div>
          ) : (
            savedCities.map((city) => {
              const isSelected = city.toLowerCase() === currentCity.toLowerCase();
              return (
                <div
                  key={city}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-cyan-500/20 border-cyan-400/50 shadow-md"
                      : "bg-white/5 hover:bg-white/10 border-white/10"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <MapPin
                      className={`w-4 h-4 ${
                        isSelected ? "text-cyan-400" : "text-slate-400"
                      }`}
                    />
                    <span className="text-sm font-bold text-white capitalize">
                      {city}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-semibold border border-cyan-400/30">
                        Current
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onRemoveCity(city)}
                      title="Remove city"
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCity(city);
                        onClose();
                      }}
                      className="p-1.5 text-cyan-400 hover:text-cyan-300 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;
