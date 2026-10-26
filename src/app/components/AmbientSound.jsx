"use client";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Volume2, VolumeX, Loader2 } from "lucide-react";

// Real studio-recorded nature sound tracks from Google Public Sound Library
const WEATHER_SOUNDS = {
  thunderstorm: {
    name: "Thunder & Rain",
    url: "https://actions.google.com/sounds/v1/weather/summer_thunder_and_rain.ogg",
    icon: "⚡",
  },
  rain: {
    name: "Rainfall",
    url: "https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg",
    icon: "🌧️",
  },
  wind: {
    name: "Breeze & Wind",
    url: "https://actions.google.com/sounds/v1/weather/wind.ogg",
    icon: "🍃",
  },
  night: {
    name: "Night Crickets",
    url: "https://actions.google.com/sounds/v1/ambiences/crickets_with_distant_traffic.ogg",
    icon: "🌙",
  },
  birds: {
    name: "Nature Songbirds",
    url: "https://actions.google.com/sounds/v1/animals/june_songbirds.ogg",
    icon: "🐦",
  },
};

const AmbientSound = ({ weatherCode = 800, icon = "01d" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const isNight = icon.endsWith("n");

  // Determine which real track corresponds to the active weather
  const currentSound = useMemo(() => {
    // Thunderstorm: 2xx
    if (weatherCode >= 200 && weatherCode < 300) {
      return WEATHER_SOUNDS.thunderstorm;
    }
    // Rain & Drizzle: 3xx & 5xx
    if (weatherCode >= 300 && weatherCode < 600) {
      return WEATHER_SOUNDS.rain;
    }
    // Wind / Fog / Mist: 7xx
    if (weatherCode >= 700 && weatherCode < 800) {
      return WEATHER_SOUNDS.wind;
    }
    // Night sky
    if (isNight) {
      return WEATHER_SOUNDS.night;
    }
    // Clear / Sunny day
    return WEATHER_SOUNDS.birds;
  }, [weatherCode, isNight]);

  // Audio player management
  const playTrack = useCallback((url) => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = 0.45;
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    if (audio.src !== url) {
      setIsLoading(true);
      audio.src = url;
      audio.load();
    }

    audio
      .play()
      .then(() => {
        setIsLoading(false);
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn("Audio play blocked by browser policy:", err);
        setIsLoading(false);
        setIsPlaying(false);
      });
  }, []);

  const pauseTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const toggleSound = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack(currentSound.url);
    }
  };

  // Change track if weather changes while playing
  useEffect(() => {
    if (isPlaying && currentSound.url) {
      playTrack(currentSound.url);
    }
  }, [currentSound.url, isPlaying, playTrack]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleSound}
      title={isPlaying ? `Pause ${currentSound.name} Audio` : `Play Real ${currentSound.name} Sound`}
      className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold backdrop-blur-md border ${
        isPlaying
          ? "bg-cyan-500/25 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-500/20"
          : "bg-white/10 hover:bg-white/15 border-white/15 text-slate-200 hover:text-white"
      }`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 text-cyan-300 animate-spin" />
      ) : isPlaying ? (
        <>
          <span className="text-sm">{currentSound.icon}</span>
          <Volume2 className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span className="hidden sm:inline font-bold text-white">
            {currentSound.name}
          </span>
          {/* Animated sound equalizer bars */}
          <span className="flex items-end gap-0.5 h-3 ml-0.5">
            <span className="w-0.5 h-full bg-cyan-300 animate-pulse" />
            <span className="w-0.5 h-2 bg-cyan-300 animate-bounce" />
            <span className="w-0.5 h-2.5 bg-cyan-300 animate-pulse" />
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Audio</span>
        </>
      )}
    </button>
  );
};

export default AmbientSound;
