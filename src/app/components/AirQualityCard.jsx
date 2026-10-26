"use client";
import React from "react";
import { Wind, ShieldAlert, ShieldCheck, AlertTriangle, Activity } from "lucide-react";

const getAqiDetails = (aqi) => {
  switch (aqi) {
    case 1:
      return {
        label: "Good",
        color: "text-emerald-300",
        bgBadge: "bg-emerald-500/20 border-emerald-400/40 text-emerald-200",
        gradient: "from-emerald-400 to-teal-500",
        advice: "Air quality is excellent. Great day for outdoor workouts and walks!",
        percentage: 20,
      };
    case 2:
      return {
        label: "Fair",
        color: "text-lime-300",
        bgBadge: "bg-lime-500/20 border-lime-400/40 text-lime-200",
        gradient: "from-lime-400 to-emerald-500",
        advice: "Air quality is acceptable. Very sensitive individuals should take note.",
        percentage: 40,
      };
    case 3:
      return {
        label: "Moderate",
        color: "text-amber-300",
        bgBadge: "bg-amber-500/20 border-amber-400/40 text-amber-200",
        gradient: "from-amber-400 to-orange-500",
        advice: "Sensitive groups may experience mild throat irritation. Limit prolonged exertion.",
        percentage: 60,
      };
    case 4:
      return {
        label: "Poor",
        color: "text-orange-400",
        bgBadge: "bg-orange-500/20 border-orange-400/40 text-orange-200",
        gradient: "from-orange-500 to-rose-500",
        advice: "Unhealthy air. Children, elderly, and those with respiratory issues should wear a mask.",
        percentage: 80,
      };
    case 5:
    default:
      return {
        label: "Very Poor",
        color: "text-rose-400",
        bgBadge: "bg-rose-500/25 border-rose-400/50 text-rose-200",
        gradient: "from-rose-500 to-purple-600",
        advice: "Severe pollution alert. Avoid outdoor activities and keep windows shut. Wear N95 mask.",
        percentage: 100,
      };
  }
};

const AirQualityCard = ({ airQualityData, currentCity = "" }) => {
  const item = airQualityData?.list?.[0];
  if (!item) return null;

  const aqi = item.main?.aqi || 2;
  const components = item.components || {};
  const details = getAqiDetails(aqi);

  const pollutants = [
    { name: "PM2.5", value: components.pm2_5 ? components.pm2_5.toFixed(1) : "--", desc: "Fine Dust", safe: 15 },
    { name: "PM10", value: components.pm10 ? components.pm10.toFixed(1) : "--", desc: "Coarse Dust", safe: 45 },
    { name: "NO2", value: components.no2 ? components.no2.toFixed(1) : "--", desc: "Nitrogen Dioxide", safe: 40 },
    { name: "SO2", value: components.so2 ? components.so2.toFixed(1) : "--", desc: "Sulfur Dioxide", safe: 40 },
    { name: "O3", value: components.o3 ? components.o3.toFixed(1) : "--", desc: "Ozone Gas", safe: 100 },
    { name: "CO", value: components.co ? (components.co / 1000).toFixed(2) : "--", desc: "Carbon Monoxide (mg)", safe: 4 },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Wind className="w-5 h-5 text-cyan-400" />
          Air Quality Index (AQI)
        </h3>
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          Live Sensors • {currentCity}
        </span>
      </div>

      <div className="rounded-3xl glass-panel p-5 sm:p-7 backdrop-blur-2xl border border-white/15 shadow-xl relative overflow-hidden">
        {/* Top summary row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-4">
            {/* Visual Gauge Circle */}
            <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/15 shadow-inner">
              <span className={`text-3xl sm:text-4xl font-black ${details.color}`}>
                {aqi}
              </span>
              <span className="absolute bottom-1 text-[10px] text-slate-400 font-semibold uppercase">
                / 5 AQI
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold border shadow-sm ${details.bgBadge}`}>
                  {details.label}
                </span>
                <span className="text-xs text-slate-400">Index Category</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-md">
                {details.advice}
              </p>
            </div>
          </div>

          {/* Safety Icon status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 self-stretch sm:self-auto justify-center">
            {aqi <= 2 ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : aqi === 3 ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <span className="text-xs font-semibold text-slate-200">
              {aqi <= 2 ? "Breathable & Safe" : aqi === 3 ? "Sensitive Alert" : "Hazardous Pollution"}
            </span>
          </div>
        </div>

        {/* Progress bar across whole spectrum */}
        <div className="mt-4 mb-5">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
            <span>Good (1)</span>
            <span>Fair (2)</span>
            <span>Moderate (3)</span>
            <span>Poor (4)</span>
            <span>Severe (5)</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden relative">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${details.gradient} transition-all duration-700 shadow-md`}
              style={{ width: `${details.percentage}%` }}
            />
          </div>
        </div>

        {/* Pollutants Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3">
          {pollutants.map((p) => {
            const isElevated = parseFloat(p.value) > p.safe;
            return (
              <div
                key={p.name}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{p.name}</span>
                  {isElevated ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" title="Above recommended limit" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Safe level" />
                  )}
                </div>
                <div className="my-1">
                  <span className="text-base sm:text-lg font-black text-white">
                    {p.value}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-0.5">µg/m³</span>
                </div>
                <span className="text-[10px] text-slate-400 truncate">{p.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AirQualityCard;
