"use client";
import React from "react";
import {
  formatWindSpeed,
  formatVisibility,
  getWindDirection,
  formatLocalTime12h,
} from "../utils/utility";
import {
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  Cloud,
  Compass,
} from "lucide-react";

const WeatherMetrics = ({ currentWeatherData, unit }) => {
  const data = currentWeatherData?.data;
  if (!data) return null;

  const windSpeed = data.wind?.speed;
  const windDeg = data.wind?.deg ?? 0;
  const windGust = data.wind?.gust;
  const windDir = getWindDirection(windDeg);

  const humidity = data.main?.humidity ?? 0;
  const temp = data.main?.temp ?? 20;
  const dewPoint = Math.round(temp - (100 - humidity) / 5);

  const visibility = data.visibility;
  const pressure = data.main?.pressure;
  const cloudiness = data.clouds?.all ?? 0;

  const timezone = data.timezone || 0;
  const sunrise = data.sys?.sunrise;
  const sunset = data.sys?.sunset;

  // Daylight progress calculation
  const nowUnix = Math.floor(Date.now() / 1000);
  let daylightProgress = 0;
  let isDaytime = true;
  let timeUntilEvent = "";

  if (sunrise && sunset) {
    if (nowUnix >= sunrise && nowUnix <= sunset) {
      daylightProgress = Math.min(
        100,
        Math.max(0, Math.round(((nowUnix - sunrise) / (sunset - sunrise)) * 100))
      );
      isDaytime = true;
      const secsLeft = sunset - nowUnix;
      const hrs = Math.floor(secsLeft / 3600);
      const mins = Math.floor((secsLeft % 3600) / 60);
      timeUntilEvent = `Sunset in ${hrs}h ${mins}m`;
    } else {
      isDaytime = false;
      daylightProgress = 100;
      let secsLeft = 0;
      if (nowUnix < sunrise) {
        secsLeft = sunrise - nowUnix;
      } else {
        // Next day sunrise ~ sunrise + 86400
        secsLeft = sunrise + 86400 - nowUnix;
      }
      const hrs = Math.floor(secsLeft / 3600);
      const mins = Math.floor((secsLeft % 3600) / 60);
      timeUntilEvent = `Sunrise in ${hrs}h ${mins}m`;
    }
  }

  // Calculate coordinates along SVG semi-circle arc (width=160, height=65)
  // Arc center: (80, 55), rx=65, ry=42
  const progressRatio = isDaytime ? daylightProgress / 100 : 1;
  const sunAngle = Math.PI * progressRatio; // 0 to PI
  const sunX = Math.round(80 - 65 * Math.cos(sunAngle));
  const sunY = Math.round(55 - 42 * Math.sin(sunAngle));

  // Humidity comfort category
  const getHumidityStatus = (h) => {
    if (h < 30) return { label: "Dry", color: "text-amber-300" };
    if (h <= 60) return { label: "Comfortable", color: "text-emerald-300" };
    if (h <= 80) return { label: "Humid", color: "text-cyan-300" };
    return { label: "Very Humid", color: "text-blue-300" };
  };

  const getVisibilityStatus = (v) => {
    if (v >= 10000) return "Excellent clarity";
    if (v >= 5000) return "Good visibility";
    if (v >= 2000) return "Moderate haze";
    return "Poor visibility / Fog";
  };

  const humStatus = getHumidityStatus(humidity);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Gauge className="w-5 h-5 text-cyan-400" />
          Atmospheric Conditions
        </h3>
        <span className="text-xs text-slate-400">Live Station Sensors</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Card 1: Wind */}
        <div className="glass-panel glass-card-hover rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-cyan-400" />
              Wind
            </span>
            <span className="text-slate-300 font-mono text-[11px] flex items-center gap-1">
              <Compass
                className="w-3.5 h-3.5 text-cyan-400 transition-transform"
                style={{ transform: `rotate(${windDeg}deg)` }}
              />
              {windDir} ({windDeg}°)
            </span>
          </div>

          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {formatWindSpeed(windSpeed, unit)}
            </span>
          </div>

          <div className="text-[11px] text-slate-300">
            {windGust ? (
              <span>Gusts up to {formatWindSpeed(windGust, unit)}</span>
            ) : (
              <span>Light gentle breeze</span>
            )}
          </div>
        </div>

        {/* Card 2: Humidity */}
        <div className="glass-panel glass-card-hover rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-400" />
              Humidity
            </span>
            <span className={`text-[11px] font-semibold ${humStatus.color}`}>
              {humStatus.label}
            </span>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {humidity}%
            </span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, humidity))}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-400 mt-2">
            Dew point is roughly {dewPoint}°{unit === "metric" ? "C" : "F"}
          </div>
        </div>

        {/* Card 3: Visibility */}
        <div className="glass-panel glass-card-hover rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-400" />
              Visibility
            </span>
          </div>

          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {formatVisibility(visibility, unit)}
            </span>
          </div>

          <div className="text-[11px] text-slate-300">
            {getVisibilityStatus(visibility)}
          </div>
        </div>

        {/* Card 4: Pressure */}
        <div className="glass-panel glass-card-hover rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-amber-400" />
              Pressure
            </span>
          </div>

          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {pressure ?? "--"}
            </span>
            <span className="text-xs text-slate-400 ml-1">hPa</span>
          </div>

          <div className="text-[11px] text-slate-300">
            {pressure >= 1013 ? "High pressure system" : "Low pressure system"}
          </div>
        </div>

        {/* Card 5: Cloud Cover */}
        <div className="glass-panel glass-card-hover rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-sky-400" />
              Cloud Cover
            </span>
            <span className="text-[11px] font-mono text-slate-300">
              {cloudiness}%
            </span>
          </div>

          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {cloudiness > 70
                ? "Overcast"
                : cloudiness > 30
                ? "Scattered"
                : "Clear Sky"}
            </span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-400 to-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${cloudiness}%` }}
            />
          </div>
        </div>

        {/* Card 6: Interactive Sun Path Arc (Sunrise & Sunset) */}
        <div className="glass-panel glass-card-hover rounded-2xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Sunrise className="w-4 h-4 text-amber-400" />
              Sun Path Arc
            </span>
            <span className="text-[11px] text-amber-300 font-semibold truncate ml-2">
              {timeUntilEvent}
            </span>
          </div>

          {/* SVG Sun Arc */}
          <div className="relative flex items-center justify-center my-1">
            <svg
              viewBox="0 0 160 65"
              className="w-full max-w-[200px] h-14 overflow-visible"
            >
              {/* Ground horizon line */}
              <line
                x1="8"
                y1="55"
                x2="152"
                y2="55"
                stroke="rgba(255,255,255,0.15)"
                strokeDasharray="2,2"
                strokeWidth="1"
              />

              {/* Background Sun Arc Path */}
              <path
                d="M 15 55 A 65 42 0 0 1 145 55"
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="2.5"
                strokeDasharray="3,3"
              />

              {/* Active Golden Daylight Path */}
              <path
                d="M 15 55 A 65 42 0 0 1 145 55"
                fill="none"
                stroke="url(#sun-gradient)"
                strokeWidth="3"
                strokeDasharray="180"
                strokeDashoffset={180 - (180 * daylightProgress) / 100}
                className="transition-all duration-1000"
              />

              {/* Sun Gradient definition */}
              <defs>
                <linearGradient id="sun-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
                <filter id="sun-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Traveling Sun Orb or Night Moon Orb */}
              {isDaytime ? (
                <g filter="url(#sun-glow)" className="transition-all duration-1000">
                  <circle cx={sunX} cy={sunY} r="7" fill="#fbbf24" />
                  <circle cx={sunX} cy={sunY} r="4" fill="#ffffff" />
                </g>
              ) : (
                <g className="transition-all duration-1000">
                  <circle cx="80" cy="55" r="5" fill="#818cf8" opacity="0.6" />
                </g>
              )}
            </svg>
          </div>

          {/* Sunrise & Sunset Timings Row */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
            <div className="flex items-center gap-1 text-slate-300">
              <Sunrise className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono font-bold text-white text-[11px]">
                {sunrise ? formatLocalTime12h(sunrise, timezone) : "--"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <Sunset className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-mono font-bold text-white text-[11px]">
                {sunset ? formatLocalTime12h(sunset, timezone) : "--"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMetrics;
