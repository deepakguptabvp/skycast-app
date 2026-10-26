"use client";
import React, { useState, useEffect } from "react";
import { X, ArrowRightLeft, ArrowUpRight, Droplets, Wind, Gauge, Sparkles } from "lucide-react";
import { formatTemp, formatWindSpeed } from "../utils/utility";

const COMPARE_OPTIONS = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Kolkata",
  "Chennai",
  "Hyderabad",
  "Jaipur",
  "Goa",
  "Srinagar",
  "Ahmedabad",
];

const API_KEY = "776ee648de6a5eb986f140c70c3eb660";

const CompareModal = ({
  isOpen,
  onClose,
  currentCity = "Delhi",
  currentWeatherData,
  unit,
  onSwitchCity,
}) => {
  const [targetCity, setTargetCity] = useState("Mumbai");
  const [targetData, setTargetData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Default target city different from current
    const defaultTarget = currentCity.toLowerCase() === "mumbai" ? "Delhi" : "Mumbai";
    setTargetCity(defaultTarget);

    const fetchTarget = async (city) => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();
        if (data.cod === 200) {
          setTargetData(data);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    };

    fetchTarget(defaultTarget);
  }, [isOpen, currentCity]);

  const handleTargetChange = async (city) => {
    setTargetCity(city);
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setTargetData(data);
      }
    } catch {}
    setLoading(false);
  };

  if (!isOpen) return null;

  const dataA = currentWeatherData?.data;
  const dataB = targetData;

  const tempA = dataA?.main?.temp;
  const tempB = dataB?.main?.temp;
  const tempDiff = tempA !== undefined && tempB !== undefined ? Math.round(tempA - tempB) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-7 shadow-2xl border border-white/20 bg-slate-900/95 text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                City Weather Comparison
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-xs text-slate-400">
                Compare {currentCity} side-by-side with any Indian city
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

        {/* City selector chips for City B */}
        <div className="my-4">
          <span className="text-xs text-slate-400 font-semibold mb-2 block">
            Select comparison city:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
            {COMPARE_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleTargetChange(c)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  targetCity.toLowerCase() === c.toLowerCase()
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                    : "bg-white/10 hover:bg-white/15 text-slate-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Side by side comparison cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 my-4">
          {/* City A: Current */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-cyan-400/30 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-full">
                Active City
              </span>
              <h4 className="text-xl sm:text-2xl font-black mt-2 text-white">
                {currentCity}
              </h4>
              <p className="text-xs text-slate-400 capitalize">
                {dataA?.weather?.[0]?.description || "--"}
              </p>
            </div>

            <div className="my-3 flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {formatTemp(tempA, unit)}
              </span>
              {dataA?.weather?.[0]?.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${dataA.weather[0].icon}@2x.png`}
                  alt=""
                  className="w-12 h-12"
                />
              )}
            </div>

            <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-400" /> Humidity
                </span>
                <span className="font-bold">{dataA?.main?.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-cyan-400" /> Wind
                </span>
                <span className="font-bold">{formatWindSpeed(dataA?.wind?.speed, unit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-amber-400" /> Pressure
                </span>
                <span className="font-bold">{dataA?.main?.pressure} hPa</span>
              </div>
            </div>
          </div>

          {/* City B: Target */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/15 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/10 px-2.5 py-0.5 rounded-full">
                Comparison
              </span>
              <h4 className="text-xl sm:text-2xl font-black mt-2 text-white">
                {targetCity}
              </h4>
              <p className="text-xs text-slate-400 capitalize">
                {loading ? "Fetching..." : dataB?.weather?.[0]?.description || "--"}
              </p>
            </div>

            <div className="my-3 flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {loading ? "--" : formatTemp(tempB, unit)}
              </span>
              {dataB?.weather?.[0]?.icon && !loading && (
                <img
                  src={`https://openweathermap.org/img/wn/${dataB.weather[0].icon}@2x.png`}
                  alt=""
                  className="w-12 h-12"
                />
              )}
            </div>

            <div className="space-y-1.5 pt-3 border-t border-white/10 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-400" /> Humidity
                </span>
                <span className="font-bold">{loading ? "--" : `${dataB?.main?.humidity}%`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-cyan-400" /> Wind
                </span>
                <span className="font-bold">
                  {loading ? "--" : formatWindSpeed(dataB?.wind?.speed, unit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-amber-400" /> Pressure
                </span>
                <span className="font-bold">
                  {loading ? "--" : `${dataB?.main?.pressure} hPa`}
                </span>
              </div>
            </div>

            {/* Switch to this city button */}
            <button
              type="button"
              onClick={() => {
                onSwitchCity(targetCity);
                onClose();
              }}
              className="mt-3 w-full py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold flex items-center justify-center gap-1 transition-all"
            >
              Switch to {targetCity}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Temperature difference summary footer */}
        {tempA !== undefined && tempB !== undefined && !loading && (
          <div className="p-3 rounded-xl bg-white/10 text-center text-xs text-slate-200">
            {tempDiff > 0 ? (
              <span>
                🔥 <strong>{currentCity}</strong> is <strong>{Math.abs(tempDiff)}° warmer</strong> than {targetCity}.
              </span>
            ) : tempDiff < 0 ? (
              <span>
                ❄️ <strong>{currentCity}</strong> is <strong>{Math.abs(tempDiff)}° cooler</strong> than {targetCity}.
              </span>
            ) : (
              <span>Both {currentCity} and {targetCity} have identical temperatures!</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareModal;
