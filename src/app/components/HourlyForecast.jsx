"use client";
import React from "react";
import { formatTemp, formatWindSpeed, getHourlyForecast } from "../utils/utility";
import { Clock, Droplets, Wind } from "lucide-react";

const HourlyForecast = ({ weatherForecastData, unit }) => {
  const forecastList = weatherForecastData?.data?.list || [];
  const timezone = weatherForecastData?.data?.city?.timezone || 0;
  const hourlyItems = getHourlyForecast(forecastList, timezone);

  if (hourlyItems.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          24-Hour Timeline
        </h3>
        <span className="text-xs text-slate-400">3-Hour Intervals</span>
      </div>

      {/* Horizontal Carousel */}
      <div className="relative">
        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 custom-scrollbar scroll-smooth">
          {hourlyItems.map((item, index) => {
            const isNow = index === 0;

            return (
              <div
                key={item.dt}
                className={`flex-shrink-0 flex flex-col items-center justify-between w-28 sm:w-32 py-4 px-3 rounded-2xl glass-panel transition-all duration-200 ${
                  isNow
                    ? "ring-2 ring-cyan-400/60 bg-white/15 shadow-lg shadow-cyan-500/10"
                    : "glass-card-hover"
                }`}
              >
                {/* Time Label */}
                <div className="flex items-center justify-center">
                  <span
                    className={`text-xs font-semibold ${
                      isNow ? "text-cyan-300 font-bold" : "text-slate-300"
                    }`}
                  >
                    {isNow ? "Now" : item.time}
                  </span>
                </div>

                {/* Weather Icon */}
                <div className="my-1">
                  <img
                    src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                    alt={item.description}
                    className="w-12 h-12 object-contain drop-shadow"
                  />
                </div>

                {/* Temperature */}
                <div className="text-base sm:text-lg font-extrabold text-white">
                  {formatTemp(item.temp, unit)}
                </div>

                {/* Condition caption */}
                <div className="text-[10px] text-slate-300 capitalize text-center truncate w-full mt-0.5">
                  {item.description}
                </div>

                {/* Rain probability & Wind row */}
                <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-white/10 text-[10px]">
                  {item.pop > 0 ? (
                    <span className="flex items-center text-cyan-300 font-medium">
                      <Droplets className="w-3 h-3 mr-0.5" />
                      {item.pop}%
                    </span>
                  ) : (
                    <span className="text-slate-400">0% rain</span>
                  )}
                  <span className="flex items-center text-slate-400">
                    <Wind className="w-2.5 h-2.5 mr-0.5" />
                    {formatWindSpeed(item.wind, unit).split(" ")[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
