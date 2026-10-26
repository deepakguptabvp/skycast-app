"use client";
import React from "react";
import { AlertCircle, RotateCcw, MapPin } from "lucide-react";

const ErrorState = ({ message, onRetry, onSelectPopular }) => {
  const suggestions = ["Delhi", "Mumbai", "Bengaluru", "Jaipur", "Goa"];

  return (
    <div className="w-full max-w-xl mx-auto px-4 mt-12 mb-16 text-center">
      <div className="p-8 rounded-3xl glass-panel border border-rose-500/30 bg-rose-950/20 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">Location Not Found</h3>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {message || "We couldn't fetch the weather for this location. Please check the spelling or search for another city."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Try &quot;Delhi&quot;
          </button>
        </div>

        {/* Suggested cities */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-slate-400 mb-3">Or try searching for:</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {suggestions.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onSelectPopular(city)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 hover:text-white border border-white/10 transition-colors"
              >
                <MapPin className="w-3 h-3 text-cyan-400" />
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
