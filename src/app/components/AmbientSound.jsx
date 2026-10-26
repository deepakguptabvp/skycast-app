"use client";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Volume2, VolumeX, Volume1, Loader2, Sliders } from "lucide-react";

// Local high-definition MP3 nature sounds served directly from /public/sounds
const WEATHER_SOUNDS = {
  thunderstorm: {
    key: "thunderstorm",
    name: "Thunder & Rain",
    url: "/sounds/thunder.mp3",
    icon: "⚡",
  },
  rain: {
    key: "rain",
    name: "Rainfall",
    url: "/sounds/rain.mp3",
    icon: "🌧️",
  },
  wind: {
    key: "wind",
    name: "Breeze & Wind",
    url: "/sounds/wind.mp3",
    icon: "🍃",
  },
  night: {
    key: "night",
    name: "Night Crickets",
    url: "/sounds/crickets.mp3",
    icon: "🌙",
  },
  birds: {
    key: "birds",
    name: "Nature Songbirds",
    url: "/sounds/birds.mp3",
    icon: "🐦",
  },
};

const AmbientSound = ({ weatherCode = 800, icon = "01d" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.85); // Default audible volume 85%
  const [showControls, setShowControls] = useState(false);
  const [selectedTrackKey, setSelectedTrackKey] = useState(null);
  const audioRef = useRef(null);

  const isNight = icon.endsWith("n");

  // Determine auto sound based on current weather
  const autoSound = useMemo(() => {
    // Thunderstorm: 2xx
    if (weatherCode >= 200 && weatherCode < 300) {
      return WEATHER_SOUNDS.thunderstorm;
    }
    // Rain & Drizzle: 3xx & 5xx
    if (weatherCode >= 300 && weatherCode < 600) {
      return WEATHER_SOUNDS.rain;
    }
    // Wind / Fog / Mist / Storm: 7xx
    if (weatherCode >= 700 && weatherCode < 800) {
      return WEATHER_SOUNDS.wind;
    }
    // Night time
    if (isNight) {
      return WEATHER_SOUNDS.night;
    }
    // Clear / Sunny day
    return WEATHER_SOUNDS.birds;
  }, [weatherCode, isNight]);

  // Current track is either manual override or auto-detected weather sound
  const activeSound = selectedTrackKey
    ? WEATHER_SOUNDS[selectedTrackKey] || autoSound
    : autoSound;

  // Audio player management
  const playTrack = useCallback(
    (url, currentVol) => {
      try {
        if (!audioRef.current) {
          const audio = new Audio();
          audio.loop = true;
          audioRef.current = audio;
        }

        const audio = audioRef.current;
        audio.volume = currentVol;

        if (audio.src !== window.location.origin + url && audio.src !== url) {
          setIsLoading(true);
          audio.src = url;
          audio.load();
        }

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsLoading(false);
              setIsPlaying(true);
            })
            .catch((err) => {
              console.warn("Audio play prevented:", err);
              setIsLoading(false);
              setIsPlaying(false);
            });
        }
      } catch (err) {
        console.error("Audio error:", err);
        setIsLoading(false);
      }
    },
    []
  );

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
      playTrack(activeSound.url, volume);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (!isPlaying && newVol > 0) {
      playTrack(activeSound.url, newVol);
    }
  };

  // Change track if weather changes or user selects another track
  useEffect(() => {
    if (isPlaying && activeSound.url) {
      playTrack(activeSound.url, volume);
    }
  }, [activeSound.url, isPlaying, volume, playTrack]);

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
    <div className="relative">
      <div className="flex items-center gap-1">
        {/* Main Audio Toggle Button */}
        <button
          type="button"
          onClick={toggleSound}
          title={
            isPlaying
              ? `Pause ${activeSound.name}`
              : `Play Real ${activeSound.name} (Volume: ${Math.round(volume * 100)}%)`
          }
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
              <span className="text-sm">{activeSound.icon}</span>
              <Volume2 className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span className="hidden sm:inline font-bold text-white">
                {activeSound.name}
              </span>
              {/* Equalizer animation */}
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

        {/* Volume & Sound Picker Popover Toggle */}
        <button
          type="button"
          onClick={() => setShowControls((prev) => !prev)}
          title="Adjust Volume & Switch Sounds"
          className={`p-2 rounded-xl border transition-all ${
            showControls
              ? "bg-white/20 border-white/30 text-white"
              : "bg-white/10 hover:bg-white/15 border-white/15 text-slate-300 hover:text-white"
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>

      {/* Dropdown Menu for Volume Slider & Manual Nature Sound Selection */}
      {showControls && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl glass-panel p-4 shadow-2xl border border-white/20 bg-slate-900/95 text-white animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Volume1 className="w-4 h-4 text-cyan-400" />
              Weather Audio Controls
            </span>
            <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-md">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Volume Slider */}
          <div className="my-3">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Volume</span>
              <span>{volume === 0 ? "Muted" : `${Math.round(volume * 100)}%`}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
            />
          </div>

          {/* Selectable Nature Sound Tracks */}
          <div className="pt-2 border-t border-white/10">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Select Nature Ambience:
            </span>
            <div className="space-y-1">
              {Object.values(WEATHER_SOUNDS).map((s) => {
                const isSelected = activeSound.key === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => {
                      setSelectedTrackKey(s.key);
                      if (!isPlaying) {
                        playTrack(s.url, volume);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                      isSelected
                        ? "bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-bold"
                        : "hover:bg-white/10 text-slate-300 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{s.icon}</span>
                      <span>{s.name}</span>
                    </span>
                    {isSelected && isPlaying && (
                      <span className="text-[10px] text-cyan-300 font-semibold animate-pulse">
                        Playing
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbientSound;
