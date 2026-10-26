"use client";
import React from "react";
import { CloudSun, RefreshCw, Star, ArrowRightLeft } from "lucide-react";
import AmbientSound from "./AmbientSound";

const Header = ({
  unit,
  setUnit,
  onRefresh,
  isRefreshing,
  savedCities = [],
  onOpenFavorites,
  onOpenCompare,
  lastUpdated,
  weatherCode = 800,
  icon = "01d",
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
      {/* Brand logo */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 flex-shrink-0">
          <CloudSun className="w-6 h-6 text-white animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping opacity-75" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              SkyCast
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Live
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Atmospheric & 5-Day Precision Forecast
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Real Weather Ambient Sound Toggle */}
        <AmbientSound weatherCode={weatherCode} icon={icon} />

        {/* Compare Cities Button */}
        <button
          type="button"
          onClick={onOpenCompare}
          title="Compare Cities side-by-side"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-slate-200 hover:text-white transition-all text-xs font-semibold"
        >
          <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">Compare</span>
        </button>

        {/* Unit Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
          <button
            onClick={() => setUnit("metric")}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
              unit === "metric"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/25"
                : "text-slate-300 hover:text-white"
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit("imperial")}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
              unit === "imperial"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/25"
                : "text-slate-300 hover:text-white"
            }`}
          >
            °F
          </button>
        </div>

        {/* Favorites button */}
        <button
          onClick={onOpenFavorites}
          title="Saved Cities"
          className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-slate-200 hover:text-white transition-all text-xs font-medium"
        >
          <Star className={`w-4 h-4 ${savedCities.length > 0 ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
          <span className="hidden lg:inline">Favorites</span>
          {savedCities.length > 0 && (
            <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-amber-400 text-slate-950">
              {savedCities.length}
            </span>
          )}
        </button>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title={`Refresh Weather data ${lastUpdated ? `(Last: ${lastUpdated})` : ""}`}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-slate-200 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
        </button>
      </div>
    </header>
  );
};

export default Header;
