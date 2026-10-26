"use client";
import React, { useState } from "react";
import {
  formatTemp,
  formatWindSpeed,
  formatLocalTime12h,
  getFiveDayForecast,
} from "../utils/utility";
import {
  CalendarDays,
  Droplets,
  ChevronDown,
  ChevronUp,
  Wind,
} from "lucide-react";

const WeatherForecast = ({ weatherForecastData, unit }) => {
  const forecastList = weatherForecastData?.data?.list || [];
  const timezone = weatherForecastData?.data?.city?.timezone || 0;
  const fiveDayList = getFiveDayForecast(forecastList, timezone);

  const [expandedDate, setExpandedDate] = useState(null);

  if (fiveDayList.length === 0) return null;

  // Calculate overall global min and max across all 5 days for the temperature range bars
  const allMins = fiveDayList.map((d) => d.minTemp);
  const allMaxs = fiveDayList.map((d) => d.maxTemp);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempSpan = Math.max(1, globalMax - globalMin);

  const toggleExpand = (dateKey) => {
    setExpandedDate((prev) => (prev === dateKey ? null : dateKey));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-6 mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-cyan-400" />
          5-Day Precision Forecast
        </h3>
        <span className="text-xs text-slate-400">Click a day for hourly details</span>
      </div>

      {/* Days list */}
      <div className="space-y-3">
        {fiveDayList.map((day, index) => {
          const isExpanded = expandedDate === day.dateKey;
          const isToday = index === 0;

          // Bar calculation for temperature range
          const leftPercent = Math.max(
            0,
            Math.min(100, ((day.minTemp - globalMin) / tempSpan) * 100)
          );
          const rightPercent = Math.max(
            0,
            Math.min(100, ((day.maxTemp - globalMin) / tempSpan) * 100)
          );
          const barWidth = Math.max(12, rightPercent - leftPercent);

          return (
            <div
              key={day.dateKey}
              className={`rounded-2xl glass-panel transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? "ring-1 ring-cyan-400/40 bg-white/12 shadow-lg"
                  : "glass-card-hover"
              }`}
            >
              {/* Main row */}
              <button
                type="button"
                onClick={() => toggleExpand(day.dateKey)}
                className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left focus:outline-none"
              >
                {/* Left: Day Name & Date */}
                <div className="flex items-center gap-3 sm:w-44">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-xs uppercase text-cyan-300">
                    {day.shortDay}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      {isToday ? "Today" : day.dayName}
                    </h4>
                    <p className="text-xs text-slate-400">{day.formattedDate}</p>
                  </div>
                </div>

                {/* Center: Weather icon & condition */}
                <div className="flex items-center gap-3 sm:flex-1">
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt={day.description}
                    className="w-10 h-10 object-contain drop-shadow"
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200 capitalize">
                      {day.description}
                    </p>
                    {day.pop > 0 && (
                      <span className="flex items-center text-[11px] text-cyan-300 font-medium">
                        <Droplets className="w-3 h-3 mr-0.5" />
                        {day.pop}% precipitation
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Min & Max Temp + Visual Range Bar */}
                <div className="flex items-center gap-4 sm:w-64 justify-between sm:justify-end">
                  {/* Min temp */}
                  <span className="text-xs sm:text-sm font-medium text-slate-300 w-10 text-right">
                    {formatTemp(day.minTemp, unit)}
                  </span>

                  {/* Gradient Visual Temperature Bar */}
                  <div className="flex-1 max-w-[100px] h-2 bg-white/15 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-400"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>

                  {/* Max temp */}
                  <span className="text-sm sm:text-base font-bold text-white w-10 text-right">
                    {formatTemp(day.maxTemp, unit)}
                  </span>

                  {/* Expand Chevron */}
                  <div className="text-slate-400 ml-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-cyan-300" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expandable detailed 3-hourly breakdown for this day */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 sm:px-6 sm:pb-5 border-t border-white/10 bg-black/15">
                  <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    Timeline for {day.dayName}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {day.hourlyEntries.map((entry) => (
                      <div
                        key={entry.dt}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center"
                      >
                        <span className="text-[11px] text-slate-300 font-mono">
                          {formatLocalTime12h(entry.dt, timezone)}
                        </span>
                        <img
                          src={`https://openweathermap.org/img/wn/${entry.weather?.[0]?.icon}.png`}
                          alt={entry.weather?.[0]?.description}
                          className="w-8 h-8 object-contain my-0.5"
                        />
                        <span className="text-xs font-bold text-white">
                          {formatTemp(entry.main?.temp, unit)}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                          {entry.pop > 0 && (
                            <span className="text-cyan-300 font-medium">
                              {Math.round(entry.pop * 100)}%
                            </span>
                          )}
                          <span className="flex items-center">
                            <Wind className="w-2.5 h-2.5 mr-0.5" />
                            {formatWindSpeed(entry.wind?.speed, unit).split(" ")[0]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
