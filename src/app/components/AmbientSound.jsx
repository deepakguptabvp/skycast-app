"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

const AmbientSound = ({ weatherCode = 800 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const noiseSourceRef = useRef(null);
  const oscRef = useRef(null);

  // Stop sound
  const stopAudio = useCallback(() => {
    try {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.2);
      }
      setTimeout(() => {
        if (noiseSourceRef.current) {
          noiseSourceRef.current.stop();
          noiseSourceRef.current.disconnect();
          noiseSourceRef.current = null;
        }
        if (oscRef.current) {
          oscRef.current.stop();
          oscRef.current.disconnect();
          oscRef.current = null;
        }
      }, 300);
    } catch {}
  }, []);

  // Play procedural ambient sound based on weather
  const startAudio = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.5);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // 1. Rain / Storm sound (Filtered White/Pink noise)
      const isRain = weatherCode >= 200 && weatherCode < 600;
      const isThunder = weatherCode >= 200 && weatherCode < 300;

      // Generate 2 seconds of noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filtering
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 2.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      // Filter settings based on condition
      const filter = ctx.createBiquadFilter();
      if (isRain) {
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(isThunder ? 700 : 1200, ctx.currentTime);
      } else {
        // Soft wind / breeze
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        filter.Q.setValueAtTime(1.8, ctx.currentTime);
      }

      noise.connect(filter);
      filter.connect(masterGain);
      noise.start();
      noiseSourceRef.current = noise;
    } catch (err) {
      console.warn("Audio Context init error:", err);
    }
  }, [weatherCode]);

  const toggleSound = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      stopAudio();
      startAudio();
    }
    return () => {
      stopAudio();
    };
  }, [weatherCode, isPlaying, startAudio, stopAudio]);

  return (
    <button
      type="button"
      onClick={toggleSound}
      title={isPlaying ? "Mute Ambient Sound" : "Play Ambient Weather Sound"}
      className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold backdrop-blur-md border ${
        isPlaying
          ? "bg-cyan-500/25 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/30"
          : "bg-white/10 hover:bg-white/15 border-white/15 text-slate-200 hover:text-white"
      }`}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span className="hidden sm:inline">Audio On</span>
          {/* Sound wave bars */}
          <span className="flex items-end gap-0.5 h-3 ml-0.5">
            <span className="w-0.5 h-full bg-cyan-300 animate-pulse" />
            <span className="w-0.5 h-2 bg-cyan-300 animate-bounce" />
            <span className="w-0.5 h-2.5 bg-cyan-300 animate-pulse" />
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Audio Off</span>
        </>
      )}
    </button>
  );
};

export default AmbientSound;
