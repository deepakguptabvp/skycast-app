"use client";
import React, { useMemo } from "react";

const WeatherBackgroundAnimation = ({ weatherCode = 800, icon = "01d", temp = 25 }) => {
  const isNight = icon.endsWith("n");
  const isHot = temp >= 32;

  // Determine weather category
  const weatherType = useMemo(() => {
    // Thunderstorm: 2xx
    if (weatherCode >= 200 && weatherCode < 300) return "thunderstorm";
    // Drizzle & Rain: 3xx & 5xx
    if (weatherCode >= 300 && weatherCode < 600) return "rain";
    // Snow: 6xx
    if (weatherCode >= 600 && weatherCode < 700) return "snow";
    // Mist / Fog / Haze: 7xx
    if (weatherCode >= 700 && weatherCode < 800) return "mist";
    // Clear: 800
    if (weatherCode === 800) return isNight ? "clear-night" : (isHot ? "hot" : "clear-day");
    // Clouds: 801 - 804
    return isNight ? "clouds-night" : "clouds-day";
  }, [weatherCode, isNight, isHot]);

  // Raindrop items
  const rainDrops = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: `${(i * 2.2 + Math.random() * 2).toFixed(1)}%`,
      delay: `${(Math.random() * 1.5).toFixed(2)}s`,
      duration: `${(0.6 + Math.random() * 0.4).toFixed(2)}s`,
      opacity: (0.4 + Math.random() * 0.5).toFixed(2),
      length: `${18 + Math.floor(Math.random() * 16)}px`,
    }));
  }, []);

  // Snowflakes items
  const snowflakes = useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: `${(i * 2.8 + Math.random() * 2).toFixed(1)}%`,
      delay: `${(Math.random() * 3).toFixed(2)}s`,
      duration: `${(3 + Math.random() * 4).toFixed(2)}s`,
      size: `${6 + Math.floor(Math.random() * 8)}px`,
      opacity: (0.4 + Math.random() * 0.6).toFixed(2),
    }));
  }, []);

  // Stars for night sky
  const stars = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.floor(Math.random() * 100)}%`,
      top: `${Math.floor(Math.random() * 60)}%`,
      size: `${1 + Math.floor(Math.random() * 3)}px`,
      delay: `${(Math.random() * 4).toFixed(2)}s`,
      duration: `${(1.5 + Math.random() * 2.5).toFixed(2)}s`,
    }));
  }, []);

  // Heat shimmer particles
  const heatWaves = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.5 + Math.random() * 3).toFixed(1)}%`,
      delay: `${(Math.random() * 2.5).toFixed(2)}s`,
      duration: `${(2.5 + Math.random() * 2).toFixed(2)}s`,
      width: `${40 + Math.floor(Math.random() * 60)}px`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. RAIN ANIMATION */}
      {weatherType === "rain" && (
        <div className="absolute inset-0">
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className="absolute bg-gradient-to-b from-cyan-200/60 to-blue-400/80 rounded-full animate-raindrop"
              style={{
                left: drop.left,
                top: "-30px",
                width: "2px",
                height: drop.length,
                animationDelay: drop.delay,
                animationDuration: drop.duration,
                opacity: drop.opacity,
              }}
            />
          ))}
          {/* Ground rain splash mist */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-blue-900/25 to-transparent blur-xl" />
        </div>
      )}

      {/* 2. THUNDERSTORM ANIMATION */}
      {weatherType === "thunderstorm" && (
        <div className="absolute inset-0">
          {/* Lightning Flash Overlay */}
          <div className="absolute inset-0 bg-blue-100/20 animate-lightning-flash" />

          {/* Heavy rain drops */}
          {rainDrops.slice(0, 35).map((drop) => (
            <div
              key={drop.id}
              className="absolute bg-gradient-to-b from-purple-200/80 to-blue-300 rounded-full animate-heavy-rain"
              style={{
                left: drop.left,
                top: "-40px",
                width: "2.5px",
                height: drop.length,
                animationDelay: drop.delay,
                animationDuration: "0.5s",
                opacity: drop.opacity,
              }}
            />
          ))}

          {/* Storm glow */}
          <div className="absolute -top-32 inset-x-0 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
        </div>
      )}

      {/* 3. CLOUDS ANIMATION (Day & Night) */}
      {(weatherType === "clouds-day" || weatherType === "clouds-night") && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Cloud Layer 1 - Slow Drifting */}
          <div
            className={`absolute top-8 -left-96 w-[650px] h-64 rounded-full blur-3xl animate-cloud-drift-1 ${
              weatherType === "clouds-night"
                ? "bg-slate-700/25"
                : "bg-white/18"
            }`}
          />
          {/* Cloud Layer 2 - Medium Drifting */}
          <div
            className={`absolute top-24 -left-72 w-[520px] h-52 rounded-full blur-3xl animate-cloud-drift-2 ${
              weatherType === "clouds-night"
                ? "bg-indigo-950/40"
                : "bg-sky-200/20"
            }`}
          />
          {/* Cloud Layer 3 - Lower Drifting */}
          <div
            className={`absolute top-64 -left-80 w-[600px] h-56 rounded-full blur-3xl animate-cloud-drift-3 ${
              weatherType === "clouds-night"
                ? "bg-slate-800/30"
                : "bg-blue-100/15"
            }`}
          />
        </div>
      )}

      {/* 4. CLEAR DAY / SUNNY ANIMATION */}
      {weatherType === "clear-day" && (
        <div className="absolute inset-0">
          {/* Pulsing Sun Orb */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-amber-300/35 via-yellow-400/20 to-orange-500/15 rounded-full blur-3xl animate-sun-pulse" />
          {/* Secondary ambient warm beam */}
          <div className="absolute top-1/4 -right-10 w-72 h-72 bg-amber-400/15 rounded-full blur-2xl animate-soft-glow" />
          {/* Rotating Sunbeam flare */}
          <div className="absolute -top-32 right-12 w-[500px] h-[500px] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(251,191,36,0.12)_45deg,transparent_90deg,rgba(245,158,11,0.12)_180deg,transparent_270deg)] rounded-full animate-slow-spin blur-xl" />
        </div>
      )}

      {/* 5. HOT WEATHER ANIMATION (Indian Heat / High Temp > 32°C) */}
      {weatherType === "hot" && (
        <div className="absolute inset-0">
          {/* Intense Sun Heat Glow */}
          <div className="absolute -top-24 -right-16 w-[450px] h-[450px] bg-gradient-to-br from-orange-500/35 via-rose-500/25 to-amber-400/25 rounded-full blur-3xl animate-sun-pulse" />
          <div className="absolute top-1/3 inset-x-0 h-64 bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent blur-2xl" />

          {/* Rising Heatwaves / Shimmer Particles */}
          {heatWaves.map((wave) => (
            <div
              key={wave.id}
              className="absolute bottom-0 h-36 bg-gradient-to-t from-orange-400/20 to-transparent rounded-full blur-md animate-heatwave"
              style={{
                left: wave.left,
                width: wave.width,
                animationDelay: wave.delay,
                animationDuration: wave.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* 6. SNOW ANIMATION */}
      {weatherType === "snow" && (
        <div className="absolute inset-0">
          {snowflakes.map((flake) => (
            <div
              key={flake.id}
              className="absolute bg-white rounded-full blur-[0.5px] animate-snowfall"
              style={{
                left: flake.left,
                top: "-20px",
                width: flake.size,
                height: flake.size,
                opacity: flake.opacity,
                animationDelay: flake.delay,
                animationDuration: flake.duration,
              }}
            />
          ))}
          {/* Cold icy ground fog */}
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-cyan-400/15 via-white/5 to-transparent blur-2xl" />
        </div>
      )}

      {/* 7. MIST / FOG / HAZE ANIMATION */}
      {weatherType === "mist" && (
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-40 w-[700px] h-72 bg-stone-300/15 rounded-full blur-3xl animate-fog-drift-1" />
          <div className="absolute top-1/2 -right-40 w-[650px] h-80 bg-zinc-400/15 rounded-full blur-3xl animate-fog-drift-2" />
          <div className="absolute bottom-10 inset-x-0 h-56 bg-stone-400/10 blur-2xl animate-pulse" />
        </div>
      )}

      {/* 8. CLEAR NIGHT SKY ANIMATION */}
      {weatherType === "clear-night" && (
        <div className="absolute inset-0">
          {/* Crescent Moon Glow */}
          <div className="absolute top-12 right-16 w-44 h-44 bg-indigo-300/20 rounded-full blur-3xl animate-soft-glow" />

          {/* Twinkling Stars */}
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute bg-white rounded-full animate-star-twinkle"
              style={{
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
                animationDuration: star.duration,
              }}
            />
          ))}

          {/* Subtle shooting star streak */}
          <div className="absolute top-20 right-1/3 w-28 h-0.5 bg-gradient-to-r from-transparent via-cyan-200 to-transparent rotate-[35deg] animate-shooting-star" />
        </div>
      )}
    </div>
  );
};

export default WeatherBackgroundAnimation;
