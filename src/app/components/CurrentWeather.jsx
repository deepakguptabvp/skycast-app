"use client";
import React from "react";
import {
  formatTemp,
  formatLocalDate,
  formatLocalTime12h,
  getSmartWeatherAdvice,
  getWeatherTheme,
} from "../utils/utility";
import {
  Star,
  ArrowUp,
  ArrowDown,
  Umbrella,
  Zap,
  Snowflake,
  Sun,
  Wind,
  Droplets,
  Smile,
  Clock,
  Sparkles,
  Flame,
} from "lucide-react";

const AdviceIcon = ({ name, className }) => {
  switch (name) {
    case "umbrella":
      return <Umbrella className={className} />;
    case "zap":
      return <Zap className={className} />;
    case "snowflake":
      return <Snowflake className={className} />;
    case "sun":
      return <Sun className={className} />;
    case "wind":
      return <Wind className={className} />;
    case "droplets":
      return <Droplets className={className} />;
    default:
      return <Smile className={className} />;
  }
};

const CurrentWeather = ({
  currentWeatherData,
  unit,
  isFavorite,
  onToggleFavorite,
}) => {
  const data = currentWeatherData?.data;
  if (!data) return null;

  const name = data.name;
  const country = data.sys?.country;
  const weatherItem = data.weather?.[0] || {};
  const icon = weatherItem.icon || "01d";
  const desc = weatherItem.description || "Clear";
  const mainCondition = weatherItem.main || "Clear";
  const weatherCode = weatherItem.id || 800;

  const currentTemp = data.main?.temp;
  const feelsLike = data.main?.feels_like;
  const minTemp = data.main?.temp_min;
  const maxTemp = data.main?.temp_max;
  const timezone = data.timezone || 0;

  const theme = getWeatherTheme(weatherCode, icon, currentTemp);
  const advice = getSmartWeatherAdvice(data);
  const localTime = formatLocalTime12h(Math.floor(Date.now() / 1000), timezone);
  const localDate = formatLocalDate(Math.floor(Date.now() / 1000), timezone);

  const isHotWeather = (currentTemp || 0) >= 35;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-5">
      {/* Main Glass Card */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 border border-white/20 shadow-2xl">
        {/* Ambient background glow accent */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-50 animate-soft-glow"
          style={{ background: theme.glow }}
        />

        {/* Header row: Location, Country, Local Time, Favorite */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                {name}
              </h2>
              {country && (
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-white/15 text-slate-100 border border-white/25 shadow-sm">
                  {country}
                </span>
              )}
              {/* Favorite Toggle Button */}
              <button
                type="button"
                onClick={onToggleFavorite}
                title={isFavorite ? "Remove from Favorites" : "Save to Favorites"}
                className={`p-2 rounded-xl transition-all duration-200 active:scale-90 ${
                  isFavorite
                    ? "bg-amber-400/25 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-400/20"
                    : "bg-white/10 text-slate-300 hover:text-amber-400 hover:bg-white/20 border border-white/15"
                }`}
              >
                <Star
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`}
                />
              </button>
            </div>

            {/* Date & Local Time */}
            <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-slate-300">
              <span className="font-medium">{localDate}</span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1.5 font-mono text-cyan-300 font-semibold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Clock className="w-3.5 h-3.5" />
                {localTime} Local
              </span>
            </div>
          </div>

          {/* Condition Badge & Heat indicator */}
          <div className="flex flex-wrap items-center gap-2">
            {isHotWeather && (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-gradient-to-r from-orange-500/30 to-rose-500/30 text-amber-200 border border-orange-400/50 shadow-sm animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                Heat Wave
              </span>
            )}
            <span
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold capitalize border shadow-md backdrop-blur-md ${theme.badge}`}
            >
              {desc}
            </span>
          </div>
        </div>

        {/* Center row: Big Temp & Weather Illustration */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between py-6 sm:py-8 gap-6">
          {/* Temperature section */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-baseline">
              <span className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white drop-shadow-lg">
                {formatTemp(currentTemp, unit).replace(/°[CF]/, "")}
              </span>
              <span className="text-3xl sm:text-4xl md:text-5xl font-light text-cyan-300 ml-1.5 drop-shadow">
                °{unit === "metric" ? "C" : "F"}
              </span>
            </div>

            {/* Feels like & Hi/Lo tags */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-3 text-xs sm:text-sm text-slate-300">
              <span className="bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 shadow-sm font-medium">
                Feels like:{" "}
                <strong className="text-white font-bold text-sm">
                  {formatTemp(feelsLike, unit)}
                </strong>
              </span>

              <div className="flex items-center gap-2 font-semibold bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 shadow-sm">
                <span className="flex items-center text-rose-300">
                  <ArrowUp className="w-3.5 h-3.5 mr-0.5 text-rose-400" />
                  {formatTemp(maxTemp, unit)}
                </span>
                <span className="text-slate-500">|</span>
                <span className="flex items-center text-cyan-300">
                  <ArrowDown className="w-3.5 h-3.5 mr-0.5 text-cyan-400" />
                  {formatTemp(minTemp, unit)}
                </span>
              </div>
            </div>
          </div>

          {/* Weather Icon Illustration with Ambient Glow */}
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-white/15 via-white/5 to-transparent border border-white/20 backdrop-blur-md shadow-2xl animate-weather-float">
              {/* Inner glow disc */}
              <div
                className="absolute inset-4 rounded-full blur-xl opacity-40 pointer-events-none"
                style={{ background: theme.glow }}
              />
              <img
                src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
                alt={desc}
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-2xl relative z-10"
              />
            </div>
            <span className="mt-2.5 text-xs font-bold text-slate-200 tracking-widest uppercase bg-white/10 px-3 py-0.5 rounded-full border border-white/15">
              {mainCondition}
            </span>
          </div>
        </div>

        {/* Bottom row: Smart Weather Insight & Advice Banner */}
        {advice && (
          <div className="relative z-10 mt-1 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md flex items-center gap-3.5">
            <div className="flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br from-cyan-400/25 to-blue-500/25 text-cyan-300 border border-cyan-400/40 shadow-sm">
              <AdviceIcon name={advice.icon} className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {advice.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5 leading-relaxed">
                {advice.text}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentWeather;
