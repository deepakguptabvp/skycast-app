"use client";
import React from "react";

const WeatherSkeleton = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-6 space-y-6">
      {/* Hero Card Skeleton */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 backdrop-blur-2xl">
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="space-y-2">
            <div className="w-48 h-8 rounded-xl animate-shimmer" />
            <div className="w-32 h-4 rounded-lg animate-shimmer" />
          </div>
          <div className="w-24 h-8 rounded-full animate-shimmer" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between py-8 gap-6">
          <div className="space-y-3">
            <div className="w-56 h-20 rounded-2xl animate-shimmer" />
            <div className="w-40 h-6 rounded-full animate-shimmer" />
          </div>
          <div className="w-36 h-36 rounded-full animate-shimmer" />
        </div>

        <div className="w-full h-14 rounded-2xl animate-shimmer mt-2" />
      </div>

      {/* Atmospheric Metrics Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl glass-panel p-4 animate-shimmer" />
        ))}
      </div>

      {/* Hourly Timeline Skeleton */}
      <div className="h-44 rounded-2xl glass-panel p-4 animate-shimmer" />

      {/* 5-Day Forecast Skeleton */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 rounded-2xl glass-panel p-4 animate-shimmer" />
        ))}
      </div>
    </div>
  );
};

export default WeatherSkeleton;
